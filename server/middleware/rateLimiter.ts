import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(windowMs: number, maxRequests: number, message: string) {
  const ipMap = new Map<string, RateLimitRecord>();

  // Cleanup stale IPs every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipMap.entries()) {
      if (now > record.resetTime) {
        ipMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    const record = ipMap.get(ip);
    if (!record || now > record.resetTime) {
      ipMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message: `${message}. Please wait ${retryAfterSeconds} seconds before trying again.`,
      });
    }

    record.count++;
    next();
  };
}

export const loginRateLimiter = createRateLimiter(15 * 60 * 1000, 15, 'Too many login attempts from this IP');
export const contactRateLimiter = createRateLimiter(10 * 60 * 1000, 25, 'Too many contact requests from this IP');
