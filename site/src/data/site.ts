// Conteúdo e configuração central do site do Posto Carvalho.
// Tudo que muda (contato, endereço, textos) fica aqui para facilitar manutenção.

// Telefone/WhatsApp confirmado pelo Nando (com o nono dígito).
const WHATSAPP_NUMERO = "5573981379532";
const WHATSAPP_MENSAGEM =
  "Olá! Vim pelo site do Posto Carvalho e gostaria de mais informações.";

// Link oficial do lugar no Google (aponta para o ponto exato do posto).
const GOOGLE_SHARE = "https://share.google/NglFC2ppg5sXwtn1t";

export const site = {
  nome: "Posto Carvalho",
  slogan: "Você confia, a garantia é nossa.",

  endereco: {
    linha1: "BR-116, km 698",
    linha2: "Zona rural, Jequié, Bahia",
    cidade: "Jequié, Bahia",
    horario: "Aberto 24 horas, todos os dias",
  },

  // Usado no mapa embutido (busca pelo nome + rodovia).
  mapaQuery: "Posto Carvalho BR-116 km 698 Jequié BA",

  contato: {
    whatsappNumero: WHATSAPP_NUMERO,
    whatsappLink: `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
      WHATSAPP_MENSAGEM
    )}`,
    whatsappDisplay: "(73) 98137-9532",

    instagramHandle: "@carvalho.posto",
    instagramLink: "https://instagram.com/carvalho.posto",

    email: "atendimento@postocarvalho.com",
  },
} as const;

// "Como chegar": aponta para o lugar oficial do posto no Google.
export const mapaBuscaUrl = GOOGLE_SHARE;

export const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  site.mapaQuery
)}&output=embed`;

// Âncoras de navegação. O gancho "Fidelidade" fica pronto para a fase 2.
export const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#o-posto", label: "O Posto" },
  { href: "#estrutura", label: "Estrutura" },
  { href: "#localizacao", label: "Localização" },
] as const;

// Slides da faixa de banner. O último é o slot reservado para a fidelidade (fase 2).
export const bannerSlides = [
  {
    id: "qualidade",
    tag: "24 horas",
    texto: "Combustível de qualidade com preço justo, a qualquer hora do dia ou da noite.",
  },
  {
    id: "estrutura",
    tag: "Conforto",
    texto: "Restaurante, lanchonete e banheiros limpos para você descansar bem na estrada.",
  },
  {
    id: "fidelidade",
    tag: "Em breve",
    texto: "Programa de fidelidade Posto Carvalho: abasteça e seja recompensado.",
    futuro: true,
  },
] as const;
