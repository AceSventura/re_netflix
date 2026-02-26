import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteParams {
  params: { slug: string[] };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const slug = params.slug;

  if (!slug || slug.length < 2) {
    return new Response('Invalid path', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'media', slug[0], slug[1]);

  if (!fs.existsSync(filePath)) {
    return new Response('File not found', { status: 404 });
  }

  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath);

  let contentType = 'application/octet-stream';
  if (ext === '.ts') contentType = 'video/MP2T';
  if (ext === '.m3u8') contentType = 'application/vnd.apple.mpegurl';

  return new Response(file, {
    headers: {
      'Content-Type': contentType,
    },
  });
}