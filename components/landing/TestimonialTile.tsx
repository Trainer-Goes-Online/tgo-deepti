/**
 * ONE VIDEO TESTIMONIAL TILE.
 *
 * The Vimeo player is mounted directly, exactly like the VSL frame: Vimeo
 * draws its own thumbnail and play control, so there is no poster to source
 * and no placeholder to maintain.
 *
 * LAZY, unlike the VSL. Fifteen eager players would be fifteen third-party
 * requests before the reader has scrolled anywhere near the proof run.
 * `loading="lazy"` holds each one until it approaches the viewport, which is
 * what makes mounting all fifteen affordable at all.
 *
 * The name sits over the player as a caption. It is pointer-events:none in
 * PART 3c so it cannot swallow a click meant for Vimeo's controls.
 *
 * Server component.
 */
export function TestimonialTile({
  name,
  vimeoId,
  ratio,
}: {
  name: string;
  vimeoId: string;
  ratio: string;
}) {
  return (
    <div
      className="sdp-vt-card is-live"
      style={{ '--vt-ratio': ratio } as React.CSSProperties}
    >
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
        title={`${name}'s testimonial`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
      <span className="sdp-vt-name">{name}</span>
    </div>
  );
}
