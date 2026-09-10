import { site, feeLabel } from '@/lib/site';

/**
 * What is actually being bought on this page, and the one place it is
 * declared.
 *
 * ── WHY THERE IS NO VALUE STACK HERE ──────────────────────────────────
 * The house checkout carries a lead item plus a bonus list with a rupee
 * value against each line, a struck-through total and a computed
 * VALUE_TOTAL. That pattern belongs to a challenge funnel, where the client
 * has priced each bonus and the stack is a real contract.
 *
 * This is a VSL funnel whose next click is a ninety-seven rupee PAID
 * ASSESSMENT, and nobody has priced anything inside it. Inventing "worth
 * ₹4,500" against a consultation would be inventing a client fact on a live
 * sales page, so the summary shows one line item at its real price and no
 * struck-through figure at all. If Deepti wants a value framing, she has to
 * supply the numbers.
 *
 * ── EVERY STRING BELOW IS THE CLIENT'S OWN ────────────────────────────
 * All of it comes from FAQ 1 of funnel-copy/01-landing-vsl.md, which is the
 * only place in the source that describes what the assessment is. The list
 * is that answer's own comma-separated list, split at its own commas and in
 * its own order, with no word added and none removed. Nothing here was
 * written fresh, because a description of what a paid consultation includes
 * is a commercial promise, not copywriting.
 */

/** The client's phrase, from FAQ 1: "This is a personalised health assessment." */
export const ASSESSMENT_TITLE = 'Personalised Health Assessment';

export const ASSESSMENT_PRICE = site.feeInr;
export const ASSESSMENT_PRICE_LABEL = feeLabel;

/**
 * FAQ 1, sentence two, split at the source's own commas:
 * "Deepti and her team will understand your current weight, health reports,
 *  symptoms, eating habits, lifestyle, medical history and previous
 *  weight-loss efforts to identify what may be keeping you stuck."
 */
export const ASSESSMENT_COVERS: string[] = [
  'Your current weight',
  'Your health reports',
  'Your symptoms',
  'Your eating habits',
  'Your lifestyle',
  'Your medical history',
  'Your previous weight-loss efforts',
];

/** FAQ 1, sentence three, verbatim. */
export const ASSESSMENT_PROMISE =
  "The goal is to help you understand your current health picture and whether Deepti's programme is the right next step for you. If the programme genuinely isn't the right fit, we'll tell you honestly. No pressure. No unnecessary selling.";

/** FAQ 1, sentence one, verbatim. */
export const NOT_A_SALES_CALL = 'This is not a sales call.';

/**
 * THE SCOPE LINE, and the most load-bearing sentence on this page.
 *
 * The likeliest chargeback on this funnel is a buyer who pays the assessment
 * fee and believes they have joined the 12-week programme. Saying so before
 * the card is charged costs one sentence and prevents a dispute in which the
 * buyer is, on the facts, right about what they thought they were buying.
 *
 * It states only what the client stated: the fee buys the assessment, the
 * programme is a separate decision made afterwards. It deliberately does NOT
 * say what the programme costs or how long it runs, because neither is
 * confirmed on this build.
 */
export const SCOPE_NOTE =
  'This payment is for the assessment only. It does not enrol you in the 12-week programme, and it is not a deposit against it. If the programme turns out to be right for you, joining it is a separate decision you make afterwards.';
