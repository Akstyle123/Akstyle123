# Ayush Kathoke — automatic-stats portfolio · V6.8

This is the **HTML/CSS/JavaScript rebuild**, replacing the previous SVG-panel website.

## V6.8 — automatic LeetCode data

`python scripts/update_leetcode.py` now fetches public LeetCode GraphQL data,
validates it, and updates profile.json and a separate last-good leetcode.json.
Calendar activity/streak fields explicitly use the current UTC year. Failures
preserve the last successful values/timestamp and disclose the cache status.

The hero, chart, difficulty totals, topic list, rank/badge pills and coding-activity
caption now use the fetched data. UI provenance distinguishes auto-fetched data
from legacy editorial snapshots. The illustrative heatmap and curated achievement
cards remain illustrations/editorial content, not invented daily submissions.

The new scheduled Pages workflow fetches and rebuilds every six hours, caches
last-good LeetCode stats and deploys the generated page. For a profile repository,
use the dedicated `Ayush-Auto-LeetCode-Deployment.zip` layout: website sources in
`portfolio/`, workflow at `.github/workflows/portfolio-pages.yml`, and Pages
Source **GitHub Actions**. The older docs-only upload instructions do NOT enable
automatic LeetCode fetching. A local live fetch, six Python validation/fallback
tests, YAML parsing and browser checks passed. No repository deployment has
been performed. See the dedicated AUTO-LEETCODE-SETUP.md guide.

## V6.7 — joined Ay and theme-matched greeting

Moved the `y` and following glyphs 42 design units closer to the reference-shaped
capital A, giving Ay a touching cursive connection without changing A's brush
outline or the spacing within the remaining letters. Recomputed canvas bounds
keep the left flourish and descender visible. The full-name draw-before-glow
sequence is unchanged.

The greeting now matches the portfolio rather than the demo's pale plain screen:
dark navy/purple nebula gradients, drifting stars, a subtle orbit, an accent
progress line, larger typography, and 180ms lift/fade transitions between words.
Light mode uses the same pastel space palette as the site. The nine original
languages/emojis and their order are preserved. Skip, automatic reveal, saved
theme, reduced motion and after-greeting audio behavior remain intact.

`tests/theme-greeting.pw.js` verified the complete sequence, dark/light background
colors, all 12 glyphs written before glow, 320/390/768/1440px containment, skip,
reduced motion, restored page interaction and zero JavaScript runtime errors.
Signature and both greeting themes were screenshot-reviewed.

## V6.6 — signature A reconstructed from the supplied image

The prior font-derived A was replaced with a custom vector brush outline based
on the user's 2154×480 reference image. It includes the long looped left
flourish, slanted apex, triangular counter, broad cross stroke, and curved,
tapered right stem. The remaining glyph outlines were left unchanged. Canvas
bounds were recalculated from the actual paths to keep the flourish unclipped.
The source remains editable native canvas/Path2D, not a flattened image.
The draw-all-first then whole-name glow behavior is retained. Browser checks
passed for no early glow, all 12 glyphs finished at glow, zero runtime errors
and horizontal containment at 320/390/768/1440px. A screenshot was reviewed
against the user's reference. All other V6.5 features remain unchanged.

## V6.5 — larger capital A and contact centerpiece

The clearly uppercase Kaushan A is now another 20% larger than V6.4, giving it
an unmistakably taller silhouette than the remaining letters. Spacing and canvas
bounds were recalculated; the draw-all-before-glow sequence remains intact.

The former small contact envelope is replaced by a **full-width, 188px-high
animated centerpiece directly below HIRING? LET’S TALK.** It includes a large
floating envelope, two code/message windows, orbit lanes, traveling packets and
a notification pulse. The contact section was expanded to fit the artwork without
crowding the cards; mobile uses natural flow. Pause/reduced-motion hide moving
packets and stop CSS motion. Desktop screenshots were reviewed; browser checks
passed for 12-glyph completion before glow and 320/390/768/1440px containment.

## V6.4 — unmistakable capital A

Replaced the loop-shaped Mr Dafoe A after the user's visual correction. The
signature now starts with a tall, slanted **Kaushan Script uppercase A**, with a
clearly visible crossbar and distinct capital-letter silhouette. The rest of the
signature is unchanged. Spacing and bounds were recalculated so the enlarged A
and y descender fit without clipping. License: `assets/KAUSHAN-LICENSE.txt`.

The six-second draw-first, whole-name fill, then glow sequence is retained.
Browser checks passed for no early glow, all 12 completed glyphs before glow,
reduced-motion static readability, and 320/390/768/1440px page containment.

## V6.3 — final greeting, signature and contact corrections

The supplied demo's public page/chunk/CSS were inspected on 20 October 2026.
The greeting now uses the exact strings/order (including its original `Olà`):

Hello 👋 → Bonjour 🇫🇷 → Ciao 🇮🇹 → Olà 🇵🇹 → やあ 🇯🇵 → Hallå 🇸🇪 → Guten tag 🇩🇪 → नमस्ते 🇮🇳 → Hello 👋.

Each word changes at 300ms intervals. The final Hello holds until 4.5 seconds,
then the pale `#f2f0f8` screen exits upward with a 0.2s delay and 1s
cubic-bezier(.76,0,.24,1) transition. Extra orbit/caption/progress decorations
were removed from the greeting. Skip/Escape and a short reduced-motion option
remain as accessibility additions. Emoji appearance depends on the device's emoji font.

The original signature's K was identified as **Mr Dafoe**. Its authentic uppercase
A outline now replaces the hand-drawn approximation, at a slightly larger scale;
following letters were spaced and recentered accordingly. The OFL notice for the
converted outline is in `assets/MRDAFOE-LICENSE.txt`. No network font dependency
was introduced. During the six-second writing stage the signature is strokes
only: **no fill or shadow bloom**. Once all twelve glyphs are complete, the whole
name fills, then the glow starts after a brief 0.25s beat. Reduced motion shows
a static, complete signature without animation.

The visible copy following “HIRING? LET’S TALK.” now includes a larger inline SVG
envelope, notification pulse, floating motion and animated signal trails.
Desktop section height was adjusted so cards and availability text do not collide;
mobile retains natural flow and the background grid remains behind the portrait.

`tests/final-polish.pw.js` verified the entire greeting sequence via a browser
MutationObserver, greeting background, full handwriting before glow, contact
illustration presence, 320/390/768/1440px horizontal containment, light theme,
reduced motion and zero JavaScript runtime errors. Desktop/mobile screenshots
were inspected. Previous audio controls remain; **your recording is still not
included**. Add `assets/introduction.mp3` as described below.

## V6.2 — audio-ready introduction

**Your ElevenLabs recording is not included yet.** Put your exported MP3 at
`assets/introduction.mp3`, then open `index.html` with the assets folder beside
it or serve the site. No code changes are needed. Do not rename the folder.

The bottom-right **Meet Ayush** player becomes visible only after the opening
greeting finishes or is skipped. It attempts playback once; browsers that block
autoplay show a **Tap Play** fallback. **Stop** pauses and rewinds, saves the off
preference when browser storage is available, and never loops the recording.
Leaving the tab stops narration; returning requires Play. A missing file shows
“Recording not added yet”; no substitute voice is generated.

For a completely portable HTML **including the recording**, add the MP3 first
and run `python scripts/bundle.py`. The builder now embeds MP3s as well as the
existing local assets. Otherwise keep `assets/introduction.mp3` alongside the HTML.
See `assets/ADD-YOUR-AUDIO.txt` for the quick setup.

Audio checks passed: after-greeting visibility, missing-file messaging, real
browser playback using a test-only silent WAV route, stop/rewind, persisted off
preference, playback completion, blocked-autoplay fallback, zero JavaScript
errors, and four responsive widths. The silent test fixture is NOT shipped.

## V6.1 — greeting and finishing pass

- Opening **Hello → नमस्ते → Namaste → Welcome** sequence, inspired by the supplied demo, followed by an upward curtain exit. Skip button/Escape, automatic dismissal and a short reduced-motion fallback are included; the page is never dependent on completing an intro interaction.
- Hero header divider and contact-floor grid explicitly sit behind the portrait cutouts.
- Role equalizer, animated orbital energy packets/trails, rocket and layered-code header illustrations, contact signal waveform, and a fine-pointer interactive cursor ring/click ripple. The native cursor remains available; touch and reduced-motion users do not get the decorative follower.
- A larger, curved calligraphic capital A. Individual glyphs write without neon bloom; glow starts only once the complete name has been traced.
- Browser checks in `tests/polish.pw.js` cover greeting/skip, layers, decorations, cursor, write-before-glow, four viewport widths, reduced motion and runtime errors. Run with the Playwright CLI `arena` session against the local HTTP preview.

## Whole-page modernization (V6)

V6 preserves the reference layout and native interactions while adding a local **GSAP 3.13.0** orchestration layer (`modern.js` / `modern.css`). No paid service, account, API key or runtime package installation is required.

- Portraits automatically crossfade every **4.8 seconds**; the original controls remain usable. A two-canvas orbital ellipse correctly separates the rear arc from the foreground arc around the cutout.
- Think → Build → Ship automatically advances. Commands type in order, responses follow, the completed transcript holds, then **all lines clear together** and the next sequence starts. Manual tab selection restarts that sequence.
- The three “More than commits” slides advance every **5.5 seconds**, with GSAP slide/fade transitions, a cascading illustrative heatmap and animated community-network packets. Counts retain their editorial-source labels.
- The engine-room orbit has starfield/depth treatments and **never stops on hover**. Native technology dialogs still work.
- Project, milestone, achievement, credential, metric and contact cards receive pointer glows, subtle bubble backgrounds and animated gradient outlines. Project cards add restrained pointer tilt; journey cards/details have GSAP motion. All 16 existing native miniature project animations remain in place.
- GitHub's six-language breakdown now uses **content-driven layout**, rather than overflowing the reference's three-row chart. The original LeetCode layout is retained.
- All certificate types animate, including HackerRank badges, while preserving their source-specific colors, skill artwork, rings and ribbons. New issuers, filters and certificate totals are generated from the JSON data.
- Contact copy shimmers subtly; contact cards glow, and the rotating circular hardware is explicitly behind the portrait.
- The footer starts with a **capital A**, traces **one glyph at a time over six seconds**, fills only completed glyphs and starts its clock only on the first visible visit. All strokes, including the `y` descender, fit within the canvas. It holds, fades and replays on a 12-second cycle.
- A fixed, low-resolution canvas starfield and drifting nebula span the whole page in **both light and dark themes**. Motion pause and reduced-motion keep all text readable and suspend autoplay.

### Editing V6 content

Edit `data/profile.json`, then rebuild with `python scripts/bundle.py`. Open `index.html` (portable, fully bundled) or serve `source.html` for direct source development. **Do not edit generated HTML** as the build overwrites it.

Animation settings are under `animation`:

```json
{"portraitSeconds":4.8,"beyondSeconds":5.5,"terminalHoldSeconds":3.4,"spaceStars":120,"tilt":true}
```

To add a certificate, append an entry to `certifications`. An original reference `asset` is optional; an ordinary skill badge is generated without an SVG file. For example, replace all illustrative values below with your real credential:

```json
{
  "title":"Your actual course or credential",
  "issuer":"Issuing organization",
  "type":"your-issuer",
  "url":"https://your-issuer.example/actual-verification-page",
  "credentialId":"YOUR-REAL-ID",
  "period":"2026",
  "level":"Completed",
  "color":"#22e1ff",
  "icon":"award"
}
```

Use `type: "hr"` for HackerRank or `type: "nptel"` for the NPTEL rosette. For NPTEL entries supply `issuer`, `weeks` and `period` explicitly. Existing original assets retain their audited reference artwork. `icon` can be a Lucide icon name. Certificates remain **editorial data with external issuer links**, not independently verified or automatically fetched credentials. No example/test-only credential is included in the shipped data.

### V6 validation

All six browser suites passed: smoke, motion, fidelity, credentials, display and modern. The V6 suite checks real-time autoplay, ordered terminal responses and simultaneous clearing, continuing hover-orbit movement, correct hero layer ordering, initially partial then complete handwriting, GitHub containment at six widths (320–1440px), both themes, dynamic test-only certificate/filter insertion, pause/reduced-motion, offline behavior and zero runtime errors. Screenshot reviews include desktop/mobile GitHub, certificates, community, contact, signature and the light theme.

```bash
npm install
npx playwright install chromium
npm test
npm run test:motion
npm run test:fidelity
npm run test:credentials
npm run test:display
npm run test:modern
```

The live preview is temporary; **no new deployment was made**. `github-profile/` retains the companion README package. GitHub refreshes use the public API with an honest saved-data fallback; LeetCode statistics and awards are editorial snapshots, not fabricated live feeds.

## Certificate and profile-animation correction (v5)

This pass compared the certificate artwork's actual geometry, colors, icon paths and animation definitions rather than treating ten generic cards as complete.

- Rebuilt the NPTEL rosettes with the original star-shaped outline, two separately shaped ribbons, gold inner/outer rings and **missing Verified pills**. Java is blue; DBMS is cyan. Both use their original small skill icon paths and original title sizes.
- Corrected every HackerRank accent from the source: both Problem Solving cards green, all SQL cards cyan, Python blue, JavaScript gold and CSS purple. Restored actual Python/JS/CSS brand icons instead of generic code/braces/palette substitutes and the actual issuer symbol.
- Restored source-relative card placement, condensed display title weight, issuer/date text, difficulty pill/dots, credential IDs, separators and Verify arrows. ResizeObserver scales native elements coherently with each card, including mobile.
- Restored **reverse 24s skill rings, 36s gold NPTEL rings, 6s clipped badge shines, 24s NPTEL background drift and 2.8s Verify-arrow nudges**. No full-card SVG is embedded.
- Replaced the thin unmasked portrait scan line with the original-style **9s gradient scan band masked to the selected transparent portrait**. The mask updates when portrait controls change the photo. Restored the **7s / 8px portrait float** and a moving **9s orbit light with 1.8s ripple**.
- Corrected the signature from a horizontal outline wipe to measured path-dash tracing with staggered letters and the source's neon ink fill/fade phases, drawn on canvas.
- Added `tests/credentials.cjs`: all ten colors/icons, two Verified pills/four ribbons/ten shines, source timing, every real issuer URL and ID, actual ring/orbit movement, photo-mask switching, pause/reduced-motion and responsive overflow. All five test suites passed.

`credentials.css` is the focused source-audited correction layer. Original small icon paths are stored in `website/visual-data.js`; the page, cards and interactions remain native HTML/CSS/JavaScript. The source's Verified label is preserved as artwork; issuer verification still occurs at the linked external platform, not independently inside this app.

## Display and opening correction (v4)

- The default **`index.html` is now self-contained**, just like `standalone.html`: no missing JSON, fonts, pictures or JS when the complete HTML is opened directly. The editable multi-file entry has moved to `source.html`.
- Native sections render visibly even if an embedded viewer does not deliver IntersectionObserver callbacks. Scroll entrance motion enhances already-visible content; it can no longer keep a section blank.
- The existing all-section, all-project, three-state About, card geometry, external button rows and interaction corrections from v3 are retained.
- A live HTTP preview is available in the active conversation; it is a temporary preview, not a GitHub/Vercel deployment.

## Whole-page fidelity correction (v3)

This pass compared the original sections and all 16 original project cards, not only the hero.

- Replaced **every** generic project thumbnail with its own native DOM composition: compiler/output, collaboration/chat, content generator, document-to-quiz pipeline, miniature portfolio, connected community, QR phone, TaskFlow, reminder/calendar, AI orb, Swing ATM, rental CRM, game, calculator, neural notebook and browser to-do list.
- Restored the original project header labels, description line breaks, desktop font sizes and card proportions. The six featured cards are 588×392 and ten compact cards are 588×239.12 at the original 1200px section width.
- Rebuilt all three About slides with the **same persistent portrait and handle**, the 84-cell illustration, draft/publish state and six-node community state. Restored terminal idle prompt and source geometry.
- Corrected the source panel heights, stack chip widths/row wrapping, stats column placement, ID-card proportions, badge layout, certificate proportions and original banner wording.
- Restored **six standalone coding-profile buttons**, **seven standalone contact/social buttons**, their brand paths, arrow/shimmer animation and the separate back-to-top control. The view-count badge opens the original public counter instead of inventing a count or silently tracking visitors.
- Restored six journey icons and source-sized milestone cards, connectors, colored edges and footer text.
- Fixed a discovered accessibility bug: pausing animations can no longer hide offscreen sections or freeze rolling metrics at zero. Paused terminal replies and hero text remain readable.
- Added `tests/fidelity.cjs` covering the entire section/card geometry and missing-component regression cases. All three test suites passed.

The website is still **native HTML/CSS/JavaScript**, not full-panel SVGs. Search, filtering, dialogs, theme controls, chart interactions and local mini demos remain available. Browser font rendering and responsive reflow differ from GitHub's SVG renderer; this is not a claim of pixel identity.

### GitHub-compatible README is also included

`github-profile/` contains the actual profile README, original artwork and a separate daily public-data workflow. This is distinct from this website's project documentation. Follow `github-profile/SETUP.md` to install it without confusing the two workflows. Full SVG artwork is used **only for the GitHub README**, whose renderer cannot run the interactive website. The website never loads that folder.

## Visual and animation restoration (v2)

The updated build restores details missing from the earlier native version:

- **Correct Saira Condensed typography**, rather than the earlier Barlow substitute.
- Source-style glitch name layers, typing, scan cycle, pulsing availability, star twinkles, moving perspective grid, floating photo and animated border sweeps.
- Original **two-column compact additional-project layout**, syntax bars, compiler output/AI assist, collaboration cursors, content-generation lines and PDF-to-quiz pipeline.
- **16 moving, clickable brand-logo orbit nodes** across three elliptical paths; hovering the orbit freezes it for easier selection.
- Automatic Beyond-the-Code slides, progress indicators and terminal typing/replies. Automatic slides pause after user interaction and while hovered/focused.
- Alternating upper/lower milestone cards, colored connectors and route animation. Click a milestone to expand its detail panel.
- Lanyard, metal clasp, swaying ID pass, chip, barcode, rotating status, rolling digit counters and animated bar fills. Counter motion replays on first dashboard entry.
- Achievement hexagons, dotted badge rings, native NPTEL ribbon seals, HackerRank skill/difficulty cards and rotating certificate verification ring.
- Original contact portrait, orbit and perspective floor; the handwritten signature recreated with **canvas**, the source quote and animated footer waves.
- A pause/resume control next to the navigation and OS reduced-motion support.

The reconstruction remains native and interactive. The original SVGs are **not** embedded as full panels. Small brand icons reuse paths from your original artwork; signature geometry is drawn on canvas. Extra search/filter/dialog controls and responsive mobile reflow are deliberate website additions, so this is not claimed to be pixel-identical to GitHub’s SVG rendering.

## Native implementation

The original profile’s visual language is recreated with real browser components: navy panels, neon blue/purple gradients, large condensed typography, terminal, orbit diagram, project previews, ID pass, charts, badges, certificates and contact cards. Text is selectable; buttons, inputs and dialogs are real elements. It is a native reconstruction of the design, not a pixel-perfect SVG replica.

**No full section, card, dashboard, heading or panel is an SVG image.** The website only uses small Lucide/brand SVG icons, not SVG panels. Photos are ordinary transparent WebP images, charts use canvas, and the generated QR code is a small raster image.

## Open it now

**`standalone.html`** is the complete portable website. Double-click it or open it in a browser. CSS, JavaScript libraries, photos, fonts, profile data and a real public GitHub snapshot are embedded. No installation is needed. Without network access, all local interactions work and the saved GitHub snapshot stays visible.

For editing the multi-file source:

```bash
python -m http.server 3000 --bind 0.0.0.0
```

Open http://localhost:3000. Both `index.html` and `standalone.html` now contain the complete bundled website and also work directly under `file://`. Edit `source.html` plus the CSS/JS source files, then run `python scripts/bundle.py` to regenerate both entry files. Only `source.html` needs a server for its separate JSON/assets.

## Working interactions

| Area | Actual functionality |
|---|---|
| Hero | Rotating role text (also clickable), three portrait choices, education dialog, section links |
| Navigation | Native anchor navigation, active section indicator, light/dark theme, Ctrl/Cmd+K command menu |
| About | Think/Build/Ship terminal tabs; expandable capability descriptions; DSA/Writing/Community tabs with actual destinations |
| Tech stack | Search, orbit-node buttons, technology details, documentation links, matching project links |
| Projects | All 16 original curated projects; text/tag search; category filters; sorting within featured/additional groups; detail dialogs; source and live links; GitHub metadata when a matching public repo exists |
| QR mini demo | Generates a real QR code locally from text/URL, using qrcode-generator |
| TaskFlow / To-do mini demos | Real local task creation, completion and deletion, persisted in this browser when localStorage is available |
| Tic-tac-toe mini demo | Playable local two-player game, winner/draw detection, restart |
| Calculator mini demo | Working arithmetic with parentheses and operator precedence; parsed without `eval` |
| Journey | Select any of six milestones to view its details |
| Dashboard | LeetCode/GitHub source tabs; real Chart.js doughnut tooltips and clickable segments; accessible breakdown buttons; topic/repository search; manual GitHub refresh |
| Achievements | Detail dialogs with source qualification and platform links |
| Certifications | All 10 certificates; issuer filters; details; original verification URLs; copy verification link |
| Contact | Email link and copying with fallback; LinkedIn, portfolio, X, résumé, Instagram, Hashnode and GitHub links |
| Accessibility | Native dialogs + Escape/backdrop close, keyboard-focus styles, tab arrow navigation, skip link, reduced-motion support and responsive reflow |

The local project mini demos are clearly labeled. They are **not the full original applications**: the QR mini demo does not scan a camera; the task demo does not schedule alarms, create accounts or sync to a backend. Links to the actual projects remain available. Code previews are illustrative and do not execute arbitrary code. The colored About grid is explicitly illustrative, not a fabricated daily contribution heatmap.

## What is live vs editorial?

### Live public GitHub data

The browser fetches the public user record and all pages of public owner repositories. It updates repository counts, followers, owned non-fork star totals, matching curated project metadata, primary-language chart and repository links. The browser has no API token. A 15-minute cache, saved snapshot, 12-second request timeout and manual-refresh cooldown avoid unnecessary requests. API errors show a truthful snapshot status instead of pretending to be live.

Stars and forks are summed across non-fork repositories; language percentages count primary languages per non-fork repo, **not code bytes, coding time or proficiency**. Private repositories/contributions are not accessed. A curated project absent from the current public API results keeps its original link and description without invented statistics. Newly created GitHub repositories appear in the dashboard’s latest repository list; the 16 showcase cards remain deliberately curated.

### Source snapshots / manually maintained

LeetCode’s 821 solved / 363 active days / 232 streak, topic counts, awards, certifications, journey, education, skills and personal descriptions come from the original profile. They are explicitly marked as source snapshots (2026-10-18 where applicable), **not independently live-fetched or verified**. GitHub cannot infer these. Certificate buttons open the original issuer’s verification pages. External project/resume/verification URLs may change availability independently of this website.

## Edit your content

- `data/profile.json`: skills, curated projects, descriptions, tags, source/demo links, journey, certificates and the dated LeetCode snapshot.
- `data/github.json`: generated public API snapshot. Do not manually invent values here.
- `source.html`: editable native page layout, static name/headlines and contact markup. `index.html` is generated and self-contained.
- `app.js`: interaction logic, technology documentation mapping, role labels, original achievement claims and local mini-demo behavior.
- `styles.css`: base component styling and responsive layouts.
- `fidelity.css`: source-style layouts, exact font choices, ornaments, animation keyframes and comparison fixes.
- `motion.js`: in-view effects, orbit movement, counters, automatic slides, signature/wave canvases, pause handling and responsive title fitting.
- `website/visual-data.js`: local brand-icon paths and original signature geometry; no full-panel SVG markup.
- `assets/*.webp`: transparent photos extracted from the original profile artwork.

This package is personalized for Ayush. Some personal labels/contact destinations are intentionally in HTML and JS; they are not all controlled by a single config key. Update those as well if changing identity or contact details. Do not put secrets or sensitive personal data in public JSON files.

After editing, rebuild the portable file:

```bash
python scripts/bundle.py
```

Refresh the public GitHub snapshot, then rebuild:

```bash
python scripts/update_github.py
python scripts/bundle.py
```

Python 3.9+; standard library only. No pip packages. An optional `GITHUB_TOKEN` environment variable can increase the generator’s API quota; it is never saved in generated files. The workflow automatically uses GitHub’s built-in token—you do not need to create a personal access token. Never place a token in browser JavaScript, HTML or JSON.

## Free deployment with GitHub Pages

Recommended: use a separate public repository such as `ayush-interactive-portfolio`, so you do not overwrite your GitHub profile README.

1. Upload this folder’s **contents**, including hidden `.github`.
2. Use the `main` branch (or change the workflow branch).
3. Set **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Run **Actions → Refresh and deploy interactive portfolio**.
5. Open the URL reported by the deploy job. With the suggested repo name, it should be `https://ayushkathoke.github.io/ayush-interactive-portfolio/`.

The workflow refreshes the public GitHub snapshot, bundles the native site and deploys it daily. It does not overwrite the original README or automatically update LeetCode/certifications. Schedule timing is best-effort; GitHub can delay scheduled workflows or disable them after inactivity. If an API refresh fails, the previously deployed website remains available.

No paid backend, database, API, font subscription, CDN or custom domain is required. Public-repository Actions and Pages are subject to GitHub’s current free usage policies and limits; this is not a guarantee of perpetual free hosting or uptime. Browser API requests are typically limited to 60 unauthenticated requests/hour per IP, so shared networks can hit the limit. Snapshot fallback is included.

**Nothing has been pushed or deployed to your account.** The supplied workflow runs only after you publish/configure it.

## Libraries / fonts

All are pinned and bundled locally, not loaded from CDNs at runtime:

- GSAP 3.13.0 — locally bundled motion library; free for this portfolio use under the [GSAP Standard License](https://gsap.com/standard-license/), not an MIT/open-source library. The vendor header retains its license link.
- Chart.js 4.4.7 — interactive canvas charts, MIT.
- Lucide 0.468.0 — small interface icons, ISC.
- qrcode-generator 1.4.4 — real browser-local QR generation, MIT.
- Saira Condensed (800/700) and JetBrains Mono — locally bundled fonts, SIL Open Font License. The earlier Barlow license notice is retained for provenance; its font is no longer used.

License notices are included under `website/` and `assets/`. No React/Vite build is required; the native implementation keeps installation and hosting simple.

## Optional browser smoke tests

Runtime requires no npm installation. Only automated browser testing uses Playwright:

```bash
npm install
npx playwright install chromium
npm test
npm run test:motion
```

On Linux, missing browser system libraries may require `npx playwright install --with-deps chromium` with appropriate permissions.

Tests cover component counts, real DOM panels, tabs, search/filter, technology dialog, QR generation, calculator, game winner detection, task CRUD, chart tabs, certificate links, command navigation, offline fallback and viewport overflow from 320 to 1440 pixels.

## Files

```
standalone.html              portable website, ready to open or host
index.html                   generated portable default entry
source.html                  editable native layout
styles.css                   base CSS
fidelity.css                 restored source layouts and animation keyframes
reference.css / reference.js native source-geometry and 16-thumbnail correction layer
motion.js                    native DOM/canvas animation controller
modern.js / modern.css       V6 GSAP autoplay, cosmic backdrop and card enhancements
app.js                       state, API, dialogs, charts, filters, mini demos
data/profile.json            editorial profile and original curated showcase
data/github.json             real public GitHub snapshot
assets/                      photos, fonts and font licenses
website/                     pinned libraries and licenses
scripts/update_github.py     public API snapshot generator
scripts/bundle.py            creates index.html and standalone.html
tests/smoke.cjs               deterministic Playwright interaction checks
tests/motion.cjs              animation, pause and reduced-motion checks
.github/workflows/pages.yml  free scheduled refresh/deployment
package.json                 optional convenience commands/browser tests
```
