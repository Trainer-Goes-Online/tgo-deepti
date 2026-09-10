/**
 * ASSET VERSIONING — every /public reference goes through `asset()`.
 *
 * Why this exists before a single real image has landed: the PATH is the
 * cache key. It is the cache key in the visitor's browser, at the CDN
 * edge, and in Next's image optimizer. So when someone re-crops a
 * testimonial or swaps a better poster and saves it over the same
 * filename, *nothing changes for anyone except the person who did it* —
 * their machine has a fresh copy, every returning visitor and every cache
 * in between keeps serving the old file, sometimes for weeks.
 *
 * `asset()` appends a version query so the path changes when we say it
 * changes. Wiring it now, while every slot is still a placeholder, costs
 * nothing; retrofitting it after launch means finding every string.
 *
 * ── THE RULE ────────────────────────────────────────────────────────
 * Bump ASSET_V in the SAME pass as any artwork swap. Not after, not "next
 * deploy" — the same pass, or the bump gets forgotten and the mechanism
 * is dead weight.
 */
export const ASSET_V = '7';

/**
 * @param path a /public path, e.g. '/proof/testimonial-01.jpg'
 * @returns the same path with the current asset version appended
 */
export function asset(path: string): string {
  if (!path) return '';
  // external URLs (Vimeo posters, CDN) carry their own cache policy
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${clean}${clean.includes('?') ? '&' : '?'}v=${ASSET_V}`;
}
