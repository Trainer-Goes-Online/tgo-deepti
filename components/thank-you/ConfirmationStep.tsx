import { business } from '@/lib/site';
import { asset } from '@/components/shared/asset-version';
import { WhatsappIcon } from '@/components/shared/icons';
import './ConfirmationStep.css';

/**
 * THE BRIDGE · hero of /thank-you (2026-10-01, Atul).
 *
 * The booking alone does not confirm the call: the buyer still has to open
 * WhatsApp and get the next step from the team. So the page's first beat is
 * a stop sign rather than a celebration, and its one job is that click.
 *
 * Layout follows the client's reference (headline, circular portrait, two
 * lines, one button); every colour, face and radius is the funnel's own
 * token, so it reads as the same company as the landing page.
 *
 * Server-safe: no state, no effects. Rendered inside the client page.
 */

/* Pre-filled so the first message is a question the team can answer, not
   "hi". Number from the single business source, never a second literal. */
const WA_TEXT = "Hey, I've booked a call. What's the next step to confirm my call?";
const WA_URL = `https://api.whatsapp.com/send/?phone=${business.phoneE164.replace(
  /\D/g,
  '',
)}&text=${encodeURIComponent(WA_TEXT)}&type=phone_number&app_absent=0`;

/* The same portrait the coach beat uses. Native 2:3, so the circle crops
   it with object-position (see CSS), keeping her face in the frame. */
const PHOTO = '/deepti.webp';

export function ConfirmationStep({
  imageSrc = asset(PHOTO),
  imageAlt = 'Deepti Sherawat',
  whatsappUrl = WA_URL,
}: {
  imageSrc?: string;
  imageAlt?: string;
  whatsappUrl?: string;
}) {
  return (
    <section className="cs-step" aria-labelledby="cs-title">
      <div className="cs-wrap">
        {/* "Assessment", not "strategy call": the landing copy names it a
            personalised health assessment everywhere (FAQ 1, the offer
            stack), and the page the buyer just left says the same. */}
        <h1 id="cs-title" className="cs-title">
          <span className="cs-alert">WAIT!</span> Your Assessment Has Not Been
          Confirmed Yet...
        </h1>

        <span className="cs-avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={imageAlt} width={480} height={480} decoding="async" />
        </span>

        <div className="cs-copy">
          <p>
            You&rsquo;ve just <strong>completed the first step</strong>.
          </p>
          <p>
            Connect on WhatsApp to{' '}
            <strong>get the next steps to confirm your assessment</strong>.
          </p>
        </div>

        <a className="cs-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <WhatsappIcon size={24} />
          Click Here
        </a>
      </div>

      {/* ── STICKY BAR, phones only (2026-10-01, Atul) ─────────────────
          Same shape as the landing's bar: cream, top hairline, one centred
          pill. Painted with the first frame: no observer, no transition, no
          reveal, because the tap it asks for is the whole point of the page.
          Its label carries the context "Click Here" gets from the hero, since
          the bar is read after the hero has scrolled away. The page reserves
          room for it at the bottom (thankyou.css), so it never covers the
          footer's business details. */}
      <div className="cs-stuck">
        <a className="cs-stuck-go" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <WhatsappIcon size={20} />
          Click Here To Confirm
        </a>
      </div>
    </section>
  );
}
