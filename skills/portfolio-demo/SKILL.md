---
name: portfolio-demo
description: Plan, prepare, verify and integrate polished product-demo videos of portfolio projects that the owner records in Recordly (or another screen recorder). Use when the user asks to record, demo or showcase a project video, mentions Recordly, a product demo, or a demo video for the portfolio. The agent produces the shot list, environment, rehearsal and post-export checks; the human records and edits. Do NOT use for screenshots, CLI-output GIFs, tutorials, marketing copy, or editing video files directly.
---

# Portfolio Demo

Goal: the shortest video that makes a project's value obvious. Record the product, not the development process.

## Roles

A coding agent cannot operate Recordly (desktop GUI). Split work:

- **Agent**: discover, choose flow, prepare data/environment, rehearse in a browser (Playwright), write the shot list, verify the export, integrate it into the portfolio.
- **Human (owner)**: record and edit in Recordly following the shot list.

Never claim to have recorded. Never automate the recording itself.

## Workflow

1. **Discover** (never skip): README, package.json, routes/pages, seed/mock data, env config, deploy config, tests that reveal flows. Not a code review. Answer: problem, user, primary workflow, strongest feature, what NOT to show.
2. **Select flow**: rank by visual impact, product value, technical relevance, speed, uniqueness. Prefer one flow that shows several qualities (upload -> parse -> validate -> transform -> preview -> export). For several projects, give a table: project | strongest flow | demo value | difficulty | priority. Quality over quantity.
3. **Prepare**: known initial state, realistic fictional data, clean browser, fixed viewport, stable network. Prefer the deployed URL over localhost; prefer window capture.
4. **Rehearse** in Playwright at the target viewport: catch errors, console errors, loading states, layout shift, extra clicks; measure real timing per step. Fix or re-plan before the human records.
5. **Deliver the shot list** (template below). Wait for the human to record.
6. **After export**, run the checklist and integrate.

## Narrative

Hook -> Context -> Core flow (Input -> Action -> Transformation -> Result) -> Proof.

- Hook in the first seconds with the strongest visual. Never open on login, blank state, landing page, terminal or spinner.
- Context: brief and visual, no slides.
- End on the result, held ~2s.
- Duration: 30-60s default, 45-90s complex, never over 2 min.
- Project types: data conversion (source -> import -> mapping -> transform -> validate -> output); dashboard (initial -> filter -> meaningful change); CMS (create -> publish -> public); security tool (problem -> controlled run -> evidence -> conclusion; fictional targets only); CRUD apps: show the business workflow, not CRUD.
- Technical qualities (local-first, client-side processing, validation, responsive, real-time, roles) must be visible in the UI, not explained by code.

## Data and safety

- Fictional but realistic domain data. Never test123/foo/John Doe, and never real personal data, credentials, keys, tokens, cookies, internal URLs, national IDs, phones, private emails, customer info.
- Never damage the project for the demo: no fake UI, redesign, hardcoded prod values, removed features, changed logic, disabled security, extra dependencies. If temporary data or flags are needed: use seed/mock/runtime only, isolate, record, revert, verify `git status` is clean.
- Close notifications, other apps and personal tabs. No dev overlays, devtools, extensions, bookmarks. Fonts/images loaded before capture.
- Failure (error dialog, stack trace, broken layout, missing asset, auth failure): stop, fix, re-take. Never edit around a broken state.

## Interaction and editing rules (for the human)

- Cursor: smoothing on, short deliberate paths, pause before important actions, click once, let changes breathe. No circling, wandering, frantic moves, accidental hovers.
- Trim aggressively: dead time, hesitation, failed clicks, loading, retries, irrelevant navigation.
- Speed regions only for unavoidable waits; prefer trimming. Never speed up the main interaction or result.
- Zoom only when the viewer needs help seeing (small control, localized change, dense UI, result emphasis). Not on every click, not mid-action, not aggressive.
- Annotations sparingly: result, unique capability, non-visual concept. Never on obvious buttons, never covering UI.
- No narration, music or webcam by default. If narration is requested: scripted, concise, no "hey guys".
- Do not use a Recordly feature just because it exists.
- Decision rule for every element: does it increase understanding? No -> cut. Maybe -> cut.

## Framing (consistent across all projects)

Landscape 16:9, moderate padding, rounded corners, subtle shadow, restrained background that matches the portfolio's visual identity (read its colors before choosing). App is the hero. Same duration range, quality, pacing and naming across projects, but never identical scripts.

## Required output: SHOT LIST

Deliver this in markdown before any recording. Fill every field with concrete values.

````markdown
# Shot list: <project> (<slug>)
Flow: <one sentence>   Expected final duration: <NN>s   Rehearsal time: <NN>s

## Setup checklist
- [ ] URL: <exact URL, clean, no query noise>
- [ ] Window/viewport: 1440x900 (window capture), browser chrome cropped or hidden
- [ ] Theme / language: <dark|light>, <language>
- [ ] Data to load: <file paths, e.g. demo/sample-orders.csv> (fictional, verified no real data)
- [ ] Initial state: <logged in as demo user / empty upload / etc.>
- [ ] Close: notifications, chat apps, other tabs, extensions, devtools
- [ ] Cursor start position: <where>

## Shots
| # | Time | Action (exact clicks/typing) | Viewer should notice | Recordly edit |
|---|------|------------------------------|----------------------|---------------|
| 1 | 0-4s | Page already showing <result preview>; cursor drifts to Upload | <hook> | none |
| 2 | 4-10s | Drag `sample-orders.csv` onto dropzone; wait for parse | <instant validation> | zoom 1.8x on dropzone; trim wait |
| 3 | ... | ... | ... | speed 3x on 6s processing / annotation "Runs 100% in browser" |
| N | last | Hold on final result | <proof> | hold 2s, no zoom |

## Recordly settings
- Capture: window, 16:9
- Background: <matches portfolio>, padding <moderate>, radius <12-16px>, shadow subtle
- Cursor: smoothing on, click bounce on, motion blur light
- Auto zoom suggestions: accept only those matching the table
- Webcam off, audio off
- Export: MP4, 1080p (1920x1080), high quality; save .recordly project

## Do-not-show
<real data, tokens, dev UI, etc.>
````

## After export checklist (agent runs this)

1. `ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of default=nw=1 file.mp4`: confirm duration in range, 1920x1080 (or intended), no audio unless intended.
2. Extract frames and view them: first, last, then one every ~2s: `ffmpeg -i file.mp4 -vf fps=0.5 frames/f_%03d.png`. Look for: broken UI, error dialogs, spinners, sensitive data, Recordly editor UI, desktop/taskbar leaks, weak first frame, meaningless final frame.
3. Report problems with timestamps; the human re-exports.
4. Compress if over ~8 MB: `ffmpeg -i in.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -an out.mp4`
5. Poster: `ffmpeg -ss <t> -i out.mp4 -frames:v 1 -q:v 2 poster.jpg` (clearest result frame, not frame 0 unless it is the hook).
6. Integrate into the portfolio: find where it renders project media (component, props, file naming convention) and read an existing usage before adding the video and poster. Follow the portfolio's own conventions and agent rules (AGENTS.md, CLAUDE.md). Check the page in dev or build.
7. Never commit large videos to project repos.

## File organization

Keep demos outside the project repos: `<demos-dir>/<project>/{source/<project>.recordly, exports/<project>.mp4|gif, README.md}`. README: flow, data used, date, Recordly settings, project version recorded. Keep .recordly when edits are meaningful or re-export is likely. MP4 default; GIF only for short loops (under ~8s).

## Anti-patterns

Raw capture, feature dump, CRUD showcase, UI tour, cursor chaos, zoom spam, loading simulator, developer demo (terminal, install, debugging), fake product, overproduced, underproduced.

Re-record when: confusing, chaotic cursor, broken look, strongest feature unclear, too long, distracting zooms, weak result, or project changed.

## Final report

Demo completed | Project | Primary flow | Duration | Export path | Recordly project path | Notes.

Golden rule: show the product, the important interaction, the result. Cut everything else.
