'use client';

import { useEffect } from 'react';

/**
 * THE STICKY "ON THIS PAGE" RAIL (VSL blueprint, policy surface).
 *
 * A policy is a numbered document of record, and a document of record is
 * navigable: the reader arrives wanting one clause, usually the refund
 * window or the health disclaimer, and should reach it in one click rather
 * than by scrolling a wall. That is a real structure (an ordered index of
 * an ordered document), so it earns a component.
 *
 * FAIL-OPEN BY CONSTRUCTION. Without JavaScript this is still a working
 * list of anchor links; the only thing lost is the marking of the current
 * clause. The scroll listener is passive and does nothing but toggle a
 * class, so it also costs nothing under prefers-reduced-motion.
 *
 * `pending` marks a clause whose commercial terms are unconfirmed. The dot
 * is gold, the page's action colour, so an unresolved clause is visible
 * from the rail before the reader has scrolled to it. That is the third of
 * three places a pending term announces itself, and the point is that none
 * of them can be missed.
 */
export type TocItem = { id: string; label: string; pending?: boolean };

export function PolicyToc({ items }: { items: TocItem[] }) {
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.dp-policy .toc a'),
    );
    if (!links.length) return;

    const sections = links
      .map((link) => {
        const id = link.getAttribute('href')?.slice(1) ?? '';
        return { link, el: id ? document.getElementById(id) : null };
      })
      .filter((s): s is { link: HTMLAnchorElement; el: HTMLElement } => !!s.el);

    function onScroll() {
      const y = window.scrollY + 140;
      let current = sections[0];
      for (const s of sections) if (s.el.offsetTop <= y) current = s;
      links.forEach((a) => a.classList.remove('active'));
      if (current) current.link.classList.add('active');
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <aside className="toc" aria-label="On this page">
      <span className="toc-label">On this page</span>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`}>
              {it.label}
              {it.pending ? (
                <span className="toc-pending" aria-label="unconfirmed term" />
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
