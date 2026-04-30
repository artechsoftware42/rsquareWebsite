import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Header from "../components/Header";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import AdminProtectedRoute from "../routes/AdminProtectedRoute";
import Footer from "../components/Footer";
import AboutPage from "./AboutPage";
import GamesPage from "./GamesPage";
import ContactPage from "./ContactPage";
import CareerPage from "./CareerPage";
import ShareYourGame from "./ShareYourGame";
import PrivacyPolicy from "./PrivacyPolicy";
import GameDetailPage from "./GameDetailPage";

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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/share-your-game" element={<ShareYourGame />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/games/:slug" element={<GameDetailPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default Pages;