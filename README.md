# cd-skills

Skills I wrote for AI coding agents (Claude Code, Codex, Cursor and others). Each one is a single `SKILL.md`, with a Portuguese version next to it (`SKILL.pt.md`).

| Skill | What it does |
| --- | --- |
| [clean-code-ai](skills/clean-code-ai/) | Asks for the smallest correct, safe and readable change that fits the project, with security, correctness and contracts above "do less". Tested on a small blind benchmark ([`bench/clean-code-ai/`](bench/clean-code-ai/)). |
| [portfolio-demo](skills/portfolio-demo/) | Turns "record a demo of this project" into a short product video: the agent picks the flow, rehearses it and writes the shot list; you record and edit; the agent checks the export. |

## Install

With the [skills CLI](https://skills.sh), pick one or more skills from the list:

```bash
npx skills add di0rio/cd-skills
```

Or a single skill by name:

```bash
npx skills add di0rio/cd-skills --skill clean-code-ai
```

Claude Code, by hand: save the skill's `SKILL.md` (or `SKILL.pt.md`, renamed to `SKILL.md`) in `~/.claude/skills/<skill>/`. Each skill's README has the exact `curl` command.

Any other agent: paste the body of `SKILL.md` into your rules file (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`).

## License

[MIT](LICENSE)
