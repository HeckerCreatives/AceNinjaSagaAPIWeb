const SteamOrder = require("../models/Steam");
const PurchaseReceipt = require("../models/Googleplay");
const Users = require("../models/Users");
const Characterdata = require("../models/Characterdata");
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const { URL } = require("url");

// Real-money price catalogs. Neither the SteamOrder nor PurchaseReceipt models
// persist the price paid, only the credits granted, so we look up the price by
// the item identifier each platform DOES store. Keep these in sync with the
// store-side catalogs (Unity's CreditPackController.SteamItems + Steamworks
// item defs, and Google Play Console product prices).
const STEAM_PRICE_USD_BY_ITEMDEF = {
    1001: 0.99,
    1002: 4.99,
    1003: 9.99,
    1004: 19.99,
    1005: 49.99,
    1006: 99.99,
};

const ANDROID_PRICE_USD_BY_PRODUCTID = {
    starter_credit_pack: 0.99,
    basic_credit_pack: 4.99,
    advance_credit_pack: 9.99,
    elite_credit_pack: 19.99,
    master_credit_pack: 49.99,
    legendary_credit_pack: 99.99,
};

const parsePagination = (req) => ({
    page: Math.max(0, parseInt(req.query.page) || 0),
    limit: Math.min(200, Math.max(1, parseInt(req.query.limit) || 20)),
    search: (req.query.search || "").toString().trim(),
});

const buildPlayerLabel = (user, character) => {
    if (character && character.username) return character.username;
    if (user && user.username) return user.username;
    if (user && user.email) return user.email;
    return "(unknown)";
};

/**
 * GET /sales/steam
 * Paginated list of Steam purchases joined with the player who bought them.
 * Query: page, limit, search (matches username, steamId, or orderId).
 */
exports.getSteamSales = async (req, res) => {
    try {
        const { page, limit, search } = parsePagination(req);

        const match = {};
        if (search) {
            match.$or = [
                { orderId: { $regex: search, $options: "i" } },
                { steamId: { $regex: search, $options: "i" } },
                { steamTransId: { $regex: search, $options: "i" } },
            ];
        }

        const [orders, total] = await Promise.all([
            SteamOrder.find(match)
                .sort({ createdAt: -1 })
                .skip(page * limit)
                .limit(limit)
                .lean(),
            SteamOrder.countDocuments(match),
        ]);

        // Batch-fetch the related Users + Characters for display.
        const userIds = orders.map(o => o.userId).filter(Boolean);
        const characterIds = orders.map(o => o.characterId).filter(Boolean);

        const [users, characters] = await Promise.all([
            userIds.length ? Users.find({ _id: { $in: userIds } }).lean() : [],
            characterIds.length
                ? Characterdata.find({ _id: { $in: characterIds.filter(id => mongoose.Types.ObjectId.isValid(id)) } }).lean()
                : [],
        ]);

        const userMap = new Map(users.map(u => [u._id.toString(), u]));
        const characterMap = new Map(characters.map(c => [c._id.toString(), c]));

        const data = orders.map(o => {
            const user = o.userId ? userMap.get(o.userId.toString()) : null;
            const character = o.characterId ? characterMap.get(o.characterId.toString()) : null;
            return {
                id: o._id,
                purchaseId: o.orderId,
                steamId: o.steamId,
                player: buildPlayerLabel(user, character),
                credits: o.credits,
                quantity: o.quantity,
                itemDefId: o.itemDefId,
                currency: o.steamCurrency || null,
                country: o.steamCountry || null,
                status: o.status,
                date: o.createdAt,
            };
        });

        return res.status(200).json({
            message: "success",
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(`[sales/steam] Error: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server. Please try again later." });
    }
};

/**
 * GET /sales/android
 * Paginated list of Android (Google Play) purchases joined with the player.
 * Query: page, limit, search (matches productId, purchaseToken, packageName).
 */
exports.getAndroidSales = async (req, res) => {
    try {
        const { page, limit, search } = parsePagination(req);

        const match = {};
        if (search) {
            match.$or = [
                { productId: { $regex: search, $options: "i" } },
                { purchaseToken: { $regex: search, $options: "i" } },
                { packageName: { $regex: search, $options: "i" } },
            ];
        }

        const [receipts, total] = await Promise.all([
            PurchaseReceipt.find(match)
                .sort({ createdAt: -1 })
                .skip(page * limit)
                .limit(limit)
                .lean(),
            PurchaseReceipt.countDocuments(match),
        ]);

        // Receipts store userId as a String. Convert and join in one batched query.
        const validUserIds = receipts
            .map(r => r.userId)
            .filter(id => id && mongoose.Types.ObjectId.isValid(id));

        const users = validUserIds.length
            ? await Users.find({ _id: { $in: validUserIds } }).lean()
            : [];

        const userMap = new Map(users.map(u => [u._id.toString(), u]));

        const data = receipts.map(r => {
            const user = r.userId ? userMap.get(r.userId.toString()) : null;
            const grant = r.grant && r.grant.payload ? r.grant.payload : r.grant || {};
            return {
                id: r._id,
                purchaseId: r.purchaseToken,
                productId: r.productId || null,
                packageName: r.packageName,
                productType: r.productType,
                player: buildPlayerLabel(user, null),
                credits: typeof grant.credits === "number" ? grant.credits : null,
                status: r.status,
                date: r.createdAt,
            };
        });

        return res.status(200).json({
            message: "success",
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(`[sales/android] Error: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server. Please try again later." });
    }
};

/**
 * GET /sales/ios
 * Placeholder — there's no iOS receipt model in the codebase yet. Returns an
 * empty list with a 200 so the admin UI tab renders cleanly. When iOS billing
 * is added, populate this from the new model the same way as Android.
 */
exports.getIOSSales = async (req, res) => {
    const { page, limit } = parsePagination(req);
    return res.status(200).json({
        message: "success",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        notice: "iOS purchase tracking is not yet implemented.",
    });
};

/**
 * GET /sales/summary
 * Aggregated dollar totals of completed sales for the superadmin dashboard.
 * Prices are derived from the per-platform price catalogs above because the
 * receipt/order models only persist credits granted, not the price paid.
 */
exports.getSalesSummary = async (_req, res) => {
    try {
        // Group steam orders by itemDefId so we can multiply count × unit price.
        const [steamByItem, androidByProduct] = await Promise.all([
            SteamOrder.aggregate([
                { $match: { status: "completed" } },
                { $group: { _id: "$itemDefId", count: { $sum: "$quantity" } } },
            ]),
            PurchaseReceipt.aggregate([
                { $match: { status: "granted" } },
                { $group: { _id: "$productId", count: { $sum: 1 } } },
            ]),
        ]);

        let steamTotal = 0;
        let steamCount = 0;
        for (const row of steamByItem) {
            const price = STEAM_PRICE_USD_BY_ITEMDEF[row._id];
            if (price != null) steamTotal += price * row.count;
            steamCount += row.count;
        }

        let androidTotal = 0;
        let androidCount = 0;
        for (const row of androidByProduct) {
            const price = ANDROID_PRICE_USD_BY_PRODUCTID[row._id];
            if (price != null) androidTotal += price * row.count;
            androidCount += row.count;
        }

        const iosTotal = 0;
        const iosCount = 0;

        // Round currency to 2 decimal places for display.
        const round2 = (n) => Math.round(n * 100) / 100;

        return res.status(200).json({
            message: "success",
            data: {
                steam: { total: round2(steamTotal), count: steamCount },
                android: { total: round2(androidTotal), count: androidCount },
                ios: { total: round2(iosTotal), count: iosCount },
                playstore_ios: {
                    total: round2(androidTotal + iosTotal),
                    count: androidCount + iosCount,
                },
            },
        });
    } catch (err) {
        console.error(`[sales/summary] Error: ${err}`);
        return res.status(500).json({ message: "server-error", data: "There's a problem with the server. Please try again later." });
    }
};

// Promise wrapper around https/http.request so we don't have to add a dep.
// Used by getSteamReport below to call the Game API server-to-server.
const httpJson = (urlString, { method = "GET", headers = {}, timeoutMs = 25000 } = {}) =>
    new Promise((resolve, reject) => {
        const u = new URL(urlString);
        const lib = u.protocol === "https:" ? https : http;
        const req = lib.request({
            hostname: u.hostname,
            port: u.port || (u.protocol === "https:" ? 443 : 80),
            path: `${u.pathname}${u.search || ""}`,
            method,
            headers,
        }, (res) => {
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                const body = Buffer.concat(chunks).toString("utf8");
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (_e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error(`Steam report request timed out after ${timeoutMs}ms`));
        });
        req.on("error", reject);
        req.end();
    });

/**
 * GET /sales/steam-report
 *
 * Superadmin-gated proxy to the Game API's /steam/report endpoint, which
 * itself calls Steam's ISteamMicroTxn/GetReport (production). Keeps the
 * STEAM_ADMIN_TOKEN server-to-server so it never reaches the browser.
 *
 * Query params (forwarded as-is):
 *   time        - ISO 8601 start time, required
 *   type        - PURCHASE | REFUND | CHARGEBACK | RESTORE | ALL (default ALL)
 *   maxresults  - 1..1000, default 1000
 *
 * Required Web API env:
 *   GAME_API_URL        - e.g. https://gameapi.aceninjapath.com
 *   STEAM_ADMIN_TOKEN   - must match the value set in the Game API .env
 */
exports.getSteamReport = async (req, res) => {
    try {
        const baseUrl = process.env.GAME_API_URL;
        const token = process.env.STEAM_ADMIN_TOKEN;

        if (!baseUrl || !token) {
            return res.status(503).json({
                message: "failed",
                data: "Server is missing GAME_API_URL or STEAM_ADMIN_TOKEN env vars. Set them in the Web API and restart.",
            });
        }

        const { time, type, maxresults } = req.query;
        if (!time) {
            return res.status(400).json({
                message: "failed",
                data: "Missing `time` query parameter (ISO 8601, e.g. 2026-06-01T00:00:00Z).",
            });
        }

        const target = new URL("/steam/report", baseUrl);
        target.searchParams.set("time", String(time));
        if (type) target.searchParams.set("type", String(type));
        if (maxresults) target.searchParams.set("maxresults", String(maxresults));

        const { status, body } = await httpJson(target.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (status !== 200) {
            return res.status(status).json({
                message: "failed",
                data: typeof body === "string" ? body : (body && body.message) || "Game API rejected the report request.",
                upstream: body,
            });
        }

        return res.status(200).json({ message: "success", data: body });
    } catch (err) {
        console.error(`[sales/steam-report] Error: ${err}`);
        return res.status(500).json({
            message: "server-error",
            data: err && err.message ? err.message : "Failed to fetch Steam report.",
        });
    }
};
