# CAG Tech — Arquitetura

Monorepo Yarn 1 (`workspaces: apps/*, packages/*`, escopo `@cagtech/*`).

```text
apps/web/            Nuxt 4 (srcDir app/) — landing + painel /admin (SSR)
  app/pages/         index.vue (landing), admin/ (login, dashboard, leads, pacotes, projetos, depoimentos, FAQ, configurações)
  app/components/    landing/ (seções Landing*), consent/, notify/
  app/composables/   useApiBase (SSR interno × API pública), useAdminApi (Bearer), useSiteSeoHead, useSupabaseClient
  app/stores/        Pinia: useLandingStore (fallback CMS), useSiteStore, useConsentStore, useNotifyStore
  app/plugins/       00.landing-cms (GET /public/landing), 00.site-settings, consent, marketing scripts
  app/constants/     landingScreen.ts
  app/middleware/    admin-auth.ts
  server/            Nitro: routes/ (robots, sitemap, CSP report, health), api/
  tailwind.config.ts tokens (alinhar com DESIGN.md)
apps/backend/        Hono + Prisma 7 (porta 3001)
  src/app.ts         rotas /health, /public/*, /admin/* (JWT Supabase + ADMIN_ALLOWED_EMAILS)
  src/lib/           auth.ts, mappers.ts
  src/infrastructure/prisma/output  client gerado (não editar)
  prisma/schema.prisma + migrations/  schema Postgres `cagtech`
packages/shared/src/ Zod + tipos: settings, lead, cms, admin
supabase/migrations/ histórico (legado) — não usar para schema novo
```

## Fluxos

- **Landing SSR**: plugin `00.landing-cms` → `GET /public/landing` via `NUXT_API_BASE` (rede interna) → `useLandingStore` (fallback local se API falhar).
- **SEO**: `useSiteSeoHead()` no `setup` de `app.vue` (não em plugin após `$fetch`) + `site_settings`.
- **Lead**: formulário → `POST /public/contacts` → kanban no `/admin`.
- **Admin**: Supabase Auth no browser → Bearer JWT → API `/admin/*` valida e checa e-mail permitido.
- **Storage**: bucket público `project-logos`.

Princípio: simplicidade (`.ai/architecture/karpathy.md`). Sem camadas DDD até haver necessidade real.
