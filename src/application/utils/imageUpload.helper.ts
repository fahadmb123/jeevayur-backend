export function extractImageKey(imageKey?: string | null, imageUrl?: string | null): string | null {
  if (imageKey && imageKey.trim()) {
    return imageKey.trim();
  }
  if (imageUrl && imageUrl.includes('/api/gallery/images/')) {
    const parts = imageUrl.split('/api/gallery/images/');
    if (parts[1]) {
      const raw = parts[1].split('?')[0];
      return decodeURIComponent(raw);
    }
  }
  return null;
}

export function parseBase64Image(dataUri: string): { mimeType: string; buffer: Buffer } | null {
  const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], 'base64'),
  };
}
