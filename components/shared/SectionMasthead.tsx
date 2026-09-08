/**
 * The section masthead, identical at every beat:
 *   uppercase dash-eyebrow → display H2 (one word lit via <em>) → deck.
 *
 * Eyebrows are ALWAYS uppercase, every section — set here rather than
 * left to each caller so it cannot drift.
 */
export function SectionMasthead({
  eyebrow,
  title,
  sub,
  delay = '0s',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  delay?: string;
}) {
  return (
    <>
      {eyebrow && (
        <div className="sdp-eyebrow center" data-sdp-reveal>
          {eyebrow}
        </div>
      )}
      <h2
        className="sdp-h2"
        data-sdp-reveal
        style={{ '--d': delay } as React.CSSProperties}
      >
        {title}
      </h2>
      {sub && (
        <p
          className="sdp-sub"
          data-sdp-reveal
          style={{ '--d': delay } as React.CSSProperties}
        >
          {sub}
        </p>
      )}
    </>
  );
}
