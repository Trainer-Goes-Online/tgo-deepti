import { FilmGlyph, ImageGlyph } from './icons';

/**
 * A slot for artwork that does not exist yet.
 *
 * Nothing on this funnel has been shot: no photography of Deepti, no
 * testimonial films, no case-study cards, no before/after pairs, no blood
 * reports, no WhatsApp screenshots. This component is how the page holds
 * their space honestly.
 *
 * Two rules it exists to enforce:
 *  1. It is sized at the REAL asset's aspect ratio, so when the artwork
 *     lands nothing reflows and the swap is a one-line change. A slot
 *     sized "roughly" is a layout bug scheduled for later.
 *  2. It is LABELLED with what belongs there, so whoever shoots or
 *     supplies the file knows the ask without opening the code.
 *
 * It deliberately reads as pending (dashed accent hatch), never as a
 * design element. A grey box that looks intentional is how a placeholder
 * survives to launch.
 */
export function MediaPlaceholder({
  /** CSS aspect-ratio of the REAL asset, e.g. '16 / 9', '4 / 5', '1 / 1'. */
  ratio,
  /** What belongs here, in the words the person supplying it would use. */
  label,
  /** Optional spec line: dimensions, crop, count. */
  note,
  kind = 'image',
  round = false,
  className = '',
}: {
  ratio: string;
  label: string;
  note?: string;
  kind?: 'image' | 'film';
  round?: boolean;
  className?: string;
}) {
  const Glyph = kind === 'film' ? FilmGlyph : ImageGlyph;

  return (
    <div
      className={`sdp-ph${round ? ' round' : ''}${className ? ` ${className}` : ''}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <div className="sdp-ph-inner">
        <span className="sdp-ph-icon">
          <Glyph />
        </span>
        <span className="sdp-ph-label">{label}</span>
        {note && <span className="sdp-ph-note">{note}</span>}
      </div>
    </div>
  );
}
