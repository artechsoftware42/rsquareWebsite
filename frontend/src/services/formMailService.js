const API_BASE = import.meta.env.VITE_API_URL;

const postFormData = async (endpoint, formData) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.success === false) {
        const error = new Error(data?.message || "Form gönderilemedi.");
        error.remainingSeconds = data?.remainingSeconds || 0;
        throw error;
    }

    return data;
};

export const sendContactMail = async (payload) => {
    const formData = new FormData();

    formData.append("firstName", payload.firstName || "");
    formData.append("lastName", payload.lastName || "");
    formData.append("email", payload.email || "");
    formData.append("subjectType", payload.subjectType || "");
    formData.append("message", payload.message || "");

    return postFormData("/api/form-mail/contact", formData);
};

export const sendCareerMail = async (payload) => {
    const formData = new FormData();

    formData.append("firstName", payload.firstName || "");
    formData.append("lastName", payload.lastName || "");
    formData.append("email", payload.email || "");
    formData.append("phone", payload.phone || "");
    formData.append("role", payload.role || "");
    formData.append("portfolio", payload.portfolio || "");
    formData.append("coverLetter", payload.coverLetter || "");

    if (payload.cv) {
        formData.append("cv", payload.cv);
    }

    return postFormData("/api/form-mail/career", formData);
};

export const sendShareYourGameMail = async (payload) => {
    const formData = new FormData();

    formData.append("firstName", payload.firstName || "");
    formData.append("lastName", payload.lastName || "");
    formData.append("email", payload.email || "");
    formData.append("platform", payload.platform || "");
    formData.append("gameGenre", payload.gameGenre || "");
    formData.append("gameDescription", payload.gameDescription || "");

    if (payload.pitchFile) {
        formData.append("pitchFile", payload.pitchFile);
    }

    return postFormData("/api/form-mail/share-your-game", formData);
};