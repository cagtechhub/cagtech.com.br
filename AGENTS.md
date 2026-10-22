# CAG Tech (`cagtech.com.br`) — Instruções do Agente

Site institucional da CAG Tech: **monorepo Yarn 1** com landing Nuxt 4 + painel `/admin` (`apps/web`), API Hono/Prisma (`apps/backend`) e tipos/Zod compartilhados (`packages/shared`). Banco, Auth e Storage no **Supabase**. Deploy Docker + Traefik via GitHub Actions. Node **>= 26**.

Este arquivo **roteia**. Detalhe técnico está em `docs/`. Padrões compartilhados: `.ai/` (symlink na raiz do repo → `../.ai` → `pieta.tech/is-essentials/.ai`; não duplicar aqui).

## Fonte de verdade

1. `AGENTS.md` — roteamento e regras duras
2. `docs/` e `DESIGN.md` — conhecimento do projeto (abrir o doc da tarefa)
3. código existente — comportamento implementado
4. `.ai/` — standards/stacks/agents/skills compartilhados (sob demanda)
5. inferência — só se não houver doc/código; declarar premissa

Não contradiga decisão documentada sem justificar. Se o doc necessário não existir: **não invente** — proponha a decisão e mantenha simples.

## Roteamento

| Tarefa                                 | Documento              |
| -------------------------------------- | ---------------------- |
| Protocolo IA / anti-alucinação         | `docs/ai.md`           |
| Arquitetura e estrutura de pastas      | `docs/architecture.md` |
| Stack, comandos e validação            | `docs/stack.md`        |
| Visual, tokens, componentes, redesign  | `DESIGN.md`            |
| API, banco (Prisma/Supabase), `shared` | `docs/contracts.md`    |
| Docker, Traefik, CI/CD, env            | `docs/deploy.md`       |
| Risco e segurança                      | `docs/risk.md`         |
| Agents e skills                        | `docs/agents.md`       |
| Validação / testes (`qa-engineer`)     | `docs/stack.md`        |
| Git / commits                          | `docs/git.md`          |
| Índice de docs                         | `docs/README.md`       |

Carregar **somente** o documento relevante à tarefa.

## Comandos essenciais

```bash
yarn install
yarn db:generate          # Prisma client (apps/backend)
yarn dev                  # web :3000 + API :3001 (concurrently)
yarn dev:web | yarn dev:api
yarn lint                 # shared + backend (tsc) + web (eslint)
yarn format               # prettier --check
yarn db:migrate           # prisma migrate deploy — só com autorização
./deploy.sh               # produção (docker compose) — só com autorização
```

## Regras duras

- Não inventar requisitos, campos, endpoints, seções da landing ou tokens visuais.
- Frontend/visual segue `DESIGN.md`; token novo → atualizar `DESIGN.md` + `tailwind.config.ts` juntos.
- Contrato web↔API mora em `packages/shared` (Zod); não duplicar tipos.
- Não enfraquecer CSP/`nuxt-security`. Nunca `service_role`/secrets em `NUXT_PUBLIC_*`.
- Schema só via Prisma (`apps/backend/prisma`); `supabase/migrations/` é histórico.
- `TRAEFIK_NETWORK=web` (nunca `host`); compose sem `ports:`.
- Source `.ts` importa `.ts` (nunca `.js`); não editar Prisma gerado em `src/infrastructure/prisma/output/`.
- Nunca ler/imprimir `.env*` nem `gha_deploy*`.
- Não criar commit/push/PR, nem rodar migrate/deploy, sem autorização explícita (`docs/git.md`).
- Dúvida de produto → perguntar ao César, não supor (`.ai/standards/general/product-handoff.md`).
- Não afirmar validação sem executar.
- Mudança de infra (Docker, Traefik, Node, Prisma, env, deploy, `yarn dev`) atualiza `docs/deploy.md`/`docs/stack.md` **na mesma entrega**.

## Fluxo

```text
Entender → abrir doc roteado → web, backend, shared ou infra?
    → impacto em contrato? → menor mudança → yarn lint → revisar diff
```

Regra central: landing simples, rápida e segura; complexidade proporcional ao problema (`.ai/architecture/karpathy.md`).
