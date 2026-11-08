import type { Request } from 'express';

export interface ClientInfo {
  ipAddress: string;
  device: string;
  city: string | null;
  country: string | null;
}

export function parseDevice(userAgent?: string): string {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'Unknown Device';
  }

  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  if (/Edg\//i.test(userAgent)) {
    browser = 'Edge';
  } else if (/OPR\//i.test(userAgent) || /Opera/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/Chrome\//i.test(userAgent) && !/Chromium/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Safari\//i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/Firefox\//i.test(userAgent)) {
    browser = 'Firefox';
  }

  if (/Windows NT/i.test(userAgent)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
    os = 'macOS';
  } else if (/Android/i.test(userAgent)) {
    os = 'Android';
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    os = 'iOS';
  } else if (/Linux/i.test(userAgent)) {
    os = 'Linux';
  }

  return `${browser} on ${os}`;
}

export function extractClientInfo(req: Request): ClientInfo {
  const forwarded = req.headers['x-forwarded-for'];
  let rawIp = '';

  if (typeof forwarded === 'string') {
    rawIp = forwarded.split(',')[0].trim();
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    rawIp = forwarded[0].trim();
  } else if (typeof req.headers['cf-connecting-ip'] === 'string') {
    rawIp = req.headers['cf-connecting-ip'].trim();
  } else if (req.ip) {
    rawIp = req.ip;
  } else if (req.socket?.remoteAddress) {
    rawIp = req.socket.remoteAddress;
  }

  const ipAddress = rawIp.replace(/^::ffff:/, '') || '127.0.0.1';
  const userAgent = req.headers['user-agent'];
  const device = parseDevice(userAgent);

  const city =
    (typeof req.headers['cf-ipcity'] === 'string' && req.headers['cf-ipcity']) ||
    (typeof req.headers['x-vercel-ip-city'] === 'string' && req.headers['x-vercel-ip-city']) ||
    null;

  const country =
    (typeof req.headers['cf-ipcountry'] === 'string' && req.headers['cf-ipcountry']) ||
    (typeof req.headers['x-vercel-ip-country'] === 'string' && req.headers['x-vercel-ip-country']) ||
    null;

  return {
    ipAddress,
    device,
    city,
    country,
  };
}
