import express from "express";
import multer from "multer";
import {
    sendCareerMail,
    sendContactMail,
    sendShareYourGameMail,
} from "../services/formMail.service.js";
import formCooldownMiddleware from "../middleware/formCooldownMiddleware.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
});

const required = (value) => {
    return Boolean(String(value || "").trim());
};

router.post("/contact", formCooldownMiddleware, upload.none(), async (req, res) => {
    try {
        const { firstName, lastName, email, subjectType, message } = req.body;

        if (
            !required(firstName) ||
            !required(lastName) ||
            !required(email) ||
            !required(subjectType) ||
            !required(message)
        ) {
            return res.status(400).json({
                success: false,
                message: "Zorunlu alanlar eksik.",
            });
        }

        await sendContactMail({
            firstName,
            lastName,
            email,
            subjectType,
            message,
        });

        return res.json({
            success: true,
            message: "Mesaj gönderildi.",
        });
    } catch (error) {
        console.error("Contact mail error:", error);

        return res.status(500).json({
            success: false,
            message: "Mesaj gönderilemedi.",
        });
    }
});

router.post("/career", formCooldownMiddleware, upload.single("cv"), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            role,
            portfolio,
            coverLetter,
        } = req.body;

        if (
            !required(firstName) ||
            !required(lastName) ||
            !required(email) ||
            !required(phone) ||
            !required(role) ||
            !required(portfolio) ||
            !required(coverLetter) ||
            !req.file
        ) {
            return res.status(400).json({
                success: false,
                message: "Zorunlu alanlar eksik.",
            });
        }

        await sendCareerMail(
            {
                firstName,
                lastName,
                email,
                phone,
                role,
                portfolio,
                coverLetter,
            },
            req.file
        );

        return res.json({
            success: true,
            message: "Başvuru gönderildi.",
        });
    } catch (error) {
        console.error("Career mail error:", error);

        return res.status(500).json({
            success: false,
            message: "Başvuru gönderilemedi.",
        });
    }
});

router.post("/share-your-game", formCooldownMiddleware, upload.single("pitchFile"), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            platform,
            gameGenre,
            gameDescription,
        } = req.body;

        if (
            !required(firstName) ||
            !required(lastName) ||
            !required(email) ||
            !required(platform) ||
            !required(gameGenre) ||
            !required(gameDescription) ||
            !req.file
        ) {
            return res.status(400).json({
                success: false,
                message: "Zorunlu alanlar eksik.",
            });
        }

        await sendShareYourGameMail(
            {
                firstName,
                lastName,
                email,
                platform,
                gameGenre,
                gameDescription,
            },
            req.file
        );

        return res.json({
            success: true,
            message: "Oyun başvurusu gönderildi.",
        });
    } catch (error) {
        console.error("Share your game mail error:", error);

        return res.status(500).json({
            success: false,
            message: "Oyun başvurusu gönderilemedi.",
        });
    }
});

export default router;