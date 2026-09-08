import { CtaLockup } from '@/components/shared/CtaLockup';
import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { ShieldCheckIcon } from '@/components/shared/icons';

/**
 * BEAT 8 — GUARANTEE.  DARK BAND (the second gravity beat: risk).
 *
 * Shape: ASSURANCE + a small condition SET.
 *
 * The promise itself is a single undertaking, so it gets a single card.
 * Scattering a guarantee across a section is how it stops reading as one
 * thing somebody is on the hook for.
 *
 * "What We Ask In Return" IS structure — two conditions, and the reader
 * has to be able to check themselves against both — so it gets rows. They
 * are numbered rather than ticked: a ✓ marks something you receive, and
 * these are things you owe. That distinction is the whole reason this
 * block builds trust instead of reading as fine print.
 *
 * The qualifying line sits below a hairline as an authored coda — a
 * clarification of record, deliberately not shrunk into fine print. On a
 * results guarantee, hiding the condition is the thing that would make it
 * untrustworthy.
 *
 * Server component.
 */
const ASKS = [
  'You complete the full 12-week programme, consistently follow your personalised nutrition & lifestyle plan, attend scheduled check-ins and submit your progress updates on time.',
  'You actively communicate with Deepti and her nutritionists whenever work, travel, health or life gets in the way, so your plan can be adjusted accordingly.',
] as const;

export function Guarantee() {
  return (
    <section id="guarantee" className="sdp-guar sdp-deep-aqua">
      <div className="sdp-wrap">
        <SectionMasthead
          title={
            <>
              The Risk Is <em>Ours.</em> Not Yours.
            </>
          }
          delay=".06s"
        />

        <div className="sdp-guarantee-card" data-sdp-reveal style={{ '--d': '.10s' } as React.CSSProperties}>
          <div className="sdp-guarantee-icon" aria-hidden>
            <ShieldCheckIcon size={42} />
          </div>

          <span className="sdp-guarantee-badge">100% Results Guarantee</span>

          <p className="sdp-guarantee-promise">
            If you don&apos;t see measurable progress in your weight and health by
            the end of your 12-week programme, despite consistently following your
            personalised plan, we&apos;ll continue supporting you at no additional
            cost until you do.
          </p>

          <div className="sdp-ask">
            <p className="sdp-ask-title">What We Ask In Return</p>
            {ASKS.map((a, i) => (
              <div className="sdp-ask-row" key={i}>
                <span className="sdp-ask-ord" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p>{a}</p>
              </div>
            ))}
            <p className="sdp-guarantee-coda">
              The guarantee applies when you&apos;ve consistently followed your
              personalised plan and completed the programme as recommended.
            </p>
          </div>
        </div>

        <div className="sdp-guar-cta" data-sdp-reveal>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
