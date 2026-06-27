# DESIGN.md — Posto Carvalho

> Tokens e diretrizes de design. Calibrado para minimalismo premium com a identidade verde-bandeira + ouro, fugindo do clichê "posto verde-amarelo". Valores em OKLCH (a skill exige OKLCH; nunca #000/#fff puros — todo neutro levemente tintado para o verde da marca).

## Color strategy
**Restrained**: neutros tintados + branco dominante + UM acento (ouro) ≤10% da superfície. O verde-bandeira atua como neutro escuro da marca (não conta como "o acento" — é a âncora estrutural das áreas escuras). Verde e ouro nunca dividem grande área lado a lado.

## Paleta (OKLCH)
- **Branco de marca (fundo dominante):** oklch(0.99 0.004 150) — branco levemente tintado de verde. NÃO #fff.
- **Off-white / seção alternada:** oklch(0.975 0.006 150).
- **Verde-bandeira (âncora escura da marca):** oklch(0.38 0.09 155) — rodapé, faixa de destaque, fundo do banner quando escuro, títulos de peso.
- **Verde profundo (texto sobre claro, quando precisa de cor):** oklch(0.30 0.08 155).
- **Ouro (acento nobre, ≤10%):** oklch(0.80 0.13 85) — botão de ação primário, filete sob título, micro-destaques. Reduzir chroma se parecer berrante.
- **Texto principal:** oklch(0.25 0.01 155) — quase preto tintado de verde, nunca #000.
- **Texto secundário:** oklch(0.50 0.01 155).
- **Linha/borda sutil:** oklch(0.92 0.006 150).

Regra de proporção alvo: ~75-80% branco/off-white, ~12-18% verde (áreas escuras/estruturais), ≤10% ouro (acentos). Se o ouro passar de ~10% da tela, está carregado — reduzir.

## Tipografia
- **Display/títulos:** uma sans-serif moderna com presença (ex.: família geométrica/grotesque — Söhne, Geist, Inter Tight, ou similar disponível). Peso forte nos títulos (600-700).
- **Corpo:** mesma família ou uma sans neutra legível. Corpo 16-18px, line-height generoso.
- Hierarquia por escala + peso, contraste ≥1.25 entre passos. Nada de escala chapada.
- Largura de linha do corpo: 65-75ch máx.
- Sem texto em gradiente (ban). Ênfase por peso/tamanho, cor sólida.

## Layout
- Mobile-first. O essencial pro caminhoneiro (24h, localização, segurança, estrutura) captável em segundos no celular.
- Ritmo de espaçamento variado (não o mesmo padding em tudo). O respiro É o luxo.
- Evitar "wrap everything in a card". Cards só quando forem de fato a melhor forma; nunca card aninhado; nunca grid de cards idênticos ícone+título+texto.
- Logo recebe espaço amplo ao redor para virar ponto focal (compensa o estilo brilhante/3D dela com entorno clean).

## Estrutura de seções (primeira versão)
1. **Top nav** simples: logo + âncoras (Início, O Posto, Estrutura, Localização, Contato). CTA discreto.
2. **Hero**: mensagem fixa forte — headline curta + subheadline com o espírito de "Você confia, a garantia é nossa" + 1 botão ouro (ex.: "Como chegar"). Fundo com fotografia quente do posto (golden hour). A mensagem principal NUNCA some.
3. **Banner publicitário** (faixa/slot rotativo): logo abaixo ou integrado ao Hero como tira horizontal, secundário. Peças institucionais agora; slot reservado para a fidelidade depois.
4. **O Posto / quem somos**: confiança, qualidade, preço justo, 24h.
5. **Estrutura / diferenciais**: restaurante e lanchonete, banheiros limpos, segurança (PRF), estacionamento de carreta. (Sem virar grid de cards idêntico — variar a apresentação.)
6. **Localização**: BR-116 km 698, Jequié-BA, 24h, mapa/como chegar. Forte para quem está na estrada.
7. **Rodapé** (verde-bandeira): contato, redes, slogan, eventual gancho "abastecimento para frota" (semente B2B).

## Motion
- Ease-out exponencial (quart/quint/expo). Sem bounce, sem elastic.
- Não animar propriedades de layout. Transições sutis, premium, nunca chamativas.
- Banner: transição suave entre peças (fade/slide curto), sem auto-troca agressiva que atrapalhe leitura.

## Bans (reforço — match-and-refuse)
- Borda lateral colorida (border-left/right como acento). 
- Texto em gradiente.
- Glassmorphism decorativo.
- Hero-metric template (número gigante + label + stats).
- Grid de cards idênticos.
- Em dash / "--" no texto da interface (usar vírgula, dois-pontos, ponto, parênteses).

## Imagens
- Fotografia real do posto será fornecida depois pelo Nando. Por ora, usar imagens geradas por IA (golden hour, posto de rodovia limpo e premium, estacionamento de carreta, ambiente acolhedor) como placeholder, marcadas para troca futura.
- Clima: quente, premium, confiável. Nada de stock genérico frio.

## Acessibilidade
- Contraste AA mínimo. Ouro sobre branco tem contraste baixo para texto — ouro é para fundo de botão com texto escuro/branco legível ou para filetes, não para texto pequeno sobre branco.
- Alvos de toque confortáveis (uso no celular, na estrada).
