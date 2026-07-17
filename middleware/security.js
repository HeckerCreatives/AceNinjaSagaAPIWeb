const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Standard security response headers. CSP / cross-origin resource policies are
// disabled because this API serves images/assets cross-origin to the dashboard
// and CORS is handled separately. HSTS, X-Content-Type-Options, X-Frame-Options,
// Referrer-Policy, etc. remain on.
const securityHeaders = helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
});

// Throttle authentication endpoints to blunt credential brute-forcing.
// 20 attempts / 15 min / IP.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "failed", data: "Too many attempts. Please wait a few minutes and try again." },
});

module.exports = { securityHeaders, authLimiter };
