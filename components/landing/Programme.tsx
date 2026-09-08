import { CtaLockup } from '@/components/shared/CtaLockup';
import { SectionMasthead } from '@/components/shared/SectionMasthead';

/**
 * BEAT 7 — WHAT'S INCLUDED IN YOUR 12-WEEK PROGRAMME.  LIGHT-ALT.
 *
 * Shape: ACCUMULATION. Six components that sum to one programme.
 *
 * Deliberately NOT rendered as a sequence, even though the copy numbers
 * them 1-6. The deck says "everything working together" — these run in
 * parallel for twelve weeks, they are not steps you complete in order.
 * A timeline spine would be the prettier component and the wrong claim:
 * it would tell the reader the blood report comes before the nutrition
 * plan comes before the support, which is not what is being sold. So the
 * numbers are inventory marks on a grid, not stations on a rail.
 *
 * No value column either. §3's itemised ledger wants a price per line,
 * and there isn't one in the copy. Inventing values to make the ledger
 * work would be the design version of a fabricated claim.
 *
 * Server component.
 */
const ITEMS = [
  {
    title: 'Liver & Metabolic Health Support',
    body: 'Rather than focusing only on calories and the weighing scale, your plan works on liver and metabolic health, while supporting concerns such as blood sugar, cholesterol, triglycerides, thyroid markers and other underlying health issues.',
  },
  {
    title: 'Complete Blood Report & Health Assessment',
    body: 'Your journey begins with an in-depth review of your blood reports, alongside your health history, symptoms, lifestyle, eating patterns and weight-loss history. Your reports help identify the health markers that need attention, so your plan is personalised around what is actually happening inside your body, not just the number on the scale.',
  },
  {
    title: 'Body-Type-Based Nutrition',
    body: "Instead of giving everyone the same high-protein diet, supplements and food rules, Deepti's approach considers your digestive & metabolic capacity, individual body type, food combinations and meal timings to personalise what, how and when you eat around your body and health needs.",
  },
  {
    title: 'Weekly Progress Reviews & Plan Adjustments',
    body: 'Your progress is reviewed regularly across weight, measurements, symptoms, adherence and relevant health markers, with your nutrition and lifestyle plan adjusted as your body responds instead of keeping you on the same plan for months.',
  },
  {
    title: 'Dedicated Nutritionist & Constant WhatsApp Chat Support',
    body: "You're supported throughout your journey by Deepti and her team of qualified nutritionists, so questions, challenges and roadblocks can be addressed as they arise rather than waiting until your next scheduled review.",
  },
  {
    title: 'Sustainable Weight Loss & Maintenance Strategy',
    body: "The goal isn't simply to help you lose 5–15 kilos and send you on your way. You'll learn which foods, eating patterns and lifestyle choices work best for your individual body type, so you can maintain your progress long-term without staying dependent on restrictive diets or generic food rules forever.",
  },
] as const;

export function Programme() {
  return (
    <section id="included" className="sdp-prog sdp-aqua">
      <div className="sdp-wrap">
        <SectionMasthead
          title={
            <>
              What&apos;s Included In Your <em>12-Week</em> Programme
            </>
          }
          sub="Everything working together to help you lose weight while improving the underlying health issues keeping you stuck."
          delay=".06s"
        />

        <div className="sdp-prog-grid">
          {ITEMS.map((it, i) => (
            <div
              className="sdp-prog-card"
              key={it.title}
              data-sdp-reveal
              style={{ '--d': `${0.04 + i * 0.05}s` } as React.CSSProperties}
            >
              <span className="sdp-pillar-num" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="sdp-prog-title">{it.title}</h3>
              <p className="sdp-prog-desc">{it.body}</p>
            </div>
          ))}
        </div>

        <div className="sdp-prog-cta" data-sdp-reveal>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
