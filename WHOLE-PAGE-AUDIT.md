# V6 whole-page modernization — verified 20 October 2026

The historical source-geometry audits below remain applicable; V6 intentionally enhances the native rebuild rather than replacing it with an unrelated design or full-panel images.

| User request | V6 implementation / verification |
| --- | --- |
| Banner autoplay + depth | Real 4.8s portrait timer; manual controls retained; rear canvas z1 → cutout z2 → front canvas z3. |
| Modern nav | Seven small native icons, gradient sweeps, hover lift/glow and active state. |
| Terminal + Think/Build/Ship | GSAP command/response sequencing; completed hold; all-line fade; automatic next tab; manual reset. |
| Beyond/about | All three states autoplay at 5.5s; slide transitions; 84-cell illustrative heatmap; six animated community packets. |
| Engine room | Native orbit keeps moving with cursor over it; additional space/ring depth, pill borders and hover glows. |
| Projects | All 16 source-specific native previews preserved; gradient borders, bubbles, pointer glows and restrained tilt. |
| Journey | Native source-positioned six-card journey retained; GSAP card reveals and selected-detail transitions; active glow. |
| Public dashboard | Six-language layout uses flow; tested language containment, no topics overlap and contained footnote at 320/390/768/1000/1280/1440px. |
| Awards and certificates | Shared aura borders/bubbles; all badge types animate; existing NPTEL/HackerRank source artwork preserved. |
| Editable credentials | JSON-only custom credential/issuer/filter/color/icon verified in browser; header counts recalculate. No test credential shipped. |
| Connect | Actual visible contact lead animated; social cards glow; circular hardware centered and layered behind photo. |
| Footer | Capital A; first-visible blank/partial → sequential 12 glyphs → completed fill; descender fits; no full-name flash. |
| Whole-site space / themes | Local star canvas + CSS nebula; light and dark; all local assets embedded; pause/reduced-motion honored. |

**Final validation:** six Playwright suites passed, zero runtime errors; standalone/offline and live HTTP checks passed. Screenshots reviewed for hero, light theme, community, certificates, contact, desktop/mobile dashboard and footer handwriting. No deployment or external account changes were made.

---

# Whole-page correction audit — v3

Reference: original `Ayushkathoke/Ayushkathoke` profile artwork and README, imported 19 October 2026. Source dimensions refer to a 1200px-wide section; desktop browser checks use a 1280px viewport and the site's 1200px content width.

| Area | Correction / validation |
| --- | --- |
| Hero | 660px panel; source fonts, portrait, role/glitch/scan/orbit/grid animation retained; paused text stays readable. |
| About | Two 700px panels; original terminal geometry/idle prompt; all 3 slides retain photo and handle; 84-cell illustrative heatmap, article/publish and community-network graphics. |
| Stack | 700px panel; original per-brand pill widths and row gaps; corrected content origin and orbit center; 16 moving, clickable logos retained. |
| Project banners | Both 176px; original wording and public-repository caption. |
| Six featured projects | Each original preview rebuilt in native DOM; source-specific headers/description breaks; 588×392 desktop cards. |
| Ten additional projects | Ten distinct native device/browser illustrations; source-specific headers/description breaks; 588×239.12 desktop cards. |
| Journey | 660px source panel; six source-positioned milestone cards, six icons, connectors, colored edges and footer. Details still expand on selection. |
| Dashboard | 830px panel; corrected right column, chart/topic/GitHub frame positions, lanyard/clasp/card, status and caption. Frozen metrics show their final values, not zeros. |
| Achievements | 580px panel; 4×2 original-sized badge grid; coding links moved outside the panel. |
| Coding profiles | All 6 separate brand-icon buttons restored; original destinations retained. |
| Certifications | 196px header; 2 wide source-proportioned NPTEL cards and 8 skill cards; all verification links retained. |
| Contact | 640px source panel; four contact rows plus copy-email; all 7 external button-row destinations restored, including résumé/socials. |
| Footer | 330px panel; canvas signature, source quote, wave and separate top control retained. Public counter is an opt-in link, never a made-up count. |

## Executed automated checks

- `node tests/smoke.cjs`: native panels, all 16 projects/10 certificates, tabs, filters/search, dialogs, QR, calculator, game, task CRUD, charts, certificate links, keyboard navigation, offline fallback and horizontal overflow at seven widths — passed.
- `node tests/motion.cjs`: 16 orbit logos move, pause/resume, preview structures, certificate ornaments, signature, reduced-motion behavior and mobile overflow — passed.
- `node tests/fidelity.cjs`: full desktop section/card dimensions, persistent portrait in 3 states, 84 heatmap cells, six journey icons, six coding/seven contact buttons, noncollapsed AI preview, readable paused sections and final paused counters, animated miniature and absence of full-panel SVGs — passed.

Screenshots of the rendered hero, About states, stack, all project cards, journey, dashboard, achievements, certificate cards, contact/button rows and footer were reviewed during the correction. These checks do not assert identical pixels or identical browser/SVG animation frames. Website-specific search, dialogs, theme controls and mobile reflow are deliberate additions.

## Data honesty

Public GitHub data is fetched/cached with an offline snapshot. LeetCode/awards/certifications are source snapshots/editorial content, not independently live-fetched or verified. Nothing was published to GitHub or another hosting account from this workspace. Included workflows run only after installation and activation in the user's repositories.

## V4 — display/opening verification

- Default `index.html` is now generated as the same self-contained document as `standalone.html`. The multi-file editable template is `source.html`.
- Scroll entrance animations enhance visible content; missing iframe/viewport observer callbacks cannot hide whole sections.
- `node tests/display.cjs` passed: an isolated `index.html`, with no sibling files and networking disabled, renders 16 projects, 10 certificates and all four portraits; every panel stays visible with a deliberately inactive observer; About states remain functional.
- The HTTP entry was also tested at 390px: no horizontal overflow or runtime errors.
- Live preview on port 3002 returned HTTP 200; browser verification found all 16 project cards and 10 certificates with zero runtime errors.
- Existing smoke, motion and fidelity suites were rerun and passed. These checks validate rendering, component presence, geometry and tested interactions, not identical pixels against every source animation frame.

## V5 — certificate and profile-motion comparison

Source inspection found mismatches not detected by component-count tests: level-derived certificate colors, substituted skill/issuer icons, missing NPTEL Verified pills/rosette edges, incorrect ring/shine timing and a thin unmasked scan line. These were corrected directly from the source SVG metadata and small icon paths, using native DOM/CSS/canvas for full components.

All ten certificate credential IDs and issuer URLs passed click-through destination tests. Native card placement, difficulty indicators and borders scale from source card coordinate systems (600×300 NPTEL; 260×310 HackerRank). Gold rings actually rotate over 36 seconds; skill rings rotate in reverse over 24 seconds; clipped badge shines run on a 6-second cycle. Portrait mask follows photo selection; a 9-second band scans only the portrait silhouette, the 7-second float and 9-second orbit traveler move, and pause/reduced-motion tests passed. Signature now uses measured path tracing and filled neon ink instead of a rectangle wipe.

Five suites passed: smoke, motion, fidelity, display and credentials. Browser screenshots of desktop and mobile certificate sections were reviewed. This is a targeted reference correction, not a claim of complete pixel identity in every animation frame.
