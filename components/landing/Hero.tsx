import { site } from '@/lib/site';
import { CtaLockup } from '@/components/shared/CtaLockup';
import { ArrowDownIcon } from '@/components/shared/icons';
import { VslFrame } from './VslFrame';

/**
 * BEAT 1 — HERO / VSL.
 *
 * Shape: FOCAL MEDIA. §8, the heaviest composite on the page: the whole
 * beat exists to hand the reader to the film and then, the moment the
 * film ends, to the button.
 *
 * ORDER IS THE CLIENT'S AND IS FIXED, top to bottom:
 *   audience-gate pill → two-tier H1 → deck → pre-video line →
 *   marker chips → watch cue → VSL → CTA lockup → credibility table
 *
 * The post-video order matters more than it looks: the CTA sits directly
 * under the film because that is the second the reader is most persuaded,
 * and the four-stat credibility table sits AFTER it, as the thing that
 * catches whoever scrolled past the button rather than as a warm-up
 * before it.
 *
 * Server component. The only client parts are the film and the countdown.
 */

/* The copy's eight markers, printed as two rows of four. Kept in the
   copy's exact order and grouping. */
const MARKERS = [
  'HbA1c',
  'Thyroid Markers',
  'Fatty Liver Grades 1-3',
  'Gut Issues',
  'LDL Cholesterol',
  'Blood Pressure',
  'Uric Acid',
  'Insulin Resistance',
] as const;

/* The credibility table. The fee reads from site so it can move without a
   code change; the other three are the client's figures. */
const STATS = [
  { k: '700+', v: 'Clients Coached Globally' },
  { k: '12wk', v: 'Avg. Transformation' },
  { k: '5.0', v: 'Client Rating', star: true },
  { k: `₹${site.feeInr}`, v: 'To Start', price: true },
] as const;

export function Hero() {
  return (
    <section id="top" className="sdp-hero">
      <div className="sdp-wrap sdp-hero-inner">
        {/* Audience gate — a bordered pill with a glowing dot, not a filled
            callout: it names who this is for before it claims anything. */}
        <div className="sdp-eyebrow-pill">
          <span className="glowdot" aria-hidden />
          <span>
            FOR MEN &amp; WOMEN 30–55 STRUGGLING WITH STUBBORN WEIGHT, WORSENING
            HEALTH MARKERS &amp; CHRONIC HEALTH CONDITIONS
          </span>
        </div>

        <h1 className="sdp-h1" data-sdp-reveal style={{ '--d': '.06s' } as React.CSSProperties}>
          <span className="sdp-h1-l1">Lose 5-15 Kilos,</span>
          <span className="sdp-h1-l2">Even If You Have (Pre)Diabetes,</span>
          <span className="sdp-h1-l3">Fatty Liver, Cholesterol or Hypothyroidism</span>
        </h1>

        <p className="sdp-hero-sub" data-sdp-reveal style={{ '--d': '.12s' } as React.CSSProperties}>
          Through a personalised, root-cause approach that focuses on{' '}
          <strong>
            healing your liver, the master organ connecting your weight &amp;
            metabolic health
          </strong>
          , instead of treating every health condition separately.
        </p>

        <p className="sdp-hero-lead" data-sdp-reveal style={{ '--d': '.15s' } as React.CSSProperties}>
          <strong>
            700+ clients across India, USA, Canada, UK, Australia &amp; The Middle
            East
          </strong>{' '}
          have achieved <strong>lasting weight loss</strong> while improving key
          metabolic health conditions &amp; markers, including:
        </p>

        <div
          className="sdp-hero-markers"
          data-sdp-reveal
          style={{ '--d': '.17s' } as React.CSSProperties}
          aria-label="Health markers clients have improved"
        >
          {MARKERS.map((m) => (
            <span className="sdp-marker-chip" key={m}>
              <span className="sdp-marker-dot" aria-hidden />
              {m}
            </span>
          ))}
        </div>

        <a className="sdp-above-vsl" href="#vsl" data-sdp-reveal style={{ '--d': '.20s' } as React.CSSProperties}>
          WATCH THE SHORT VIDEO BELOW
          <span className="sdp-above-vsl-arrow" aria-hidden>
            <ArrowDownIcon />
          </span>
        </a>

        <VslFrame />

        <div data-sdp-reveal style={{ '--d': '.26s' } as React.CSSProperties}>
          <CtaLockup />
        </div>

        <div className="sdp-cred-row" data-sdp-reveal style={{ '--d': '.34s' } as React.CSSProperties}>
          {STATS.map((s) => (
            <div className={`sdp-cred-card${'price' in s && s.price ? ' is-price' : ''}`} key={s.v}>
              <div className="sdp-cred-num">
                {s.k}
                {'star' in s && s.star && (
                  <span className="star" aria-label="stars">
                    {' '}
                    ★
                  </span>
                )}
              </div>
              <div className="sdp-cred-lbl">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
