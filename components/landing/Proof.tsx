import { CtaLockup } from '@/components/shared/CtaLockup';
import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { TestimonialTile } from '@/components/landing/TestimonialTile';
import { asset } from '@/components/shared/asset-version';
import { StarIcon } from '@/components/shared/icons';

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
  { name: 'Leena', vimeoId: '1228050093' },
  { name: 'Firuza', vimeoId: '1223587786' },
  { name: 'Anusha', vimeoId: '1223587735' },
  { name: 'Hemant', vimeoId: '1228050092' },
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

/* ── WRITTEN CASE STUDIES (2026-09-19, Atul) ───────────────────────────
 * The video rail shows faces; these show the markers. Both are the same
 * proof beat, so they live in the same section, but a reader scanning for
 * "did it work on someone with MY report" cannot get that from a thumbnail.
 *
 * COPY IS THE CLIENT'S, REPRODUCED VERBATIM. Ages, star counts, bodies and
 * every stat line are exactly as supplied.
 *
 * EACH STAT IS ONE WHOLE STRING, not a value/label pair. The reference this
 * was modelled on splits its stats into a big figure over a small caption,
 * and most of these lines would split that way ("GRADE 3 → GRADE 1" over
 * "FATTY LIVER"), but several would not ("FATTY LIVER → BORDERLINE",
 * "URIC ACID → NORMAL RANGE"). Splitting the ones that fit and inventing a
 * caption for the ones that do not is how a proof beat ends up with words
 * the client never wrote. So the line is kept whole and the arrow carries
 * the emphasis instead. See the note to Atul if the two-tier look is wanted.
 */
type CaseStudy = {
  readonly name: string;
  readonly age: string;
  readonly body: string;
  readonly stats: readonly string[];
};

const CASE_STUDIES: readonly CaseStudy[] = [
  {
    name: 'Jyoti',
    age: '51',
    body: 'In just 3 months, Jyoti saw significant improvement in her liver health and overall wellbeing. She came in with a sedentary lifestyle, low energy, poor appetite and Grade 3 fatty liver. Within 60 days, her fatty liver improved to Grade 2, and by the end of 3 months it had improved further to Grade 1, alongside better energy, appetite and sleep.',
    stats: ['60 → 55 KG', 'GRADE 3 → GRADE 1 FATTY LIVER', '5 KG WEIGHT REDUCTION', '3 Months DURATION'],
  },
  {
    name: 'Sthiti',
    age: '40',
    body: 'Sthiti came in with Grade 2 fatty liver, elevated uric acid, an ovarian cyst and subserosal myoma, along with bloating, heaviness and post-meal energy crashes. Over 4 months, her energy and digestion improved, her uric acid returned to the normal range, her fatty liver became borderline, the ovarian cyst reduced in size and her subserosal myoma completely reduced.',
    stats: ['75 → 63 KG', 'FATTY LIVER → BORDERLINE', 'URIC ACID → NORMAL RANGE', '4 Months DURATION'],
  },
  {
    name: 'Agrima',
    age: '27',
    body: 'Agrima had been dealing with irregular periods for 10 years, significant gut issues, fatty liver, elevated BP, acne and hair fall. Her menstrual cycle was around 45 days when she joined. Within just 1 month, her cycle returned to around 30 days, and by the end of 4 months her gut health, BP, skin, sleep and menstrual health had improved significantly.',
    stats: ['45 → 30 DAYS MENSTRUAL CYCLE', '82 → 76.2 KG', 'BP → NORMAL LEVELS', '4 Months DURATION'],
  },
  {
    name: 'Arshad',
    age: '56',
    body: 'Arshad came in with a demanding work schedule, a congenital single kidney, elevated HbA1c, deranged liver function tests, elevated BP and poor gut health. Within 4 months, he lost 10 kg, achieved visible inch loss, improved his digestion and sleep, and brought his HbA1c and liver function tests within range.',
    stats: ['76 → 66 KG', '36.5 → 32 IN WAIST', '38 → 34 IN STOMACH', '4 Months DURATION'],
  },
  {
    name: 'Subhojit',
    age: '45',
    body: 'Subhojit came in with Grade 2 fatty liver with fibrosis, frequent alcohol consumption, irregular eating, poor appetite and significant digestive issues. Over 4 months, his digestion, sleep and appetite improved substantially, while his liver assessment changed to Grade 1 fatty liver with no fibrosis detected and multiple blood markers improved.',
    stats: ['GRADE 2 + FIBROSIS → GRADE 1 + NO FIBROSIS', '2803 → 81 GGT', '21.9 → 8.61 HOMOCYSTEINE', '4 Months DURATION'],
  },
  {
    name: 'Kulpriya',
    age: '33',
    body: 'Despite working out regularly and eating healthy, Kulpriya was struggling to lose fat, especially around her belly. She was also dealing with Grade 1 fatty liver, bloating, gas, acne, pigmentation and multiple food sensitivities linked to an autoimmune condition. With a personalised nutrition approach focused on foods that suited her body, she lost around 5 kg, improved her digestion and skin health, and her Grade 1 fatty liver healed.',
    stats: ['~5 KG FAT LOSS', 'GRADE 1 → HEALED FATTY LIVER', 'DIGESTIVE ISSUES → BETTER MANAGED', 'SKIN HEALTH → NOTICEABLY IMPROVED'],
  },
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

        {/* group C · the written case studies, after both rails.
            Same doubled-track marquee as group A, and for the same reason:
            a single copy animating to -50% drifts left by half its own width
            and then snaps. The duplicate is `inert` as well as aria-hidden,
            which is what PART 3's reduced-motion rule keys on when it drops
            the spare half.

            It rides the EXISTING `is-case` rail variant, which was already in
            landing.css (duration, tile width, mobile width, reduced-motion)
            from an earlier design and had no markup using it. Reusing it
            rather than adding a parallel set of rules is why this needed
            almost no new CSS. */}
        <div className="sdp-proof-group sdp-proof-rail is-case" data-sdp-reveal>
          <div className="sdp-proof-track">
            {[0, 1].map((copy) =>
              CASE_STUDIES.map((c) => (
                <article
                  className="sdp-case-tile"
                  key={`cs-${copy}-${c.name}`}
                  {...(copy === 1 ? { inert: true, 'aria-hidden': true } : {})}
                >
                  <div className="sdp-cs-head">
                    <h3 className="sdp-cs-name">{c.name}</h3>
                    <span className="sdp-cs-age">{c.age}</span>
                  </div>

                  <span className="sdp-cs-stars" aria-label="Rated 5 out of 5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <StarIcon key={s} size={13} />
                    ))}
                  </span>

                  <p className="sdp-cs-body">{c.body}</p>

                  {/* The arrow is tinted by SPLITTING ON IT, never by rewriting
                      the line: the words stay exactly as supplied and only the
                      glyph between them is coloured. */}
                  <ul className="sdp-cs-stats">
                    {c.stats.map((s) => (
                      <li key={s}>
                        {s.split('→').map((part, idx) => (
                          <span key={idx}>
                            {idx > 0 ? (
                              <i className="sdp-cs-arrow" aria-hidden>
                                →
                              </i>
                            ) : null}
                            {part}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </article>
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
