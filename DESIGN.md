---
name: CAG Tech
version: 2.0
description: Sistema de design para o site institucional da CAG Tech (cagtech.com.br) — desenvolvimento de software sob medida.
colors:
  dark:
    canvas: "#05070F"
    surface: "#0B1020"
    surface-raised: "#111830"
    stroke: "#1E2A47"
    stroke-strong: "#2D3E66"
    text-strong: "#F4F7FF"
    text-base: "#C6D2E8"
    text-muted: "#8A9BBD"
    primary: "#1DB6FD"
    primary-hover: "#5CCBFF"
    secondary: "#3F6EFF"
    accent: "#C464FF"
    accent-glow: "#A77BFF"
    success: "#2BD99F"
    warning: "#FFB547"
    danger: "#FF5C7A"
  light:
    canvas: "#FFFFFF"
    surface: "#F5F7FC"
    surface-raised: "#FFFFFF"
    stroke: "#E2E7F2"
    text-strong: "#0A1126"
    text-base: "#3A4664"
    text-muted: "#6B7794"
    primary: "#0A84C9"
    secondary: "#1867ED"
    accent: "#8B3FD9"
typography:
  display: "Space Grotesk"
  body: "Inter"
  mono: "JetBrains Mono"
radius: { xs: 6px, sm: 10px, md: 14px, lg: 20px, xl: 28px, pill: 999px }
spacing-base: 4px
---

# DESIGN.md — CAG Tech

> Documento-fonte para o Google Stitch gerar o redesign do site cagtech.com.br. Mantém nome e logo (gradiente violeta → azul → ciano) e eleva o visual para o nível de empresas de software modernas: escuro, preciso, com luz e profundidade controladas.

## 1. Posicionamento e tom

- **Quem somos:** software house que transforma processos em produtos digitais — sites, sistemas web, apps, integrações e automações.
- **Promessa:** "Do problema ao software em produção, com engenharia de verdade."
- **Tom de voz:** direto, técnico sem jargão, confiante, humano. Frases curtas. Verbos de ação ("Construímos", "Integramos", "Entregamos"). Português do Brasil.
- **Personalidade visual:** sofisticada, silenciosa, de engenharia. Menos "neon gamer", mais "console de produto premium". O efeito "tech" vem de grid, código, dados e luz — não de excesso de cor.

## 2. Direção visual

1. **Dark-first com seções claras de respiro.** Fundo quase preto azulado; 1–2 seções em fundo claro (papel) para ritmo, como contraste editorial.
2. **Cor como luz, não como tinta.** O gradiente da marca aparece em glows, bordas, ícones e CTAs. Superfícies permanecem neutras.
3. **Interface como ilustração.** No lugar de fotos genéricas, mostrar "mockups de produto": janelas de código, dashboards, terminais, cards de deploy, fluxos de API.
4. **Precisão geométrica.** Grid de linhas finas, cantos consistentes, alinhamento rigoroso, labels em fonte mono (`// 01 — SERVIÇOS`).
5. **Profundidade em camadas.** Fundo (grid + noise + aurora) → vidro (glass) → conteúdo → glow de foco.

## 3. Paleta de cores

### Marca (do logo atual)
| Token | Hex | Uso |
|---|---|---|
| brand-violet | `#C464FF` | Início do gradiente, acentos |
| brand-indigo | `#3F6EFF` | Meio do gradiente |
| brand-blue | `#1867ED` | Links fortes, gráficos |
| brand-cyan | `#1DB6FD` | Cor primária de ação |
| brand-cyan-light | `#9DE6FF` | Realces sobre escuro |

**Gradiente de marca:** `linear-gradient(130deg, #C464FF 0%, #3F6EFF 50%, #1DB6FD 100%)`

### Tema escuro (padrão)
| Token | Hex | Uso |
|---|---|---|
| canvas | `#05070F` | Fundo da página |
| surface | `#0B1020` | Cards, seções |
| surface-raised | `#111830` | Cards em hover, modais, nav |
| stroke | `#1E2A47` | Bordas 1px |
| stroke-strong | `#2D3E66` | Bordas em foco/hover |
| text-strong | `#F4F7FF` | Títulos |
| text-base | `#C6D2E8` | Corpo |
| text-muted | `#8A9BBD` | Legendas, labels |
| primary | `#1DB6FD` | CTAs, links, foco |
| accent | `#C464FF` | Destaques pontuais, badge "Mais escolhido" |
| success | `#2BD99F` | Status "online", checks |
| warning | `#FFB547` | Avisos |
| danger | `#FF5C7A` | Erros de formulário |

### Tema claro (seções de respiro / modo claro)
| Token | Hex |
|---|---|
| canvas | `#FFFFFF` |
| surface | `#F5F7FC` |
| stroke | `#E2E7F2` |
| text-strong | `#0A1126` |
| text-base | `#3A4664` |
| text-muted | `#6B7794` |
| primary | `#0A84C9` |
| accent | `#8B3FD9` |

Regra 70/20/10: 70% neutros escuros, 20% texto/superfícies, 10% cor de marca.

## 4. Tipografia (Google Fonts)

- **Display:** Space Grotesk (500, 600, 700) — títulos, números, preços. Geométrica com personalidade técnica.
- **Corpo:** Inter (400, 500, 600) — texto, UI, formulários.
- **Mono:** JetBrains Mono (400, 500) — eyebrows, labels, trechos de código, métricas.

| Estilo | Fonte | Tamanho / altura | Peso | Tracking |
|---|---|---|---|---|
| display-xl (hero) | Space Grotesk | clamp(44px, 6vw, 80px) / 1.02 | 600 | -0.035em |
| h1 | Space Grotesk | 48px / 1.1 | 600 | -0.03em |
| h2 (seção) | Space Grotesk | clamp(32px, 4vw, 48px) / 1.12 | 600 | -0.025em |
| h3 | Space Grotesk | 22px / 1.3 | 600 | -0.01em |
| body-lg | Inter | 18px / 1.65 | 400 | 0 |
| body | Inter | 16px / 1.6 | 400 | 0 |
| small | Inter | 14px / 1.5 | 500 | 0 |
| eyebrow | JetBrains Mono | 12px / 1.4 | 500 | 0.14em, MAIÚSCULAS |
| code | JetBrains Mono | 14px / 1.6 | 400 | 0 |

Palavra-chave do título hero pode receber o gradiente de marca (`background-clip: text`). Apenas uma por tela.

## 5. Tokens de layout

- **Espaçamento (base 4px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Seções:** padding vertical 96px desktop / 64px mobile.
- **Container:** max-width 1200px (conteúdo) / 1360px (hero e vitrines); gutter `clamp(16px, 4vw, 40px)`.
- **Grid:** 12 colunas, gap 24px; mobile 4 colunas.
- **Raio:** xs 6 · sm 10 (inputs, botões) · md 14 (cards) · lg 20 (painéis) · xl 28 (hero mock) · pill 999 (badges, chips).
- **Bordas:** sempre 1px; `stroke` padrão, `stroke-strong` em hover.

### Sombras / elevação
| Nível | Valor | Uso |
|---|---|---|
| e0 | none | Fundo |
| e1 | `0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.4)` | Cards |
| e2 | `0 12px 32px -12px rgba(0,0,0,0.6)` | Hover, dropdown |
| e3 | `0 30px 80px -20px rgba(0,0,0,0.75)` | Modais, mock do hero |
| glow-primary | `0 0 0 1px rgba(29,182,253,0.35), 0 10px 40px -10px rgba(29,182,253,0.45)` | CTA hover, card em destaque |
| glow-accent | `0 0 60px -10px rgba(196,100,255,0.45)` | Pacote recomendado |

## 6. Efeitos visuais "tech"

- **Grid de fundo:** linhas 1px `rgba(255,255,255,0.04)` a cada 64px, com máscara radial (some nas bordas). No hero, pontos de interseção ocasionais acendem em ciano.
- **Aurora / glow:** 2–3 blobs radiais desfocados (blur 120px) — violeta no topo-esquerdo (`rgba(196,100,255,0.18)`), ciano no topo-direito (`rgba(29,182,253,0.16)`). Nunca atrás de texto longo.
- **Noise:** textura de grão SVG com opacidade 3–4% sobre o canvas, para tirar o aspecto "chapado" do gradiente.
- **Glass:** nav e cards flutuantes com `background: rgba(11,16,32,0.6)`, `backdrop-filter: blur(16px) saturate(150%)`, borda `rgba(255,255,255,0.08)`.
- **Borda gradiente:** cards de destaque com borda 1px em gradiente de marca (máscara), animada lentamente em conic-gradient no hover.
- **Spotlight:** card revela um brilho radial seguindo o cursor (desktop apenas).
- **Beam / linhas de conexão:** traços finos que conectam ícones em diagramas (ex.: cliente → API → banco → app), com um pulso de luz percorrendo a linha.
- **Código como textura:** trechos de código esmaecidos (opacidade 15%) atrás de seções secundárias.

Limite: no máximo 2 efeitos fortes por viewport.

## 7. Iconografia

- Biblioteca: **Lucide** (ou Phosphor Regular), traço 1.5px, 20/24px.
- Ícones de serviço dentro de um "chip" quadrado 44px, raio 10, fundo `surface-raised`, borda `stroke`, ícone em `primary`; no hover o chip ganha borda gradiente.
- Logos de tecnologia (Vue, Nuxt, Node, PostgreSQL, Docker, React, etc.) em monocromático `text-muted`, coloridos no hover.

## 8. Imagens

- Prioridade: mockups de UI próprios, screenshots dos projetos dentro de "frames" de navegador/celular escuros, diagramas de arquitetura.
- Fotos de pessoas só em depoimentos (avatar circular 48px com anel gradiente).
- Evitar: banco de imagens genérico, robôs, cérebros, "matrix", circuitos clichê.
- Tratamento: leve duotone azul nas fotos; cantos raio 14–20; sombra e3 nos mockups.

## 9. Componentes

### Botões
- **Primário:** fundo gradiente de marca, texto `#FFFFFF` 15px/600, padding 12×20, raio 10. Hover: glow-primary + brilho deslizante (shine) + translateY(-1px). Ícone de seta → que se move 2px.
- **Secundário (ghost):** fundo `rgba(255,255,255,0.03)`, borda `stroke`, texto `text-strong`. Hover: borda `stroke-strong`.
- **Link:** `primary`, sublinhado animado da esquerda para direita.
- Alturas: sm 36 · md 44 · lg 52. Foco: anel 2px `primary` com offset 2px.

### Navegação (header)
- Fixa, glass, altura 68px, borda inferior 1px ao rolar.
- Esquerda: logo CAG Tech. Centro: Serviços, Pacotes, Projetos, Depoimentos, FAQ. Direita: botão ghost "WhatsApp" + primário "Solicitar orçamento".
- Mobile: menu fullscreen glass com links grandes (Space Grotesk 28px).

### Hero
- Eyebrow mono com ponto verde pulsante: `● DISPONÍVEL PARA NOVOS PROJETOS`.
- Título 2 linhas, palavra-chave em gradiente. Subtítulo body-lg max 560px.
- 2 CTAs + linha de prova social (ex.: "+X projetos entregues · Y clientes ativos").
- Lado direito (ou abaixo, centralizado): composição de mockups em camadas — janela de editor de código, card de dashboard com gráfico, toast "Deploy concluído ✓", conectados por beams. Leve parallax.
- Fundo: grid + aurora + noise.

### Cards de serviço
- Surface, raio 14, padding 28, e1. Chip de ícone, h3, texto curto, lista de 3 tags mono. Spotlight no hover.
- Layout bento: 1 card grande (2 colunas) + cards menores.

### Pacotes (pricing)
- 3 colunas. Cada card: nome (h3), descrição curta, preço em Space Grotesk 44px (ou "Sob consulta"), lista de entregáveis com check `success`, CTA.
- Pacote recomendado: borda gradiente animada, glow-accent, badge pill "Mais escolhido" em `accent`, levemente elevado (-8px).
- Abaixo: nota "Precisa de algo sob medida? Fale com a gente".

### Vitrine de projetos
- Grid 2 colunas (desktop) com cards grandes: imagem/mock do projeto em frame de navegador escuro (raio 20), título, categoria em chip mono, stack em ícones, link "Ver projeto →".
- Hover: imagem dá zoom 1.03 e o frame ganha glow-primary.
- Filtros por categoria em chips pill (Web, Sistema, App, Integração).

### Depoimentos
- Carrossel ou masonry de cards glass: aspas grandes em gradiente (opacidade 40%), texto body-lg, avatar com anel gradiente, nome, cargo/empresa, 5 estrelas opcionais.
- Fileira de logos de clientes em monocromático com marquee lento.

### FAQ
- Layout 2 colunas: à esquerda título + texto + CTA "Ainda com dúvida? Chame no WhatsApp"; à direita accordion.
- Item: borda inferior `stroke`, pergunta 18px/600, ícone + que gira para ×; aberto ganha barra lateral 2px gradiente.

### Formulário de contato
- Painel glass raio 20. Campos: nome, e-mail, WhatsApp, empresa, tipo de projeto (chips selecionáveis), orçamento estimado (select), mensagem.
- Input: altura 48, fundo `rgba(255,255,255,0.03)`, borda `stroke`, raio 10; foco: borda `primary` + anel `rgba(29,182,253,0.25)` 3px. Label acima 14px/500. Erro em `danger` com ícone.
- Lado: canais de contato e "resposta em até 1 dia útil".

### Footer
- Faixa CTA final grande antes do footer: título "Vamos construir seu próximo software?" sobre aurora + grid, botão primário lg.
- Footer 4 colunas: logo + frase, navegação, serviços, contato/redes. Linha inferior com © CAG Tech, CNPJ, links de privacidade. Texto `text-muted`, fundo `canvas` com borda superior `stroke`.

### Elementos auxiliares
- **Eyebrow de seção:** `// 02 — PACOTES` em mono, `primary`.
- **Badge/chip:** pill, 12px mono, fundo `rgba(29,182,253,0.1)`, texto `brand-cyan-light`.
- **Métricas:** número grande Space Grotesk + label mono, com contador animado.

## 10. Motion

- Durações: 150ms (hover), 250ms (UI), 500–700ms (entrada de seção).
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (saída suave).
- Entrada: fade + translateY(16px), stagger 60ms entre cards.
- Ambientes: aurora deriva lentamente (20s loop), beams pulsam a cada 3s, borda conic gira em 6s.
- Respeitar `prefers-reduced-motion`: desligar loops, parallax e spotlight; manter apenas fades.

## 11. Acessibilidade

- Contraste mínimo WCAG AA: `text-strong` e `text-base` sobre `canvas`/`surface` > 10:1; `text-muted #8A9BBD` sobre `#05070F` ≈ 7:1 (ok para corpo pequeno).
- Texto branco sobre gradiente de marca: usar peso ≥600 e garantir 4.5:1 na região ciano (escurecer fim do gradiente para `#0E9BE0` se necessário).
- Nunca texto sobre aurora intensa; foco sempre visível; alvos de toque ≥ 44px; accordion e carrossel navegáveis por teclado com ARIA.
- Cor nunca é o único indicador (ícones + texto em erros/sucesso).

## 12. Estrutura da home

1. **Header** (glass fixo)
2. **Hero** — proposta de valor + mockups de produto + prova social
3. **Logos/stack** — faixa de tecnologias e clientes (marquee)
4. **Serviços** — bento grid (Sites, Sistemas web, Apps, Integrações/API, Automação, Manutenção)
5. **Por que a CAG Tech** — 4 diferenciais com métricas + diagrama de processo (Descoberta → Design → Desenvolvimento → Deploy → Suporte) conectado por beams
6. **Pacotes** — 3 planos, recomendado em destaque (seção clara opcional)
7. **Projetos** — vitrine com filtros
8. **Depoimentos** — cards glass + logos
9. **FAQ** — 2 colunas com accordion
10. **Contato** — formulário + canais
11. **CTA final + Footer**

Conteúdo de pacotes, projetos, depoimentos e FAQ é gerenciado pelo painel admin (CMS); os componentes devem suportar quantidades variáveis de itens.

## 13. Prompts para o Google Stitch

### Prompt base (home desktop)
```
Design a premium dark landing page for "CAG Tech", a Brazilian custom software development company. All copy in Brazilian Portuguese. Follow DESIGN.md.
Style: sophisticated, engineering-grade, dark-first (#05070F canvas, #0B1020 cards, 1px #1E2A47 borders). Brand gradient violet #C464FF → indigo #3F6EFF → cyan #1DB6FD used only for CTAs, glows, borders and one highlighted word. Fonts: Space Grotesk for headings (tight tracking), Inter for body, JetBrains Mono for small uppercase eyebrows like "// 01 — SERVIÇOS".
Background: subtle 64px line grid fading at edges, soft violet and cyan aurora blobs, fine noise grain. Glassmorphism header.
Sections: glass sticky header with logo, links (Serviços, Pacotes, Projetos, Depoimentos, FAQ) and "Solicitar orçamento" button; hero with headline "Software sob medida, do problema à produção", green pulsing "Disponível para novos projetos" badge, two CTAs, social proof, and a layered composition of product mockups (code editor, dashboard chart, "Deploy concluído" toast) connected by thin glowing lines; tech logo marquee; bento grid of services with icon chips; "Por que a CAG Tech" with metrics and a 5-step process diagram; 3 pricing packages with the middle one highlighted by animated gradient border and "Mais escolhido" badge; project showcase in dark browser frames with category chips; glass testimonial cards with gradient-ring avatars; two-column FAQ accordion; contact form in a glass panel; large final CTA band and 4-column footer.
Rounded corners 10–20px, generous spacing (96px section padding), no stock photos, no robots.
```

### Prompt mobile
```
Create the mobile version (390px) of the CAG Tech landing page following DESIGN.md: same dark palette, grid and aurora background, stacked sections, hero mockup simplified to one dashboard card with a floating "Deploy concluído" toast, horizontally scrollable pricing cards with the recommended one first, fullscreen glass menu, sticky bottom WhatsApp button. Touch targets ≥44px.
```

### Prompts de refinamento
- `Make the pricing section a light "paper" section (#FFFFFF / #F5F7FC, text #0A1126) to create rhythm, keeping the highlighted package dark with gradient border.`
- `Redesign the projects section as a 2-column showcase with large dark browser frames, hover zoom and cyan glow, plus filter chips: Todos, Web, Sistemas, Apps, Integrações.`
- `Reduce visual noise: maximum two strong glow effects per screen, keep surfaces neutral, color only as light.`
- `Generate a light theme variant using the light tokens in DESIGN.md.`
