import mongoose from "mongoose";

const mailSettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "main",
            unique: true,
            index: true,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        resendApiKey: {
            type: String,
            required: true,
        },
        from: {
            name: {
                type: String,
                default: "RSquare Studio",
            },
            email: {
                type: String,
                required: true,
            },
        },
        recipients: {
            contact: {
                type: [String],
                default: [],
            },
            career: {
                type: [String],
                default: [],
            },
            shareYourGame: {
                type: [String],
                default: [],
            },
        },
        subjects: {
            contact: {
                type: String,
                default: "Yeni İletişim Formu Mesajı",
            },
            career: {
                type: String,
                default: "Yeni Kariyer Başvurusu",
            },
            shareYourGame: {
                type: String,
                default: "Yeni Oyun Yayınlama Başvurusu",
            },
        },
        replyToFromUser: {
            type: Boolean,
            default: true,
        },
    },
    {
        collection: "mailSettings",
        timestamps: true,
    }
);

export default mongoose.model("MailSettings", mailSettingsSchema);