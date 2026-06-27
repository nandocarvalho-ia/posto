import { site, navLinks, mapaBuscaUrl } from "../data/site";
import {
  IconWhatsapp,
  IconInstagram,
  IconEnvelope,
  IconSeta,
} from "./Icons";

export function Footer() {
  return (
    <footer className="rodape" id="contato">
      <div className="rodape__inner">
        <div className="rodape__slogan">
          <p className="rodape__marca">Posto Carvalho</p>
          <p className="rodape__frase">{site.slogan}</p>
        </div>

        <div className="rodape__colunas">
          <div className="rodape__coluna">
            <h3 className="rodape__titulo">Contato</h3>
            <ul className="rodape__lista">
              <li>
                <a
                  href={site.contato.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rodape__contato"
                >
                  <IconWhatsapp className="rodape__contato-icone" />
                  WhatsApp {site.contato.whatsappDisplay}
                </a>
              </li>
              <li>
                {/* PREENCHER: confirmar handle real do Instagram. */}
                <a
                  href={site.contato.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rodape__contato"
                >
                  <IconInstagram className="rodape__contato-icone" />
                  {site.contato.instagramHandle}
                </a>
              </li>
              <li>
                {/* PREENCHER: confirmar e-mail real de contato. */}
                <a
                  href={`mailto:${site.contato.email}`}
                  className="rodape__contato"
                >
                  <IconEnvelope className="rodape__contato-icone" />
                  {site.contato.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="rodape__coluna">
            <h3 className="rodape__titulo">Onde estamos</h3>
            <address className="rodape__endereco">
              {site.endereco.linha1}
              <br />
              {site.endereco.linha2}
              <br />
              {site.endereco.horario}
            </address>
          </div>

          <div className="rodape__coluna">
            <h3 className="rodape__titulo">Navegação</h3>
            <ul className="rodape__lista">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="rodape__link">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <span className="rodape__link rodape__link--futuro">
                  Fidelidade <span className="rodape__em-breve">em breve</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Semente B2B: captação discreta de frota. */}
      <div className="rodape__frota">
        <div className="rodape__frota-inner">
          <p>Abastecimento para frota e transportadora?</p>
          <a
            href={site.contato.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rodape__frota-link"
          >
            Fale com a gente
            <IconSeta className="btn__icon" />
          </a>
        </div>
      </div>

      <div className="rodape__base">
        <p>© 2026 Posto Carvalho. Todos os direitos reservados.</p>
        <a
          href={mapaBuscaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rodape__base-link"
        >
          BR-116, km 698 · Jequié, Bahia
        </a>
      </div>
    </footer>
  );
}
