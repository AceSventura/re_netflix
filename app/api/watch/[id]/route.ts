import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DISATTIVAZIONE CACHE NEXT.JS (Fondamentale per i generatori di flussi)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const targetId = parseInt(resolvedParams.id, 10);
        
        if (isNaN(targetId)) {
            return new NextResponse("ID non valido", { status: 400 });
        }

        const media = await prisma.contenuti.findUnique({
            where: { id_contenuto: targetId },
            include: {
                codificato: {
                    include: {
                        assets_video: true
                    }
                },
                include: {
                    include: {
                        assets_audio: {
                            include: {
                                parlato_in: {
                                    include: {
                                        lingue: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!media || media.codificato.length === 0) {
            return new NextResponse("Manifest non trovato", { status: 404 });
        }

        const videoAsset = media.codificato[0].assets_video;
        const audioAssets = media.include.map(inc => inc.assets_audio);

        let m3u8Manifest = `#EXTM3U\n`;
        m3u8Manifest += `#EXT-X-VERSION:3\n`;

        if (audioAssets.length > 0) {
            audioAssets.forEach((audio, index) => {
                const nomeLingua = audio.parlato_in[0]?.lingue?.nome || `Lingua_${index + 1}`;
                const codiceLingua = nomeLingua.substring(0, 2).toLowerCase();
                const isDefault = index === 0 ? "YES" : "NO";

                m3u8Manifest += `#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="${nomeLingua}",LANGUAGE="${codiceLingua}",AUTOSELECT=YES,DEFAULT=${isDefault},URI="${audio.url_traccia}"\n`;
            });
        }

        const bitrate = videoAsset.bitrate || 2500000;
        
        if (audioAssets.length > 0) {
            m3u8Manifest += `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate},AUDIO="audio"\n`;
        } else {
            m3u8Manifest += `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate}\n`;
        }
        
        m3u8Manifest += `${videoAsset.url_manifest}\n`;

        return new NextResponse(m3u8Manifest, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.apple.mpegurl",
                // Direttive Cache-Control rinforzate
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Access-Control-Allow-Origin": "*"
            },
        });

    } catch (error) {
        console.error("Errore API Watch:", error);
        return new NextResponse("Errore interno del server", { status: 500 });
    }
}