import { CtaLockup } from '@/components/shared/CtaLockup';
import { SiteFooter } from '@/components/shared/SiteFooter';

/**
 * BEAT 11 — FINAL CTA.  DARK BAND.  THE PEAK.
 *
 * The closing beat carries the most depth on the page — that is the one
 * place a funnel is allowed to spend it, because the reader who arrives
 * here has read everything and is deciding. The depth is entirely
 * atmosphere (floor ramp, mesh blooms, a drifting dot grid, a lit top
 * seam): it adds no content and makes no claim. Structure earns
 * components; the finale earns finish.
 *
 * Lean, like tgo-sreshtha: headline → CTA lockup → centred colophon
 * folded in. No standalone footer, no dense body block, no wall of legal.
 *
 * ── THE COLOPHON IS NOW THE SHARED FOOTER, FOLDED ──────────────────
 * It was a hand-rolled line (name · ✦ · three links · © year) that lived
 * only here, so the registered entity, the postal address, the phone and
 * the email appeared NOWHERE on the site. A payment gateway's merchant
 * review looks for all four on the site itself, not inside one policy
 * page, so that was a launch blocker rather than a detail.
 *
 * The fix keeps both rules. `<SiteFooter folded />` is the same component
 * the policy pages mount, in a variant that drops the band entirely: no
 * background, no border, just the fading hairline and the centred stack
 * inside this stage. Nothing appears after the peak, the peak is still
 * the last thing on the page, and the four facts are on it.
 *
 * ── TWO COPY DECISIONS, BOTH FLAGGED ───────────────────────────────
 * 1. The blueprint wants an eyebrow + a purpose-built identity headline
 *    here. The copy source gives beat 11 only the button and the three
 *    badges. Rather than author a closing headline, the H1 promise is
 *    repeated VERBATIM at a smaller scale — repeating the promise at the
 *    close is what this beat is for, and it puts no words in the
 *    client's mouth. NO-BRAINER should write the real one.
 * 2. The source prints no countdown in this block (unlike the hero and
 *    beat 2), so the lockup runs without it.
 *
 * Server component.
 */
export function Finale() {
  return (
    <section id="start" className="sdp-finale sdp-dark">
      <div className="sdp-wrap">
        <div className="sdp-finale-inner">
          <h2 className="sdp-h1" data-sdp-reveal>
            <span className="sdp-h1-l1">Lose 5-15 Kilos,</span>
            <span className="sdp-h1-l2">Even If You Have (Pre)Diabetes,</span>
            <span className="sdp-h1-l3">Fatty Liver, Cholesterol or Hypothyroidism</span>
          </h2>

          {/* The countdown runs here too, from 2026-09-12 (Atul): every CTA
              on the page carries the same offer deadline the hero does. The
              copy source omitted it from the final block; he has since said
              it belongs at every button. */}
          <div data-sdp-reveal style={{ '--d': '.10s' } as React.CSSProperties}>
            <CtaLockup />
          </div>

          <SiteFooter folded />
        </div>
      </div>
    </section>
  );
}
