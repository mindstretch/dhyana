# Dhyana — Project Context

## What it is
Mobile-first web app that reads nervous system state and recommends protocols (breathwork, meditation, movement, recovery). Core interaction: spatial orb check-in → Nervous System Score → protocol recommendation.

## Status
Waitlist live at dhyanaflow.com. Pre-product — protocol screen not built yet.

## Stack
Next.js + Vercel, Supabase, Resend, HTML/CSS/JS

## Key files
- `public/index.html` — main app (orb check-in; resolves 5 states, lines ~681–688)
- `src/app/api/subscribe/` — waitlist API
- `public/528hz.mp3` — ambient audio
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
- Protocol screen — not built
- Branding/logo — not done
- Name change under consideration: Spanda, Ritam, Sattva, Turiya
- Zashi owns design — briefs in workspace-design/projects/dhyana/
