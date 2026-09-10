import { site, CTA_LABEL } from '@/lib/site';
import { ArrowRightIcon, StarIcon, FlameIcon } from '@/components/shared/icons';

/**
 * BEAT 12 · STICKY CTA. Page-chrome, not a section.
 *
 * ── ALWAYS ON, from 2026-09-09 (Atul) ─────────────────────────────────
 * It used to stay hidden until the hero had scrolled away and retreat
 * again at the finale. Both observers are gone, and that takes the whole
 * client island with them: with nothing to show or hide there is no
 * state, no useEffect and no JS. It is a server component now, so the bar
 * paints with the first frame instead of after hydration.
 *
 * TWO THINGS THAT ONLY MATTER BECAUSE IT NEVER RETREATS:
 *  · The page needs a spacer. `.sdp-root` takes bottom padding in PART 3g,
 *    or the bar sits permanently on top of the finale, and the finale is
 *    where SiteFooter carries the registered name, address, phone and
 *    email that Razorpay's merchant review looks for. A bar covering
 *    those is a bar that fails the review.
 *  · The button is no longer focus-trapped. `tabIndex` used to flip to -1
 *    while the bar was hidden so a keyboard user could not tab into an
 *    invisible control. Always visible means always tabbable, so it goes.
 *
 * ── SHAPE, from vsl.teamfitarjun.com's bar (measured, not eyeballed) ───
 * A LIGHT cream bar, not dark glass: a 1px warm border along the top, a
 * soft upward shadow, a CENTRED pill button, and two risk badges under
 * it. Ours previously ran a price tag left and the button right with a
 * shine sweeping the top edge; the tag's space goes to the badges, and
 * the sweep was drawn to read across dark glass and does nothing on
 * cream.
 *
 * The badges are the first two from the CTA lockup, so the bar still
 * introduces no copy that is not already the client's own.
 */
const BAR_BADGES = [
  { label: '100% Results Guarantee', Icon: StarIcon },
  { label: '700+ Success Stories', Icon: FlameIcon },
] as const;

export function StickyCta() {
  return (
    <div className="sdp-stuck on">
      <div className="sdp-stuck-inner">
        <a className="sdp-stuck-go" href={site.checkoutUrl}>
          {CTA_LABEL}
          <span className="arrow" aria-hidden>
            <ArrowRightIcon size={11} />
          </span>
        </a>
        <div className="sdp-stuck-risk">
          {BAR_BADGES.map(({ label, Icon }) => (
            <span className="sdp-stuck-badge" key={label}>
              <span className="sdp-stuck-badge-icon" aria-hidden>
                <Icon size={11} />
              </span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
