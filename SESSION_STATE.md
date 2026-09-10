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

### Proof beat (beats 3/4) as it now stands
**Changed 2026-09-09 (Atul): case-study cards removed, blood-report half
removed, before/after pairs replaced by a plain scrolling rail.**

Two groups, both real assets, no placeholders left in the beat:
- **A · 15 video testimonials.** Vimeo players mounted directly, lazy.
- **B · 32 before and afters** from `/public/before-after`, a fixed-height
  rail (380px desktop) with NATURAL WIDTHS and no crop.

Why no crop: they arrive at every ratio from 0.66 to 2.91 and most carry the
client's own words burned into the image, so `object-fit:cover` would slice
the testimony off the bottom of a proof beat. Fixed height, ragged widths, and
that raggedness is correct: it reads as real photographs rather than a designed
grid. CSS is PART 3e of `app/landing.css`.

Filenames are the client's own exports; 24 of 32 contain spaces or brackets, so
each is `encodeURIComponent`'d at render rather than renamed, which keeps the
link back to whatever the client holds on their side.

**Dropping the reports also dropped a launch blocker**: those images carried
patient names and needed redaction before they could ship.

PART 2's `.sdp-case-*` and `.sdp-pair-*` rules are left in place. They style
nothing now and break nothing, and PART 2 is the shared SDP anatomy rather than
this build's to edit.

`ASSET_V` bumped to 3 in the same pass.

### Images: WebP, done 2026-09-09
**27.2MB became 6.2MB (77% smaller).** Every image the site serves is WebP.

| set | was | now | encoded at |
|---|---|---|---|
| 104 chat screenshots | 13.2MB | 4.8MB | 460px wide, q78 |
| 32 before/afters | 14.0MB | 1.3MB | 900px tall, q82 |

Sizes are set by how the images are actually DRAWN, not guessed: the wins-wall
tiles are 208px across and the /book-a-call proof tiles 176px, so 460px clears
2x retina; the before/after rail is 380px tall, so 900px does the same. A first
pass at 600px only reached 48% on the screenshots, which is why they were
re-encoded.

**Originals were DELETED on Atul's instruction (2026-09-09).** `public/` holds
WebP and nothing else: 139 files, 6.3MB, and every one of them is requested by
the code. There is no second copy anywhere in the repo.

**What that means going forward:** these WebPs are the only copies at these
sizes. Re-encoding any of them LARGER is not possible from what is in the repo;
it needs the client's source exports again. The encode sizes are recorded above
so a re-export can match them.

Filename stems are untouched, only extensions changed, so the 24 before/after
names containing spaces or brackets still match whatever the client holds.
`ASSET_V` bumped to 4 in the same pass.

### Assets still outstanding
Deepti's portrait, the 3 credential logos (Cult Fit, AAFT School of Health &
Wellness, Habuild), trust-row portraits.

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

### THE FLOW (changed 2026-09-09, read this first)

    landing -> /checkout -> PAYMENT -> /book-a-call -> BOOKING -> /thank-you

The thank-you used to sit straight after the payment and push people towards
booking. It now sits after the BOOKING and is a preparation page. Three wiring
changes carry that:

1. `app/checkout/page.tsx` Razorpay handler redirects to
   `/book-a-call?p=<payment_id>`, not `/thank-you`.
2. `/book-a-call` is now the first page after payment, so it owns the
   browser-side GA4 purchase (`trackPurchase`, keyed on the payment id, guarded
   by `once()`). Meta's Purchase is untouched: the Razorpay webhook has always
   owned it, so a buyer who closes the tab on the calendar is still counted.
   **There is exactly one `trackPurchase` call site in the build.**
3. `/book-a-call` listens for Cal's `bookingSuccessful` and sends the buyer to
   `/thank-you?p=<payment_id>&booked=1`. A redirect can also be set on the
   event type inside Cal's dashboard; if it is ever set it WINS, so set it to
   the same url or leave it empty.

`NEXT_PUBLIC_BOOKING_URL` and `NEXT_PUBLIC_WHATSAPP_INVITE` were REMOVED from
`.env.example`: nothing reads them now, and LAUNCH's used-equals-declared check
would otherwise fail. 15 vars, both directions clean.

### /thank-you, now the post-BOOKING page (REWRITTEN 2026-09-09)
Structure from `vsl.teamfitarjun.com/thank-you`, minus the video (Atul's
instruction), with the prep content from the previous version mixed back in.

**REBUILT AGAIN 2026-09-09 to the landing page's own anatomy.** Atul: "the
layout is boring and not matching our design standards from home page", and
the email-your-reports beat was cut. Every measurement is now taken FROM
`landing.css` rather than approximated: the 24x2 dashed mono eyebrow, the
centred Fraunces h2 with one italic accent word, the 680px deck with 44px of
air under it, 80px sections, and the `.sdp-pillar-num` treatment (42px display
numeral, -.03em, 24x3 gold rule beneath).

Band rhythm dark, light, blush, dark: the page opens AND closes on the deepest
surface, which is how the funnel marks a beat that matters. The seal is built
like the guarantee card's icon tile (garnet gradient, gold mark, rotated 4deg)
rather than a flat circle.

Order: seal + gold "Booking confirmed" badge + "Your assessment is locked in" +
two mono confirmation chips / "This is not a sales call" with three display-
ordinal cards / "What to keep ready" as hairline-ruled rows (NOT a second card
grid, per the vary-adjacent rule: the beat above is already cards) + the gold
honesty note / dark close.
Every push to book is gone: on a page reached only BY booking, a "book your
slot" button is a bug. `app/thankyou.css` rewritten to match; the sticky CTA
bar and the WhatsApp panel went with it.

**Not copied from the reference, deliberately:**
- No "message me on Instagram" beat. Deepti has no handle on record. The
  do-one-thing-now slot is spent on emailing reports ahead instead, which uses
  a fact we have and actually changes the call.
- No "no rescheduling / no cancellations / missed calls count as completed".
  Those are the reference's own commercial terms. Deepti's are still the
  PENDING clauses on /refund, and /book-a-call currently tells people they CAN
  reschedule from their confirmation email, so inventing a stricter rule would
  both invent a client fact and contradict the page before it.

### /book-a-call, the post-payment step (BUILT + REBUILT 2026-09-09)
Closes LAUNCH's biggest open item: a buyer paid and was given nothing to do.
Calendar: `https://cal.id/deepti-sherawat/1-on-1-health-consultation`.
`NEXT_PUBLIC_BOOKING_URL=/book-a-call`, so the thank-you's primary action
lands here. Route named to match the house standard.

`app/book-a-call/page.tsx` + `layout.tsx` + `app/bookacall.css` (`.dp-book`,
token-only, noindex, mounts SiteFooter).

**REBUILT to the anatomy of `vsl.teamfitarjun.com/book-a-call`**, which Atul
named as the house standard. First attempt was a calendar beside a sticky
sidebar, which was the wrong shape. The reference's real lesson: this page is
NOT a calendar with a heading, it is a page whose whole job is converting a
PAID buyer into a BOOKED one, which is why most of its length sits AFTER the
calendar. Order as built: confirmation strip, two step dots, pill, two-line
headline with an italic accent line, deck, THE CALENDAR CARD (header, embed on
a light inset, three reassurances inside the card), proof strips, scroll-back
CTA, numbered "what you walk away with", a booking nudge, two objections, a
dark closing card, footer. Single centred column at 860px throughout.

**Deliberately NOT copied from the reference:**
- No logo lockup. The wordmark was removed from the build on Atul's
  instruction; a placeholder is exactly what he asked to be rid of.
- No "38% of people who pay never show up". That is Arjun's measured number.
  Deepti has none, and a fabricated statistic on a live page is a fabricated
  client fact. The nudge makes the same argument without a figure.
- No written pull quote. Deepti's testimonials are films and the source copy
  carries no quote; an invented one is a fabricated review.

Proof strips reuse 24 of the client chat screenshots (two counter-scrolling
rows at 90s). Everything describing the assessment is verbatim from FAQ 1 of
the landing copy, split at the source's own seams. The connective copy is
mine and is worth a NO-BRAINER pass.

Cal's official inline embed, `NEXT_PUBLIC_CAL_ORIGIN` / `NEXT_PUBLIC_CAL_LINK`
(both default to the live values). Brand colour passed as gold `#E0A32E`.
The direct cal.id link is ALWAYS rendered plus an 8s timeout that states the
failure in the gold open-item register, because a third-party embed fails
invisibly and a blank panel after a payment reads as a broken purchase.

**Embed is now the client's real snippet (2026-09-09), not a guess.** Three
things it corrected, and any one of them would have left a blank calendar:
- loader is `<origin>/embed-link/embed.js`, NOT `/embed/embed.js`
- the api is NAMESPACED: `Cal("init","default",...)` then `Cal.ns.default(...)`
- event slug is `1-on-1-health-consultation`, not `30-min-consultation-call`

Cal's loader defines `window.Cal` as a queue and appends its own script, so
nothing waits on `script.onload` any more. Readiness is polled by checking for
a real iframe in `#dp-cal` (the embed reports neither success nor failure), and
gives up at 9s into the stated-failure state. The direct link is still always
rendered.

Two deliberate departures from the pasted snippet: `cal-brand` is the funnel's
gold `#E0A32E` rather than Cal's default blue `#007ee5`, and `theme` is forced
to `light` so a visitor on a dark OS theme does not get a dark calendar dropped
into a cream page.

**OPEN: the event is no longer named "30 min".** The old slug said 30 minutes
and both `/book-a-call` and `/thank-you` say "30 minutes" in six places. The new
slug (`1-on-1-health-consultation`) does not state a duration. Copy left as is,
because the duration is a client fact. If the call is not 30 minutes, those six
lines need changing.

**Not wired:** no Meta or GA4 event on a completed booking. Cal emits
`bookingSuccessful`, which could drive a Schedule event, but LAUNCH keeps
`custom_data` to currency, value and order_id on a health offer, so that is
Atul's decision rather than a default.

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

### /book-a-call, the post-payment step (BUILT 2026-09-09)
The funnel's biggest open item is closed. LAUNCH shipped `/thank-you` with an
env-driven next step and no url to point it at, so a paying buyer was given
nothing to do. Atul supplied the calendar:
`https://cal.id/deepti-sherawat/1-on-1-health-consultation`.

`app/book-a-call/page.tsx` + `app/book-a-call/layout.tsx` + `app/bookacall.css` (`.dp-book`,
token-only, noindex, mounts SiteFooter). `NEXT_PUBLIC_BOOKING_URL=/book-a-call`, so
the thank-you's primary action now reads "Book your assessment slot" and lands
on our own page rather than handing the last step of a paid funnel to a page
carrying someone else's chrome.

Cal's official inline embed, origin and link split into
`NEXT_PUBLIC_CAL_ORIGIN` / `NEXT_PUBLIC_CAL_LINK` (both default to the live
values, so it works with them blank). Brand colour passed as gold `#E0A32E`,
since gold is the funnel's only action colour and should be the only
clickable-looking thing inside the embed too.

**The fallback is the important part.** A third-party embed fails invisibly,
and a blank rectangle on the page after a payment reads as a broken purchase.
So: an 8s timeout flips to a stated failure in the gold open-item register
(not a red error, since nothing is wrong with their payment), and the direct
link to cal.id is ALWAYS rendered, never revealed on error.

**Unverified:** `cal.id` could not be reached from the build sandbox, so the
embed script path (`<origin>/embed/embed.js`) and whether that host serves
Cal's embed runtime are assumptions. If the calendar does not appear, the page
still works via the direct link and the fix is the two env vars.

**Not wired:** no Meta or GA4 event fires on a completed booking. Cal's embed
emits a `bookingSuccessful` message that could drive a Schedule event, but
LAUNCH deliberately keeps `custom_data` to currency, value and order_id on a
health offer, so that is a decision for Atul rather than a default.

### LAUNCH's half (BUILT 2026-09-09)
`/checkout`, `/thank-you`, Razorpay, Meta CAPI, GA4, Pabbly, `.env.example`.

Built by the LAUNCH agent against `~/.claude/system/challenge-funnel-build.md`,
which is written for CHALLENGE funnels. What transferred verbatim: the event
map, the single-source price law, the health-classification posture, the
order-notes carrier, first-touch attribution, request signals, the checkout
anatomy, the env contract. What did NOT transfer, and why, is written at the
top of the file it would have gone in:
  · no VALUE STACK on the checkout (`app/checkout/included.ts`). A challenge
    prices its bonuses; nobody has priced anything inside a 97-rupee
    consultation, so the summary shows one real line and no struck-through
    figure rather than an invented one.
  · no OCCUPATION field and no QualifiedLead fired (`lib/meta-capi.ts`). The
    mechanism is wired end to end; the client has not said which half of the
    buyers they sell to, and every obvious candidate question for a metabolic
    offer names a condition in `custom_data`.
  · the thank-you's ONE NEXT STEP is env-driven in three shapes, because how
    a paid assessment reaches the buyer is not recorded anywhere.

**New files.**
`lib/`  meta-capi · order-notes · attribution · request-signals ·
        client-signals · ga4 · ga4-server · pabbly · checkout-config · track
`components/shared/`  MetaPixel · Analytics · FunnelTracker · PaymentLogos
`app/api/`  meta/event · razorpay/create-order · razorpay/webhook
`app/checkout/`  page · layout · included    `app/thank-you/`  page · layout
`app/checkout.css` (.dp-pay) · `app/thankyou.css` (.dp-ty) · `.env.example`

Edited: `lib/site.ts` (+`feePaise`, `feeLabel`), `app/layout.tsx` (mounts
MetaPixel + Analytics), `app/page.tsx` (mounts FunnelTracker),
`components/shared/icons.tsx` (+8 glyphs, appended).

**The event map as shipped.**
landing mount -> `ViewContent` + `view_item`, once per SESSION
checkout mount -> `AddToCart` + `begin_checkout`, ref-guarded
pay tap -> `InitiateCheckout` + `add_payment_info`
webhook -> `Purchase` + GA4 Measurement Protocol + Pabbly
Purchase is NEVER fired from the browser. InitiateCheckout NEVER fires on load.

**Classification posture.** `custom_data` carries currency, value and an
opaque `order_id`, and nothing else. `event_source_url` is reduced to the
origin server-side. The product string reaches Razorpay, GA4 and Pabbly and
never Meta. This is not retrofittable: a Meta health classification binds at
the ROOT DOMAIN.

**Blocking LAUNCH's half:** `NEXT_PUBLIC_SITE_URL` (no domain supplied, and
there is deliberately no fallback), the next-step url, the Razorpay keys and
webhook secret, and a square brand mark for the payment sheet.

## Standing rule
Bump `ASSET_V` in `components/shared/asset-version.ts` in the same pass as any
artwork swap, or the new file never reaches a returning visitor.
