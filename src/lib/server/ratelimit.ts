interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMITED_ROUTES: { [route: string]: RateLimitConfig } = {
  "/api/gifts/back-up": { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  "/api/gifts/report-error": { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 requests in 60 minutes for /api/report-error
  "/api/gifts/delete-gift[giftId]": {
    maxRequests: 50,
    windowMs: 20 * 60 * 1000,
  },
  "/api/gifts/submit": { maxRequests: 50, windowMs: 20 * 60 * 1000 },
  "/api/gifts/batch-update": { maxRequests: 50, windowMs: 20 * 60 * 1000 },
};

const rateLimitData: {
  [route: string]: {
    [ip: string]: { count: number; firstRequestTime: number };
  };
} = {};

export const rateLimit = (req: Request): boolean => {
  const route = new URL(req.url).pathname;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.url;

  if (!ip) {
    return false;
  }

  const limit = RATE_LIMITED_ROUTES[route];

  if (!rateLimitData[route]) {
    rateLimitData[route] = {};
  }

  if (limit) {
    if (!rateLimitData[route][ip]) {
      rateLimitData[route][ip] = { count: 1, firstRequestTime: Date.now() };
      return true;
    }

    const { count, firstRequestTime } = rateLimitData[route][ip];
    const elapsedTime = Date.now() - firstRequestTime;

    if (elapsedTime > limit.windowMs) {
      rateLimitData[route][ip] = { count: 1, firstRequestTime: Date.now() };
      return true;
    }

    if (count >= limit.maxRequests) {
      return false; // Block the request if it exceeds the rate limit
    }

    rateLimitData[route][ip].count++;
    return true; // Allow the request
  }

  // If no rate limit is configured for this route, skip rate limiting
  return true;
};
