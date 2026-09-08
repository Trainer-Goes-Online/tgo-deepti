import type { ReactNode } from 'react';
import { business } from '@/lib/site';

/**
 * THE CONTACT CLOSE (VSL blueprint, policy surface, closing beat).
 *
 * The dark band that ends every policy page: one icon, a heading with an
 * accent word, one line, the two ways to reach a human, and the way back to
 * the page they came from. It mirrors the live SDP funnel's contact block.
 *
 * Its job is not persuasion. A policy page that closes with a CTA is a
 * policy page nobody believes, so there is no offer here and no price. What
 * it does is answer the question a policy leaves a reader holding: "and if
 * I still want to ask?"
 *
 * The email and phone come from `business`, so they can never drift from
 * the footer, the clauses or the checkout.
 *
 * ⚠ The heading and the one line are UI copy written at build time, not
 * client-supplied policy text. They restate facts already in the clauses
 * and claim nothing new. NO-BRAINER should re-voice them.
 *
 * Server component.
 */
export function PolicyContactCTA({
  heading,
  body,
}: {
  heading: ReactNode;
  body: ReactNode;
}) {
  return (
    <section className="contact">
      <div className="wrap">
        <span className="contact-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16v14H4z" />
            <path d="m4 6 8 6 8-6" />
          </svg>
        </span>
        <h2>{heading}</h2>
        <p>{body}</p>
        <p className="contact-lines">
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <span className="contact-sep" aria-hidden>
            ·
          </span>
          <a href={`tel:${business.phoneE164}`}>{business.phone}</a>
        </p>
        <a href="/" className="home-link">
          Back to the programme
        </a>
      </div>
    </section>
  );
}
