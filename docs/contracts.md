# CAG Tech — Contratos (API, banco, shared)

## API (`apps/backend/src/app.ts`)

- `GET /health`
- `GET /public/settings`, `GET /public/landing`, `POST /public/contacts`
- `/admin/*` (Bearer JWT Supabase + `ADMIN_ALLOWED_EMAILS`): leads, settings, pacotes, projetos, depoimentos, FAQ

Consultar o código antes de citar rota/payload; não inventar.

## Shared (`packages/shared/src`)

Zod + tipos `settings`, `lead`, `cms`, `admin`, reexportados em `index.ts`. Mudança de payload: alterar o schema em `shared` → backend valida com ele → web consome o tipo. Mudança breaking exige ajustar os dois lados na mesma entrega.

## Banco

- Prisma 7, `schema.prisma` com `schemas = ["cagtech"]`; client em `src/infrastructure/prisma/output`.
- **Schema novo só via migrations Prisma** em `apps/backend/prisma/migrations/` (`prisma migrate deploy`). `supabase/migrations/` é **histórico somente leitura** — não criar nem editar arquivos lá.
- Toda migration nova: aditiva quando possível; nunca rodar contra produção sem autorização.
- Storage: bucket `project-logos` (público).
