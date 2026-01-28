
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const idProfilo = url.searchParams.get("idProfilo");

  if (!idProfilo) {
    return NextResponse.json({ error: "idProfilo mancante" }, { status: 400 });
  }

  try {
    // Prisma sa già il tipo
    const filmSalvati = await prisma.salva_film.findMany({
      where: { id_profilo: parseInt(idProfilo) },
      include: { film: true }, // type-safe
    });

    const serieSalvate = await prisma.salva_serie.findMany({
      where: { id_profilo: parseInt(idProfilo) },
      include: { serie_tv: true }, // type-safe
    });

    return NextResponse.json({
      film: filmSalvati.map(f => f.film),       
      serie: serieSalvate.map(s => s.serie_tv) 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
