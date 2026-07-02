# DhyanaFlow — Brand & Design Foundation

> Read before any UI or copy work. Derived from dhyanaflow.com and calibrated for
> a Gen Z audience. Governs every visual and voice decision.

## The target feeling

A calm, dark, spacious room at night — not a clinical wellness app, not a
guru's temple. The product is a **mirror, not a coach**. It helps you locate
yourself and know your own patterns. It never lectures, never hustles, never
performs enlightenment. Confidence through restraint.

Closest references: **Oura** (dark, data-as-calm, trustworthy), **Linear**
(density without clutter, nothing decorative), **Headspace's antithesis** (we are
not cartoons and streaks).

---

## Visual system

### Color

Dark-first. The background is near-black navy; color appears only to signal a
*state*, never as decoration.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0E1219` | base background (deep navy-black) |
| `--bg-raised` | `#131B26` | raised surfaces, cards |
| `--restful` | `#E8A855` | Restful Alertness — the hero/gold state |
| `--regulated` | `#6FA89A` | Regulated — sage |
| `--activated` | `#C96B5A` | Activated — terracotta |
| `--depleted` | `#5A6E8A` | Depleted — slate |
| `--dysreg` | `#7A6880` | Dysregulated — mauve |

Text is white at **opacity**, never a second color:
`0.9` primary · `0.72` secondary · `0.55` tertiary · `0.36` faint · `0.28` ghost.

State glows are low-alpha halos of the state color (`~0.14–0.18`), never hard fills.

### Typography

Two families, loaded from Google Fonts — nothing else.

- **DM Serif Display** — headlines and the one emotional line per screen.
  Italic is available and used sparingly for warmth. This is the *voice*.
- **DM Sans** (weights **300** and **400** only) — everything else. Labels are
  often lowercase.

### Space & motion

- Generous negative space. One idea per screen. The check-in *is* the screen.
- Motion is slow, breathing, organic — fades and soft drifts, never bounces or
  snappy spring. Nothing should feel gamified.
- State words are lowercase (`energized`, `depleted`). Lowercase = unforced, present.

---

## Voice

Present tense. Second person. Spare. The site's actual lines set the register:

> "Where are you right now?" · "touch to place yourself" ·
> "Dhyana would know exactly what to do next." · "We'll find you when it's ready."

### Do
- Ask, don't tell. "Where are you right now?" not "Check in daily!"
- Name states plainly and without judgment. Depleted is not failure.
- Short. One real sentence beats three soft ones.
- Let the user have agency — *they* place themselves, *they* run the experiment.

### Don't
- No toxic positivity ("You've got this! ✨"), no exclamation-point energy.
- No guru voice, no Sanskrit as decoration, no "ancient wisdom" mysticism.
- No streaks, badges, confetti, or shame mechanics.
- No therapy-speak as marketing gloss — use it only where it's accurate.

---

## Audience: Gen Z

Who we're building for, and what it demands. This is not decoration — it changes
product decisions.

**They already speak the language.** *Regulated, dysregulated, nervous system,
activated, burnout* are native Gen Z vocabulary. This brand is pre-tuned to it.
Lean in — but only where the term is *accurate*, never as flavor.

**They trust authenticity and distrust authority.** Gurus, institutions, "experts
know best," and anything that smells like being sold to → instant bounce. This is
the single biggest reason the [generalization layer](knowledge/generalization.md)
matters: **"Maharishi Vedic Science" and "Transcendental Meditation™" are exactly
the framing this audience rejects.** "Understand your own nervous system" and "run
your own experiment" are exactly what it embraces. Generalization is audience fit,
not just legal cover.

**They want agency, not prescription.** The product's whole stance — you locate
yourself, you form the hypothesis, you read your own evidence — aligns perfectly.
Don't break it by suddenly telling them what to do.

**They are science-curious but anti-clinical.** Cite evidence honestly (our
strength tags), but never sound like a lab report. Warm precision.

**They are allergic to fake.** The honesty stance (admitting when evidence is thin,
tagging `personal` vs `strong`) reads to Gen Z as *trustworthy*, not as weakness.
Our biggest differentiator is that we don't bullshit them.

---

## Where brand meets knowledge

The app's five states are an **affect model** (arousal × valence). The knowledge
base is organized by **capacities** (Restoration, Attention, …). They connect:

- A check-in state → the relevant capacity. *Depleted / Activated* → **Restoration**.
- "Restful Alertness" (the gold state) is literally capacity concept **C6**.
- The "Dhyana would know what to do next" promise is fulfilled by surfacing a
  concept, a reflection prompt, or an **n=1 experiment** from that capacity —
  not generic advice.

This is the product thesis in one line: **you place yourself, and the knowledge
meets you where you are.**

---

## Anti-patterns — never

- Light mode as default. This brand lives in the dark.
- A third font, or DM Sans in weights other than 300/400.
- Color used decoratively instead of to signal state.
- Streaks, badges, push-notification guilt, "you missed a day."
- Guru imagery, lotus clip-art, Sanskrit-as-vibe, incense mysticism.
- Overclaiming evidence to sound impressive. Honesty is the brand.
