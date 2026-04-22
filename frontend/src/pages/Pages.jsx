import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Home from "./Home";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import AdminProtectedRoute from "../routes/AdminProtectedRoute";

function Pages() {
  const location = useLocation();

  const hideHeaderRoutes = ["/admin-login", "/admin"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminPanel />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default Pages;