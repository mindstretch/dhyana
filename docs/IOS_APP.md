# Getting Dhyana onto iPhone (PWA now → App Store later)

Two paths, both set up. Start with the PWA; do the App Store when it's stable and
you actually want reach.

---

## 1 · PWA — on your phone today (no App Store, no review, $0)

Already live. On your iPhone:

1. Open **dhyanaflow.com/app.html** in **Safari** (must be Safari, not Chrome).
2. Tap the **Share** button → **Add to Home Screen**.
3. It installs as **Dhyana** — full-screen, dark, its own icon (the orb). No Safari chrome.

This is the real web app wrapped as a home-screen app. Push works on iOS 16.4+.
Same for your wife — send her the link. Good enough for a personal tool and for
first testers.

**Limits:** not discoverable in the App Store; still the web app under the hood.

---

## 2 · App Store — via Capacitor (the real store path)

Capacitor wraps the *existing* web app in a native iOS shell and lets you add
native value. Config is committed (`capacitor.config.json`); the web bundle is
assembled by `native/build.mjs`. Everything below runs **on your Mac**.

### Prerequisites (one-time)
- **Apple Developer Program** — $99/yr (developer.apple.com/programs)
- **Mac + Xcode** (App Store) + Xcode Command Line Tools
- **CocoaPods** — `sudo gem install cocoapods`
- Node (already have it)

### Build steps
```bash
# from the repo root
npm install @capacitor/core @capacitor/cli @capacitor/ios

node native/build.mjs          # assembles native/www (app + absolute API origin)
npx cap add ios                # generates the ios/ Xcode project (first time only)
npx cap sync ios               # copies web bundle + native deps into the project
npx cap open ios               # opens Xcode
```

### In Xcode
- **Signing & Capabilities** → select your Team (needs the paid account). Bundle ID: `com.mindstretchlabs.dhyana`.
- **App icon** → drag `public/icon-1024.png` into the asset catalog (Apple needs the 1024 version).
- **Display name** → Dhyana.
- Build to a simulator or your own device to test.

### Clear Apple's "minimum functionality" bar (Guideline 4.2)
A bare web wrapper gets **rejected**. Add real native value — pick one or two:
- `@capacitor/haptics` — a soft tap when the orb resolves / on save (easy, on-brand).
- `@capacitor/push-notifications` — the evening check-in nudge (native, and useful).
- **HealthKit** (community plugin) — the wearable/Health integration from the vision. Highest value, most work; do it when ready.

### Before submission
- **Privacy policy** (required) — you store reflections. Host a page, link it in App Store Connect.
- **App Privacy "nutrition label"** — while anonymous (device id only), data is *"not linked to you."* If you add magic-link accounts, you **must** also add in-app **account deletion** (Guideline 5.1.1(v)).
- **Health claims** — none. Your honesty discipline (evidence tags, no medical claims) is what keeps you clear of the health-app scrutiny.
- **Screenshots** — required per device size; generate from the simulator.
- **Name** — confirm "Dhyana" is free in App Store Connect before committing to it.
- Submit for review (~1–3 days).

### Keeping it updated
The native app loads the bundled web app, which calls the live API at
`dhyanaflow.com`. For UI changes: `node native/build.mjs && npx cap sync ios`, then
re-submit. For content/logic behind the API, no resubmit needed.

---

## Honest recommendation
Ship the PWA now (path 1) — it's a real app on your and your wife's phones tonight.
Do the App Store (path 2) once the experience is stable and you want strangers to
find it. The App Store adds cost, review, and maintenance; it's worth it only when
distribution is the goal — not while this is still a personal tool you're shaping.
