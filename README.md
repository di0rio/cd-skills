# pragmatic-code

A skill for AI coding agents (Claude Code, Codex, Cursor and others) that asks for **the smallest correct, safe and readable change that fits the project you are in**.

Minimal means smallest correct and narrowest scope. It never means least safe.

## Why

Coding agents overbuild: new layers, new dependencies, a global stylesheet for a one-off value, an `eslint-disable` to make the build pass. "Do less" rules fix part of that, but pushing hard for "shortest" brings its own failure modes:

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

## How I tested it

I ran five small tasks (a styling change, a bug with several callers, a feature that tempts a new dependency, a "simplify this" handler with auth and validation, and dead-code cleanup) with no rules, with another "do less" skill and with pragmatic-code, then had a separate model score the attempts blind.

It is a smoke test, not proof: one run per setup, an LLM judge, and tasks I wrote myself around the failure modes above. The tasks, raw outputs and verdict are in [`bench/`](bench/) so anyone can rerun or challenge them. Pull requests with new tasks are welcome, especially ones where pragmatic-code does worse.

## Background

Thanks to [ponytail](https://ponytail.dev/), which shaped how this skill is written: short, with a clear trigger description and a fixed reply format. The story behind the skill and what I learned from it is in the post [a skill que escrevi pra IA parar de complicar meu código](https://cauadiorio.vercel.app/blog/skill-de-codigo-pragmatico) (Portuguese, with an English version on the same site).

## License

[MIT](LICENSE)
