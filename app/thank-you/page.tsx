'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { business } from '@/lib/site';
import { SealCheckIcon, CheckIcon } from '@/components/shared/icons';

/**
 * THE CONFIRMATION · /thank-you
 *
 * ── WHERE IT SITS ──────────────────────────────────────────────────────
 *   checkout -> PAYMENT -> /book-a-call -> BOOKING -> /thank-you
 *
 * By the time anyone lands here they have paid AND booked, so the only
 * thing left to influence is whether they turn up prepared. Every push to
 * book is gone: on a page reached only by booking, a "book your slot"
 * button is a bug.
 *
 * ── REBUILT 2026-09-09 TO THE LANDING PAGE'S OWN SYSTEM ────────────────
 * The previous version was structurally fine and visually anonymous: small
 * flat cards, no eyebrows, no band rhythm, none of the funnel's signatures.
 * It read like a different company's confirmation page.
 *
 * It now mirrors the SDP anatomy in `landing.css` beat for beat, measured
 * from it rather than approximated:
 *   · eyebrows are mono, uppercase, with the 24x2 accent dash before them
 *   · section headings are Fraunces, centred, one italic accent word
 *   · a deck at 680px under each, then 44px of air
 *   · sections are 80px tall and alternate band tone the way the funnel does
 *   · big display ordinals with a short gold rule under them, exactly the
 *     `.sdp-pillar-num` treatment from the programme beat
 *   · the confirmation seal is built like the guarantee card's icon tile:
 *     a dark garnet tile with a gold mark on it
 *
 * BAND RHYTHM: dark (confirmation) · light (what the call is) · blush
 * (prep) · dark (close). The page opens AND closes on the deepest surface,
 * which is the funnel's own way of marking a beat that matters.
 *
 * The "email your reports" section was removed on Atul's instruction.
 *
 * Everything describing the assessment is verbatim from the copy source.
 * The connective copy is mine and is worth a NO-BRAINER pass.
 */

/* What the call does. Verbatim from FAQ 1 of the copy source. */
const CLARITY = [
  {
    title: 'Your current health picture',
    body: 'Your weight, health reports, symptoms, eating habits, lifestyle and medical history, read across each other rather than one condition at a time.',
  },
  {
    title: 'What may be keeping you stuck',
    body: 'Your previous weight-loss efforts, and the specific reasons they did not hold, in your body rather than in general.',
  },
  {
    title: 'An honest yes or no',
    body: 'Whether the programme is the right next step for you. If it genuinely is not the right fit, we will tell you honestly.',
  },
] as const;

/* Section 7 item 2 of the copy source, verbatim: "Your journey begins with an
   in-depth review of your blood reports, alongside your health history,
   symptoms, lifestyle, eating patterns and weight-loss history." Split at the
   sentence's own commas, in its own order. Nothing added. */
const HAVE_READY = [
  ['Your blood reports', 'Whatever you have, however old it feels. Bring them even if they read as normal.'],
  ['Your health history', 'The conditions you are managing, and the medication and supplements you take.'],
  ['Your symptoms', 'Bloating, digestion, energy, sleep. The things that never show on a scale.'],
  ['Your lifestyle', 'Work hours, travel, how the week actually runs rather than how it should.'],
  ['Your eating patterns', 'A normal day of eating, not an ideal one.'],
  ['Your weight-loss history', 'What you have tried, how long it held, and where it came apart.'],
] as const;

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYou />
    </Suspense>
  );
}

function ThankYou() {
  /* `booked=1` is set by the Cal handoff on /book-a-call. Its absence is not
     treated as an error: somebody may arrive from their own history or a Cal
     dashboard redirect, and a confirmation page that accuses a real buyer of
     not having booked is worse than one that simply confirms. */
  useSearchParams();

  return (
    <div className="dp-ty">
      {/* ── 1 · CONFIRMATION. Dark band, the page's first peak. ─────── */}
      <section className="ty-sec ty-dark ty-hero">
        <div className="ty-wrap">
          <span className="ty-seal" aria-hidden>
            <SealCheckIcon />
          </span>
          <span className="ty-badge">Booking confirmed</span>
          <h1 className="ty-h1">
            Your assessment is <em>locked in.</em>
          </h1>
          <p className="ty-sub">
            Your slot is confirmed and the details are on their way to the email
            address you booked with. Put it in your calendar now, while it is in
            front of you.
          </p>

          <ul className="ty-chips">
            <li>
              <span className="ty-tick" aria-hidden>
                <CheckIcon />
              </span>
              Confirmation by email, with your joining link
            </li>
            <li>
              <span className="ty-tick" aria-hidden>
                <CheckIcon />
              </span>
              A reminder before the call
            </li>
          </ul>
        </div>
      </section>

      {/* ── 2 · WHAT THE CALL IS. Light band, display ordinals. ─────── */}
      <section className="ty-sec ty-light">
        <div className="ty-wrap">
          <span className="ty-eyebrow center">What this call actually is</span>
          <h2 className="ty-h2">
            This is not a <em>sales call.</em>
          </h2>
          <p className="ty-sub">
            It is a personalised health assessment. No pressure, and no
            unnecessary selling. Thirty minutes spent getting clear on three
            things.
          </p>

          <ol className="ty-ord-grid">
            {CLARITY.map((c, i) => (
              <li key={c.title}>
                <span className="ty-ord">{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 3 · PREP. Blush band. ──────────────────────────────────── */}
      <section className="ty-sec ty-blush">
        <div className="ty-wrap">
          <span className="ty-eyebrow center">Before the call</span>
          <h2 className="ty-h2">
            What to keep <em>ready.</em>
          </h2>
          <p className="ty-sub">
            Your assessment begins with an in-depth review of your reports, so
            the more of this you have to hand, the further the thirty minutes
            goes. You do not need perfect data.
          </p>

          <ul className="ty-ready">
            {HAVE_READY.map(([t, b]) => (
              <li key={t}>
                <h3>{t}</h3>
                <p>{b}</p>
              </li>
            ))}
          </ul>

          <p className="ty-note">
            Come with what is true for you today, not what you wish were true.
            The honest version is the one we can actually work from.
          </p>
        </div>
      </section>

      {/* ── 4 · CLOSE. Dark band, the premium peak. ────────────────── */}
      <section className="ty-sec ty-dark ty-close">
        <div className="ty-wrap">
          <h2 className="ty-h2">
            See you at your <em>assessment.</em>
          </h2>
          <p className="ty-sub">
            Something come up, or the confirmation not arrived? Write to{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a> or call{' '}
            <a href={`tel:${business.phoneE164}`}>{business.phone}</a>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
