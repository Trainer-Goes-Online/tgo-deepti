import type { Metadata } from 'next';

/* The route's own stylesheet, loaded from the LAYOUT rather than the page:
   the page is a client component, and every other route on this build loads
   its CSS from a server file. Scoped `.dp-pay`, token-only. */
import '../checkout.css';

/**
 * The checkout carries its own metadata because its page is a client
 * component and a client component cannot export `metadata`.
 *
 * noindex is permanent here, not a pre-launch setting. A checkout in a search
 * result is a page somebody lands on with no idea what they are being asked to
 * pay for, and it splits the funnel's own analytics.
 */
export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your personalised health assessment.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
