/** Central site config. The assessment fee is the copy's "₹97 To Start". */
export const site = {
  brand: 'Deepti',
  /** LAUNCH's half of the funnel, not built yet; the LP links here. */
  checkoutUrl: '/checkout',
  feeInr: Number(process.env.NEXT_PUBLIC_ASSESSMENT_FEE ?? '97') || 97,
  /** Countdown window for the offer urgency, per the copy: 5 hours. */
  offerHours: 5,
};

/**
 * BUSINESS + LEGAL FACTS. Client-supplied 2026-09-08, verbatim.
 *
 * This is the SINGLE SOURCE for the legal pages (/privacy, /terms, /refund),
 * the colophon, the checkout footer and the Razorpay account details. Nothing
 * here is inferred: every field came from the client. If a legal page needs a
 * fact that is not in this object, it does not get invented, it gets asked.
 *
 * Razorpay and most Indian payment gateways require the registered entity
 * name, a serviceable address, a contact number, an email and the governing
 * jurisdiction to be reachable from the checkout page, so these are not
 * decoration: the checkout is rejected without them.
 */
export const business = {
  /** Registered entity. A proprietor, not a private limited company. */
  legalName: 'Deepti Sherawat',
  /** Trading name, as given. */
  tradingName: '"Liver First" - 90 days holistic wellness program',
  address: {
    line1: 'Sector 21',
    city: 'Noida',
    state: 'Uttar Pradesh',
    stateShort: 'U.P.',
    pin: '201301',
    country: 'India',
  },
  phone: '9289049674',
  phoneE164: '+919289049674',
  email: 'deeptiofficialsherawat@gmail.com',
  /** Governing law + venue for the terms page. */
  jurisdictionState: 'Uttar Pradesh',
} as const;

/** One-line postal address for footers and legal pages. */
export const addressLine = [
  business.address.line1,
  business.address.city,
  business.address.pin,
  business.address.stateShort,
].join(', ');

export const CTA_LABEL =
  'Click Here To Get Your Personalised Weight Loss & Metabolic Health Plan';
