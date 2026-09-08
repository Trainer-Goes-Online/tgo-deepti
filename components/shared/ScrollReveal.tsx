'use client';

import { useEffect } from 'react';

/**
 * The page's single reveal observer. Mount it ONCE inside `.sdp-root`;
 * every section then just carries `data-sdp-reveal` (and an optional
 * `--d` delay), so the sections themselves stay server components.
 *
 * FAIL-OPEN, which is the non-negotiable part (C7). The CSS hides a
 * revealed element only under `html.sdp-armed`, and only this effect
 * ever adds that class. So:
 *   · JS never loads / a script throws → nothing is armed → the whole
 *     page renders visible. Content is never hostage to an animation.
 *   · prefers-reduced-motion → never armed at all, no motion, no delay.
 *
 * The second belt is the scroll fallback: an anchor jump or a fast flick
 * can land past an element before the observer ever fires, so anything
 * already above the fold line is revealed on scroll/resize too. An
 * element stuck invisible below the fold is the failure mode this
 * pattern exists to prevent.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-sdp-reveal]')
    );
    if (!nodes.length) return;

    const root = document.documentElement;
    root.classList.add('sdp-armed');

    const show = (el: HTMLElement) => el.classList.add('vis');
    const inView = (el: HTMLElement) =>
      el.getBoundingClientRect().top < window.innerHeight * 0.92;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((n) => io.observe(n));

    const sweep = () => {
      for (const n of nodes) {
        if (!n.classList.contains('vis') && inView(n)) {
          show(n);
          io.unobserve(n);
        }
      }
    };

    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    // next frame, so above-the-fold content still plays its transition
    const raf = requestAnimationFrame(sweep);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('resize', sweep);
      root.classList.remove('sdp-armed');
    };
  }, []);

  return null;
}
