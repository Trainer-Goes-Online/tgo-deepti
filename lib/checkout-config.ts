import { site, feePaise } from '@/lib/site';

/**
 * Every server-side constant the payment and tracking routes need, in one
 * place. The price comes from lib/site.ts, which reads it from a single env
 * var, so the amount charged can never drift from the amount displayed.
 */

/**
 * ⚠️ NO LIVE DOMAIN HAS BEEN SUPPLIED FOR THIS BUILD.
 *
 * This value is sent to Meta as event_source_url and written into every
 * Razorpay order, so a wrong default would quietly attribute live events to a
 * domain the client does not own. Rather than invent one, the fallback is
 * empty and `siteUrlReady()` below is checked by the routes that need it, which
 * log loudly instead of failing silently.
 *
 * `||`, not `??`. A host that defines the key with a BLANK value yields an
 * empty string, which `??` passes straight through, and an empty
 * event_source_url is silently worthless to Meta.
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');

export const siteUrlReady = () => Boolean(SITE_URL);

export const CHECKOUT_CONFIG = {
  amountRupees: site.feeInr,
  amountPaise: feePaise,
  currency: 'INR',
  /**
   * The product label. Used for Razorpay's payment sheet, the GA4 item name
   * and the Pabbly record.
   *
   * DELIBERATELY NEUTRAL, and it never reaches Meta. See the classification
   * note at the top of lib/meta-capi.ts: a descriptive product string in
   * custom_data on a domain selling against diabetes, fatty liver and thyroid
   * is the surface that gets a dataset classified, and the classification
   * binds at the root domain. GA4 and Razorpay are not that surface, so the
   * label is honest there and simply absent from every Meta payload.
   *
   * It says "assessment" and not "programme" because that is what is being
   * bought here: the paid consultation, not enrolment in the 12-week plan.
   */
  contentName: 'Personalised Health Assessment',
  /** GA4 item_id. Opaque, stable, no condition word. */
  itemId: 'deepti-assessment',
  /* THIS FUNNEL'S MARK, written onto every order it creates and checked by the
     webhook before it reports anything. One constant, referenced from both
     ends, because the gate is worthless the day the two sides disagree about
     the spelling.

     Razorpay registers webhooks per URL on an ACCOUNT and sends every
     subscribed event to every registered URL, so without this check the
     webhook reports a payment link, an invoice, a renewal or a second funnel's
     sale as a sale of this one: a Purchase to Meta, a purchase to GA4 and a
     buyer row to Pabbly, for someone who never bought this. */
  orderKind: 'deepti_assessment',
  fallbackEventSourceUrl: SITE_URL,
  meta: {
    pixelId: process.env.META_PIXEL_ID ?? '',
    accessToken: process.env.META_CAPI_ACCESS_TOKEN ?? '',
    testEventCode: process.env.META_CAPI_TEST_EVENT_CODE ?? '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID ?? '',
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? '',
  },
} as const;

/** True only when a real CAPI call can be made. Routes check this and skip
 *  quietly rather than posting to Meta with an empty pixel id. */
export const capiReady = () =>
  Boolean(CHECKOUT_CONFIG.meta.pixelId && CHECKOUT_CONFIG.meta.accessToken);

/**
 * Whether this deployment is transacting in test mode, DERIVED rather than
 * declared.
 *
 * Razorpay stamps its own environment into the key id (`rzp_test_` versus
 * `rzp_live_`), so this cannot drift out of sync the way a separate IS_TEST
 * env var would when someone swaps the keys and forgets the flag. A Meta test
 * event code is also treated as test, because events sent with one do not
 * count toward optimisation and the sale they describe is not real.
 *
 * It rides to Pabbly as `is_test` so a staging purchase can be routed away
 * from the live fulfilment instead of putting a fictional buyer into Deepti's
 * assessment queue.
 */
export const isTestMode = () =>
  CHECKOUT_CONFIG.razorpay.keyId.startsWith('rzp_test_') ||
  Boolean(CHECKOUT_CONFIG.meta.testEventCode);
