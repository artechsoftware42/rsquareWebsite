import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import Pages from "./pages/Pages";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <LanguageProvider>
      <Pages />
    </LanguageProvider>
  );
}

export default App;