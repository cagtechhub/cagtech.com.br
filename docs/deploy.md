# CAG Tech — Deploy e infra

- `docker-compose.yml`: `cagtech-web` (3000, Host apex + www, redirect 301 www→apex via `cagtech-www`) e `cagtech-backend` (3001, Host `API_DOMAIN`). Rede Traefik `web` (`TRAEFIK_NETWORK=web`, nunca `host`). Sem `db`, sem `ports:`.
- SSR: `NUXT_API_BASE=http://cagtech-backend:3001`; browser: `NUXT_PUBLIC_API_BASE=https://api.cagtech.com.br`. CSP `connect-src` inclui `NUXT_PUBLIC_API_BASE`.
- `deploy.sh`: `docker compose up -d --remove-orphans --build`.
- GitHub Actions (`.github/workflows/deploy.yml`): push em `main` → SSH (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`) → `git pull --ff-only` → `deploy.sh`. `APP_DIR` default `/opt/cagtech.com.br`.
- Docker web: recopiar `vue`/`@vue`/`birpc`/`unhead`/`@unhead` para `.output` (stubs Nitro sem `dist`); devtools off em production.
- Env: modelo em `.env.example` (nunca ler `.env*` reais). `gha_deploy*` é chave privada: não ler, não commitar.

Push em `main` = deploy em produção. Mudança aqui → atualizar este doc na mesma entrega. Ver `.ai/agents/devops-engineer.md`, `.ai/stacks/docker.md`.
