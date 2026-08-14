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
- `app/components/landing/`: secoes da home (IDs de ancora via `app/constants/landingScreen.ts`), incluindo `LandingPackagesSection.vue` (pacotes comerciais).
- `app/constants/landingScreen.ts`: IDs de secao (`home`, `services`, `packages`, `work`, etc.) e itens do menu (fonte unica para ancoras).
- `app/plugins/00.consent-hydrate.client.ts`: hidrata `useConsentStore` a partir do `localStorage` antes dos scripts de marketing.
- `app/plugins/00.site-settings.ts`: carrega `GET /api/settings` e mescla em `runtimeConfig.public` (SEO, WhatsApp, analytics).
- `app/plugins/01.site-init.ts`: SEO global (`useSiteSeoHead`).
- `app/plugins/02.marketing-scripts.client.ts`: GA4 / Meta Pixel (injeção estável no `head` + page view em rota), após consentimento; ignora `/admin`.
- `app/pages/admin/`: painel (`login`, dashboard, `contatos`, `configuracoes`); middleware `admin-auth`.
- `app/layouts/admin.vue`: layout do painel (dark, tokens da landing).
- `app/composables/useSupabaseClient.ts`: cliente Auth no browser (`NUXT_PUBLIC_SUPABASE_*`).
- `app/composables/useAdminApi.ts`: login, cookie `admin_token` e chamadas `/api/admin/*`.
- `shared/schemas/settings.ts`: Zod de `site_settings` (app + Nitro).
- `server/utils/require-admin.ts`: valida JWT Supabase + `ADMIN_ALLOWED_EMAILS`.
- `server/utils/site-settings.ts`: CRUD singleton `cagtech.site_settings`.
- `server/api/settings.get.ts`: settings públicas.
- `server/api/admin/`: dashboard, settings e contatos (Bearer).
- `app/error.vue`: pagina de erro alinhada ao layout.
- `app/types/landing.ts`: tipos do conteudo da landing (servicos, FAQ, depoimentos, etc.).
- `app/stores/useLandingStore.ts`: conteudo/dados da landing (navegacao, cards, faq, footer); exporta `faqItems` para SEO.
- `app/stores/useConsentStore.ts`: escolha de cookies (`essential` | `all`); GA4/Meta só com `all`.
- `app/components/consent/ConsentBanner.vue`: popup LGPD; layout inclui `<ConsentBanner />`.
- `app/types/consent.ts`: chave de storage e tipo `ConsentChoice`.
- `app/stores/useNotifyStore.ts`: fila de toasts (sucesso, erro, alerta, info); usar com `useNotify()` e `<NotifyStack />` no layout.
- `app/components/notify/`: `NotifyPopup.vue` (card), `NotifyStack.vue` (Teleport + fila); tipos em `app/types/notify.ts`.
- `app/composables/useSiteSeoHead.ts`: metadados SEO/OG/Twitter/Schema (titulo dinamico, FAQPage na `/`, Organization com logo e sameAs).
- `app/composables/useSiteSeoUrls.ts`: origem publica e URL canonica.
- `server/utils/no-index.ts`: leitura compartilhada de `noIndex` (robots e sitemap).
- `server/routes/`: `robots.txt`, `sitemap.xml`, CSP report, etc.
- `server/utils/supabase.ts`: cliente Supabase no Nitro (URL sem `/rest/v1`) e cliente Auth (`getUser`).
- `supabase/migrations/001_cagtech_contacts.sql`: schema `cagtech`, tabela `contacts` e GRANTs para roles da API.
- `supabase/migrations/002_cagtech_site_settings.sql`: tabela `site_settings` (SEO/contato/analytics) e índice de contatos.
- `app/assets/css/tailwind.css`: estilos globais e classes utilitarias.
- `tailwind.config.ts`: tokens de design (cores, fontes, sombras, animacoes).
- `public/og-default.png`: imagem Open Graph padrao (1200x630).
- `.env.example`: `DOMAIN`, Traefik, `NUXT_PUBLIC_*` (inclui Supabase Auth), `NUXT_PRIVATE_*` e `NUXT_ADMIN_ALLOWED_EMAILS`.
- `docker-compose.yml`: producao Traefik (`cagtech-web`), sem `ports:` no host e sem servico `db`.
- `deploy.sh` + `.github/workflows/deploy.yml`: deploy na VPS (`APP_DIR=/opt/cagtech.com.br`).

## 3) Comandos uteis
- Instalar deps: `yarn install`
- Desenvolvimento: `yarn dev`
- **Docker (produção):** `./deploy.sh` (ou `docker compose up --build -d`). Traefik na rede `web`; sem `WEB_PORT` / `ports:` no host. Variáveis via `.env` na VPS.
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
- Deploy: sem servico `db`, sem `ports:` no host, `container_name` unico `cagtech-web`. API de contato/settings e Nitro no mesmo container (sem `NUXT_API_BASE` / backend).
- Nunca expor `service_role` em `NUXT_PUBLIC_*`. Login do painel usa anon key; mutacoes passam pelo Nitro.

## 5) Fluxo recomendado de manutencao
1. Identificar se a mudanca e de conteudo, layout, tema ou SEO.
2. Conteudo da home: ajustar na `app/stores/useLandingStore.ts`.
3. Layout/secoes: editar componentes em `app/components/landing/`.
4. Tema visual: ajustar tokens em `tailwind.config.ts` e estilos em `app/assets/css/tailwind.css`.
5. SEO: revisar `app/composables/useSiteSeoHead.ts` e `public/og-default.png`; origem em `NUXT_PUBLIC_SITE_URL` / `site_settings`.
6. Configuracoes editaveis no painel: `/admin/configuracoes` (tabela `cagtech.site_settings`).
7. Validar com lint antes de concluir (quando autorizado).

## 6) Checklist de PR/entrega
- [ ] Nenhum erro de sintaxe em `.vue`/`.ts`.
- [ ] Navegacao por ancora continua funcional (`#home`, `#services`, etc.).
- [ ] Contraste de texto legivel em cards e banners.
- [ ] Campos de formulario mantem estilo consistente (`field-control`).
- [ ] Header e footer alinhados em desktop e mobile.
- [ ] SEO OG padrao aponta para imagem existente (`/og-default.png`).
- [ ] Sem alteracoes acidentais em `nuxt.config.ts` relacionadas a seguranca.
- [ ] Compose sem `ports:` no host, `TRAEFIK_NETWORK=web` (nunca `host`) e `container_name: cagtech-web`.

## 7) Regra de atualizacao
- Sempre que houver alteracao estrutural (novas secoes, stores, composables, rotas, regras Cursor ou convencoes), atualizar este `AGENTS.md` na mesma entrega.

## 8) Notas de operacao com o usuario
- Antes de rodar a aplicacao (`yarn dev`, `yarn build`, `yarn preview`), confirmar com o usuario.
- Em alteracoes grandes, descrever rapidamente o que mudou em cada arquivo.
