import express from "express";
import bcrypt from "bcrypt";
import AdminAuth from "../models/AdminAuth.js";
import { adminLoginLimiter } from "../middleware/adminRateLimit.js";

const router = express.Router();

router.post("/login", adminLoginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

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

        if (!adminDoc) {
            return res.status(404).json({
                success: false,
                message: "Admin giriş verisi bulunamadı.",
            });
        }

        if (!adminDoc.passwordHash) {
            return res.status(500).json({
                success: false,
                message: "Admin şifre ayarı güvenli formatta değil.",
            });
        }

        const usernameMatch =
            username.trim() === String(adminDoc.username || "").trim();

        const passwordMatch = await bcrypt.compare(
            password,
            String(adminDoc.passwordHash)
        );

        const isMatch = usernameMatch && passwordMatch;

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

        req.session.save((err) => {
            if (err) {
                console.error("SESSION SAVE ERROR:", err);
                return res.status(500).json({
                    success: false,
                    message: "Session kaydedilemedi.",
                });
            }

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