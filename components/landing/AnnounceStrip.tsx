/**
 * BEAT 0a — ANNOUNCEMENT STRIP.
 *
 * Shape: why-now / standing proof. Category §11 Urgency, rendered as the
 * page-chrome announcement bar. Not gated by THE GATE — it is chrome, not
 * a section.
 *
 * Copy (verbatim):
 *   "10+ YEARS OF COACHING EXPERIENCE | Up to 15 KGS LOST PER CLIENT"
 *
 * Each figure renders as a lit number chip + a white label rather than one
 * bolded run: bright accent text on the accent bar has almost no contrast
 * and reads as blended. The number sits in a dark chip so it actually
 * reads as the number. Static, not a marquee: two short claims scrolling
 * past is harder to read than two short claims standing still.
 *
 * Server component. The only motion is the CSS dot pulse.
 */
const ITEMS = [
  { num: '10+', label: 'Years Of Coaching Experience' },
  { num: 'Up to 15', label: 'KGS Lost Per Client' },
] as const;

export function AnnounceStrip() {
  return (
    <div className="sdp-announce" role="note">
      <span className="sdp-announce-dot" aria-hidden />
      <span className="sdp-announce-copy">
        {ITEMS.map((it, i) => (
          <span className="sdp-announce-item" key={it.label}>
            {i > 0 && (
              <span className="sdp-announce-sep" aria-hidden>
                |
              </span>
            )}
            <b className="sdp-announce-num">{it.num}</b>
            <span className="sdp-announce-label">{it.label}</span>
          </span>
        ))}
      </span>
    </div>
  );
}
