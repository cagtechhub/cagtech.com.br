# CAG Tech (`cagtech.com.br`)

Monorepo Yarn: landing **Nuxt 4** (`apps/web`) + API **Hono/Prisma** (`apps/backend`) + tipos (`packages/shared`). Banco e Auth no **Supabase**. Requer **Node >= 26**.

## Desenvolvimento

```bash
yarn install
yarn db:generate
yarn dev
```

Sobe web (3000) e API (3001) juntos via `concurrently`. Isolado: `yarn dev:web` / `yarn dev:api`.

Copie `.env.example` → `.env`. Preencha `DATABASE_URL`, `SUPABASE_*`, `NUXT_PUBLIC_SUPABASE_*`, `NUXT_PUBLIC_API_BASE=http://127.0.0.1:3001`, `NUXT_API_BASE=http://127.0.0.1:3001` e `ADMIN_ALLOWED_EMAILS`.

Aplique o schema: `yarn db:migrate` (ou rode o SQL em `apps/backend/prisma/migrations/`). Crie o bucket Storage `project-logos` (público) no Supabase.

Painel: `/admin/login`. Conteúdo da home (pacotes, projetos, depoimentos, FAQ) vem da API, com fallback na store.

## Docker + Traefik

Padrão Up2tech: rede `web`, sem Postgres local, **sem** `ports:` no host.

DNS: `cagtech.com.br`, `www.cagtech.com.br` e `api.cagtech.com.br` no IP da VPS.

```bash
cp .env.example .env
# DOMAIN, API_DOMAIN, DATABASE_URL, SUPABASE_*, NUXT_PUBLIC_*
./deploy.sh
```

- `cagtech-web`: 3000, Host apex + www, redirect 301 www→apex, `NUXT_PUBLIC_SITE_URL=https://cagtech.com.br`
- `cagtech-backend`: 3001, Host `API_DOMAIN`
- SSR: `NUXT_API_BASE=http://cagtech-backend:3001`

GitHub Actions: SSH + `git pull` + `deploy.sh`. Secrets `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`. `APP_DIR` default `/opt/cagtech.com.br`.

Não use `TRAEFIK_NETWORK=host`.
