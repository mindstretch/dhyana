# The Reflective Report — spec

Draft for curation. This is the AI layer — a **research partner, not a coach** —
that reads your real check-in data and your corpus, and reflects an honest picture
back. It answers *"am I actually developing?"* in words, from evidence.

**How to curate:** cut/add elements, retune the voice, decide the open questions at
the bottom. Nothing is built yet — shape it here first.

---

## Cadence
- **Weekly** — a light touch: the through-line, the arc, one pattern, one question. (Elements 1–2, 7, 10.)
- **End of the 30** — the full report (all elements below).

Pull, not push, at least to start: you tap **"reflect."** (Auto-generation at day 30 is an open question.)

## Data it reads (all already collected)
Per check-in in `checkins`: `state` (the feeling) · `reflection_data.fields`
(feelings[], intensity, trigger, and the per-practice entries) · `reflection` (text) ·
`meditation_seconds` · `program_day` · `created_at`. Plus the founder corpus in
`knowledge/`.

---

## The elements

| # | Element | Source | Honesty note |
|--|--|--|--|
| 1 | **The through-line** — one honest sentence naming the arc | synthesis of all | Never flattering. Names the direction, warts included. |
| 2 | **The emotional arc** — where days landed, drift toward regulated/restful | `state` over time | The dot arc, narrated. |
| 3 | **What you felt most** — top emotions + what they gathered around | `fields.feelings` counts | — |
| 4 | **Intensity** — average + direction (easing/steady/rising) | `fields.intensity` | Computed in code, not guessed. |
| 5 | **Granularity** — are you naming feelings more precisely over time | distinct feelings over time | How We Feel's validated well-being metric. |
| 6 | **Themes in your words** — recurring subjects, lightly quoted back | `reflection` text + fields | The "reflection as data" payoff. |
| 7 | **Patterns worth noticing** — honest correlations | cross-field | **Only real ones.** "Not enough data yet" when thin. |
| 8 | **A concept from your corpus** — the idea/practice that speaks to what came up | `knowledge/` + AI | Personal + knowledge fusion. Grounded, honesty-tagged. |
| 9 | **One experiment** — a specific, data-grounded n=1 hypothesis for next stretch | synthesis | Advice becomes a thing to test on yourself. |
| 10 | **A question, not a verdict** — ends as a mirror | synthesis | Keeps it a mirror, never a guru. |
| 11 | **Footer** — caveats, adherence *without guilt*, "seen, not scored" | `program_day` coverage | Says what it can't see. |

**Gated:** the **five dimensions** (well-being, consciousness, stress, resilience,
relationship) are *not* in the report yet — they need the weekly self-rating step.
When that exists, add a "the five, your own read" element. Don't fake it before then.

---

## Voice
A calm, honest research partner. Warm, never flattering, never clinical, never a
guru. Present tense, spare. It quotes *your* words back sparingly and reflects, it
doesn't diagnose or prescribe. Same register as the rest of the app.

## Guardrails (non-negotiable — this is the whole ethos)
- **Numbers are computed in code, never by the AI.** The arc, counts, intensity
  trend, meditation total, adherence are calculated deterministically and *handed
  to* the model. The AI only narrates and synthesizes — so it can never hallucinate
  a statistic. This is the honesty-preserving architecture.
- **No fabricated patterns.** If a correlation isn't real, it says "not enough data yet."
- **No medical or diagnostic claims.** Ever.
- **Reflections are intimate.** Sent to the model **server-side only**, never
  auto-shared to a paired partner. (Anthropic's API does not train on API data.)
- **Not too much AI.** It appears at reflective moments (weekly / end), never
  interrupts the daily calm.

---

## Generation (how it's built)
A serverless function (`api/report`) with the service key:
1. **Gather** the device's check-ins.
2. **Compute the stats in code** — arc, top feelings, intensity + trend, meditation
   total, adherence, granularity. Deterministic, trustworthy numbers.
3. **Retrieve** the most relevant corpus concepts (keyword/embedding match on the
   reflection themes) for element 8.
4. **Ask Claude** — pass the computed stats + the raw reflections + the corpus
   excerpts, with a strict prompt, to produce *only the narrative* elements
   (through-line, themes, honestly-framed patterns, corpus concept, experiment,
   question). Return structured JSON.
5. **Render** in a dark report view (same language as the insight view).

**Model:** Claude Haiku 4.5 for the light weekly synthesis (fast, cheap); a larger
model (Sonnet 5 / Opus 4.8) for the deep end-of-30 report. Confirm exact model +
params at build.

---

## Open questions for you
1. **Voice** — how warm vs. how spare? (I'll draft two sample paragraphs to pick from.)
2. **Quoting** — how much of your own reflections read back to you? (none / sparing / generous)
3. **Push vs pull** — auto-generate at day 30, or only when you tap "reflect"?
4. **Weekly scope** — is the 4-element weekly right, or lighter/heavier?
