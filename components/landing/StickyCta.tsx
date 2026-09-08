'use client';

import { useEffect, useState } from 'react';
import { site, CTA_LABEL } from '@/lib/site';
import { ArrowRightIcon } from '@/components/shared/icons';

/**
 * BEAT 12 — STICKY CTA. Page-chrome, not a section.
 *
 * Two rules it obeys, and both are about not competing:
 *  · it stays hidden until the hero has left the screen, because the
 *    hero already has the button and a second one over it is noise;
 *  · it slides back down the moment the finale is in view, because the
 *    finale is the page's peak and a bar of dark glass across it is
 *    exactly the kind of chrome that flattens a peak.
 *
 * Because it retreats at the finale it needs no spacer in normal flow.
 *
 * The tag reads "₹97 To Start" — the client's own words from the hero's
 * credibility table, so the bar introduces no new copy. On phones the tag
 * hides and the button takes the whole bar: the button is the only thing
 * down there with a job.
 */
export function StickyCta() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const finale = document.getElementById('start');
    if (!hero) return;

    let pastHero = false;
    let atFinale = false;
    const sync = () => setOn(pastHero && !atFinale);

    const heroIo = new IntersectionObserver(
      ([e]) => {
        pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        sync();
      },
      { threshold: 0 }
    );
    heroIo.observe(hero);

    let finaleIo: IntersectionObserver | undefined;
    if (finale) {
      finaleIo = new IntersectionObserver(
        ([e]) => {
          atFinale = e.isIntersecting;
          sync();
        },
        { threshold: 0 }
      );
      finaleIo.observe(finale);
    }

    return () => {
      heroIo.disconnect();
      finaleIo?.disconnect();
    };
  }, []);

  return (
    <div className={`sdp-stuck${on ? ' on' : ''}`} aria-hidden={!on}>
      <div className="sdp-stuck-inner">
        <span className="sdp-stuck-tag">
          <span className="dot" aria-hidden />₹{site.feeInr} To Start
        </span>
        <a className="sdp-stuck-go" href={site.checkoutUrl} tabIndex={on ? 0 : -1}>
          {CTA_LABEL}
          <span className="arrow" aria-hidden>
            <ArrowRightIcon size={11} />
          </span>
        </a>
      </div>
    </div>
  );
}
