'use client';

import { site } from '@/lib/site';
import { collectSignals } from '@/lib/client-signals';
import {
  ga4AddPaymentInfo,
  ga4AddToCart,
  ga4BeginCheckout,
  ga4GenerateLead,
  ga4Purchase,
  ga4ViewItem,
  once,
  type Ga4Item,
} from '@/lib/ga4';

/**
 * The one place a page calls to record something. Each function fires the
 * matching STANDARD event on both platforms: Meta by name via the CAPI route,
 * GA4 by its own recommended name.
 *
 * The two vocabularies differ and that is expected. Meta's InitiateCheckout is
 * GA4's begin_checkout. Mapping them here keeps that translation in one file
 * instead of every call site.
 *
 * The value on every event is the ASSESSMENT fee, not the programme fee. The
 * programme is sold afterwards and off-page, so nothing on this site knows
 * what it costs, and reporting a programme value against a ninety-seven rupee
 * charge would teach the ad account to buy against revenue that never landed
 * in Razorpay.
 */

const VALUE = site.feeInr;

/* GA4 only. The item name never reaches Meta: see lib/checkout-config.ts. */
const ITEM: Ga4Item = {
  item_id: 'deepti-assessment',
  item_name: 'Personalised Health Assessment',
  price: VALUE,
  quantity: 1,
};
const money = { value: VALUE, currency: 'INR', items: [ITEM] };

type Person = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  /** ISO 3166-1 alpha-2, from the checkout's country picker. */
  country?: string;
  /** Reserved for the QualifiedLead split. Nothing sets it on this build. */
  occupation?: string;
};

/** Fire-and-forget: analytics must never block or fail a click. */
function capi(eventName: string, person: Person = {}) {
  const s = collectSignals();
  try {
    void fetch('/api/meta/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ eventName, ...s, ...person }),
      keepalive: true, // survives the navigation a CTA click causes
    });
  } catch {
    /* ignore */
  }
}

/** Landing page: the offer has been seen. Once per SESSION. */
export function trackViewItem() {
  once('view_item', () => {
    capi('ViewContent');
    ga4ViewItem(money);
  });
}

/**
 * Checkout ARRIVAL, named for the Meta event it sends.
 *
 * It fires from the checkout page's MOUNT and from nowhere else. Do not move
 * it back onto a landing-page CTA click listener: this page carries seven CTA
 * lockups, so a reader who taps two of them counts twice, which inflates
 * AddToCart volume and deflates the cost-per-AddToCart the ads are judged on.
 * A click is also not an arrival.
 *
 * It is also the ONLY Meta event a DIRECT arrival ever produces. Someone who
 * opens /checkout from an email, a retargeting ad or a bookmark never touches
 * the landing page and would be invisible until the pay tap.
 */
export function trackAddToCart() {
  capi('AddToCart');
  ga4AddToCart(money);
}

/** The checkout page has loaded. GA4's half of the arrival. */
export function trackBeginCheckout() {
  ga4BeginCheckout(money);
}

/**
 * Details valid and the payment sheet is opening. This is the real intent, and
 * it is why InitiateCheckout does NOT fire on page load: a page-load IC is a
 * broken optimisation signal, because Meta then buys people who land rather
 * than people who try to pay.
 */
export function trackInitiateCheckout(person: Person) {
  capi('InitiateCheckout', person);

  /* QualifiedLead would fire here, as its own capi() call, for the qualifying
     segment only. It is not wired on this build because no qualifying segment
     has been specified for this offer. See lib/meta-capi.ts. */

  ga4AddPaymentInfo({ value: VALUE, currency: 'INR' });
}

/**
 * GA4 only. Meta's Purchase comes from the Razorpay webhook, where the payment
 * is proven. Firing it here as well would double-count every sale.
 */
export function trackPurchase(transactionId: string) {
  /* Keyed on the payment id, not a fixed string: a refresh, a back-forward, or
     the buyer reopening the confirmation link must not count the sale twice,
     but a genuine second purchase later must still count. */
  once(`purchase_${transactionId}`, () => {
    ga4Purchase({ transactionId, ...money });
  });
}

/**
 * The call was actually booked. Fired from Cal's `bookingSuccessful` callback
 * and nowhere else.
 *
 * WHY THIS EXISTS: the payment is not the outcome of this funnel, the booked
 * call is. Until this was added the ad account could optimise towards someone
 * paying ninety-seven rupees and not towards someone who then took a slot, and
 * those are different people. A buyer who pays and never books is the exact
 * waste this event makes visible.
 *
 * NO VALUE. The assessment fee was already counted on Purchase, and sending it
 * again here would double the revenue GA4 and Meta attribute to one sale.
 *
 * Keyed on the payment id like Purchase is, so a refresh of the confirmation
 * page or a back-navigation into Cal's success state cannot count one booking
 * twice.
 */
export function trackSchedule(paymentId: string) {
  once(`schedule_${paymentId || 'anon'}`, () => {
    capi('Schedule', {});
    ga4GenerateLead({ value: 0, currency: 'INR' });
  });
}
