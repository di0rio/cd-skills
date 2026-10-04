# pragmatic-code

A skill for AI coding agents (Claude Code, Codex, Cursor and others) that asks for **the smallest correct, safe and readable change that fits the project you are in**.

Minimal means smallest correct and narrowest scope. It never means least safe.

## Why

Coding agents overbuild: new layers, new dependencies, a global stylesheet for a one-off value, an `eslint-disable` to make the build pass. "Do less" skills such as [ponytail](https://ponytail.dev/) fix part of that, but pushing hard for "shortest" brings its own failure modes:

- reuse turned into centralization (a `:root` variable or a store for something used once);
- code deleted because it looks unused, while it is wired by name from config;
- validation, error handling or a needed test dropped to save lines;
- clever one-liners that are shorter and harder to read.

`pragmatic-code` keeps the "do less" instinct and puts security, correctness and contracts above it.

## What is inside

[`skills/pragmatic-code/SKILL.md`](skills/pragmatic-code/SKILL.md), about 1,400 words:

- priority on conflict: security, correctness, explicit requirements and contracts before simplicity
- solution ladder: delete, reuse, stdlib, native API, existing dependency, a few lines, then abstraction
- **scope and locality**: styling and state live in the narrowest scope that works; a global token only for a real shared design decision
- root cause first, breaking changes flagged explicitly, trust boundaries, no silenced tools
- a frontend section for React, Next.js and Tailwind
- **when minimal is wrong**: the cases where the right move is to do more
- a short quality gate and a reply format

## Install

Claude Code, as a personal skill:

```bash
mkdir -p ~/.claude/skills/pragmatic-code
curl -fsSL https://raw.githubusercontent.com/di0rio/pragmatic-code/main/skills/pragmatic-code/SKILL.md -o ~/.claude/skills/pragmatic-code/SKILL.md
```

With the [skills CLI](https://skills.sh):

```bash
npx skills add di0rio/pragmatic-code
```

Any other agent: paste the body of `SKILL.md` into your rules file (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`).

## Benchmark

Five small tasks, each run with no rules, with ponytail and with pragmatic-code (same model, isolated copies), then scored blind by a separate judge. Details, raw outputs and limits in [`bench/RESULTS.md`](bench/RESULTS.md).

| Task | What it tests | baseline | ponytail | pragmatic |
|---|---|---|---|---|
| 01 featured card | local styling vs new globals | 32 | 36 | **39** |
| 02 price format | fix the shared function, not one caller | **39** | 38 | 38 |
| 03 relative dates | native `Intl` vs a library, old dates | 33 | 31 | **37** |
| 04 simplify handler | shorter without dropping auth/validation | **37** | 36 | **37** |
| 05 dead code | code wired by name in config | 36 | 17 | **39** |
| **Total (of 200)** | | 177 | 158 | **190** |

One run per arm, judged by an LLM, on fixtures written by the author. Treat it as a smoke test, not proof. Pull requests with new tasks are welcome, especially ones where pragmatic-code does worse.

## Background

The story behind the skill, and how it changed after comparing it with ponytail, is in the post [a skill que escrevi pra IA parar de complicar meu código](https://cauadiorio.vercel.app/blog/skill-de-codigo-pragmatico) (Portuguese, with an English version on the same site).

## License

[MIT](LICENSE)
