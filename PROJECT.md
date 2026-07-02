# Dhyana — Project Context

## What it is
Mobile-first web app that reads nervous system state and recommends protocols (breathwork, meditation, movement, recovery). Core interaction: spatial orb check-in → Nervous System Score → protocol recommendation.

## Status
Waitlist live at dhyanaflow.com (`/` = index.html). Working product prototype at
`/app.html`: check-in → protocol screen (all 5 states) → reflection, with
anonymous persistence. Built for first user experiments; not yet promoted to `/`.

## Stack
Next.js + Vercel, Supabase, Resend, HTML/CSS/JS

## Key files
- `public/index.html` — waitlist landing (orb check-in teaser; resolves 5 states)
- `public/app.html` — working product: check-in → protocol screen → reflection + persistence
- `api/subscribe.js` — waitlist API
- `api/checkin.js` — check-in persistence (save / attach-reflection / list)
- `public/528hz.mp3` — ambient audio
- Supabase tables: `waitlist`, `checkins` (device_id, state, reflection, created_at)
- `knowledge/` — the content layer that powers the protocol screen (see its README)
- `BRAND.md` — visual system + voice + Gen Z audience (derived from the live site)

## Content model (how the protocol screen will work)
Check-in state → capacity → surfaced concept / experiment / reflection.
Knowledge is organized by human capacity, generalized away from TM/MVS-specific
terms (`knowledge/generalization.md`). First capacity decomposed: Restoration
(`knowledge/capstone-restoration.md`), which serves the depleted / activated /
dysregulated states.

## Credentials
See `/Users/tp/projects/dhyana/.env.local`

## Domains & Services
- Domain: dhyanaflow.com (GoDaddy)
- Email: hello@dhyanaflow.com (Google Workspace + Resend verified)
- Supabase: https://qixkfdcvxyqqcyrloksg.supabase.co
- Deployed: Vercel (auto-deploy from main)

## Open
- Reflections persist but no history/insight view yet (only "welcome back" line)
- No cross-device identity (anonymous device id only; magic-link "save history" later)
- Not instrumented — no analytics on loop drop-off yet
- Promote `/app.html` → `/` once it earns it
- Branding/logo — not done
- Name change under consideration: Spanda, Ritam, Sattva, Turiya
- Zashi owns design — briefs in workspace-design/projects/dhyana/
