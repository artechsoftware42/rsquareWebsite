import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import path from "path";

import adminAuthRoutes from "./routes/adminAuth.js";
import adminAuthMiddleware from "./middleware/adminAuthMiddleware.js";
import titleSettingsRoutes from "./routes/titleSettingsRoutes.js";
import uploadRoutes from "./routes/upload.routes.js";
import Page from "./models/Page.js";

import formMailRoutes from "./routes/formMail.routes.js";

const app = express();

const uri = process.env.MONGO_URI;

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
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use("/api/form-mail", formMailRoutes);
app.use("/api/admin-auth", adminAuthRoutes);

app.get("/api/pages", async (req, res) => {
    try {
        const pages = await Page.find({}, { pageKey: 1, title: 1 });
        res.json(pages);
    } catch (error) {
        console.error("❌ Pages listesi alınamadı:", error.message);
        res.status(500).json({ error: error.message });
    }
});

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

app.put("/api/pages/:name", adminAuthMiddleware, async (req, res) => {
    try {
        const { sections, title } = req.body;

        if (!Array.isArray(sections)) {
            return res.status(400).json({ error: "sections array olmalı." });
        }

        const updated = await Page.findOneAndUpdate(
            { pageKey: req.params.name },
            { $set: { sections, title } },
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

app.use("/api", titleSettingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/images", express.static(path.join(process.cwd(), "public", "images")));

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