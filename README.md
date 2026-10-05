# clean-code-ai

A skill for AI coding agents (Claude Code, Codex, Cursor and others) that asks for **the smallest correct, safe and readable change that fits the project you are in**.

Minimal means smallest correct and narrowest scope. It never means least safe.

## Why

Coding agents overbuild: new layers, new dependencies, a global stylesheet for a one-off value, an `eslint-disable` to make the build pass. "Do less" rules fix part of that, but pushing hard for "shortest" brings its own failure modes:

- reuse turned into centralization (a `:root` variable or a store for something used once);
- code deleted because it looks unused, while it is wired by name from config;
- validation, error handling or a needed test dropped to save lines;
- clever one-liners that are shorter and harder to read.

`clean-code-ai` keeps the "do less" instinct and puts security, correctness and contracts above it.

## What is inside

[`skills/clean-code-ai/SKILL.md`](skills/clean-code-ai/SKILL.md), about 2,500 words. A Portuguese version of the same skill is in [`skills/clean-code-ai/SKILL.pt.md`](skills/clean-code-ai/SKILL.pt.md).

- **levels**: `lite`, `full` (default), `ultra` and `off`, switched with `/clean-code-ai lite|full|ultra|off`
- **priority order** on conflict: security, correctness, explicit requirements and contracts before simplicity
- **solution ladder**: does it need to exist, remove code, reuse, stdlib, native platform feature (HTML/CSS before JS, database constraint before app code), installed dependency, a few lines, abstraction only with 2+ real uses, then new dependency or infrastructure
- **scope and locality**: styling and state live in the narrowest scope that works; a global token only for a real shared design decision
- **root cause** first, instead of guards in every caller
- **errors, types and tools**: no empty `catch`, no silenced lint or types, generated files left to their generator
- **readability**: clear beats short, comment the why, a `// clean-code-ai:` comment for known limits
- a **frontend** section for React, Next.js and Tailwind
- **dependencies**, and **where not to simplify** (backend validation, database guarantees, idempotency, accessibility)
- **when minimal is wrong**: the cases where the right move is to do more
- **contracts** and breaking changes flagged before they are applied
- a **stop criterion**: past ~50 lines, a new file, abstraction, global or dependency means one sentence of justification, unless the user explicitly asked for the feature
- a **reply format** and a short final **checklist**

## Install

Claude Code, as a personal skill:

```bash
mkdir -p ~/.claude/skills/clean-code-ai
curl -fsSL https://raw.githubusercontent.com/di0rio/pragmatic-code/main/skills/clean-code-ai/SKILL.md -o ~/.claude/skills/clean-code-ai/SKILL.md
```

Portuguese version, same folder and file name:

```bash
curl -fsSL https://raw.githubusercontent.com/di0rio/pragmatic-code/main/skills/clean-code-ai/SKILL.pt.md -o ~/.claude/skills/clean-code-ai/SKILL.md
```

With the [skills CLI](https://skills.sh):

```bash
npx skills add di0rio/pragmatic-code
```

Any other agent: paste the body of `SKILL.md` into your rules file (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`).

## How I tested it

The numbers in [`bench/`](bench/) were measured with the previous version of this skill, `pragmatic-code` (it lived at `skills/pragmatic-code/SKILL.md`, see git history). **They have not been re-run for `clean-code-ai`.**

I ran five small tasks (a styling change, a bug with several callers, a feature that tempts a new dependency, a "simplify this" handler with auth and validation, and dead-code cleanup) with no rules, with another "do less" skill and with pragmatic-code, then had a separate model score the attempts blind.

It is a smoke test, not proof: one run per setup, an LLM judge, and tasks I wrote myself around the failure modes above. The tasks, raw outputs and verdict are in [`bench/`](bench/) so anyone can rerun or challenge them. Pull requests with new tasks are welcome, especially ones where the skill does worse.

## Background

`clean-code-ai` merges `pragmatic-code` with an earlier `clean-code-ai` draft of mine, and replaces `pragmatic-code`.

Thanks to [ponytail](https://ponytail.dev/), which shaped how this skill is written: short, with a clear trigger description and a fixed reply format. The story behind the skill and what I learned from it is in the post [a skill que escrevi pra IA parar de complicar meu código](https://cauadiorio.vercel.app/blog/skill-de-codigo-pragmatico) (Portuguese, with an English version on the same site).

## License

[MIT](LICENSE)
