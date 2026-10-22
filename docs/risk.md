# CAG Tech — Risco e segurança

## Hotspots

- `nuxt.config.ts` (`nuxt-security`/CSP) — não relaxar `script-src`/`style-src`/`connect-src` sem justificativa.
- `apps/backend/src/lib/auth.ts` e rotas `/admin/*` — authz por JWT + allowlist.
- `POST /public/contacts` — input público: validar com Zod, sem vazar erro interno; PII de leads (LGPD).
- Plugin `02.marketing-scripts.client.ts` + consent — scripts só após consentimento.
- `docker-compose.yml`, workflow, `deploy.sh` — push em `main` publica.
- Prisma migrations — dados de produção.

## Regras

- Nunca `service_role`/secrets em `NUXT_PUBLIC_*` ou bundle client.
- Não logar PII nem tokens.
- Mudança em hotspot → acionar `reviewer` (security/data-leak).

Ver `.ai/standards/general/security.md`, `.ai/agents/security-reviewer.md`, `.ai/agents/data-leak-auditor.md`.
