# portfolio-demo

A skill for AI coding agents (Claude Code, Codex, Cursor and others) that turns "record a demo of this project" into **a short product video that shows what the project does**, not a screen capture of someone clicking around.

The agent plans, prepares and checks. You record and edit.

## Why

Portfolio demo videos usually fail the same way: they open on a login screen, tour every menu, wait on spinners, zoom on every click and end on a random frame. Asking an agent for help makes it worse in a different way: it tries to fake the recording, edits the project to look better on camera, or fills the form with `test123`.

`portfolio-demo` splits the work. The agent does what it is good at (reading the project, picking the strongest flow, preparing fictional data, rehearsing the flow in a real browser, checking the exported file) and hands you a shot list precise enough to record in one or two takes.

## What is inside

[`SKILL.md`](SKILL.md). A Portuguese version of the same skill is in [`SKILL.pt.md`](SKILL.pt.md).

- **roles**: the agent never records and never claims to have recorded; the human records in Recordly (any screen recorder with zoom and trimming works)
- **workflow**: discover the project, pick one flow, prepare the environment, rehearse in Playwright with real timings, deliver the shot list, check the export
- **narrative**: hook, context, core flow (input, action, transformation, result), proof; 30-60s by default, never over 2 minutes
- **data and safety**: fictional but realistic data, no real personal data or secrets, never change the project to look good on camera, clean `git status` after any temporary setup
- **editing rules** for the human: cursor, trimming, speed, zoom, annotations, and "does it increase understanding? if not, cut"
- a **shot list template** with setup checklist, timed shots and recorder settings
- an **after-export checklist** with `ffprobe` and `ffmpeg` commands: duration, resolution, frame-by-frame review, compression, poster frame, integration into the portfolio
- **anti-patterns** and when to re-record

## Install

Claude Code, as a personal skill:

```bash
mkdir -p ~/.claude/skills/portfolio-demo
curl -fsSL https://raw.githubusercontent.com/di0rio/cd-skills/main/skills/portfolio-demo/SKILL.md -o ~/.claude/skills/portfolio-demo/SKILL.md
```

Portuguese version, same folder and file name:

```bash
curl -fsSL https://raw.githubusercontent.com/di0rio/cd-skills/main/skills/portfolio-demo/SKILL.pt.md -o ~/.claude/skills/portfolio-demo/SKILL.md
```

With the [skills CLI](https://skills.sh):

```bash
npx skills add di0rio/cd-skills --skill portfolio-demo
```

Any other agent: paste the body of `SKILL.md` into your rules file (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`).

## Usage

Ask the agent something like "record a demo of converter-hub for my portfolio". It will read the project, propose the flow, rehearse it and give you the shot list. Record, export, then tell the agent where the file is so it can check it and add it to the portfolio.

Rehearsal needs a browser the agent can drive (Playwright or a built-in browser). The export check needs `ffmpeg` and `ffprobe` on the PATH.

## Background

I wrote this skill to record the project videos for [my portfolio](https://cauadiorio.vercel.app/projetos).

## License

[MIT](../../LICENSE)
