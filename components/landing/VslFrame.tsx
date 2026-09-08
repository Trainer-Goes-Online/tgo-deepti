/**
 * BEAT 1 (focal) — THE VSL FRAME.
 *
 * §8 Focal media. The player is mounted directly: Vimeo draws its own
 * thumbnail and its own play control, so the frame no longer carries a
 * poster, a placeholder or a custom disc.
 *
 * That removes the honesty problem the earlier version was built around.
 * There is no longer a decorative play affordance that might front nothing,
 * because the only play button on the page is the real player's.
 *
 * NOT lazy-loaded, deliberately: this sits above the fold and is the beat
 * the whole page hands off to. The testimonial tiles further down are lazy.
 *
 * Server component (no state left to hold).
 */
const VIMEO_ID = '1224198548';

export function VslFrame() {
  return (
    <div
      className="sdp-vsl-frame"
      id="vsl"
      data-sdp-reveal
      style={{ '--d': '.22s' } as React.CSSProperties}
    >
      <div className="sdp-vsl playing">
        <iframe
          src={`https://player.vimeo.com/video/${VIMEO_ID}?title=0&byline=0&portrait=0`}
          title="Watch the short video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
