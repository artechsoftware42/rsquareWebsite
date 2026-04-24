import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/Contact";
import Career from "../components/Career";
import Games from "../components/Games";
import Footer from "../components/Footer";
import Partners from "../components/Partners";
import Publish from "../components/Publish";
import ScrollToTop from "../components/ScrollToTop";

function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Games />
      <Publish />
      <Career />
      <Partners />
    </div>
  );
}

export default Home;