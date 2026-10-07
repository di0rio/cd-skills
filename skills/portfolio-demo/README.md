# portfolio-demo

A skill for AI coding agents (Claude Code, Codex, Cursor and others) that turns "record a demo of this project" into **a short product video that shows what the project does**, not a screen capture of someone clicking around.

The agent plans, rehearses and reviews. The capture is either a script the agent runs (Playwright + browser screencast + ffmpeg) or a recording you make in Recordly from the agent's shot list.

## Why

Portfolio demo videos usually fail the same way: they open on a login screen, tour every menu, wait on spinners, zoom on every click and end on a random frame. Asking an agent for help makes it worse in a different way: it tries to fake the recording, edits the project to look better on camera, or fills the form with `test123`.

`portfolio-demo` gives the agent a process: read the project, pick the strongest flow, prepare fictional data, rehearse in a real browser, write a timed shot list, then capture (by script, or hand it to you) and review the export frame by frame. The rules are the same in both modes: one flow, no changes to the product for the camera, and a broken state gets fixed, not edited around.

## What is inside

[`SKILL.md`](SKILL.md). A Portuguese version of the same skill is in [`SKILL.pt.md`](SKILL.pt.md).

- **two modes**: scripted (the agent captures the deployed site, the default when the flow runs in a browser) and manual (you record in Recordly or any screen recorder with zoom and trimming); when to pick each
- **workflow**: discover the project, pick one flow, prepare the environment, rehearse in Playwright with real timings, deliver the shot list, capture, review the export
- **scripted capture**: theme set before the first frame, injected cursor, CDP screencast rebuilt at a constant 30 fps, zooms anchored to recorded action marks, luma check against flicker, CLI products replayed from real output, dark and light versions from the same script
- **narrative**: hook, context, core flow (input, action, transformation, result), proof; 30-60s by default, never over 2 minutes
- **data and safety**: fictional but realistic data, no real personal data or secrets, never change the project to look good on camera, clean `git status` after any temporary setup
- **editing rules**: cursor, trimming, speed, zoom, annotations, and "does it increase understanding? if not, cut"
- a **shot list template** with mode, setup checklist, timed shots and capture settings
- **export settings** (H.264 `yuv420p` with full `bt709` color tags, so the video looks the same in every browser)
- an **after-export checklist** with `ffprobe` and `ffmpeg` commands: duration, resolution, color tags, contact sheet, luma, poster frame, integration into the portfolio
- **anti-patterns** and when to re-capture

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

Ask the agent something like "record a demo of converter-hub for my portfolio". It will read the project, propose the flow and the mode, rehearse it and give you the shot list. In scripted mode it captures, edits and reviews the video itself. In manual mode you record and export, then tell the agent where the file is so it can review it and add it to the portfolio.

Rehearsal and scripted capture need Playwright (with Chromium or Edge). The edit and the export check need `ffmpeg` and `ffprobe` on the PATH.

## Background

I wrote this skill to make the project videos for [my portfolio](https://cauadiorio.vercel.app/projetos). It started as manual-only (the agent plans, I record in Recordly); the videos that ended up on the site were captured by script, so scripted mode became part of the skill. The story is in the post [vídeos de demo que mostram o produto](https://cauadiorio.vercel.app/blog/videos-de-demo-do-portfolio) (Portuguese, with an English version on the same site).

## License

[MIT](../../LICENSE)
