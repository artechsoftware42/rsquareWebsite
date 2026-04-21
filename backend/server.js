import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import path from "path";

import mailRoutes from "./routes/mail.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminAuthMiddleware from "./middleware/adminAuthMiddleware.js";
import titleSettingsRoutes from "./routes/titleSettingsRoutes.js";
import uploadRoutes from "./routes/upload.routes.js";

import Page from "./models/Page.js"; // 🔥 EKLENDİ

const app = express();

const uri = process.env.MONGO_URI;
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://192.168.1.37:5173",
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use(
    session({
        name: "admin_sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: uri,
            collectionName: "sessions",
        }),
        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
        },
    })
);

app.use("/api/mail", mailRoutes);
app.use("/api/admin-auth", adminAuthRoutes);

/* =========================
   🔥 PAGES (TEK COLLECTION)
========================= */

// GET ALL PAGES
app.get("/api/pages", async (req, res) => {
    try {
        const pages = await Page.find({}, { pageKey: 1, title: 1 });
        res.json(pages);
    } catch (error) {
        console.error("❌ Pages listesi alınamadı:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET SINGLE PAGE
app.get("/api/pages/:name", async (req, res) => {
    try {
        const page = await Page.findOne({ pageKey: req.params.name });

        if (!page) {
            return res.status(404).json({ error: "Page bulunamadı" });
        }

        res.json(page);
    } catch (error) {
        console.error("❌ Page alınamadı:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE PAGE
app.put("/api/pages/:name", adminAuthMiddleware, async (req, res) => {
    try {
        const { sections } = req.body;

        if (!Array.isArray(sections)) {
            return res.status(400).json({ error: "sections array olmalı." });
        }

        const updated = await Page.findOneAndUpdate(
            { pageKey: req.params.name },
            { $set: { sections } },
            { new: true, upsert: true }
        );

        res.json({
            message: "Belge güncellendi",
            data: updated,
        });
    } catch (error) {
        console.error("❌ Güncelleme hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/* ========================= */

app.use("/api", titleSettingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/images", express.static(path.join(process.cwd(), "public", "images")));

/* ========================= */

mongoose
    .connect(uri)
    .then(() => {
        console.log("✅ MongoDB Atlas'a bağlandı");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB bağlantı hatası:", err.message);
    });