import type { ReactNode } from 'react';
import { PolicyHero } from './PolicyHero';
import { PolicyToc, type TocItem } from './PolicyToc';
import { PolicyContactCTA } from './PolicyContactCTA';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { business, addressLine } from '@/lib/site';

/**
 * SHARED POLICY PAGE SHELL · the VSL blueprint's policy surface.
 *
 * Rebuilt to the blueprint. The previous version was a single 760px column
 * of ruled prose, which is the under-elevation the whole SHAPE gate exists
 * to catch: a policy page carries three real structures and rendered none
 * of them. What it carries, and what each now gets:
 *
 *   · an ORDERED, CITABLE DOCUMENT      → the anchored, numbered clause
 *                                          ledger beside a sticky rail
 *   · an INDEX of that document          → the "On this page" TOC
 *   · a LABEL → VALUE FACT SET           → the business-details ledger
 *
 * Order, verbatim from the blueprint: PolicyHero (pill eyebrow, display
 * title with one accent word, deck, meta chip) → `.legal-grid` = a 240px
 * sticky TOC beside the body → the `.legal-intro` callout with its thick
 * accent left border → `.legal-section`s, each anchored, each marked and
 * ruled off from the next → `ul.l-list` items as bordered cards rather
 * than ruled rows → the dark contact close → the identity footer.
 *
 * The clause PROSE is untouched. It was written and client-fact-checked;
 * this changed only how it is presented. Every fact still comes from
 * `business` in lib/site.ts, and no page hardcodes a name or an address.
 *
 * ── HOW A PENDING TERM ANNOUNCES ITSELF: THREE TIMES ────────────────
 * `Clause.pending` marks a commercial term the client has not confirmed.
 * An unconfirmed refund window that ships by looking like finished prose
 * is the worst outcome this build has available, so it is impossible to
 * arrive at the page and not see one:
 *   1. a gold banner at the top of the body, counting them and linking to
 *      each by name, before a single clause is read;
 *   2. a gold dot on that clause's link in the sticky rail, visible the
 *      whole way down the page;
 *   3. the gold callout in the clause itself, above the prose.
 * Gold is the page's action colour and appears nowhere else here, so it
 * reads as the only unfinished thing on an otherwise finished document.
 *
 * Server component. Only the TOC's scroll-spy is a client island.
 */
export type Clause = {
  /** Anchor target. Also the TOC link and the clause's stable id. */
  id: string;
  heading: string;
  /** Short label for the sticky rail. Defaults to the heading. */
  nav?: string;
  body: ReactNode;
  pending?: ReactNode;
};

const BUSINESS_ID = 'business-details';

export function LegalPage({
  eyebrow,
  title,
  updated,
  lede,
  clauses,
  close,
}: {
  eyebrow: string;
  title: ReactNode;
  updated: string;
  lede: ReactNode;
  clauses: Clause[];
  close: { heading: ReactNode; body: ReactNode };
}) {
  const pending = clauses.filter((c) => c.pending);

  const toc: TocItem[] = [
    ...clauses.map((c) => ({
      id: c.id,
      label: c.nav ?? c.heading,
      pending: !!c.pending,
    })),
    { id: BUSINESS_ID, label: 'Business details' },
  ];

  return (
    <div className="dp-policy">
      <PolicyHero
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        updated={updated}
        operator={business.legalName}
      />

      <section className="legal">
        <div className="wrap">
          <div className="legal-grid">
            <PolicyToc items={toc} />

            <article className="legal-body">
              {pending.length > 0 ? (
                <div className="legal-intro pending" role="note">
                  <span className="legal-intro-tag">
                    Pending · client confirmation required before launch
                  </span>
                  <p>
                    {pending.length === 1
                      ? 'One commercial term on this page is not confirmed and must not go live as written.'
                      : `${pending.length} commercial terms on this page are not confirmed and must not go live as written.`}{' '}
                    Each is flagged in the clause it belongs to:
                  </p>
                  <ul className="legal-intro-jump">
                    {pending.map((c) => (
                      <li key={c.id}>
                        <a href={`#${c.id}`}>{c.nav ?? c.heading}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {clauses.map((c, i) => (
                <section className="legal-section" id={c.id} key={c.id}>
                  <span className="l-mark">
                    <span className="l-bar" aria-hidden />
                    <span className="l-ord">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <h2>{c.heading}</h2>

                  {c.pending ? (
                    <div className="l-pending">
                      <span className="l-pending-tag">
                        Pending · client confirmation required before launch
                      </span>
                      <p>{c.pending}</p>
                    </div>
                  ) : null}

                  {c.body}
                </section>
              ))}

              {/* The fact set. A label-to-value ledger is a structure, so it
                  renders as one rather than as a paragraph of run-on
                  details, and it is anchored so a gateway reviewer can be
                  sent straight to it. */}
              <section
                className="legal-section"
                id={BUSINESS_ID}
                aria-label="Business details"
              >
                <span className="l-mark">
                  <span className="l-bar" aria-hidden />
                  <span className="l-ord">Details</span>
                </span>
                <h2>Business details</h2>
                <dl className="l-dl">
                  <dt>Registered entity</dt>
                  <dd>{business.legalName}</dd>

                  <dt>Trading name</dt>
                  <dd>{business.tradingName}</dd>

                  <dt>Registered address</dt>
                  <dd>
                    {addressLine}, {business.address.country}
                  </dd>

                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${business.phoneE164}`}>{business.phone}</a>
                  </dd>

                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </dd>

                  <dt>Jurisdiction</dt>
                  <dd>{business.jurisdictionState}, India</dd>
                </dl>
              </section>
            </article>
          </div>
        </div>
      </section>

      <PolicyContactCTA heading={close.heading} body={close.body} />
      <SiteFooter />
    </div>
  );
}
