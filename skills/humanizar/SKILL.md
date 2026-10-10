---
name: humanizar
description: Rewrites text that reads like AI so it sounds like the person who signs it, writes from scratch in their voice, and uses someone else's text only as inspiration. Use whenever the user asks to humanize text, make it sound natural, "less ChatGPT", less robotic, less generic, more "like me", review the tone of a text, or sends someone else's text saying "something like this". Also use, without being asked, when drafting LinkedIn or social posts, portfolio project descriptions, bios, "about me" pages, website or landing copy, READMEs for people, essays, abstracts, or the introduction or conclusion of academic work. Covers English and Brazilian Portuguese. Do not use for code, commit messages or short chat replies.
---

# Humanizar

AI text isn't bad because AI wrote it. It's bad because it's generic: it says the obvious with inflated words, in a uniform rhythm, with a predictable structure. Readers notice in two lines and stop trusting it. The goal is text that is **specific, direct and in the voice of whoever signs it**, not text in disguise.

Humanizing is **not** adding typos, forced slang, "lol" or deliberately broken sentences. Fake imperfection is just another tic, and a worse one.

## Three modes

1. **Rewrite**: the user hands over a text and wants the humanized version.
2. **Write**: Claude is drafting something people will read (post, bio, README, website copy). Apply everything below on the first draft, without announcing it.
3. **Inspire**: the user sends someone else's text ("I think this is the idea", "something like this"). See its own section below. **A reference is never a template.**

## Before writing: find the voice

"Keep the author's voice" doesn't work if you don't know what the voice is. Before writing or rewriting:

1. **Collect 2 to 4 samples of what the person has already published**: posts, other pages of the same site, READMEs, older texts in the project. Chat messages help you hear how they talk, but published writing is usually one step cleaner (someone who types "dude idk lol" in chat may write "gonna" on their site, but not "idk").
2. **Note 3 to 5 concrete traits**: grammatical person, average sentence length, slang and contractions they use, whether headings are capitalized, whether they joke, words they would never use.
3. **Write with those traits.** If there are no samples at all, write plain and direct, and ask.

## Process

1. **Genre, language and audience.** Each genre has its own conventions, see `references/genres.md`.
2. **List the concrete claims** the text has to carry. AI text often spreads 3 ideas across 300 words.
3. **Check where each fact comes from.** Only what's in the original text, the project files or what the user said gets in. If you have no source for a concrete detail, **don't write it**: ask (in short text) or leave `[concrete example here]` (in long text).
4. **Write from the ideas, not sentence by sentence.** Swapping synonyms keeps the robotic skeleton. Start with the most interesting point and cut whatever carries no information.
5. **Run the final audit** (below) on your own text before delivering.

## Core rules

- **A scene beats an abstraction.** "From the database and API all the way to the last screen state" is abstract. "If a screen needs a new route, I build it" is a situation the reader can picture. Prefer what you can see happening.
- **Specific beats generic**, as long as the specific thing is true (step 3).
- **Vary the rhythm.** Short sentence. Then a longer one that develops the idea calmly. AI writes everything at the same length.
- **Stop when the content stops.** No punchline at the end, no moral, no aphorism ("code I can't explain doesn't get in", "and that makes all the difference"). If the last sentence would fit on a mug, cut it or replace it with a fact.
- **Cut empty openings.** No "In today's fast-paced world...". Start with the subject.
- **Words the person would actually say.** In bios and website copy, no jargon they wouldn't use in conversation ("loading states", "API routes", "service layer"). Talk about what they enjoy, the way they say it ("I'm into motion and design"), and leave technical detail for case studies.
- **Plain verbs.** "Use", not "leverage". "Show", not "showcase". In Portuguese, "usar", not "alavancar".
- **Assert.** Drop "it's worth noting that", "it's important to remember", "vale destacar".
- **Less dramatic punctuation.** Em dashes and suspense colons are strong tells, especially in Portuguese. And a colon followed by **a list of three** ("the loading, the error, the speed") is the tic that most often survives revision.
- **No decorative formatting** when the genre doesn't call for it.
- **Keep the language and register.** Academic stays academic, just clearer. A post stays a post.

## Inspire mode (reference text)

The person liked something in someone else's text. Your job is to find out **what**, and do that with their material and their voice.

1. **Say in one line what the reference does well** (the moves, not the words). E.g. "says who the work is for", "admits a concrete personal preference", "ends with where to find you".
2. **Don't copy**: the same paragraph structure, sentence order, expressions, images ("software people spend their whole workday in"), or **facts** from the reference (the other person may build ERPs and be on X; the user may not).
3. **Write with the user's facts and voice** (see "find the voice").
4. **Distance test:** read both side by side. If someone could tell one was built on top of the other, rewrite.

## Short text (bio, tagline, caption, title)

For text up to ~4 sentences, deliver **2 or 3 versions with different angles** (e.g. one more direct, one with more humor, one focused on work), each with one line naming its angle. A single version turns into back-and-forth. If the user already chose the angle, deliver one.

## Final audit (run it on your text, always)

- [ ] Is the last sentence of each paragraph a fact or a slogan? Slogans go.
- [ ] Is there a colon followed by three items? A trio of adjectives? Switch to two, four or prose.
- [ ] Is there "from X to Y", "end to end", "it's not X, it's Y"? Replace with a scene or a direct statement.
- [ ] Any fact without a source (step 3)? Remove it or ask.
- [ ] Would the person say this out loud to a friend, as it is? If not, rewrite the sentence.
- [ ] (Inspire mode) Does it pass the distance test?

Detailed tics are in `references/patterns.md`. One on its own doesn't condemn a text; a pile of them does.

## Reply format

1. The ready-to-copy text (or the 2-3 versions, for short text), one block each.
2. Up to 4 short lines with the main changes. Skip if the user asked for the text only.
3. Facts that were missing or that you couldn't confirm, as direct questions.

If the text is already good, say so and change little. Rewriting for the sake of it makes things worse.

## Limits

- Don't promise the text "passes AI detectors". Detectors are unreliable and the point is reading quality.
- In academic work, keep the author's ideas, arguments and citations. Never invent a reference, data or author. If the user wants the whole paper written from scratch to hand in as their own, remind them to check their institution's rules on AI use.

## References

- `references/patterns.md`: catalog of tics in English and Portuguese, including the ones that survive a first revision. Read it when revising any text.
- `references/genres.md`: what changes for posts, portfolio/bio, website copy, essays and academic writing.

The Portuguese version of this skill is `SKILL.pt.md`, with its references in `references/padroes.md` and `references/generos.md`.
