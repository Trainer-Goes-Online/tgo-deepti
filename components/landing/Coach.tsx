import { CtaLockup } from '@/components/shared/CtaLockup';
import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { MediaPlaceholder } from '@/components/shared/MediaPlaceholder';
import { asset } from '@/components/shared/asset-version';

/**
 * BEATS 5a / 5b — MEET YOUR COACH.  DARK BAND.
 *
 * The band rhythm puts dark on the two gravity beats: authority and risk.
 * This is authority, so it is the page's first dark band.
 *
 * 5b IS THE BLUEPRINT'S ONE RELIABLY-TEXT BEAT, and it holds here. Three
 * paragraphs of "for over ten years she noticed the same pattern" is
 * narrative prose. It has no sequence, no contrast, no set — nothing to
 * render. Cutting it into three numbered cards would be the design
 * version of padding: it would look like more structure and carry less
 * meaning, and the one thing a founder story has to sound like is a
 * person talking. So it stays prose, set with a real measure (62ch), a
 * generous 1.85 line height, and a single drop cap to mark where the
 * voice changes from the page's to hers.
 *
 * 5a IS structure: the third paragraph resolves into a credential SET —
 * Cult Fit, AAFT School of Health & Wellness, Habuild. §12 Authority,
 * rendered as the right-to-left logo marquee the copy asks for. Those
 * three names are the ONLY organisations Deepti's own bio claims, so the
 * marquee slots are labelled with them rather than with "logo 1, logo 2":
 * nothing here is invented, and whoever sources the logos knows exactly
 * which three to ask for.
 *
 * Server component.
 */

/* Client-supplied 2026-09-09. Converted to WebP at 1120px wide, q82: the
   frame is 360px on desktop and up to 560px in the single-column breakpoint,
   so 1120 is 2x the widest it is ever drawn. 23.1MB became 81KB.

   Native 2:3 is kept rather than pre-cropped to the frame's 4:5, so the frame
   can change later without needing the source again. The centred cover crop
   takes roughly 384px off the top and the same off the bottom, which leaves
   her head plenty of room and trims the seat, checked against the file. */
const PHOTO = '/deepti.webp';

/* The organisations named in Deepti's own bio, in the order she names them.
   Logos client-supplied 2026-09-09, converted to WebP (alpha preserved).

   All three are DARK ink on transparent: cult.fit is black, AAFT is red and
   navy, Habuild is navy. That is why PART 3f flips the tile to a light one.
   A dark mark on the dark garnet tile PART 2 ships would have rendered three
   invisible rectangles, and the fix is never to recolour someone else's
   trademark to fit our band. */
const CREDENTIALS: { org: string; role: string; src: string }[] = [
  { org: 'Cult Fit', role: 'Top Nutritionist', src: '/logos/cult_fit_logo-freelogovectors.net_.webp' },
  { org: 'AAFT School of Health & Wellness', role: 'Advisory Board', src: '/logos/aaftuniversitylogo.webp' },
  { org: 'Habuild', role: 'Hormonal & Liver Detox', src: '/logos/habuild.webp' },
];

export function Coach() {
  /* repeated so the -50% marquee translate loops seamlessly */
  const track = [...CREDENTIALS, ...CREDENTIALS, ...CREDENTIALS, ...CREDENTIALS];

  return (
    <section id="coach" className="sdp-coach sdp-light">
      <div className="sdp-wrap">
        <SectionMasthead
          eyebrow="Meet Your Coach"
          title={
            <>
              The Nutritionist Who Goes <em>Deeper</em> Than Diets, Calories &amp;
              Exercise.
            </>
          }
          delay=".06s"
        />

        <div className="sdp-coach-grid">
          <div
            className="sdp-coach-photo"
            data-sdp-reveal
            style={{ '--d': '.10s' } as React.CSSProperties}
          >
            {PHOTO ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(PHOTO)} alt="Deepti" width={800} height={1000} loading="lazy" decoding="async" />
            ) : (
              <MediaPlaceholder
                ratio="4 / 5"
                label="Deepti — solo portrait"
                note="4:5 · shot on a plain wall"
              />
            )}
          </div>

          {/* 5b — prose, set as prose */}
          <div
            className="sdp-coach-body"
            data-sdp-reveal
            style={{ '--d': '.16s' } as React.CSSProperties}
          >
            <p className="lede">
              For over 10 years, Deepti has worked with men and women struggling
              with far more than just excess weight. Fatty liver, diabetes,
              thyroid issues, high cholesterol, hormonal concerns and gut issues
              often showed up alongside it.
            </p>
            <p>
              Over the years, she noticed the same pattern repeatedly: these
              problems rarely existed in isolation. This shaped her root-cause
              approach, combining personalised nutrition and lifestyle changes to
              work on the bigger health picture rather than treating every
              condition separately.
            </p>
            <p>
              Her work over the last decade has earned her recognition as Top
              Nutritionist at Cult Fit, a place on the Advisory Board at AAFT
              School of Health &amp; Wellness, and the opportunity to lead
              Hormonal &amp; Liver Detox programmes at Habuild. Today, alongside
              her qualified team, she helps clients across India &amp; globally
              achieve sustainable weight loss and better metabolic health.
            </p>
          </div>
        </div>

        {/* 5a — the credential set */}
        <div className="sdp-logos" data-sdp-reveal>
          <div className="sdp-logo-track">
            {track.map((c, i) => (
              <div className="sdp-logo-tile" key={`${c.org}-${i}`} aria-hidden={i >= CREDENTIALS.length ? true : undefined}>
                {c.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset(c.src)} alt={c.org} width={380} height={152} loading="lazy" decoding="async" />
                ) : (
                  <MediaPlaceholder ratio="5 / 2" label={c.org} note={c.role} />
                )}
                {/* THE POSITION IS THE POINT. A logo says she was in the room;
                    the position says what she was doing there, and it is the
                    half the bio actually claims: "Top Nutritionist at Cult
                    Fit, a place on the Advisory Board at AAFT, the
                    opportunity to lead Hormonal & Liver Detox programmes at
                    Habuild". It used to render only inside the placeholder,
                    so it disappeared the moment real logos landed. */}
                <span className="sdp-logo-role">{c.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sdp-coach-cta" data-sdp-reveal>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
