import type { Metadata } from 'next';

/* Same as the checkout: the stylesheet loads from the layout, which is a
   server component. Scoped `.dp-ty`, token-only apart from the two documented
   WhatsApp brand greens. */
import '../thankyou.css';

/**
 * As with the checkout: a client page cannot export metadata, and a
 * confirmation page must never be indexed. It is reachable only with a payment
 * id on the query string, and a crawler that finds it indexes a page telling
 * strangers their assessment is confirmed.
 */
export const metadata: Metadata = {
  /* Matches the hero since 2026-10-01: the assessment is not confirmed until
     the buyer messages the team, so the tab must not say it is. */
  title: 'One more step to confirm your assessment',
  description: 'Payment received.',
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
