import { Resend } from "resend";
import MailSettings from "../models/mailSettings.model.js";

const escapeHtml = (value = "") => {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
};

const getMailSettings = async () => {
    const settings = await MailSettings.findOne({ key: "main" }).lean();

    if (!settings) {
        throw new Error("Mail ayarları bulunamadı.");
    }

    if (!settings.enabled) {
        throw new Error("Mail gönderimi pasif durumda.");
    }

    if (!settings.resendApiKey) {
        throw new Error("Resend API key tanımlı değil.");
    }

    if (!settings.from?.email) {
        throw new Error("Gönderici mail adresi tanımlı değil.");
    }

    return settings;
};

const getFromAddress = (settings) => {
    const fromName = settings.from?.name || "RSquare Studio";
    const fromEmail = settings.from?.email;

    return `${fromName} <${fromEmail}>`;
};

const getRecipients = (settings, type) => {
    const recipients = settings.recipients?.[type] || [];

    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new Error(`${type} için alıcı mail adresi tanımlı değil.`);
    }

    return recipients;
};

const fileToAttachment = (file) => {
    if (!file) return null;

    return {
        filename: file.originalname,
        content: file.buffer.toString("base64"),
        contentType: file.mimetype,
    };
};

const buildTableRows = (rows) => {
    return rows
        .map(
            (row) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:700;color:#111827;width:180px;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#374151;">
            ${escapeHtml(row.value || "-")}
          </td>
        </tr>
      `
        )
        .join("");
};

const buildMailTemplate = ({ title, intro, rows }) => {
    return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
      <div style="max-width:720px;margin:0 auto;padding:28px;">
        <div style="background:#0d0d0d;color:#ffffff;border-radius:22px;padding:26px 28px;margin-bottom:16px;">
          <div style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#c12030;font-weight:700;">
            RSquare Studio
          </div>
          <h1 style="margin:12px 0 0;font-size:26px;line-height:1.2;">
            ${escapeHtml(title)}
          </h1>
          ${intro
            ? `<p style="margin:12px 0 0;color:rgba(255,255,255,0.68);line-height:1.7;">${escapeHtml(intro)}</p>`
            : ""
        }
        </div>

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tbody>
              ${buildTableRows(rows)}
            </tbody>
          </table>
        </div>

        <p style="margin-top:16px;font-size:12px;color:#6b7280;line-height:1.6;">
          Bu e-posta web sitesi formu üzerinden otomatik oluşturuldu.
        </p>
      </div>
    </div>
  `;
};

const sendResendMail = async ({
    settings,
    type,
    subject,
    html,
    replyTo,
    attachments = [],
}) => {
    const resend = new Resend(settings.resendApiKey);

    const payload = {
        from: getFromAddress(settings),
        to: getRecipients(settings, type),
        subject,
        html,
        attachments,
    };

    if (settings.replyToFromUser && replyTo) {
        payload.replyTo = replyTo;
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
        console.error("Resend error:", error);
        throw new Error("Mail gönderilemedi.");
    }

    return data;
};

export const sendContactMail = async (formData) => {
    const settings = await getMailSettings();

    const subject =
        settings.subjects?.contact || "Yeni İletişim Formu Mesajı";

    const html = buildMailTemplate({
        title: "Yeni İletişim Formu Mesajı",
        intro: "ContactPage üzerinden yeni bir mesaj gönderildi.",
        rows: [
            { label: "Ad", value: formData.firstName },
            { label: "Soyad", value: formData.lastName },
            { label: "E-posta", value: formData.email },
            { label: "Konu Türü", value: formData.subjectType },
            { label: "Mesaj", value: formData.message },
        ],
    });

    return sendResendMail({
        settings,
        type: "contact",
        subject,
        html,
        replyTo: formData.email,
    });
};

export const sendCareerMail = async (formData, file) => {
    const settings = await getMailSettings();

    const subject =
        settings.subjects?.career || "Yeni Kariyer Başvurusu";

    const attachment = fileToAttachment(file);

    const html = buildMailTemplate({
        title: "Yeni Kariyer Başvurusu",
        intro: "CareerPage üzerinden yeni bir başvuru gönderildi.",
        rows: [
            { label: "Ad", value: formData.firstName },
            { label: "Soyad", value: formData.lastName },
            { label: "E-posta", value: formData.email },
            { label: "Telefon", value: formData.phone },
            { label: "Rol / Departman", value: formData.role },
            { label: "Portfolio", value: formData.portfolio },
            { label: "Ön Yazı", value: formData.coverLetter },
            { label: "CV Dosyası", value: file?.originalname || "-" },
        ],
    });

    return sendResendMail({
        settings,
        type: "career",
        subject,
        html,
        replyTo: formData.email,
        attachments: attachment ? [attachment] : [],
    });
};

export const sendShareYourGameMail = async (formData, file) => {
    const settings = await getMailSettings();

    const subject =
        settings.subjects?.shareYourGame || "Yeni Oyun Yayınlama Başvurusu";

    const attachment = fileToAttachment(file);

    const html = buildMailTemplate({
        title: "Yeni Oyun Yayınlama Başvurusu",
        intro: "ShareYourGame sayfası üzerinden yeni bir oyun gönderimi yapıldı.",
        rows: [
            { label: "Ad", value: formData.firstName },
            { label: "Soyad", value: formData.lastName },
            { label: "E-posta", value: formData.email },
            { label: "Platform", value: formData.platform },
            { label: "Oyun Türü", value: formData.gameGenre },
            { label: "Oyun Açıklaması", value: formData.gameDescription },
            { label: "Pitch Dosyası", value: file?.originalname || "-" },
        ],
    });

    return sendResendMail({
        settings,
        type: "shareYourGame",
        subject,
        html,
        replyTo: formData.email,
        attachments: attachment ? [attachment] : [],
    });
};