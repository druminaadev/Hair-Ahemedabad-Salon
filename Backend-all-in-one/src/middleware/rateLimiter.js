const rateLimitMap = {};

module.exports = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (!rateLimitMap[ip]) {
    rateLimitMap[ip] = [];
  }

  // Filter out timestamps older than 1 minute (60,000ms)
  rateLimitMap[ip] = rateLimitMap[ip].filter(timestamp => now - timestamp < 60000);

  if (rateLimitMap[ip].length >= 60) {
    return res.status(429).json({
      message: 'Too many requests. Limit is 60 requests per minute.'
    });
  }

  rateLimitMap[ip].push(now);
  next();
};
