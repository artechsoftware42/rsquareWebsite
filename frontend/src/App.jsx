import './App.css'

import Header from "./components/Header"
import Home from './pages/Home'
import { LanguageProvider } from "./context/LanguageContext";

function App() {

  return (
    <>
      <LanguageProvider>
        <Header />
        <Home />
      </LanguageProvider>
    </>
  )
}

export default App
