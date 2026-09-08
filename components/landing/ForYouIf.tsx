import { CtaLockup } from '@/components/shared/CtaLockup';
import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { CheckIcon } from '@/components/shared/icons';

/**
 * BEAT 2 — THIS IS FOR YOU IF.
 *
 * Shape: SELF-RECOGNITION SET (five of them, each a different way of
 * being stuck). Category §2 Contrast, rendered with the VSL default: the
 * ONE-SIDED ✓ list, not the two-column for-you / not-for-you fit-check.
 * That is the right call here because this offer does not disqualify —
 * there is no takeaway beat anywhere in the copy, and a ✗ column with
 * nothing honest to put in it is invented structure.
 *
 * A single centred 820px column, per the locked build rule. Five rows,
 * not a grid: the reader is meant to read down them until one of them is
 * about them, and a two-up grid breaks that scan.
 *
 * Each row's first sentence is the recognition (set as the lead-in) and
 * the rest is the detail. That is emphasis, not an edit — every word
 * below is the client's, in the client's order.
 */
const ITEMS = [
  {
    head: 'Losing even 3–5 kilos now feels harder than it should.',
    body: 'You can be disciplined for weeks, see barely any movement on the scale, and then gain back the little you lost the moment life gets busy again.',
  },
  {
    head: 'Every health check-up seems to give you another number to worry about.',
    body: 'Your HbA1c, cholesterol, triglycerides, BP, uric acid, thyroid or liver markers keep moving in the wrong direction, despite your efforts to eat better and take care of your health.',
  },
  {
    head: 'One health issue seems to have slowly turned into three or four.',
    body: "Weight gain, thyroid, fatty liver, high cholesterol, blood sugar or gut issues have started piling up together, and you're tired of managing each one as a completely separate problem.",
  },
  {
    head: 'Bloating, poor digestion, low energy or constant heaviness have started feeling like your new normal.',
    body: 'You may not feel "sick", but you don\'t feel truly healthy either, and you don\'t want to accept feeling this way simply because you\'re getting older.',
  },
  {
    head: "You're done with plans that only focus on calories and exercise while ignoring the bigger health picture.",
    body: 'You want an approach that helps you lose weight and see meaningful improvements in your health reports, not just temporary changes on the scale.',
  },
] as const;

const DELAYS = ['.04s', '.10s', '.16s', '.22s', '.28s'] as const;

export function ForYouIf() {
  return (
    <section id="for-you" className="sdp-who sdp-light">
      <div className="sdp-wrap">
        <SectionMasthead
          eyebrow="For Men & Women 30–55 Looking For Sustainable Weight Loss & Better Overall Health"
          title={
            <>
              This Is For You <em>if:</em>
            </>
          }
          delay=".06s"
        />

        <ul className="sdp-who-list">
          {ITEMS.map((it, i) => (
            <li
              key={it.head}
              data-sdp-reveal
              style={{ '--d': DELAYS[i] ?? '.28s' } as React.CSSProperties}
            >
              <span className="ck" aria-hidden>
                <CheckIcon />
              </span>
              <span>
                <strong>{it.head}</strong> {it.body}
              </span>
            </li>
          ))}
        </ul>

        <div className="sdp-who-cta" data-sdp-reveal style={{ '--d': '.34s' } as React.CSSProperties}>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
