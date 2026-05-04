import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

function AdminProtectedRoute({ children }) {
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const hasTabSession =
                    sessionStorage.getItem("admin_tab_session") === "active";

                if (!hasTabSession) {
                    await fetch(`${API_BASE}/api/admin-auth/logout`, {
                        method: "POST",
                        credentials: "include",
                    }).catch(() => { });

                    setStatus("unauthorized");
                    return;
                }

                const res = await fetch(`${API_BASE}/api/admin-auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    sessionStorage.removeItem("admin_tab_session");
                    setStatus("unauthorized");
                    return;
                }

                const data = await res.json().catch(() => null);

                if (!data?.success) {
                    sessionStorage.removeItem("admin_tab_session");
                    setStatus("unauthorized");
                    return;
                }

                setStatus("authorized");
            } catch (error) {
                console.error("Admin auth check error:", error);
                sessionStorage.removeItem("admin_tab_session");
                setStatus("unauthorized");
            }
        };

        checkAdmin();
    }, []);

    if (status === "checking") {
        return null;
    }

    if (status === "unauthorized") {
        return <Navigate to="/r2Ws-Nw2G-CCwM-IyWyN-AVp-7VsXC" replace />;
    }

    return children;
}

export default AdminProtectedRoute;