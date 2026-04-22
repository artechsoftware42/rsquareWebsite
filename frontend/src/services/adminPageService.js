const API_BASE = import.meta.env.VITE_API_URL;

const parseResponse = async (response) => {
    const text = await response.text();

    let data = {};
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
};

export const getPages = async () => {
    const response = await fetch(`${API_BASE}/api/pages`, {
        method: "GET",
        credentials: "include",
    });

    return parseResponse(response);
};

export const getPageByKey = async (pageKey) => {
    const response = await fetch(`${API_BASE}/api/pages/${pageKey}`, {
        method: "GET",
        credentials: "include",
    });

    return parseResponse(response);
};

export const savePageByKey = async (pageKey, payload) => {
    const response = await fetch(`${API_BASE}/api/pages/${pageKey}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    return parseResponse(response);
};

export const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    return parseResponse(response);
};