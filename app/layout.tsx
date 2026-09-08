import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Mono, Manrope } from 'next/font/google';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
