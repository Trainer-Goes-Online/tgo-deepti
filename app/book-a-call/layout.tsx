import type { Metadata } from 'next';

/* Same as the checkout and the thank-you: the stylesheet loads from the
   layout, which is a server component. Scoped `.dp-book`, token-only. */
import '../bookacall.css';

/**
 * A client page cannot export metadata, and a booking page must never be
 * indexed: it sits behind a payment and a stranger who lands on it from a
 * search result would be booking an assessment they have not bought.
 */
export const metadata: Metadata = {
  title: 'Book your assessment',
  description: 'Choose a time for your personalised health assessment.',
  robots: { index: false, follow: false },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
