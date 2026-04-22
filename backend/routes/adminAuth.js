import express from "express";
import AdminAuth from "../models/AdminAuth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("LOGIN REQUEST BODY:", { username, password });
        console.log("LOGIN SESSION ID BEFORE:", req.sessionID);
        console.log("LOGIN SESSION BEFORE:", req.session);

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Kullanıcı adı ve şifre zorunlu.",
            });
        }

        const adminDoc = await AdminAuth.findOne({
            key: "adminLogin",
            isActive: true,
        }).lean();

        console.log("ADMIN DOC:", adminDoc);

        if (!adminDoc) {
            return res.status(404).json({
                success: false,
                message: "Admin giriş verisi bulunamadı.",
            });
        }

        const isMatch =
            username.trim() === String(adminDoc.username).trim() &&
            password === String(adminDoc.password);

        console.log("PASSWORD MATCH:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Kullanıcı adı veya şifre hatalı.",
            });
        }

        req.session.admin = {
            username: adminDoc.username,
            isAuthenticated: true,
        };

        console.log("LOGIN SESSION AFTER ASSIGN:", req.session);

        req.session.save((err) => {
            if (err) {
                console.error("SESSION SAVE ERROR:", err);
                return res.status(500).json({
                    success: false,
                    message: "Session kaydedilemedi.",
                });
            }

            console.log("LOGIN SESSION SAVED ID:", req.sessionID);
            console.log("LOGIN SESSION SAVED DATA:", req.session);

            return res.status(200).json({
                success: true,
                message: "Login successful.",
                admin: {
                    username: adminDoc.username,
                },
            });
        });
    } catch (error) {
        console.error("ADMIN LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
        });
    }
});

router.get("/me", (req, res) => {
    try {
        console.log("ME COOKIE HEADER:", req.headers.cookie);
        console.log("ME SESSION ID:", req.sessionID);
        console.log("ME SESSION DATA:", req.session);

        if (!req.session?.admin?.isAuthenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            admin: {
                username: req.session.admin.username,
            },
        });
    } catch (error) {
        console.error("ADMIN ME ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası.",
        });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Çıkış yapılırken hata oluştu.",
            });
        }

        res.clearCookie("admin_sid", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Çıkış başarılı.",
        });
    });
});

export default router;