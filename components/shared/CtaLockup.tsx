import { site, CTA_LABEL } from '@/lib/site';
import { ArrowRightIcon, FlameIcon, PercentBadgeIcon, StarIcon } from './icons';
import { OfferTimer } from './OfferTimer';

/**
 * THE CTA LOCKUP — one group, reused verbatim after every proof beat.
 *
 * FIXED ORDER, taken straight from the copy source and identical at every
 * occurrence on the page:
 *   1. the button
 *   2. the three risk badges
 *   3. the 5-hour offer countdown
 *
 * They are one component and never separated: Rush and Reassure belong at
 * the button, not three scrolls apart. Keeping the countdown inside the
 * group is what makes the group repeatable — every timer reads the same
 * stored deadline, so they all agree.
 *
 * Badge labels are the client's own words. The copy prints them with
 * emoji (⭐ 🔥 💯); they render here as line glyphs, because emoji are a
 * different typeface at a different weight on every OS.
 */
const BADGES = [
  { label: '100% Results Guarantee', Icon: StarIcon, tone: 'sdp-risk-icon-gold' },
  { label: '700+ Success Stories', Icon: FlameIcon, tone: 'sdp-risk-icon-gold' },
  { label: '100% Personalised Root-Cause Approach', Icon: PercentBadgeIcon, tone: 'sdp-risk-icon-blue' },
] as const;

export function CtaButton() {
  return (
    <a className="sdp-cta" href={site.checkoutUrl} data-cta>
      <span className="cta-label">{CTA_LABEL}</span>
      <span className="arrow" aria-hidden>
        <ArrowRightIcon />
      </span>
    </a>
  );
}

export function RiskBadges() {
  return (
    <div className="sdp-risk-strip">
      {BADGES.map(({ label, Icon, tone }) => (
        <span className="sdp-risk-badge" key={label}>
          <span className={`sdp-risk-icon ${tone}`} aria-hidden>
            <Icon />
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}

/**
 * @param timer defaults true. The copy source prints the countdown in the
 * hero and the beat-2 lockup but NOT in the final-CTA block, so the finale
 * passes `timer={false}` rather than adding a line the client didn't
 * write. Flagged for Atul — it may simply be an omission in the doc.
 */
export function CtaLockup({ timer = true }: { timer?: boolean } = {}) {
  return (
    <div className="sdp-lockup">
      <CtaButton />
      <RiskBadges />
      {timer && <OfferTimer />}
    </div>
  );
}
