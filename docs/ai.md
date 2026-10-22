# CAG Tech — Protocolo IA

1. Abrir o documento de `docs/` (ou `DESIGN.md`) indicado pelo `AGENTS.md` **antes** de decidir.
2. Citar fonte (arquivo, rota, schema) ou declarar **desconhecido**.
3. Não inventar endpoints, campos, seções, copy ou tokens visuais.
4. Dúvida de alto impacto: **parar e perguntar**.
5. Não afirmar que lint/typecheck/build passou sem executar.
6. Carregar só o contexto necessário (não o `.ai/` inteiro).

## Antes de codificar

O que muda; onde (web/backend/shared/infra); contrato envolvido (`contracts.md`); risco (`risk.md`); como validar.

## Durante

Mudanças pequenas e cirúrgicas; sem alterações não pedidas; respeitar padrões locais e `DESIGN.md`.

## Depois

`yarn lint` (e `yarn format`) no escopo; revisar diff; reportar riscos e o que não foi validado.

## `.ai/` local

`.ai` é um symlink local (`.ai → ../.ai → pieta.tech/is-essentials/.ai`) e **não é versionado** (está no `.gitignore`). Em outro ambiente sem o symlink, recriar com `ln -s ../.ai .ai` a partir da raiz do repo.

## MCP

`.cursor/mcp.json` configura o MCP do Supabase (read-only) via variáveis de ambiente `SUPABASE_PROJECT_REF` e `SUPABASE_ACCESS_TOKEN` (personal access token). Nunca colocar valores no arquivo.
