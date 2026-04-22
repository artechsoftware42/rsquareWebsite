import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminMe, clearAdminSessionMarkers } from "../services/adminAuthService";

function AdminProtectedRoute({ children }) {
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getAdminMe();
                setStatus("authorized");
            } catch (error) {
                clearAdminSessionMarkers();
                setStatus("unauthorized");
            }
        };

        checkAuth();
    }, []);

    if (status === "loading") {
        return <div style={{ padding: "24px" }}>Kontrol ediliyor...</div>;
    }

    if (status === "unauthorized") {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
}

export default AdminProtectedRoute;