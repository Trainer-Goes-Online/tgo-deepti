# tgo-deepti — session state

**What this is.** Deepti's VSL funnel (nutritionist, 12-week personalised
weight-loss + metabolic-health programme, ₹97 assessment as the next click).
Built 2026-09-03 by the SHAPE agent in VSL mode, three passes.

**Stack.** Next.js 15 App Router + React 19, vanilla CSS (no Tailwind),
`@/*` alias to the project root. Mirrors `/workspace/SDP-New-Funnel`.

**Design.** The locked SDP VSL component system
(`~/.claude/system/design-system.skin.sdp-vsl.md`). PART 1 (the theme) lives in
`app/globals.css`, re-themed 2026-09-07 to **GARNET & GOLD**: cream ground
`#F8F2E8`, garnet authority `#5A1526` with lit garnet `#8C2740`, all dark bands
garnet (`#3A0D19` / `#46121F` / `#56192A`), guarantee band the deepest surface
on the page at `#290911`, gold `#E0A32E` as the only action colour.

Two themes were rejected before it, and the reasons are worth keeping:
FRESH METABOLIC RESET (aqua `#25CED1` + coral) read fitness-app on a page about
fatty liver and blood reports. INK & BONE (bone + warm ink + marigold) fixed
that but read boring, because a near-neutral page has no colour presence.
Indigo + marigold was rejected on sight: near-complementary hues, both
saturated, a 62-point lightness gap, which is the festive-sale recipe.

**The one discipline this palette needs:** gold never grows past button scale on
a light band. A gold-filled section beside a garnet section turns it into a
wedding invitation.

**Type** is the THREE VOICES of `design-system.base.md` C1: **Fraunces** 600
(display serif) + **IBM Plex Mono** (spec: every marker, stat, ordinal, label
and the timer) + **Manrope** (body). The build originally ran two sans and no
mono, which is the base file's first-listed failure mode and the reason it read
cheap. Assignments live in a new **PART 3** at the foot of `app/landing.css`.
Note: `next/font` changes need a dev-server restart to take effect.

PART 2 (`app/landing.css`, component design) stays token-only with zero brand
hexes, so the anatomy is still identical to SDP and only the skin differs.

**Copy source of truth.** `funnel-copy/01-landing-vsl.md`, verbatim from Atul,
mapped to the 13 VSL beats. Beat 9 (Two Choices) cut, as on Kunal.

**Band rhythm as built.** light · light · light · light-alt · **DARK (coach)** ·
light-alt · **DARK (guarantee)** · light · **DARK (finale)**. 7 CTA lockups.

## Outstanding

### Copy (NO-BRAINER)
1. **No mechanism beat** (blueprint 6). The liver / root-cause argument exists
   only as the hero deck sentence. Biggest hole in the page.
2. **The whole proof run has no written copy** — beats 3/4/4b are asset labels
   only. No client names, cities, ages, markers or quotes.
3. **Final CTA has no headline** of its own; the H1 is repeated verbatim.
4. No group labels for the three proof forms.
5. Countdown is absent from beat 11 in the source (present in hero + beat 2);
   confirm whether that is deliberate.
6. No results disclaimer anywhere.

### Client facts received 2026-09-08
Business + legal details are now in `lib/site.ts` as `business` (registered
entity Deepti Sherawat, trading name "Liver First", Sector 21 Noida 201301
U.P., phone, email, jurisdiction Uttar Pradesh). That object is the SINGLE
source for the legal pages, the colophon and the Razorpay account details.
The legal pages themselves are still LAUNCH's half and are not built.

VSL is live: Vimeo `1224198548` in `components/landing/VslFrame.tsx`.
15 video testimonials are live in `components/landing/Proof.tsx` with a new
`TestimonialTile` client component (click to play). Posters still pending, so
each tile shows a labelled placeholder and the disc lights only because the
film behind it is real.

**Open on this batch:**
- Testimonial ASPECT RATIO is assumed 9:16. Could not be checked against Vimeo
  (no network in the build sandbox). One constant, `TESTIMONIAL_RATIO` at the
  top of Proof.tsx, if they turn out to be landscape.
- Trading name says **90 days**; all landing copy says **12-week** (84 days).
  Needs Deepti's call on which is the product, before the legal pages quote it.
- Copy source lists 4 testimonials, 5 case cards, 5 B&A pairs. 15 films landed.
  Case cards and pairs are still placeholders.
- Names title-cased from the client's list ("Rhea,veena,tanshree" became
  "Rhea, Veena & Tanshree"). Confirm the spellings.

### Facts to confirm
- `700+`, `12wk`, `5.0 ★`, `10+ years`, `up to 15 kgs`, `100% Results Guarantee`.
- "Healing your liver" + a 100% results guarantee are strong health claims for a
  nutritionist. Needs Deepti's sign-off before `robots: noindex` comes off
  `app/layout.tsx`.
- Blood-report images carry patient names; placeholders ask for redaction.

### Assets (all placeholders, ratio-locked and labelled)
Vimeo id for the VSL · Deepti's portrait · 4 testimonial films · 5 case-study
cards · 5 before/after + report pairs · 10 WhatsApp screenshots · 3 logos
(Cult Fit, AAFT School of Health & Wellness, Habuild) · trust-row portraits.

### Legal pages + site footer (BUILT 2026-09-08 · REBUILT to the VSL blueprint)
`/privacy`, `/terms`, `/refund` are live, on a shared shell
(`components/legal/LegalPage.tsx`) with their own scoped stylesheet
(`app/legal.css`, `.dp-policy`, token-only so it re-themes with PART 1). Every
fact renders from `business` in `lib/site.ts`; no page hardcodes a name,
address or email. All three are `robots: noindex`.

The first pass was built freehand and did not match SHAPE's VSL policy
surface. It is now the blueprint's anatomy, beat for beat: `PolicyHero`
(pill eyebrow, display title with one accent word, deck, meta chips) → a
240px sticky "On this page" rail beside the body → the accent-bordered
intro callout → anchored, marked, ruled clauses whose list items are
bordered CARDS → the business-details ledger → the dark contact close →
the identity footer. Components in `components/legal/`.

**The site footer is one shared component**, `components/shared/SiteFooter.tsx`,
styled `.dp-foot` in `globals.css` (the only stylesheet loaded on every
route). It carries the registered name, full postal address, phone and
email, which Razorpay's merchant review looks for on the SITE. On the
landing page it renders `folded`: no band, just the hairline and the stack
inside the finale, where the hand-rolled colophon used to be. So the finale
is still the peak and still the last thing on the page.

What they say, and why:
- **Privacy** leads on HEALTH data (blood reports, medication, history), not on
  cookies. That is what the assessment actually collects and what a reader
  cares about. Names the real processors: Razorpay, Meta, GA4, Vimeo.
- **Terms** puts the MEDICAL DISCLAIMER at clause 02, including "do not start,
  stop or change prescribed medication because of anything we tell you". The
  landing copy says "healing your liver" and sells to people managing diabetes,
  thyroid and fatty liver, so this is the clause that matters most.
- **Refund** exists mainly to separate the "100% Results Guarantee" (we keep
  working with you at no extra cost) from a money-back guarantee (we do not
  promise one). A reader conflating those two is the likeliest chargeback.

**3 PENDING clauses block launch.** They render as loud gold callouts rather
than invented prose, so they cannot ship unnoticed. Each one now announces
itself THREE times: a gold register at the top of the page counting them and
linking to each by name, a gold dot on that clause in the sticky rail, and
the gold callout in the clause itself. Grep `pending:`.
1. Is the ₹97 assessment fee refundable, and until when? (Razorpay will not
   approve the account without a stated position.)
2. Programme refund terms: cooling-off window, stopping part-way, and whether
   any part is non-refundable once the personalised plan is delivered.
3. Programme LENGTH and PRICE. Copy says 12 weeks, the registered trading name
   says 90 days, and the refund window is measured against whichever is right.

### LAUNCH's half (still not built)
`/checkout`, `/thank-you`, Razorpay, Meta CAPI, GA4, `.env`.

## Standing rule
Bump `ASSET_V` in `components/shared/asset-version.ts` in the same pass as any
artwork swap, or the new file never reaches a returning visitor.
