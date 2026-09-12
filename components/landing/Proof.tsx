import { CtaLockup } from '@/components/shared/CtaLockup';
import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { TestimonialTile } from '@/components/landing/TestimonialTile';
import { asset } from '@/components/shared/asset-version';

/**
 * BEATS 3 / 4 · PROOF.
 *
 * Shape: PROOF-SET, twice over. TWO kinds of evidence, so two exhibit
 * forms (the blueprint's vary-adjacent-proof rule, applied inside one
 * section):
 *   A · 15 video testimonials  the client says it in their own face
 *   B · 32 before and afters   the same person, a year apart
 *
 * ── CHANGED 2026-09-09 (Atul) ──────────────────────────────────────────
 * The designed case-study cards are GONE, and so is the blood-report half
 * of the old paired exhibit. What was a three-group section built around
 * placeholders is now two groups built around assets that actually exist.
 *
 * Dropping the reports also drops a launch blocker with them: those images
 * carried patient names and needed redacting before they could ship.
 *
 * ── WHY THE BEFORE AND AFTERS ARE NOT CROPPED ──────────────────────────
 * They arrive at every ratio from 0.66 to 2.91, and most of them carry the
 * client's own words burned into the image. A uniform tile with
 * object-fit:cover would slice those captions off, which on a proof beat
 * means cropping away the actual testimony. So the rail is a FIXED HEIGHT
 * and every image keeps its own width. Ragged widths are the correct
 * outcome here: it reads as a set of real photographs rather than a
 * designed grid, which is what this evidence is.
 *
 * Server component.
 */

const TESTIMONIAL_RATIO = '9 / 16';

const TESTIMONIALS: { name: string; vimeoId: string }[] = [
  { name: 'Sriya', vimeoId: '1223587811' },
  { name: 'Rhea, Veena & Tanshree', vimeoId: '1223587806' },
  { name: 'Sthiti', vimeoId: '1223587871' },
  { name: 'Meethali', vimeoId: '1223587793' },
  { name: 'Smitha', vimeoId: '1223587856' },
  { name: 'Shruti', vimeoId: '1223587847' },
  { name: 'Poornima', vimeoId: '1223587801' },
  { name: 'Firdous', vimeoId: '1223587781' },
  { name: 'Eesha', vimeoId: '1223587738' },
  { name: 'Leena', vimeoId: '1223587736' },
  { name: 'Firuza', vimeoId: '1223587786' },
  { name: 'Anusha', vimeoId: '1223587735' },
  { name: 'Hemant', vimeoId: '1223587789' },
  { name: 'Divya', vimeoId: '1223587737' },
  { name: 'Anuja', vimeoId: '1223587883' },
];

/* Client-supplied 2026-09-09, /public/before-after. Filenames are the
   client's own exports and 24 of the 32 contain spaces, brackets or both,
   so each one is encodeURIComponent'd at render. The stems are left exactly
   as the client named them, which keeps the link back to whatever they hold
   on their side; only the extension changed.

   WebP 2026-09-09: 900px tall at q82, past 2x retina for a 380px rail.
   14.0MB became 1.3MB. WebP is the ONLY copy kept: the original exports were
   deleted on Atul's instruction. */
const BEFORE_AFTER: string[] = [
  '1617392290947.webp',
  '1617392394382.webp',
  '1617392498166.webp',
  '1617392508458.webp',
  '1617393049014.webp',
  '1617393470550.webp',
  'IMG-20240614-WA0003.webp',
  'IMG_20200826_004713 - Copy.webp',
  'IMG_20200826_004742.webp',
  'Screenshot 2025-10-17 at 3.13.57 PM.webp',
  'Screenshot 2025-10-17 at 3.14.05 PM.webp',
  'Screenshot 2026-09-01 at 2.40.08 AM.webp',
  'Screenshot 2026-09-01 at 2.40.43 AM.webp',
  'Screenshot 2026-09-01 at 2.40.55 AM.webp',
  'Screenshot 2026-09-01 at 2.41.09 AM.webp',
  'Screenshot 2026-09-01 at 2.41.19 AM.webp',
  'Screenshot 2026-09-01 at 2.41.26 AM.webp',
  'Screenshot 2026-09-01 at 2.42.55 AM.webp',
  'Screenshot 2026-09-01 at 2.43.02 AM.webp',
  'Screenshot 2026-09-01 at 2.43.06 AM.webp',
  'Screenshot 2026-09-01 at 2.43.16 AM.webp',
  'Screenshot 2026-09-01 at 2.43.25 AM.webp',
  'Screenshot 2026-09-01 at 2.43.33 AM.webp',
  'Shruti Transformation.webp',
  'photo_2026-09-01 02.44.27.webp',
  'photo_2026-09-01 02.44.34.webp',
  'photo_2026-09-01 02.44.45.webp',
  'photo_2026-09-01 02.44.51.webp',
  'photo_2026-09-01 02.44.55.webp',
  'photo_2026-09-01 02.44.58.webp',
  'photo_2026-09-01 02.45.20.webp',
  'photo_2026-09-01 02.48.03.webp',
];

export function Proof() {
  return (
    <section id="proof" className="sdp-proof sdp-dark">
      <div className="sdp-wrap">
        <SectionMasthead
          title={
            <>
              They Came To Lose Weight. They Changed Far More Than The Number On
              The <em>Scale.</em>
            </>
          }
          sub="See how clients improved their weight alongside the health conditions and markers they had been struggling with for years."
          delay=".06s"
        />

        {/* group A · 15 video testimonials, players mounted directly.
            THE TRACK IS DOUBLED, from 2026-09-12. It was a single copy
            running an animation that translates -50%, so the rail drifted
            left by half its own width and then SNAPPED back seven tiles.
            Every other rail on this page (the wins wall, the before-afters,
            the credential marquee) is doubled for exactly this reason; this
            one was the odd one out, and the snap is what made the counter-
            scroll against the before-after rail unreadable.

            Thirty players rather than fifteen is affordable because every
            tile is `loading="lazy"`: the second copy costs nothing until it
            approaches the viewport. The duplicate is `inert` as well as
            aria-hidden, which is also what PART 3's reduced-motion rule
            looks for when it drops the spare half. */}
        <div className="sdp-proof-group sdp-proof-rail is-vt">
          <div className="sdp-proof-track">
            {[0, 1].map((copy) =>
              TESTIMONIALS.map((t, i) => (
                <div
                  key={`vt-${copy}-${t.vimeoId}`}
                  data-sdp-reveal
                  style={{ '--d': `${0.04 + Math.min(i, 8) * 0.06}s` } as React.CSSProperties}
                  {...(copy === 1 ? { inert: true, 'aria-hidden': true } : {})}
                >
                  <TestimonialTile name={t.name} vimeoId={t.vimeoId} ratio={TESTIMONIAL_RATIO} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* group B · before and afters. Fixed height, natural widths, no crop. */}
        <div className="sdp-proof-group sdp-ba-rail" data-sdp-reveal>
          <div className="sdp-ba-track">
            {[0, 1].map((copy) =>
              BEFORE_AFTER.map((src) => (
                <figure className="sdp-ba" key={`${copy}-${src}`} aria-hidden={copy === 1 ? true : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(`/before-after/${encodeURIComponent(src)}`)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))
            )}
          </div>
        </div>

        <div className="sdp-proof-cta" data-sdp-reveal>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
