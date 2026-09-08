import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { MediaPlaceholder } from '@/components/shared/MediaPlaceholder';
import { asset } from '@/components/shared/asset-version';

/**
 * BEAT 4b — THE WHATSAPP WINS WALL.
 *
 * Shape: PROOF-SET, but the specific shape is VOLUME. The headline is
 * "hundreds of journeys, countless wins" — so the job is not to make any
 * one screenshot readable, it is to make the quantity felt at a glance.
 *
 * That is why it is two counter-scrolling rows and not a static grid, and
 * it is what the copy asks for: row 1 left→right, row 2 right→left. The
 * counter-motion is the argument. Ten tiles sitting still read as ten
 * wins, which is the opposite of the claim; ten tiles arriving from both
 * directions read as a stream you are seeing a slice of.
 *
 * Also the vary-adjacent-proof rule doing its job: this sits directly
 * under three exhibit grids and had to not be a fourth one.
 *
 * Hover pauses a row, so a win someone spotted can actually be read.
 * Reduced motion turns both rows into plain horizontal scrollers — the
 * proof stays, the reader just moves it by hand.
 *
 * Server component; the marquee is pure CSS.
 */

/* Five per row, in the copy's two rows. Empty = pending. */
const ROW_1: string[] = ['', '', '', '', ''];
const ROW_2: string[] = ['', '', '', '', ''];

function Row({ shots, dir, rowLabel }: { shots: string[]; dir: 'ltr' | 'rtl'; rowLabel: number }) {
  /* The track is duplicated so the -50% translate loops seamlessly.
     The copy is aria-hidden: a screen reader should hear each win once. */
  return (
    <div className={`sdp-wa-row ${dir}`}>
      <div className="sdp-wa-track">
        {[0, 1].map((copy) =>
          shots.map((src, i) => (
            <div
              className="sdp-wa-card"
              key={`${copy}-${i}`}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset(src)} alt="" width={640} height={800} loading="lazy" decoding="async" />
              ) : (
                <MediaPlaceholder
                  ratio="4 / 5"
                  label={`WhatsApp win ${rowLabel}.${i + 1}`}
                  note="crop to 4:5 · hide numbers"
                />
              )}
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
        <Row shots={ROW_1} dir="ltr" rowLabel={1} />
        <Row shots={ROW_2} dir="rtl" rowLabel={2} />
      </div>
    </section>
  );
}
