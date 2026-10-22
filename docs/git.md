# CAG Tech — Git

- **Não** criar commit, push ou PR sem autorização explícita. Push em `main` dispara deploy de produção.
- Conventional Commits em pt-BR, como no histórico: `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`, `docs: ...` (sem card Jira neste projeto; evitar `wip` em `main`).
- Branch (quando usada): `<tipo>/descricao-curta`.
- Antes de propor commit: `git status`, diff revisado, `yarn lint` + `yarn format`.
- Nunca versionar `.env*` (exceto `.env.example`) nem `gha_deploy*`.

Skill: `.ai/skills/pr-prep/SKILL.md`. Padrão: `.ai/standards/general/git.md`.
