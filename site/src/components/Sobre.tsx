import combustivelImg from "../assets/images/combustivel.jpg";
import { Reveal } from "./Reveal";

const sinais = [
  { titulo: "Bandeira branca", desc: "Independente, com liberdade para entregar o melhor." },
  { titulo: "Qualidade comprovada", desc: "Combustível em que você pode confiar, abastecimento após abastecimento." },
  { titulo: "Preço justo", desc: "Sempre. Sem letra miúda, sem surpresa na bomba." },
  { titulo: "24 horas", desc: "Todos os dias, porque a estrada não para, e a gente também não." },
];

export function Sobre() {
  return (
    <section className="sobre" id="o-posto">
      <div className="sobre__inner">
        <Reveal className="sobre__texto">
          <p className="eyebrow">O Posto</p>
          <h2 className="sobre__title">
            Parceiro de quem
            <br />
            vive a estrada.
          </h2>
          <p className="sobre__lead">
            O Posto Carvalho fica na BR-116, km 698, em Jequié. Combustível de
            qualidade com preço justo, atendimento próximo e acolhedor, e uma
            estrutura pensada para quem precisa parar com segurança, a qualquer
            hora.
          </p>

          <dl className="sobre__sinais">
            {sinais.map((sinal) => (
              <div className="sobre__sinal" key={sinal.titulo}>
                <dt>{sinal.titulo}</dt>
                <dd>{sinal.desc}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="sobre__media" delay={120}>
          <figure className="sobre__figura">
            {/* Placeholder, trocar pela foto real do posto. */}
            <img
              src={combustivelImg}
              alt="Bicos de combustível de um posto, em detalhe"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="sobre__selo">
              <span className="sobre__selo-num">698</span>
              <span className="sobre__selo-label">km da BR-116, o seu ponto de parada</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
