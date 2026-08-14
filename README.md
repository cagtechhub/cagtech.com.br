# CAG Tech (`cagtech.com.br`)

Landing institucional em **Nuxt 4** + Tailwind. Formulário de contato e painel admin usam **Supabase** via Nitro (`server/api/`). Não há API em container separado.

## Desenvolvimento

```bash
yarn install
yarn dev
```

Copie `.env.example` → `.env`. Preencha:

- `NUXT_PUBLIC_SUPABASE_URL` + `NUXT_PUBLIC_SUPABASE_ANON_KEY` (login em `/admin`)
- `NUXT_PRIVATE_SUPABASE_URL` + `NUXT_PRIVATE_SUPABASE_KEY` (service_role no servidor)
- `NUXT_PRIVATE_SUPABASE_SCHEMA=cagtech`
- `NUXT_ADMIN_ALLOWED_EMAILS` (CSV; vazio libera qualquer usuário Auth — só em dev)

No Supabase: crie um usuário Auth para o painel, exponha o schema `cagtech` em API → Exposed schemas e rode `supabase/migrations/001_cagtech_contacts.sql` e `002_cagtech_site_settings.sql`.

Rotas do painel: `/admin/login`, `/admin`, `/admin/contatos`, `/admin/configuracoes`.

SEO, WhatsApp, redes e analytics da landing vêm de `site_settings` (com fallback das env `NUXT_PUBLIC_*`).

## Docker + Traefik (produção na OS)

Padrão Up2tech: Traefik na rede bridge `web`, Postgres só no Supabase, **sem** `ports:` no host.

Pré-requisitos na VPS:

1. Rede Traefik: `docker network create web` (se ainda não existir)
2. DNS de `cagtech.com.br` e `www.cagtech.com.br` apontando para a OS
3. `.env` **só na VPS** (não commitar). `APP_DIR` default: `/opt/cagtech.com.br`

```bash
cp .env.example .env
# preencha DOMAIN, NUXT_PUBLIC_SITE_URL, NUXT_PUBLIC_SUPABASE_*, NUXT_PRIVATE_SUPABASE_* e Traefik
chmod +x deploy.sh
./deploy.sh
```

O Compose sobe só `cagtech-web` (porta interna 3000). Traefik termina TLS (`websecure` / Let's Encrypt) com `Host(DOMAIN)` e `Host(www.DOMAIN)`.

`NUXT_PUBLIC_*` entram como **build args** (canônico, OG, login Auth e CSP). Depois de mudar essas vars, faça rebuild: `docker compose build --no-cache web && docker compose up -d`.

GitHub Actions (`.github/workflows/deploy.yml`): SSH + `git pull` + `deploy.sh`. Secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`. Vars opcionais: `DOMAIN`, `APP_DIR` (default `/opt/cagtech.com.br`).

Não use `TRAEFIK_NETWORK=host`.

Detalhes de conteúdo, SEO e convenções: ver `AGENTS.md`.
