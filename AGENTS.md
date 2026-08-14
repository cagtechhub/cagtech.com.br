# AGENTS.md

Guia operacional para agentes (Cursor e similares) no projeto `cagtech.com.br`.

## 1) Objetivo do projeto
- Landing institucional em Nuxt 4 + Tailwind.
- Visual dark com identidade azul, ciano e violeta (`apps/web/public/img/logo.png`).
- Painel `/admin` gerencia leads (kanban), settings, pacotes, projetos, depoimentos e FAQ.

## 2) Stack e estrutura
Monorepo Yarn 1 (`@cagtech/*`):
- Runtime **Node >= 26** (web e backend; Docker `node:26-alpine`).
- `apps/web`: Nuxt 4 (`srcDir: app/`), Vue 3, Pinia, Tailwind, `nuxt-security`.
- `apps/backend`: API Hono + Prisma 7 (schema `cagtech`) na porta 3001.
- `packages/shared`: Zod e tipos compartilhados.

Deploy Docker + Traefik: `cagtech-web` (3000) e `cagtech-backend` (3001). Sem `db`, sem `ports:` no host. SSR usa `NUXT_API_BASE=http://cagtech-backend:3001`. Browser usa `NUXT_PUBLIC_API_BASE=https://api.cagtech.com.br`. Nunca `service_role` em `NUXT_PUBLIC_*`.

Diretórios relevantes:
- `apps/web/app/pages/index.vue` e `apps/web/app/components/landing/`
- `apps/web/app/constants/landingScreen.ts`
- `apps/web/app/plugins/00.site-settings.ts`: `GET /public/settings` na API
- `apps/web/app/plugins/00.landing-cms.ts`: hidrata store com `GET /public/landing`
- `apps/web/app/composables/useApiBase.ts`: SSR interno vs API pública
- `apps/web/app/composables/useAdminApi.ts`: Bearer para `/admin/*` na API
- `apps/web/app/pages/admin/`: login, dashboard, leads, pacotes, projetos, depoimentos, FAQ, configurações
- `packages/shared/src/`: settings, lead, cms, admin
- `apps/backend/src/app.ts`: rotas públicas e admin
- `apps/backend/prisma/schema.prisma` + `prisma/migrations/`
- Convenção: source `.ts` importa `.ts` (nunca `.js`); Prisma gerado em `output/` não se edita.
- `apps/web/server/routes/`: robots, sitemap, CSP report, health Nitro
- `docker-compose.yml`, `deploy.sh`, `.github/workflows/deploy.yml`

## 3) Comandos
- `yarn install`
- `yarn dev` (web + API via concurrently); `yarn dev:web` / `yarn dev:api` isolados
- `yarn db:generate` / `yarn db:migrate`
- Docker: `./deploy.sh`
- `yarn lint` / `yarn format`

## 4) Regras
- Não enfraquecer CSP/`nuxt-security`.
- Preservar identidade visual do logo.
- Conteúdo CMS via painel; fallback na `useLandingStore`.
- `TRAEFIK_NETWORK=web` (nunca `host`). Alias www só no site (`cagtech-www`).
- Auth do painel: JWT Supabase + `ADMIN_ALLOWED_EMAILS`.
- Node **>= 26** em engines, `.nvmrc`, Docker web/API e `@types/node`.

## 5) Manutenção
1. Copy/CMS: painel ou fallback na store.
2. Layout: `apps/web/app/components/landing/`.
3. Tema: `apps/web/tailwind.config.ts`.
4. SEO: `useSiteSeoHead` + `site_settings`.
5. Schema: Prisma em `apps/backend`.

## 6) Checklist
- Âncoras `#home`, `#services`, `#packages`, `#work`, etc.
- Compose sem `ports:`, `container_name` `cagtech-web` / `cagtech-backend`.
- CSP `connect-src` inclui `NUXT_PUBLIC_API_BASE`.

## 7) Atualizar este arquivo em mudanças estruturais.
