import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Header from "../components/Header";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import AdminProtectedRoute from "../routes/AdminProtectedRoute";
import Footer from "../components/Footer";

function Pages() {
  const location = useLocation();

  const hideHeaderRoutes = ["/admin", "/admin-login"];
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
      <Footer />
    </>
  );
}

export default Pages;