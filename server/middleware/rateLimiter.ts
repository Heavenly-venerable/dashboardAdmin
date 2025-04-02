import { getRequestIP, H3Event } from 'h3';

const requestCounts = new Map<string, { count: number; timestamp: number }>();

export default defineEventHandler((event: H3Event) => {
  if (!event.path.startsWith('/api/auth/login')) return;

  const ip = getRequestIP(event) || 'unknown';

  const limit = 10;

  const windowMs = 60 * 1000;

  const now = Date.now();

  const entry = requestCounts.get(ip);

  if (entry) {
    if (now - entry.timestamp < windowMs) {
      if (entry.count >= limit) {
        event.node.res.statusCode = 429;

        return { error: 'Terlalu banyak request, coba lagi nanti' };
      }

      entry.count++;
    } else {
      requestCounts.set(ip, { count: 1, timestamp: now });
    }
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }
});
