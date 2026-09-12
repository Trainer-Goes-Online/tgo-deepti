'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

/**
 * "OFFER ENDS IN" — the copy's 5-hour countdown, part 3 of the CTA lockup.
 *
 * The deadline is stamped ONCE per visitor into localStorage, so a refresh
 * or a second tab continues the same countdown instead of restarting. A
 * timer that resets on every page load is the single thing that makes an
 * urgency block read as fake, and it takes one refresh to catch.
 *
 * Every instance on the page reads that same deadline, which is what lets
 * the lockup repeat: all the timers show the same number and stay in sync.
 *
 * WHILE THE PAGE IS OPEN it never rolls over: it counts to zero, stops
 * rendering, and nothing hands it another five hours in front of you. A
 * countdown that resurrects itself while you are watching is the same lie
 * as one that resets on every load.
 *
 * ACROSS VISITS it does start again, from 2026-09-12. The earlier rule was
 * absolute, and the effect was that a stale deadline in localStorage killed
 * the countdown permanently for that browser: every CTA block on the page
 * lost its third element and nobody who had ever loaded the page more than
 * five hours ago saw urgency again. That is not honesty, it is a dead
 * widget. A visit that starts after the stored deadline has passed gets a
 * new window; a page already open past zero still shows nothing.
 *
 * Renders nothing until mounted: localStorage is client-only, and a
 * server-rendered digit would hydrate-mismatch on first paint.
 */
const KEY = 'deepti.offer.deadline';

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0');
}

export function OfferTimer() {
  const hours = Number(site.offerHours) || 0;
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (hours <= 0) return;
    const windowMs = hours * 3600_000;

    let deadline = Number(window.localStorage.getItem(KEY) || 0);
    /* Re-stamp when the stored value is missing, already spent, or absurd
       (a clock change or a tampered value putting it further out than the
       window is long). "Already spent" is the one added on 2026-09-12: it
       is what makes the countdown survive a returning visitor instead of
       staying dead for the life of that browser profile. */
    if (!deadline || deadline <= Date.now() || deadline - Date.now() > windowMs) {
      deadline = Date.now() + windowMs;
      try {
        window.localStorage.setItem(KEY, String(deadline));
      } catch {
        /* private mode — the countdown simply restarts next visit */
      }
    }

    const tick = () => setLeft(Math.max(0, deadline - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hours]);

  if (hours <= 0 || left === null || left <= 0) return null;

  const s = Math.floor(left / 1000);
  /* Three cells, not four. The window is 5 hours, so a DAYS cell would
     read 00 for the whole life of the offer — a dead digit next to live
     ones reads as a broken widget. If the window ever goes multi-day,
     add the cell back here and in site.offerHours together. */
  const cells = [
    { v: pad(Math.floor(s / 3600)), k: 'Hrs' },
    { v: pad(Math.floor((s % 3600) / 60)), k: 'Min' },
    { v: pad(s % 60), k: 'Sec' },
  ];

  return (
    <div className="sdp-urgency" role="timer" aria-live="off">
      <span className="sdp-urgency-label">Offer ends in</span>
      <span className="sdp-urgency-timer">
        {cells.map((c, i) => (
          <span key={c.k} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span className="sdp-urgency-cell">
              <b>{c.v}</b>
              <i>{c.k}</i>
            </span>
            {i < cells.length - 1 && <span className="sdp-urgency-sep" aria-hidden />}
          </span>
        ))}
      </span>
    </div>
  );
}
