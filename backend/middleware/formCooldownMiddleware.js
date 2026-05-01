const cooldownStore = new Map();

const COOLDOWN_MS = 5 * 60 * 1000; //5 minutes

const getClientKey = (req) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        req.ip ||
        "unknown";

    return `${ip}:${req.method}:${req.originalUrl}`;
};

const formCooldownMiddleware = (req, res, next) => {
    const key = getClientKey(req);
    const now = Date.now();

    const lastRequestTime = cooldownStore.get(key);

    if (lastRequestTime) {
        const elapsed = now - lastRequestTime;
        const remainingMs = COOLDOWN_MS - elapsed;

        if (remainingMs > 0) {
            const remainingSeconds = Math.ceil(remainingMs / 1000);

            return res.status(429).json({
                success: false,
                message: `Lütfen tekrar göndermeden önce ${remainingSeconds} saniye bekleyin.`,
                remainingSeconds,
            });
        }
    }

    cooldownStore.set(key, now);

    setTimeout(() => {
        cooldownStore.delete(key);
    }, COOLDOWN_MS);

    next();
};

export default formCooldownMiddleware;