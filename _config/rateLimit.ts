const rateLimit = {
  windowMs: 60 * 60 * 1000,
  limit: 3000,
  standardHeaders: "draft-8" as "draft-8",
}

export default rateLimit;