# CAG Tech — Stack e validação

| Área      | Stack                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Runtime   | Node >= 26 (`engines`, `.nvmrc`, Docker `node:26-alpine`, `@types/node` 26)                                                                      |
| Web       | Nuxt 4, Vue 3.5 (pinned via `resolutions`), Pinia 3, Tailwind (`@nuxtjs/tailwindcss`), vee-validate + Zod, `nuxt-security`, `@unhead/schema-org` |
| API       | Hono 4, `@hono/node-server`, Prisma 7 + `@prisma/adapter-pg`, Zod 4, tsx                                                                         |
| Shared    | Zod 4, TS (exporta `src/index.ts`)                                                                                                               |
| Dados     | Supabase Postgres (schema `cagtech`), Auth, Storage                                                                                              |
| Qualidade | ESLint (web), `tsc --noEmit` (backend/shared), Prettier (sem `;`, aspas simples, 100 col)                                                        |

Sem suíte de testes automatizados hoje; validação = `yarn lint` + `yarn format` + smoke manual (`yarn dev`) — ver agente `.cursor/agents/qa-engineer.md`, que também propõe setup (Vitest / @nuxt/test-utils / Playwright) quando pedido.

## Comandos

`yarn install` · `yarn db:generate` · `yarn dev` · `yarn dev:web` · `yarn dev:api` · `yarn lint` · `yarn lint:fix` · `yarn format` / `format:write` · `yarn build` · `yarn db:migrate` (autorização).

## Convenções TS

- `.ts` importa `.ts` (`allowImportingTsExtensions` + `rewriteRelativeImportExtensions`).
- Evitar `any`; tipos de domínio vêm de `@cagtech/shared`.

Stacks compartilhadas: `.ai/stacks/{nuxt4,vue3,pinia,tailwind,typescript,node,prisma,postgresql,supabase,docker}.md`.
