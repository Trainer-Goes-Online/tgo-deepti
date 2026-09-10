'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { business } from '@/lib/site';
import { asset } from '@/components/shared/asset-version';
import { trackPurchase } from '@/lib/track';

/**
 * THE SIXTH SURFACE · /book-a-call
 *
 * ── WHERE THIS SITS IN THE FLOW (changed 2026-09-09) ───────────────────
 *   checkout -> PAYMENT -> /book-a-call?p=<payment_id> -> BOOKING -> /thank-you
 *
 * This is now the FIRST page after a payment, which moves two jobs onto it:
 *   1. It fires the browser-side GA4 purchase, keyed on the payment id. The
 *      thank-you used to own that and no longer sees the payment first.
 *      Meta's Purchase is unaffected: the Razorpay webhook owns it and always
 *      did, so a buyer who closes the tab here is still counted.
 *   2. It carries the payment id forward, so the thank-you can still key on
 *      it after Cal hands the buyer back.
 *
 * Rebuilt 2026-09-09 to the anatomy of vsl.teamfitarjun.com/book-a-call,
 * which Atul named as the house standard for this route. Route name matched
 * for the same reason.
 *
 * ── WHAT THE REFERENCE GETS RIGHT, AND WHY IT IS COPIED ────────────────
 * The page is NOT a calendar with a heading on it. It is a page whose whole
 * job is to convert a PAID buyer into a BOOKED buyer, because the gap
 * between those two is where a funnel quietly loses the people it already
 * charged. That is why the reference spends most of its length after the
 * calendar: proof, what the call gets you, a nudge, an objection or two,
 * and a CTA that scrolls back up. Every one of those exists to stop
 * somebody closing the tab meaning to come back on Monday.
 *
 * Structure taken from it, in order: confirmation strip, step dots, pill,
 * two-line headline with an italic accent line, deck, THE CALENDAR CARD
 * (header, embed, three reassurances inside the card), proof, a
 * scroll-back CTA, a numbered "what you walk away with", a booking nudge,
 * an objection pair, a closing CTA card, footer.
 *
 * ── WHAT IS DELIBERATELY NOT COPIED ────────────────────────────────────
 * · No logo lockup. Atul removed the wordmark from the build; there is no
 *   mark to put here, and a placeholder is what he asked to be rid of.
 * · No "38% of people who pay never show up". That is the reference's own
 *   measured number. Deepti has no such figure, and inventing a statistic
 *   on a live page is inventing a client fact. The nudge makes the same
 *   argument without a number.
 * · No written testimonial quote. Deepti's testimonials are films, and the
 *   source copy carries no pull quote. An invented one is a fabricated
 *   review, so the slot is left out rather than filled.
 *
 * Everything describing the assessment is the client's own words from
 * FAQ 1 of the landing copy. The connective copy is mine and is worth a
 * NO-BRAINER pass.
 */

/* Client-supplied embed snippet, 2026-09-09. Three things in it corrected
   guesses made when only the share link was known:
     · the loader is /embed-link/embed.js, not /embed/embed.js
     · the api is NAMESPACED: Cal("init", "default", ...) then Cal.ns.default(...)
     · the event slug is 1-on-1-health-consultation
   All three are why the calendar would not have appeared before. */
const CAL_ORIGIN = (process.env.NEXT_PUBLIC_CAL_ORIGIN ?? 'https://cal.id').trim();
const CAL_LINK = (
  process.env.NEXT_PUBLIC_CAL_LINK ?? 'deepti-sherawat/1-on-1-health-consultation'
).trim();
const CAL_NS = 'default';
const CAL_URL = `${CAL_ORIGIN.replace(/\/$/, '')}/${CAL_LINK.replace(/^\//, '')}`;

/* Cal's own loader, verbatim from the snippet apart from the url being read
   from CAL_ORIGIN. It defines window.Cal as a QUEUE straight away and appends
   the real script itself, which is why nothing here waits on script.onload:
   calls made before the script lands are replayed when it does. */
type CalQueue = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, (...args: unknown[]) => void>;
  q?: unknown[][];
};
function loadCal(origin: string) {
  const C = window as unknown as { Cal?: CalQueue; document: Document };
  const A = `${origin.replace(/\/$/, '')}/embed-link/embed.js`;
  const L = 'init';
  const p = (a: { q?: unknown[][] }, ar: unknown[]) => {
    (a.q = a.q || []).push(ar);
  };
  const d = C.document;
  C.Cal =
    C.Cal ||
    function (this: unknown, ...ar: unknown[]) {
      const cal = C.Cal as CalQueue;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        (d.head.appendChild(d.createElement('script')) as HTMLScriptElement).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function (...a: unknown[]) {
          p(api as unknown as { q?: unknown[][] }, a);
        } as unknown as ((...a: unknown[]) => void) & { q?: unknown[][] };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns![namespace] = cal.ns![namespace] || (api as (...a: unknown[]) => void);
          p(cal.ns![namespace] as unknown as { q?: unknown[][] }, ar);
          p(cal as unknown as { q?: unknown[][] }, ['initNamespace', namespace]);
        } else {
          p(cal as unknown as { q?: unknown[][] }, ar);
        }
        return;
      }
      p(cal as unknown as { q?: unknown[][] }, ar);
    };
  return C.Cal as CalQueue;
}

/* Inside the calendar card, under the embed: the three things a person
   hesitating over a time slot is actually wondering. */
const REASSURANCES = [
  ['Deepti and her team', 'A qualified nutritionist reads your reports, not a call centre.'],
  ['Confirmation by email', 'It arrives the moment you book, with the joining link.'],
  ['Reschedule if life happens', 'Your confirmation email has the link to move your slot.'],
] as const;

/* Verbatim from FAQ 1 of the landing copy: "Deepti and her team will
   understand your current weight, health reports, symptoms, eating habits,
   lifestyle, medical history and previous weight-loss efforts to identify
   what may be keeping you stuck." Split at the source's own seams. */
const WALK_AWAY = [
  {
    title: 'A proper read of your reports',
    body: 'Your weight, health reports, symptoms, eating habits, lifestyle and medical history, looked at together instead of one condition at a time.',
  },
  {
    title: 'What may be keeping you stuck',
    body: 'The previous weight-loss efforts that did not hold, and the specific reasons they did not, in your body rather than in general.',
  },
  {
    title: 'An honest yes or no',
    body: 'Whether the programme is the right next step for you. If it genuinely is not the right fit, we will tell you honestly.',
  },
] as const;

const PROOF_ROW_1 = ['1.webp','2.webp','3.webp','4.webp','5.webp','6.webp','7.webp','8.webp','9.webp','10.webp','11.webp','12.webp'];
const PROOF_ROW_2 = ['13.webp','14.webp','15.webp','16.webp','17.webp','18.webp','19.webp','20.webp','21(1).webp','21.webp','22.webp','23.webp'];

const FAQS = [
  {
    q: 'Is this a sales call?',
    a: 'No. This is a personalised health assessment. Deepti and her team will understand your current weight, health reports, symptoms, eating habits, lifestyle, medical history and previous weight-loss efforts to identify what may be keeping you stuck. The goal is to help you understand your current health picture and whether Deepti’s programme is the right next step for you. If the programme genuinely isn’t the right fit, we’ll tell you honestly. No pressure. No unnecessary selling.',
  },
  {
    q: 'What should I have ready?',
    a: 'Your most recent blood reports, however old they feel, and bring them even if you think they are normal. The medication and supplements you currently take, with doses if you know them. And a rough sense of what a normal day of eating looks like for you. If you do not have recent reports, come anyway and we will tell you which ones are worth doing.',
  },
] as const;

export default function BookACallPage() {
  return (
    <Suspense fallback={null}>
      <BookACall />
    </Suspense>
  );
}

function BookACall() {
  const paymentId = useSearchParams().get('p') ?? '';
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  /* GA4 only, and only with a payment id to key it on. `once()` inside
     trackPurchase means a refresh or a back-navigation cannot double count. */
  useEffect(() => {
    if (paymentId) trackPurchase(paymentId);
  }, [paymentId]);

  useEffect(() => {
    let cancelled = false;
    /* The embed reports nothing on success or failure, so the only honest
       readiness signal is whether an iframe actually appeared in the mount
       point. Polled, then given up on, rather than assumed. */
    const started = Date.now();
    const poll = window.setInterval(() => {
      if (cancelled) return;
      if (document.querySelector('#dp-cal iframe')) {
        setState('ready');
        window.clearInterval(poll);
      } else if (Date.now() - started > 9000) {
        setState('failed');
        window.clearInterval(poll);
      }
    }, 300);

    try {
      const Cal = loadCal(CAL_ORIGIN);
      Cal('init', CAL_NS, { origin: CAL_ORIGIN });
      const ns = Cal.ns![CAL_NS];

      ns('inline', {
        elementOrSelector: '#dp-cal',
        config: { layout: 'month_view' },
        calLink: CAL_LINK,
      });

      ns('ui', {
        /* Cal's generated snippet ships its default blue. Gold is this
           funnel's only action colour, so it is the only thing inside the
           embed that should look clickable either. Light is forced: the page
           is cream, and Cal would otherwise follow the visitor's OS theme and
           drop a dark calendar into the middle of it. */
        cssVarsPerTheme: { light: { 'cal-brand': '#E0A32E' }, dark: { 'cal-brand': '#E0A32E' } },
        theme: 'light',
        hideEventTypeDetails: false,
        layout: 'month_view',
      });

      /* THE HANDOFF. Cal fires this when a booking completes inside the
         embed, and it is the only reliable in-page signal that the buyer
         actually booked. Without it they would sit on a confirmed calendar
         with nowhere to go. The payment id rides along so the thank-you can
         still key on it.

         Belt and braces: a redirect can also be set on the event type in
         Cal's own dashboard. If that is ever set it WINS over this, so set it
         to the same url or leave it empty. */
      ns('on', {
        action: 'bookingSuccessful',
        callback: () => {
          const q = paymentId ? `?p=${encodeURIComponent(paymentId)}&booked=1` : '?booked=1';
          window.location.href = `/thank-you${q}`;
        },
      });
    } catch {
      if (!cancelled) setState('failed');
      window.clearInterval(poll);
    }

    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [paymentId]);

  return (
    <div className="dp-book">
      {/* 1 · confirmation strip */}
      <div className="bk-strip">
        <span className="bk-strip-tick" aria-hidden>
          ✓
        </span>
        Payment received
        <span className="bk-strip-sep" aria-hidden>
          ·
        </span>
        1 step left
        <span className="bk-strip-sep" aria-hidden>
          ·
        </span>
        30 minutes with Deepti&rsquo;s team
      </div>

      <section className="bk-body">
        <div className="wrap">
          {/* 2 · step dots. Two steps, one done. The reference uses these to
              make "you are nearly finished" a picture rather than a claim. */}
          <ol className="bk-steps" aria-label="Progress">
            <li className="done">
              <span className="bk-dot" aria-hidden>
                ✓
              </span>
              Paid
            </li>
            <li className="now" aria-current="step">
              <span className="bk-dot" aria-hidden>
                2
              </span>
              Book your assessment
            </li>
          </ol>

          <div className="bk-mast">
            <span className="bk-pill">One step left</span>
            <h1>
              Pick a time. Bring your reports.
              <br />
              <em>Leave knowing what is actually going on.</em>
            </h1>
            <p className="bk-deck">
              Your &#8377;97 is in. Now lock the 30 minutes where someone finally
              reads your reports properly. Slot below.
            </p>
          </div>

          {/* 3 · THE CALENDAR CARD */}
          <div className="bk-card" id="calendar">
            <div className="bk-card-head">
              <h2>Pick a slot that works for you</h2>
              <p>All times are shown in your own time zone.</p>
            </div>

            <div className="bk-cal-inset">
              {state !== 'ready' && (
                <p className={state === 'failed' ? 'bk-cal-note failed' : 'bk-cal-note'}>
                  {state === 'failed'
                    ? 'The calendar could not load here. Use the direct link below and your booking will work exactly the same.'
                    : 'Loading the calendar.'}
                </p>
              )}
              <div id="dp-cal" className="bk-cal" />
            </div>

            {/* Always rendered, never revealed on error: a third-party embed
                fails invisibly, and a blank panel on the page after a payment
                reads as a broken purchase. */}
            <p className="bk-direct">
              Calendar not showing?{' '}
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
                Open the booking page directly
              </a>
              .
            </p>

            <ul className="bk-reassure">
              {REASSURANCES.map(([t, b]) => (
                <li key={t}>
                  <span className="bk-check" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <b>{t}.</b> {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 · proof. Deepti's proof is the client chats, so that is what runs
            here, a slice of the wall rather than the whole thing. */}
        <div className="bk-proof">
          <div className="wrap">
            <h2 className="bk-h2">
              They came in with the same reports. <em>Then they picked a slot.</em>
            </h2>
            <p className="bk-h2-sub">Real clients, mid-programme, in their own words.</p>
          </div>
          <div className="bk-strips">
            {[PROOF_ROW_1, PROOF_ROW_2].map((row, r) => (
              <div className={r === 0 ? 'bk-marquee ltr' : 'bk-marquee rtl'} key={r}>
                <div className="bk-track">
                  {[0, 1].map((copy) =>
                    row.map((src) => (
                      <div className="bk-shot" key={`${copy}-${src}`} aria-hidden={copy === 1 ? true : undefined}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset(`/testimonials/${src}`)}
                          alt=""
                          width={739}
                          height={1314}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="wrap bk-mid-cta">
            <a className="bk-btn" href="#calendar">
              Pick my slot
              <span aria-hidden>&nbsp;&rarr;</span>
            </a>
          </div>
        </div>

        <div className="wrap">
          {/* 5 · what the 30 minutes gets you */}
          <h2 className="bk-h2">
            What you walk away with in <em>30 minutes</em>
          </h2>
          <ol className="bk-value">
            {WALK_AWAY.map((w, i) => (
              <li key={w.title}>
                <span className="bk-ord">{String(i + 1).padStart(2, '0')}</span>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </li>
            ))}
          </ol>

          {/* 6 · the nudge. Same argument as the reference makes with its own
              measured no-show number, made without one, because Deepti has no
              such figure and a made-up statistic is a made-up client fact. */}
          <div className="bk-nudge">
            <h2>
              The slot is the part people leave <em>for Monday.</em>
            </h2>
            <p>
              Paying was the decision. Booking is the one that puts a date on it.
              The assessment is already yours, it just needs a time against it,
              and the calendar above takes about twenty seconds.
            </p>
            <a className="bk-btn" href="#calendar">
              Pick my slot
              <span aria-hidden>&nbsp;&rarr;</span>
            </a>
          </div>

          {/* 7 · the two objections that stand between paid and booked */}
          <h2 className="bk-h2">Two quick questions before you book</h2>
          <div className="bk-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          {/* 8 · closing card */}
          <div className="bk-final">
            <h2>
              You&rsquo;ve paid. Now <em>lock the time.</em>
            </h2>
            <p>One slot. 30 minutes. Then the reading of your reports begins.</p>
            <a className="bk-btn lg" href="#calendar">
              Take me to the calendar
              <span aria-hidden>&nbsp;&rarr;</span>
            </a>
          </div>

          <p className="bk-help">
            Trouble booking? Write to{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a> or call{' '}
            <a href={`tel:${business.phoneE164}`}>{business.phone}</a>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
