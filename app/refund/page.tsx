import type { Metadata } from 'next';
import '../legal.css';
import { LegalPage, type Clause } from '@/components/legal/LegalPage';
import { business, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: `Refunds, cancellations and the results guarantee for ${business.legalName}.`,
  robots: { index: false, follow: false },
};

const UPDATED = '8 September 2026';

/* THE DISTINCTION THIS PAGE EXISTS TO MAKE.
   The landing copy's "100% Results Guarantee" is NOT a money-back guarantee.
   It promises continued support at no additional cost until you see
   measurable progress. A reader who meets the words "100% guarantee" on the
   landing page and assumes "100% refund" is the single most likely source of
   a chargeback and a complaint here, so clause 01 separates the two in plain
   words before anything else is said.

   The actual refund windows are commercial terms nobody has confirmed, so
   they render as PENDING callouts rather than as invented prose. A payment
   gateway will not approve an account on a policy that has no refund terms,
   so these are the blocking items on this page. */
const CLAUSES: Clause[] = [
  {
    id: 'not-money-back',
    heading: 'The results guarantee is not a money-back guarantee',
    nav: 'Not a money-back guarantee',
    body: (
      <>
        <p>
          Our 100% Results Guarantee promises our continued work, not your money
          back. If you do not see measurable progress in your weight and health
          by the end of your programme, despite consistently following your
          personalised plan, we continue supporting you at no additional cost
          until you do.
        </p>
        <p>
          That is a promise to keep working with you. It is a different thing
          from a refund, and the rest of this page sets out when a refund is
          available instead.
        </p>
      </>
    ),
  },
  {
    id: 'guarantee-conditions',
    heading: 'What the guarantee asks of you',
    nav: 'What the guarantee asks',
    body: (
      <>
        <p>The guarantee applies where you have:</p>
        <ul>
          <li>
            completed the full programme and followed your personalised nutrition
            and lifestyle plan consistently;
          </li>
          <li>attended your scheduled check-ins and submitted progress updates on time;</li>
          <li>
            communicated with {business.legalName} and her nutritionists when
            work, travel, health or life got in the way, so your plan could be
            adjusted.
          </li>
        </ul>
        <p>
          We ask for these because a plan that was not followed cannot tell us
          anything about whether it works. We will look at your check-in history
          and progress updates when a claim is made.
        </p>
      </>
    ),
  },
  {
    id: 'assessment-fee',
    heading: 'The assessment fee',
    body: (
      <p>
        The assessment is a paid consultation, currently ₹{site.feeInr}, in which
        we review your reports and tell you honestly whether the programme suits
        you. You receive that review whether or not you go on to join, so the fee
        pays for work that has already been done by the time it ends.
      </p>
    ),
    pending: (
      <>
        Is the ₹{site.feeInr} assessment fee refundable, and if so, until when?
        The usual options are: refundable any time before the assessment takes
        place, refundable only if WE cancel, or non-refundable once booked. This
        needs Deepti&rsquo;s decision. A payment gateway will not approve the
        account without a stated position.
      </>
    ),
  },
  {
    id: 'programme-fee',
    heading: 'The programme fee',
    body: (
      <p>
        Where a refund is due under this policy, it is issued to the original
        payment method.
      </p>
    ),
    pending: (
      <>
        The programme refund terms are not confirmed. We need: (a) is there a
        cooling-off window after joining, and how long; (b) what happens if a
        client stops part-way through; (c) is any part of the fee non-refundable
        once the personalised plan has been built and delivered. The programme
        length is also unresolved, since the landing copy says 12 weeks and the
        registered trading name says 90 days, and a refund window is measured
        against it.
      </>
    ),
  },
  {
    id: 'if-we-cancel',
    heading: 'If we cancel',
    body: (
      <p>
        If we cancel your assessment or cannot deliver your programme, you get a
        full refund of what you paid for the part we did not deliver. If we end a
        programme part-way through for a reason that is not your fault, we refund
        the unused portion of your fee.
      </p>
    ),
  },
  {
    id: 'medical-reasons',
    heading: 'Medical reasons',
    body: (
      <p>
        If your doctor advises you not to continue for a medical reason, tell us
        as soon as you can. We will pause your programme so you can resume when
        you are able, or discuss a refund of the unused portion with you. We would
        rather hold your place than have you continue against medical advice.
      </p>
    ),
  },
  {
    id: 'how-to-ask',
    heading: 'How to ask for a refund',
    body: (
      <>
        <p>
          Email <a href={`mailto:${business.email}`}>{business.email}</a> from the
          address you booked with, telling us your name, the date of payment and
          what you are asking for. You can also reach us on{' '}
          <a href={`tel:${business.phoneE164}`}>{business.phone}</a>.
        </p>
        <p>
          We will acknowledge your request within 3 working days and tell you our
          decision, with reasons, within 7 working days.
        </p>
      </>
    ),
  },
  {
    id: 'when-it-reaches-you',
    heading: 'When an approved refund reaches you',
    nav: 'When it reaches you',
    body: (
      <p>
        Once approved, we issue the refund to your original payment method within
        7 working days. How long it then takes to appear depends on your bank or
        card issuer, and is usually a further 5 to 10 working days. We will send
        you the payment gateway&rsquo;s refund reference when it is issued.
      </p>
    ),
  },
  {
    id: 'questions-and-complaints',
    heading: 'Questions and complaints',
    body: (
      <p>
        If you are unhappy with a decision, reply to us and say so. We would
        rather resolve it directly. Our full business details, including our
        registered address and jurisdiction, are below.
      </p>
    ),
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="Refund & Cancellation"
      title={
        <>
          Refunds, cancellations and the <em>guarantee</em>
        </>
      }
      updated={UPDATED}
      lede={
        <p>
          Our 100% Results Guarantee promises that we keep working with you, not
          that we return your money. Those are two different things and this page
          keeps them apart, then sets out when a refund is available, how to ask
          for one and how long it takes to arrive.
        </p>
      }
      clauses={CLAUSES}
      close={{
        heading: (
          <>
            Asking for a <em>refund</em>
          </>
        ),
        body: 'Write from the address you booked with and tell us your name, the date of payment and what you are asking for. We acknowledge within 3 working days and decide within 7.',
      }}
    />
  );
}
