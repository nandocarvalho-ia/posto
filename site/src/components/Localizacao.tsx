import { useState } from "react";
import { site, mapaBuscaUrl, mapaEmbedUrl } from "../data/site";
import { Reveal } from "./Reveal";
import { IconSeta, IconRelogio, IconPin } from "./Icons";

export function Localizacao() {
  // O mapa pesado de terceiros só carrega sob clique: melhor desempenho
  // para quem acessa do celular, com conexão fraca na estrada.
  const [mapaCarregado, setMapaCarregado] = useState(false);

  return (
    <section className="local" id="localizacao">
      <div className="local__inner">
        <Reveal className="local__painel">
          <p className="eyebrow eyebrow--claro">Localização</p>
          <h2 className="local__title">Fácil de achar, na BR-116.</h2>

          <div className="local__endereco">
            <IconPin className="local__icone" />
            <div>
              <p className="local__rua">{site.endereco.linha1}</p>
              <p className="local__cidade">{site.endereco.linha2}</p>
            </div>
          </div>

          <div className="local__horario">
            <IconRelogio className="local__icone" />
            <p>{site.endereco.horario}</p>
          </div>

          <a
            className="btn btn--ouro"
            href={mapaBuscaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Como chegar
            <IconSeta className="btn__icon" />
          </a>
        </Reveal>

        <Reveal className="local__mapa" delay={120}>
          {mapaCarregado ? (
            <iframe
              title="Mapa da localização do Posto Carvalho na BR-116, km 698, Jequié-BA"
              src={mapaEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="local__mapa-trigger"
              onClick={() => setMapaCarregado(true)}
            >
              <span className="local__mapa-pin">
                <IconPin />
              </span>
              <span className="local__mapa-titulo">Ver no mapa</span>
              <span className="local__mapa-sub">
                Toque para abrir o mapa interativo
              </span>
            </button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
