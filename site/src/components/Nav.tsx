import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { navLinks, mapaBuscaUrl } from "../data/site";
import { IconMenu, IconFechar, IconSeta } from "./Icons";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do corpo quando o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  return (
    <header className={`nav ${scrolled ? "nav--solida" : ""}`}>
      <div className="nav__inner">
        <a href="#inicio" className="nav__logo" aria-label="Posto Carvalho, início">
          <img src={logo} alt="Posto Carvalho" width={148} height={64} />
        </a>

        <nav className="nav__links" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav__link">
              {link.label}
            </a>
          ))}
          <span className="nav__fidelidade" aria-disabled="true">
            Fidelidade
            <span className="nav__tag">em breve</span>
          </span>
        </nav>

        <a
          className="nav__cta"
          href={mapaBuscaUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Como chegar
          <IconSeta className="nav__cta-icon" />
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((v) => !v)}
        >
          {menuAberto ? <IconFechar /> : <IconMenu />}
        </button>
      </div>

      {/* Menu mobile */}
      <div className={`nav__mobile ${menuAberto ? "is-aberto" : ""}`}>
        <nav className="nav__mobile-links" aria-label="Navegação mobile">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav__mobile-link"
              onClick={() => setMenuAberto(false)}
            >
              {link.label}
            </a>
          ))}
          <span className="nav__mobile-fidelidade">
            Fidelidade <span className="nav__tag">em breve</span>
          </span>
          <a
            className="nav__mobile-cta"
            href={mapaBuscaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuAberto(false)}
          >
            Como chegar
            <IconSeta className="nav__cta-icon" />
          </a>
        </nav>
      </div>
    </header>
  );
}
