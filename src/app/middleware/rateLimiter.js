// Simple in-memory store for rate limiting
const store = new Map();

const createRateLimiter = (windowMs, max) => {
  return async (request) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing records for this IP
    const records = store.get(ip) || [];
    
    // Remove expired records
    const validRecords = records.filter(timestamp => timestamp > windowStart);
    
    // Check if limit is exceeded
    if (validRecords.length >= max) {
      return {
        status: 429,
        message: `Too many requests, please try again after ${windowMs / 60000} minutes`
      };
    }

    // Add new record
    validRecords.push(now);
    store.set(ip, validRecords);
    
    return null; // No rate limit exceeded
  };
};

export const loginLimiter = createRateLimiter(15 * 60 * 1000, 18); // 15 minutes, 5 attempts
export const registrationLimiter = createRateLimiter(60 * 60 * 1000, 3); // 1 hour, 3 attempts 