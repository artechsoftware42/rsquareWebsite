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
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
};

export const loginAdmin = async ({ username, password }) => {
    const response = await fetch(`${API_BASE}/api/admin-auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            username: username.trim(),
            password,
        }),
    });

    return parseResponse(response);
};

export const getAdminMe = async () => {
    const response = await fetch(`${API_BASE}/api/admin-auth/me`, {
        method: "GET",
        credentials: "include",
    });

    return parseResponse(response);
};

export const logoutAdmin = async () => {
    const response = await fetch(`${API_BASE}/api/admin-auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    const data = await parseResponse(response);
    sessionStorage.removeItem("adminSessionActive");
    return data;
};

export const clearAdminSessionMarkers = () => {
    sessionStorage.removeItem("adminSessionActive");
};

export const hasActiveAdminSessionMarker = () => {
    return sessionStorage.getItem("adminSessionActive") === "true";
};