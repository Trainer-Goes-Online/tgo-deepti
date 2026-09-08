import './landing.css';

import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { AnnounceStrip } from '@/components/landing/AnnounceStrip';
import { TrustRow } from '@/components/landing/TrustRow';
import { Hero } from '@/components/landing/Hero';
import { ForYouIf } from '@/components/landing/ForYouIf';
import { Proof } from '@/components/landing/Proof';
import { WhatsAppWall } from '@/components/landing/WhatsAppWall';
import { Coach } from '@/components/landing/Coach';
import { Programme } from '@/components/landing/Programme';
import { Guarantee } from '@/components/landing/Guarantee';
import { Faq } from '@/components/landing/Faq';
import { Finale } from '@/components/landing/Finale';
import { StickyCta } from '@/components/landing/StickyCta';

/**
 * The landing page — VSL blueprint, SDP component system, oxblood + amber on cream.
 *
 * Everything lives under a single `.sdp-root` wrapper: the skin is scoped
 * to it, so nothing here can leak into the checkout / thank-you / legal
 * routes that LAUNCH owns.
 *
 * THE WHOLE PAGE, beat by beat, with its band:
 *
 *   0a  announcement strip   §11 Urgency (chrome)   accent bar
 *   0b  trust row            §12 Authority          light-alt strip
 *   1   hero / VSL           §8  Focal media        LIGHT      ← lockup 1
 *   2   this is for you if   §2  one-sided ✓ list   LIGHT      ← lockup 2
 *   3/4 proof, three groups  §6  Proof              LIGHT      ← lockup 3
 *   4b  whatsapp wins wall   §6  Proof (volume)     LIGHT-ALT
 *   5a  credential marquee   §12 Authority          DARK       ← lockup 4
 *   5b  the coach's story    (no shape) TEXT        DARK
 *   7   what's included      §3  Accumulation       LIGHT-ALT  ← lockup 5
 *   8   guarantee            assurance + seal       DARK       ← lockup 6
 *   10  faq                  §5  Objection ledger   LIGHT
 *   11  final cta            the peak               DARK       ← lockup 7
 *   12  sticky cta           chrome                 dark glass
 *
 * TWO BEATS ARE ABSENT ON PURPOSE:
 *   6 · Mechanism — the copy carries the liver mechanism only as the hero
 *       deck sentence. There is no mechanism content to render, and
 *       building a pillar grid out of one sentence would be inventing
 *       structure the meaning does not have. Flagged for NO-BRAINER.
 *   9 · Two Choices — optional in the blueprint, and there is no decision
 *       copy anywhere in the source. Cut, as it was for Kunal.
 *
 * The dark bands land where the skin says they land: authority (coach),
 * risk (guarantee), and the peak (finale). Nowhere else.
 */
export default function LandingPage() {
  return (
    <main className="sdp-root">
      <ScrollReveal />
      <AnnounceStrip />
      <TrustRow />
      <Hero />
      <ForYouIf />
      <Proof />
      <WhatsAppWall />
      <Coach />
      <Programme />
      <Guarantee />
      <Faq />
      <Finale />
      <StickyCta />
    </main>
  );
}
