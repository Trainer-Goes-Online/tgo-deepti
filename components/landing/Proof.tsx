import { CtaLockup } from '@/components/shared/CtaLockup';
import { SectionMasthead } from '@/components/shared/SectionMasthead';
import { MediaPlaceholder } from '@/components/shared/MediaPlaceholder';
import { TestimonialTile } from '@/components/landing/TestimonialTile';
import { asset } from '@/components/shared/asset-version';

/**
 * BEATS 3 / 4 — PROOF.
 *
 * Shape: PROOF-SET, three times over. The copy lists three separate
 * groups, and they are three different KINDS of evidence:
 *   A · 15 video testimonials  — the client says it in their own face
 *   B · 5 case-study cards     — a designed summary of one journey
 *   C · 5 before/after + report PAIRS — the body and the bloodwork
 *
 * So they get three different exhibit forms (the blueprint's
 * vary-adjacent-proof rule, applied inside one section). Three identical
 * grids would collapse into one wall the reader scans none of.
 *
 * Group C is the one that matters most and it is built as a PAIR, not as
 * ten tiles. The whole claim of this funnel is that the weight and the
 * markers moved together, in the same person — split the photo from the
 * report and the reader has no way to know they belong to each other.
 * One card, one ordinal, one seam: the pairing is the argument.
 *
 * Every slot is a labelled placeholder at the real asset's ratio. The
 * video tiles' play discs are dashed and inert until footage exists.
 *
 * Server component.
 */

/* Real files drop in here, in order. Empty = still pending. Every path
   goes through asset() so a re-crop under the same filename actually
   reaches returning visitors (bump ASSET_V in the same pass). */
/* GROUP A · the 15 video testimonials. Vimeo ids client-supplied 2026-09-08.
   Each tile mounts the Vimeo player directly, so Vimeo supplies the thumbnail
   and the play control and there are no poster frames to source.

   ASPECT RATIO IS AN ASSUMPTION. The tile group was designed 9:16 for vertical
   testimonial clips and the ids could not be checked against Vimeo from here.
   If these films are landscape, change this ONE constant and the tiles, the
   placeholders and the players all follow. */
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
const CASE_CARDS: string[] = ['', '', '', '', ''];
const PAIRS: { ba: string; report: string }[] = [
  { ba: '', report: '' },
  { ba: '', report: '' },
  { ba: '', report: '' },
  { ba: '', report: '' },
  { ba: '', report: '' },
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

        {/* ── group A · 15 video testimonials, players mounted directly ──
             The track no longer duplicates the set. Duplication existed to
             make four tiles fill a marquee; fifteen fill it on their own, and
             thirty tiles would mean thirty Vimeo players in the DOM. */}
        <div className="sdp-proof-group sdp-proof-rail is-vt">
          <div className="sdp-proof-track">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={`vt-${t.vimeoId}`}
              data-sdp-reveal
              style={{ '--d': `${0.04 + Math.min(i, 8) * 0.06}s` } as React.CSSProperties}
            >
              <TestimonialTile
                name={t.name}
                vimeoId={t.vimeoId}
                ratio={TESTIMONIAL_RATIO}
              />
            </div>
          ))}
          </div>
        </div>

        {/* ── group B · designed case-study cards (4:5) ──────────────── */}
        <div className="sdp-proof-group sdp-proof-rail is-case">
          <div className="sdp-proof-track">
          {[...CASE_CARDS, ...CASE_CARDS].map((src, i) => (
            <div
              className="sdp-case-tile"
              key={`case-${i}`}
              aria-hidden={i >= CASE_CARDS.length || undefined}
              inert={i >= CASE_CARDS.length || undefined}
              data-sdp-reveal
              style={{ '--d': `${0.04 + i * 0.05}s` } as React.CSSProperties}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset(src)} alt="" width={800} height={1000} loading="lazy" decoding="async" />
              ) : (
                <MediaPlaceholder
                  ratio="4 / 5"
                  label={`Case study card ${i + 1} of 5`}
                  note="4:5 · designed card"
                />
              )}
            </div>
          ))}
          </div>
        </div>

        {/* ── group C · before/after + report, PAIRED ─────────────────── */}
        <div className="sdp-proof-group sdp-proof-rail is-pair">
          <div className="sdp-proof-track">
          {[...PAIRS, ...PAIRS].map((p, i) => (
            <article
              className="sdp-pair"
              key={`pair-${i}`}
              aria-hidden={i >= PAIRS.length || undefined}
              inert={i >= PAIRS.length || undefined}
              data-sdp-reveal
              style={{ '--d': `${0.04 + i * 0.05}s` } as React.CSSProperties}
            >
              <header className="sdp-pair-head">
                <span className="sdp-pair-ord">{String(i + 1).padStart(2, '0')}</span>
                <span className="sdp-pair-rule" aria-hidden />
              </header>

              <div className="sdp-pair-body">
                <div className="sdp-pair-pane ba">
                  {p.ba ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(p.ba)} alt="" width={800} height={1000} loading="lazy" decoding="async" />
                  ) : (
                    <MediaPlaceholder
                      ratio="4 / 5"
                      label={`Before & after ${i + 1}`}
                      note="4:5 · same client as report"
                    />
                  )}
                  <span className="sdp-pair-cap">Before &amp; after</span>
                </div>

                <span className="sdp-pair-seam" aria-hidden />

                <div className="sdp-pair-pane report">
                  {p.report ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(p.report)} alt="" width={750} height={1000} loading="lazy" decoding="async" />
                  ) : (
                    <MediaPlaceholder
                      ratio="3 / 4"
                      label={`Report ${i + 1}`}
                      note="3:4 · markers redacted of name"
                    />
                  )}
                  <span className="sdp-pair-cap">Report</span>
                </div>
              </div>
            </article>
          ))}
          </div>
        </div>

        <div className="sdp-proof-cta" data-sdp-reveal>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
