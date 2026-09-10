import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Mono, Manrope } from 'next/font/google';
import './globals.css';

import Analytics from '@/components/shared/Analytics';
import MetaPixel from '@/components/shared/MetaPixel';

/* THREE VOICES (design-system.base.md, C1). The aqua build ran two sans and
   no mono, which is the base file's first-listed failure mode and the reason
   the page read cheap rather than clinical.

   DISPLAY = Fraunces, a high-contrast editorial serif. Stroke contrast is what
   actually reads expensive; weight does not. This reverses the earlier
   Oswald-to-Jakarta call, and deliberately: that call was made to move AWAY
   from the editorial register, back when the palette was aqua and coral. The
   palette is now bone and ink, so the register it was avoiding is the target. */
const display = Fraunces({
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/* SPEC = IBM Plex Mono. The credibility voice, and the one this page was
   missing most: it is 40% lab data (HbA1c, LDL, fatty liver grades, 700+,
   12wk, 5.0, 97). Mono makes a number read as a measurement instead of a
   marketing figure. Plex specifically because it is the report-paper mono,
   not a code-editor one. */
const mono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

/* BODY = Manrope. Unchanged. The neutral voice stays neutral. */
const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lose 5-15 Kilos, Even If You Have (Pre)Diabetes, Fatty Liver, Cholesterol or Hypothyroidism',
  description:
    'A personalised, root-cause approach that focuses on healing your liver, the master organ connecting your weight & metabolic health. 700+ clients across India, USA, Canada, UK, Australia & The Middle East.',
  robots: { index: false, follow: false }, // pre-launch: assets + figures not yet final
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${manrope.variable}`}>
      <body>
        {children}

        {/* ── TAGS, MOUNTED HERE AND NOWHERE ELSE ───────────────────────
            Both render nothing when their env ids are missing, so an
            unfilled variable leaves no broken script tag behind.

            They mount in the ROOT layout rather than on the landing page
            because both have work to do on every surface. MetaPixel also
            captures first-touch attribution and the _fbc cookie, and it
            does that ABOVE its own pixel-id guard: a retargeting ad or an
            email can drop somebody straight onto /checkout, and that visit
            is the only one carrying the campaign. Attribution must not go
            dark because a pixel id is unset.

            Analytics is the GA4 base tag. It is part of this build and not
            a snippet somebody pastes in later, because every GA4 call in
            lib/ga4.ts checks for window.gtag and returns quietly when it is
            absent: without a base tag the whole browser funnel silently
            does nothing while the webhook keeps reporting purchases through
            the Measurement Protocol, and GA4 then shows revenue with no
            funnel above it. That is harder to spot than an empty property,
            not easier. ────────────────────────────────────────────────── */}
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
