# cd-skills site

The website for the skills in this repo. It reads `../skills/*` at build time and generates everything from it: add a folder in `skills/` and it gets a page and an entry on the home, with no code changes.

Next.js 16 (App Router), React 19, Tailwind v4, Biome and Bun, with the [cd/ui](https://cd-ui.vercel.app) components. Portuguese at `/`, English at `/en`.

## Run

```bash
cd site
bun install
bun dev          # http://localhost:3000
```

Checks, same as CI:

```bash
bun run lint
bun run typecheck
bun test
bun run build
```

## How it reads the skills

`src/lib/skills.ts` lists every `skills/<name>/` that has a `SKILL.md`, in alphabetical order.

- **description**: `description` from the frontmatter of `SKILL.md` (English) or `SKILL.pt.md` (Portuguese, falls back to English). The pages show the first sentence.
- **page text**: `README.pt.md` for Portuguese when it exists, otherwise `README.md` with a note that it is only in English. The first `# title` line is dropped, the page has its own.
- **links** in a README (`SKILL.md`, `references/x.md`, `../../LICENSE`) point to the file on GitHub.
- **install commands** come from the folder name.

Never put a file named `SKILL.md` inside `site/`: `npx skills add` scans the repo for them.

## Deploy

Vercel, with **Root Directory** set to `site`. Vercel includes files outside the root directory in the build by default, which is how `../skills` is available. `bun run build` runs `scripts/check-skills.ts` first and fails loudly if `../skills` is missing. The site URL comes from `VERCEL_PROJECT_PRODUCTION_URL`.
