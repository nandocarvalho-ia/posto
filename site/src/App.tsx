import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Banner } from "./components/Banner";
import { Sobre } from "./components/Sobre";
import { Estrutura } from "./components/Estrutura";
import { Localizacao } from "./components/Localizacao";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Banner />
        <Sobre />
        <Estrutura />
        <Localizacao />
      </main>
      <Footer />
    </>
  );
}
