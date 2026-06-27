import heroImg from "../assets/images/hero-posto.jpg";
import { site, mapaBuscaUrl } from "../data/site";
import { IconSeta, IconWhatsapp, IconPin } from "./Icons";

export function Hero() {
  return (
    <section className="hero" id="inicio">
      {/* Imagem de fundo: placeholder golden-hour/noturno, trocar pela foto real do posto. */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src={heroImg}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content">
        <p className="hero__status">
          <span className="hero__pulse" aria-hidden="true" />
          Aberto agora
          <span className="hero__status-sep" aria-hidden="true" />
          24 horas
        </p>

        <h1 className="hero__title">
          Na estrada, o que importa
          <br />é <span className="hero__title-accent">confiança</span>.
        </h1>

        <p className="hero__sub">
          Combustível de qualidade, preço justo e estrutura completa na BR-116.
          Você confia, a garantia é nossa.
        </p>

        <p className="hero__local">
          <IconPin className="hero__local-icon" />
          {site.endereco.linha1} · {site.endereco.cidade}
        </p>

        <div className="hero__acoes">
          <a
            className="btn btn--ouro"
            href={mapaBuscaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Como chegar
            <IconSeta className="btn__icon" />
          </a>
          <a
            className="btn btn--fantasma"
            href={site.contato.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsapp className="btn__icon" />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
