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
import ScrollToTop from "../components/ScrollToTop";
import NotFoundPage from "./NotFoundPage";

function Pages() {
  const location = useLocation();

  const hiddenLayoutRoutes = ["/admin", "/admin-login", "/404"];

  const shouldShowHeader = !hiddenLayoutRoutes.includes(location.pathname);
  const shouldShowFooter = !hiddenLayoutRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
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
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  );
}

export default Pages;