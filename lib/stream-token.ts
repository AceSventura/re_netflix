export function createToken(contentId: number, ttlSeconds: number = 300) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const tokenData = `${contentId}:${expires}`;
  return Buffer.from(tokenData).toString('base64');
}

export function verifyToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [contentIdStr, expiresStr] = decoded.split(':');
    const contentId = Number(contentIdStr);
    const expires = Number(expiresStr);
    const now = Math.floor(Date.now() / 1000);

    if (isNaN(contentId) || isNaN(expires) || now > expires) {
      return null;
    }

    return contentId;
  } catch {
    return null;
  }
}