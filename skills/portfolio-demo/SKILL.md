---
name: portfolio-demo
description: Plan, prepare, capture or hand off, verify and integrate polished product-demo videos of portfolio projects. Two modes - the owner records in Recordly (or another screen recorder) from the agent's shot list, or the agent captures the video by script (Playwright + browser screencast + ffmpeg). Use when the user asks to record, demo or showcase a project video, mentions Recordly, a product demo, or a demo video for the portfolio. Do NOT use for screenshots, CLI-output GIFs, tutorials or marketing copy.
---

# Portfolio Demo

Goal: the shortest video that makes a project's value obvious. Record the product, not the development process.

## Modes

Pick one per project and say which in the shot list. If unclear, propose one and ask.

- **Scripted** (default when it fits): the agent captures the deployed site by script, edits with ffmpeg and exports. Fits when the flow runs in a browser on a public URL, is deterministic, and the video must be regenerated later or exist in two themes. For CLI products, replay the real output (see Scripted capture).
- **Manual**: the human records and edits in Recordly following the shot list. Fits when the flow needs native OS UI (real file dialogs, desktop apps, system prompts), when the owner wants hand-made pacing, or when scripted capture keeps looking robotic.

Both modes share everything else: discovery, one flow, fictional data, rehearsal, shot list, frame-by-frame review. The mode changes the tool, not the rules.

Never claim a recording happened that did not. Never drive Recordly or other desktop GUIs.

## Workflow

1. **Discover** (never skip): README, package.json, routes/pages, seed/mock data, env config, deploy config, tests that reveal flows. Not a code review. Answer: problem, user, primary workflow, strongest feature, what NOT to show.
2. **Select flow**: rank by visual impact, product value, technical relevance, speed, uniqueness. Prefer one flow that shows several qualities (upload -> parse -> validate -> transform -> preview -> export). For several projects, give a table: project | strongest flow | demo value | difficulty | priority. Quality over quantity.
3. **Prepare**: known initial state, realistic fictional data, clean browser, fixed viewport, stable network. Prefer the deployed URL over localhost; prefer window capture.
4. **Rehearse** in Playwright at the target viewport: catch errors, console errors, loading states, layout shift, extra clicks, external requests; measure real timing per step. Fix or re-plan before capturing.
5. **Deliver the shot list** (template below).
6. **Capture**: scripted mode, the agent runs the capture and edit; manual mode, wait for the human to record.
7. **Review the export** with the checklist, fix or re-capture, then integrate.

## Narrative

Hook -> Context -> Core flow (Input -> Action -> Transformation -> Result) -> Proof.

- Hook in the first seconds with the strongest visual. Never open on login, blank state, landing page, terminal or spinner (a terminal is fine when the product is a CLI).
- Context: brief and visual, no slides.
- End on the result, held ~2s.
- Duration: 30-60s default, 45-90s complex, never over 2 min.
- Project types: data conversion (source -> import -> mapping -> transform -> validate -> output); dashboard (initial -> filter -> meaningful change); CMS (create -> publish -> public); security tool (problem -> controlled run -> evidence -> conclusion; fictional targets only); CRUD apps: show the business workflow, not CRUD.
- Technical qualities (local-first, client-side processing, validation, responsive, real-time, roles) must be visible in the UI, not explained by code.

## Data and safety

- Fictional but realistic domain data. Never test123/foo/John Doe, and never real personal data, credentials, keys, tokens, cookies, internal URLs, national IDs, phones, private emails, customer info. IPs from documentation ranges (RFC 5737).
- Never damage the project for the demo: no fake UI, redesign, hardcoded prod values, removed features, changed logic, disabled security, extra dependencies. Things injected only into the capture (cursor, click ripple, hidden scrollbar, a single annotation) live in the capture script at runtime, never in the project repo. If temporary data or flags are needed: seed/mock/runtime only, isolate, revert, verify `git status` is clean.
- Close notifications, other apps and personal tabs. No dev overlays, devtools, extensions, bookmarks. Fonts/images loaded before capture.
- Failure (error dialog, stack trace, broken layout, missing asset, auth failure, empty state that should not be there): stop, fix, re-take. Never edit around a broken state. If the bug is in the product, fix it in the product (separate change), redeploy, then capture again.

## Scripted capture

Keep the scripts next to the exports (see File organization) so the video can be regenerated after the product changes.

- **Browser**: Playwright drives Chromium or Edge on the deployed URL at a fixed viewport. Set theme and locale before the first page script (`addInitScript` writing the app's theme key to `localStorage`, plus `colorScheme` on the context), so frame 0 is already in the right theme.
- **Cursor**: headless capture has no cursor. Inject one with `addInitScript` (SVG arrow, eased movement, small bounce and ripple on click). Move it with purpose, hover ~0.5s before important clicks.
- **Frames**: capture with CDP `Page.startScreencast` (jpeg quality ~92). Frames arrive at a variable rate with timestamps; rebuild a constant 30 fps video from those timestamps.
- **Resolution**: some browsers' screencast ignores `deviceScaleFactor` and returns CSS pixels. Check the real frame size. Either place a viewport (e.g. 1600x900) 1:1 inside the 1920x1080 frame with no rescale, or force the scale with a launch flag plus `Emulation.setDeviceMetricsOverride`.
- **Marks**: record a timestamp for every action in the screencast clock and anchor zooms and cuts to those marks, never to fixed times; network variation then cannot misalign the edit.
- **Edit with ffmpeg**: eased zooms (smoothstep, max ~1.6x, never during a click), background matching the portfolio, rounded mask, subtle shadow. Shorten pauses in the capture instead of speeding up footage.
- **Luma jumps**: measure average brightness per frame. A jump above ~4 (0-255 scale) between consecutive frames reads as a flicker (modal scrim, navigation, theme flash). Remove the beat if it adds nothing; otherwise apply a short crossfade (~4 frames) at that cut. This is editing; the UI stays real.
- **CLI products**: run the real CLI, save its output (and timing) to JSON, and replay it on an HTML page that renders the terminal deterministically as `render(t)`; capture frame by frame. The only allowed text change is anonymizing paths. Colors may be applied at render time.
- **Two themes**: same script, same marks, same timing; export `<slug>.mp4` and `<slug>-light.mp4`.

## Manual mode: interaction and editing rules (for the human)

- Cursor: smoothing on, short deliberate paths, pause before important actions, click once, let changes breathe. No circling, wandering, frantic moves, accidental hovers.
- Trim aggressively: dead time, hesitation, failed clicks, loading, retries, irrelevant navigation.
- Speed regions only for unavoidable waits; prefer trimming. Never speed up the main interaction or result.
- Zoom only when the viewer needs help seeing (small control, localized change, dense UI, result emphasis). Not on every click, not mid-action, not aggressive.
- Annotations sparingly: result, unique capability, non-visual concept. Never on obvious buttons, never covering UI.
- No narration, music or webcam by default. If narration is requested: scripted, concise, no "hey guys".
- Do not use a Recordly feature just because it exists.
- Decision rule for every element: does it increase understanding? No -> cut. Maybe -> cut.

The zoom, annotation and trimming rules apply to scripted mode too.

## Framing (consistent across all projects)

Landscape 16:9, moderate padding, rounded corners, subtle shadow, restrained background that matches the portfolio's visual identity (read its colors before choosing). App is the hero. Same duration range, quality, pacing and naming across projects, but never identical scripts.

## Required output: SHOT LIST

Deliver this in markdown before capturing. Fill every field with concrete values.

````markdown
# Shot list: <project> (<slug>)
Mode: <scripted | manual (Recordly)>
Flow: <one sentence>   Expected final duration: <NN>s   Rehearsal time: <NN>s

## Setup checklist
- [ ] URL: <exact URL, clean, no query noise>
- [ ] Viewport: <1600x900 1:1 in frame | 1440x900 window capture>, browser chrome hidden
- [ ] Theme / language: <dark|light|both>, <language>
- [ ] Data to load: <file paths, e.g. demo/sample-orders.csv> (fictional, verified no real data)
- [ ] Initial state: <logged in as demo user / empty upload / etc.>
- [ ] Manual mode only: close notifications, chat apps, other tabs, extensions, devtools; cursor start position <where>

## Shots
| # | Time | Action (exact clicks/typing) | Viewer should notice | Edit |
|---|------|------------------------------|----------------------|------|
| 1 | 0-4s | Page already showing <result preview>; cursor drifts to Upload | <hook> | none |
| 2 | 4-10s | Drag `sample-orders.csv` onto dropzone; wait for parse | <instant validation> | zoom 1.5x on dropzone; trim wait |
| 3 | ... | ... | ... | crossfade on modal open / annotation "Runs 100% in browser" |
| N | last | Hold on final result | <proof> | hold 2s, no zoom |

## Capture settings
- Scripted: capture script, viewport, fps 30, zoom anchors (marks), background, radius 12-16px, export settings
- Manual (Recordly): window capture 16:9; background <matches portfolio>, padding moderate, radius 12-16px, shadow subtle; cursor smoothing on, click bounce on, motion blur light; auto zoom suggestions only if they match the table; webcam and audio off; save the .recordly project

## Do-not-show
<real data, tokens, dev UI, etc.>
````

## Export settings

MP4, H.264, 1920x1080, 30 fps, `yuv420p`, TV range, full `bt709` tags, `+faststart`, no audio:

`ffmpeg -i in.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -color_range tv -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -an out.mp4`

Without the color tags the same file renders with different colors across browsers. CRF 21-26; aim for under ~4 MB for a 45s video.

## After export checklist (agent runs this)

1. `ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,pix_fmt,color_range,color_primaries,color_transfer,color_space -of default=nw=1 file.mp4`: duration in range, 1920x1080 (or intended), `yuv420p`, `bt709` tags, no audio unless intended.
2. Extract frames and view them: first, last, then one every ~1.5-2s as a contact sheet: `ffmpeg -i file.mp4 -vf fps=0.5 frames/f_%03d.png`. Look for: broken UI, error dialogs, spinners, empty states, sensitive data, recorder UI, desktop/taskbar leaks, cropped UI inside zooms, weak first frame, meaningless final frame.
3. Check luma per frame around modals, navigations and zooms (see Luma jumps). Look at consecutive frames where it jumps.
4. Report problems with timestamps. Scripted mode: fix the script and re-render. Manual mode: the human re-exports.
5. Re-encode with the export settings if the file is over budget or lacks the color tags.
6. Poster: `ffmpeg -ss <t> -i out.mp4 -frames:v 1 -c:v libwebp -quality 85 poster.webp` (an unzoomed frame; frame 0 when it is the hook).
7. Integrate into the portfolio: find where it renders project media (component, props, file naming convention, light-theme variants) and read an existing usage before adding the video and poster. Follow the portfolio's own conventions and agent rules (AGENTS.md, CLAUDE.md). Check the page in dev or build.
8. Never commit large videos to project repos.

## File organization

Keep demos outside the project repos: `<demos-dir>/<project>/{source/, exports/, README.md, exports/REVIEW.md}`. `source/` holds the capture scripts (scripted) or the `.recordly` project (manual). README: mode, flow and why it won, data used, date, settings, project version recorded, how to regenerate. REVIEW.md: ffprobe output, what the review found and what was fixed. MP4 default; GIF only for short loops (under ~8s).

## Anti-patterns

Raw capture, feature dump, CRUD showcase, UI tour, cursor chaos, robotic cursor (instant jumps, no pauses), zoom spam, loading simulator, developer demo (terminal, install, debugging, unless the product is a CLI), fake product, overproduced, underproduced.

Re-capture when: confusing, chaotic cursor, broken look, flicker, strongest feature unclear, too long, distracting zooms, weak result, or project changed.

## Final report

Demo completed | Project | Mode | Primary flow | Duration | Size | Export path | Source path | Problems found and fixed | Notes.

Golden rule: show the product, the important interaction, the result. Cut everything else.
