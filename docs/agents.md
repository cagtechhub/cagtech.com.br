# CAG Tech — Agents e Skills

**Agent** = quem responde pela responsabilidade. **Skill** = como executar uma capacidade. Não criar agentes por tecnologia.

## Papéis canônicos (workspace, `.ai/agents/`)

tech-lead · frontend-engineer · test-engineer · backend-engineer · dba-engineer · devops-engineer · code-reviewer · security-reviewer · impact-analyst · test-engineer · data-leak-auditor

## Agentes locais Cursor (`.cursor/agents/`)

| Agente              | Uso                                                                   |
| ------------------- | --------------------------------------------------------------------- |
| `frontend-engineer` | Landing/admin Nuxt, componentes, redesign via `DESIGN.md`             |
| `backend-engineer`  | API Hono, auth admin, validação Zod, `packages/shared`                |
| `dba-engineer`      | Prisma schema/migrations, queries, Supabase                           |
| `devops-engineer`   | Docker, Traefik, GitHub Actions, Node runtime                         |
| `qa-engineer`       | Validação (lint, format, build, smoke manual); propõe setup de testes |
| `reviewer`          | Revisão readonly; aciona impact/security/data-leak/code               |

Orquestração: rule `.cursor/rules/tech-lead.mdc` (delega, não implementa).

## Skills

`.ai/skills/{repo-map,new-module,refactoring,build-repair,database-analysis,security-audit,pr-prep,adr,release-notes}/SKILL.md`
