import { asset } from '@/components/shared/asset-version';

/**
 * BEAT 0b — TRUST ROW.
 *
 * Shape: credential set. Category §12 Authority, lightest option — a
 * hairline trust-chip row directly under the announcement strip.
 *
 * Copy (verbatim):
 *   "[Photos] ★★★★★ 5.0 Review | 🛡️ 100% Results Guarantee"
 *
 * The "[Photos]" the copy asks for are client reviewer portraits, and
 * none exist yet. They render as dashed accent rings: a slot that reads
 * as PENDING. They are deliberately not stock faces and not blank grey
 * circles that could pass for real anonymous reviewers — on a page whose
 * entire pitch is honest health claims, a fake face is the most expensive
 * pixel we could ship. When the real portraits land, drop the URLs into
 * AVATARS below; the ring geometry (32px, -6px overlap, face-crop
 * background-position) is already the shipped one, so nothing reflows.
 *
 * Server component, no client JS: this sits above the fold and must paint
 * immediately.
 */

/** Reviewer portraits, in order. Empty string = still pending. */
const AVATARS: string[] = ['', '', '', '', ''];

/* Every /public path goes through asset() — the path is the cache key,
   so a re-crop under the same filename never reaches a returning
   visitor without a version bump. */

export function TrustRow() {
  return (
    <div className="sdp-trust-strip">
      <div className="sdp-trust-avatars" aria-hidden>
        {AVATARS.map((src, i) => (
          <span
            key={i}
            className={`sdp-trust-avatar${src ? '' : ' is-empty'}`}
            style={src ? { backgroundImage: `url("${asset(src)}")` } : undefined}
          />
        ))}
      </div>

      <div className="sdp-trust-item">
        <span className="sdp-trust-stars" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z" />
            </svg>
          ))}
        </span>
        <span>
          <b>5.0</b> Review
        </span>
      </div>

      <div className="sdp-trust-item">
        <span className="sdp-trust-check" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.5l8 3v6.7c0 4.9-3.4 9.2-8 10-4.6-.8-8-5.1-8-10V5.5l8-3z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </span>
        <span>
          <b>100%</b> Results Guarantee
        </span>
      </div>
    </div>
  );
}
