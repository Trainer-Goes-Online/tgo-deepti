import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { asset } from '@/components/shared/asset-version';

/**
 * BEAT 4b · THE WHATSAPP WINS WALL.
 *
 * Shape: PROOF-SET, but the specific shape is VOLUME. The headline is
 * "hundreds of journeys, countless wins", so the job is not to make any
 * one screenshot readable, it is to make the quantity felt at a glance.
 *
 * That is why it is two counter-scrolling rows and not a static grid, and
 * it is what the copy asks for: row 1 left to right, row 2 right to left.
 * The counter-motion is the argument. Ten tiles sitting still read as ten
 * wins, which is the opposite of the claim; tiles arriving from both
 * directions read as a stream you are seeing a slice of.
 *
 * Also the vary-adjacent-proof rule doing its job: this sits directly
 * under three exhibit grids and had to not be a fourth one.
 *
 * Hover pauses a row, so a win someone spotted can actually be read.
 * Reduced motion turns both rows into plain horizontal scrollers: the
 * proof stays, the reader just moves it by hand.
 *
 * Server component; the marquee is pure CSS.
 */

/* Client-supplied 2026-09-09: 104 chat screenshots in /public/testimonials.
   The copy asked for five a row. There are 104, so the claim the section
   makes ("hundreds of journeys") is now actually carried by the section
   rather than asserted by the headline over ten tiles.

   Split ALTERNATELY, not down the middle: the files are numbered in the
   order they were exported, so a straight half would put one continuous
   run in each row and the two rows would drift as visibly related blocks.
   Alternating makes each row read as an independent stream.

   Converted to WebP 2026-09-09: 460px wide at q78, which is past 2x retina
   for a 208px tile. 13.2MB became 4.8MB. WebP is the ONLY copy kept: the
   original exports were deleted on Atul's instruction, so re-encoding these
   larger would mean re-exporting them from source.

   The row duration and the tile ratio are retuned in PART 3d of landing.css:
   a track this long at the original 48s would strobe past, and these are
   phone screenshots at roughly 0.45, so a 4:5 crop cut them mid-message. */
const ROW_1: string[] = [
  '1.webp',
  '3.webp',
  '5.webp',
  '7.webp',
  '9.webp',
  '11.webp',
  '13.webp',
  '15.webp',
  '17.webp',
  '19.webp',
  '21(1).webp',
  '22.webp',
  '24.webp',
  '26.webp',
  '28.webp',
  '30.webp',
  '32.webp',
  '34.webp',
  '36.webp',
  '38.webp',
  '40.webp',
  '42.webp',
  '44.webp',
  '46.webp',
  '48.webp',
  '50.webp',
  '52.webp',
  '54.webp',
  '56.webp',
  '58.webp',
  '60.webp',
  '62.webp',
  '64.webp',
  '66.webp',
  '68.webp',
  '70.webp',
  '72.webp',
  '74.webp',
  '76.webp',
  '78.webp',
  '80.webp',
  '82.webp',
  '84.webp',
  '86.webp',
  '88.webp',
  '90.webp',
  '92.webp',
  '94.webp',
  '96.webp',
  '98.webp',
  '100.webp',
  '102.webp',
];

const ROW_2: string[] = [
  '2.webp',
  '4.webp',
  '6.webp',
  '8.webp',
  '10.webp',
  '12.webp',
  '14.webp',
  '16.webp',
  '18.webp',
  '20.webp',
  '21.webp',
  '23.webp',
  '25.webp',
  '27.webp',
  '29.webp',
  '31.webp',
  '33.webp',
  '35.webp',
  '37.webp',
  '39.webp',
  '41.webp',
  '43.webp',
  '45.webp',
  '47.webp',
  '49.webp',
  '51.webp',
  '53.webp',
  '55.webp',
  '57.webp',
  '59.webp',
  '61.webp',
  '63.webp',
  '65.webp',
  '67.webp',
  '69.webp',
  '71.webp',
  '73.webp',
  '75.webp',
  '77.webp',
  '79.webp',
  '81.webp',
  '83.webp',
  '85.webp',
  '87.webp',
  '89.webp',
  '91.webp',
  '93.webp',
  '95.webp',
  '97.webp',
  '99.webp',
  '101.webp',
  '103.webp',
];

function Row({ shots, dir }: { shots: string[]; dir: 'ltr' | 'rtl' }) {
  /* The track is duplicated so the -50% translate loops seamlessly.
     The copy is aria-hidden: a screen reader should hear each win once. */
  return (
    <div className={`sdp-wa-row ${dir}`}>
      <div className="sdp-wa-track">
        {[0, 1].map((copy) =>
          shots.map((src) => (
            <div
              className="sdp-wa-card"
              key={`${copy}-${src}`}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(`/testimonials/${src}`)}
                alt=""
                width={739}
                height={1314}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function WhatsAppWall() {
  return (
    <section id="wins" className="sdp-wa sdp-light-alt">
      <div className="sdp-wrap">
        <SectionMasthead
          title={
            <>
              Hundreds Of Health Journeys.
              <br />
              Countless <em>Wins</em> Along The Way.
            </>
          }
          sub="Here's a small glimpse into our clients' journeys."
          delay=".06s"
        />
      </div>

      {/* full-bleed: the rows must run past the container edges or the
          "stream" reads as a box of five */}
      <div className="sdp-wa-rows" data-sdp-reveal>
        <Row shots={ROW_1} dir="ltr" />
        <Row shots={ROW_2} dir="rtl" />
      </div>
    </section>
  );
}
