import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import Pages from "./pages/Pages";

function App() {
  return (
    <LanguageProvider>
      <Pages />
    </LanguageProvider>
  );
}

export default App;