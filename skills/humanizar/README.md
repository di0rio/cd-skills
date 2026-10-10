# humanizar

A skill for AI agents (Claude Code, Codex, Cursor and others) that keeps text in the voice of whoever signs it. It rewrites text that reads like AI, writes new text in your voice, and when you send someone else's text as a reference, it takes the idea without copying it.

## Why

AI text gives itself away in two lines: inflated words, every sentence the same length, a punchline at the end of each paragraph. Asking the agent to "make it more natural" usually just swaps the tics for subtler ones. The bio on my portfolio went from "front-end is my thing, but I go from the database and API all the way to the last screen state" to something with a clever image I didn't even understand, before it finally sounded like me.

The first version of this skill had the usual catalog of tics and still let those through. This version came out of the rounds of "no, I don't talk like that" on my own site, so it targets the tics that survive a first revision.

## What is inside

[`SKILL.md`](SKILL.md), with [`references/patterns.md`](references/patterns.md) and [`references/genres.md`](references/genres.md). The Portuguese version is [`SKILL.pt.md`](SKILL.pt.md), with [`references/padroes.md`](references/padroes.md) and [`references/generos.md`](references/generos.md).

- **three modes**: rewrite a text, write a new one, or take inspiration from someone else's text without copying its structure, phrases or facts
- **find the voice first**: read 2 to 4 things the person already published and note concrete traits before writing
- **facts need a source**: a concrete detail only goes in if it came from the text, the project or the user; otherwise the agent asks
- **short text gets 2 or 3 versions** with different angles, so you pick instead of going back and forth
- **a final audit** for the tics that slip through: slogans at the end, a colon followed by three items, "from X to Y", jargon the person wouldn't say
- a **catalog of tics** in English and Portuguese, and **genre notes** for posts, bios, website copy, essays and academic writing

## Install

Claude Code, as a personal skill (the references folder comes along):

```bash
npx skills add di0rio/cd-skills --skill humanizar
```

By hand: copy the whole `skills/humanizar` folder to `~/.claude/skills/humanizar`. For the Portuguese version, rename `SKILL.pt.md` to `SKILL.md`.

Any other agent: paste the body of `SKILL.md` (and the references, if your agent can't read extra files) into your rules file (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`).

## Usage

- "humanize this" with a pasted text
- "write my bio for the site"
- "something like this" with someone else's text

The agent looks for your published writing first. If there isn't any, it writes plain and asks.

## Background

The story, with the before and after of each round, is in the post [a skill que eu fiz pra IA escrever do meu jeito](https://cauadiorio.vercel.app/blog/skill-humanizar) (Portuguese, with an English version on the same site).

## License

[MIT](../../LICENSE)
