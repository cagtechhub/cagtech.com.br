# AGENTS.md

Guia operacional para agentes (Cursor e similares) no projeto `cagtech.com.br`.

## 1) Objetivo do projeto
- Landing page institucional em Nuxt 4 + Tailwind.
- Visual principal: dark com identidade azul, ciano e violeta derivada do logo (`public/img/logo.png`).
- A home segue a estrutura do video de referencia (hero, servicos, diferenciais, depoimentos, FAQ e contato).

## 2) Stack e estrutura
- Framework: **Nuxt 4** (`srcDir: app/`), **Vue 3**, **TypeScript**.
- Estilos: **Tailwind CSS**.
- Estado: **Pinia** (`@pinia/nuxt`).
- Runtime servidor: **Nitro** (`server/`: rotas, API, utilitarios).
- Seguranca: `nuxt-security` com CSP e headers em `nuxt.config.ts`.
- Padroes de codigo front/back com Vue/Nuxt/TS: regra Cursor **`.cursor/rules/fullstack-vue-nuxt.mdc`** (especialista full stack; aplica em arquivos `*.vue` e `*.ts`).

Diretorios e arquivos relevantes:
- `app/pages/index.vue`: composicao da landing por componentes.
- `app/components/landing/`: secoes da home (IDs de ancora via `app/constants/landingScreen.ts`).
- `app/constants/landingScreen.ts`: IDs de secao e itens do menu (fonte unica para ancoras).
- `app/plugins/01.site-init.ts`: SEO global + scripts de marketing (equivalente ao antigo bootstrap em `app.vue`).
- `app/error.vue`: pagina de erro alinhada ao layout.
- `app/types/landing.ts`: tipos do conteudo da landing (servicos, FAQ, depoimentos, etc.).
- `app/stores/useLandingStore.ts`: conteudo/dados da landing (navegacao, cards, faq, footer); exporta `faqItems` para SEO.
- `app/stores/useSiteStore.ts`: integracoes utilitarias (ex.: WhatsApp tracking).
- `app/composables/useSiteSeoHead.ts`: metadados SEO/OG/Twitter/Schema (titulo dinamico, FAQPage na `/`, Organization com logo e sameAs).
- `app/composables/useSiteSeoUrls.ts`: origem publica e URL canonica.
- `server/utils/no-index.ts`: leitura compartilhada de `noIndex` (robots e sitemap).
- `server/routes/`: `robots.txt`, `sitemap.xml`, CSP report, etc.
- `app/assets/css/tailwind.css`: estilos globais e classes utilitarias.
- `tailwind.config.ts`: tokens de design (cores, fontes, sombras, animacoes).
- `public/og-default.png`: imagem Open Graph padrao (1200x630).
- `.env.example`: variaveis publicas (`NUXT_PUBLIC_*`) documentadas para deploy e SEO.

## 3) Comandos uteis
- Instalar deps: `yarn install`
- Desenvolvimento: `yarn dev`
- Build: `yarn build`
- Preview: `yarn preview`
- Lint: `yarn lint`
- Format: `yarn format`

## 4) Regras para agentes
- Nao remover ou enfraquecer configuracoes de seguranca do `nuxt-security` sem justificativa explicita.
- Preservar a identidade visual do logo: gradiente violeta/azul/ciano e superficie dark.
- Qualquer conteudo textual da home deve ser alterado preferencialmente na `useLandingStore`.
- Manter responsividade mobile-first em ajustes de secao.
- Evitar dependencias novas sem necessidade clara.
- Se alterar copy, manter coerencia com proposta de consultoria digital B2B.
- Para trabalho em **Vue, Nuxt, TypeScript ou Nitro**, seguir tambem a regra **fullstack-vue-nuxt** em `.cursor/rules/`.

## 5) Fluxo recomendado de manutencao
1. Identificar se a mudanca e de conteudo, layout, tema ou SEO.
2. Conteudo da home: ajustar na `app/stores/useLandingStore.ts`.
3. Layout/secoes: editar componentes em `app/components/landing/`.
4. Tema visual: ajustar tokens em `tailwind.config.ts` e estilos em `app/assets/css/tailwind.css`.
5. SEO: revisar `app/composables/useSiteSeoHead.ts` e `public/og-default.png`; garantir `NUXT_PUBLIC_SITE_URL` em producao.
6. Validar com lint antes de concluir (quando autorizado).

## 6) Checklist de PR/entrega
- [ ] Nenhum erro de sintaxe em `.vue`/`.ts`.
- [ ] Navegacao por ancora continua funcional (`#home`, `#services`, etc.).
- [ ] Contraste de texto legivel em cards e banners.
- [ ] Campos de formulario mantem estilo consistente (`field-control`).
- [ ] Header e footer alinhados em desktop e mobile.
- [ ] SEO OG padrao aponta para imagem existente (`/og-default.png`).
- [ ] Sem alteracoes acidentais em `nuxt.config.ts` relacionadas a seguranca.

## 7) Regra de atualizacao
- Sempre que houver alteracao estrutural (novas secoes, stores, composables, rotas, regras Cursor ou convencoes), atualizar este `AGENTS.md` na mesma entrega.

## 8) Notas de operacao com o usuario
- Antes de rodar a aplicacao (`yarn dev`, `yarn build`, `yarn preview`), confirmar com o usuario.
- Em alteracoes grandes, descrever rapidamente o que mudou em cada arquivo.
