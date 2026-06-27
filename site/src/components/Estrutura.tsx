import carretaImg from "../assets/images/carreta.jpg";
import { Reveal } from "./Reveal";
import {
  IconPrato,
  IconBanheiro,
  IconEscudo,
  IconWifi,
  IconCombustivel,
} from "./Icons";

const itens = [
  {
    Icon: IconPrato,
    titulo: "Restaurante e lanchonete",
    desc: "Comida boa e quentinha a qualquer hora, do café da manhã à madrugada.",
  },
  {
    Icon: IconBanheiro,
    titulo: "Banheiros limpos",
    desc: "Higiene de verdade, do jeito que quem roda o dia inteiro merece.",
  },
  {
    Icon: IconEscudo,
    titulo: "Segurança, junto à PRF",
    desc: "Movimento constante e a Polícia Rodoviária Federal por perto.",
  },
  {
    Icon: IconWifi,
    titulo: "Wi-Fi para clientes",
    desc: "Conexão liberada para resolver a vida ou falar com a família.",
  },
  {
    Icon: IconCombustivel,
    titulo: "Combustível de qualidade",
    desc: "Abastecimento confiável, com preço justo na bomba.",
  },
];

export function Estrutura() {
  return (
    <section className="estrutura" id="estrutura">
      <div className="estrutura__inner">
        <Reveal className="estrutura__cabecalho">
          <p className="eyebrow">Estrutura</p>
          <h2 className="estrutura__title">Tudo pronto para a sua parada.</h2>
        </Reveal>

        <div className="estrutura__grade">
          {/* Item de destaque: o diferencial número um para o caminhoneiro. */}
          <Reveal className="estrutura__destaque" as="article">
            <img
              src={carretaImg}
              alt="Carretas na estrada ao entardecer"
              loading="lazy"
              decoding="async"
            />
            <div className="estrutura__destaque-texto">
              <p className="estrutura__destaque-eyebrow">O diferencial da estrada</p>
              <h3>Estacionamento amplo para carretas</h3>
              <p>
                Espaço de sobra para manobrar, parar e descansar com tranquilidade
                antes de seguir viagem.
              </p>
            </div>
          </Reveal>

          {/* Demais diferenciais: lista tipográfica, não um grid de cards idênticos. */}
          <Reveal className="estrutura__lista" as="ul" delay={100}>
            {itens.map(({ Icon, titulo, desc }) => (
              <li className="estrutura__item" key={titulo}>
                <span className="estrutura__item-icone">
                  <Icon />
                </span>
                <div>
                  <h3 className="estrutura__item-titulo">{titulo}</h3>
                  <p className="estrutura__item-desc">{desc}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
