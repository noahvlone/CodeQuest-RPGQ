import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests, please try again later.',
    },
});

// Auth rate limiter (stricter)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many authentication attempts, please try again later.',
    },
});

// Code execution rate limiter
export const executionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 executions per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many code executions, please slow down.',
    },
});

// AI chat rate limiter
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 AI requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many AI requests, please wait a moment.',
    },
});
