import crypto from 'crypto';

/**
 * Meta Conversions API primitives, shared by every server-side event route.
 *
 * ── Health and wellness classification hygiene ────────────────────────────
 * READ THIS BEFORE ADDING A FIELD.
 *
 * This offer sells against a body: weight, (pre)diabetes, fatty liver,
 * cholesterol, hypothyroidism, insulin resistance. Meta classifies a dataset
 * into its restricted "Health and wellness condition" category by reading a
 * handful of surfaces, and a restriction, once applied, binds at the ROOT
 * DOMAIN and is not cleanly reversible. One careless payload key can cost the
 * client every funnel they will ever run on that domain.
 *
 * The intrinsic nature of the product is a signal nobody can remove. Every
 * signal that CAN be removed is removed, and there are exactly two this file
 * owns:
 *
 *   `custom_data` carries value, currency and order_id ONLY. No
 *   `content_name`, no product string, no category, no UTM, no fbclid.
 *   custom_data is NOT hashed and IS read. A product string reading
 *   "12-Week Fatty Liver and Metabolic Reset" arriving on every event is a
 *   plain-text declaration of the condition, and `utm_campaign` is worse,
 *   because media buyers write those and they drift toward symptom language
 *   with nobody reviewing them.
 *
 *   `event_source_url` is reduced to the ORIGIN, server-side. A path naming a
 *   condition carries the same declaration in the same crawl. It is done
 *   server-side rather than trusted from the caller, because the caller is a
 *   browser posting `window.location.href`, which is precisely the value with
 *   the path and the fbclid on it.
 *
 * `user_data` is untouched and stays MAXIMAL. It is all SHA-256 hashed, it is
 * what EMQ is scored on, and it declares nothing about the offer. Hygiene
 * means removing description, never removing matching.
 *
 * The standard event NAMES are deliberately kept. Coded custom events
 * (`evt_a`) are the belt-and-braces variant of this posture and they are the
 * wrong trade: they forfeit Aggregated Event Measurement priority, the
 * built-in Purchase optimisation and every standard-event prior in the ad
 * account. The payload and the URL are where the classification risk lives;
 * the names are where the performance lives.
 */

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

/**
 * Strip an event_source_url to its origin.
 *
 * Falls back to the raw string only if it will not parse: a malformed url is
 * not a leak.
 */
export function originOnly(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

/** Meta's standard events. Nothing outside this union is sendable. */
export type StandardEvent =
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  /* Added 2026-09-23. A VSL funnel does not end at the payment: the payment
     buys a CALL, and the call is the thing the funnel exists to produce. It
     was invisible to Meta until now, so the ad account could optimise towards
     someone paying and not towards someone who actually took a slot, which is
     the step that decides whether the money was well spent.

     `Schedule` is a Meta STANDARD event, so it stays inside the closed union,
     can be an AEM priority event, and populates the standard funnel report.
     It must also be added to the pixel's event allow-list in the dashboard or
     it is dropped without an error. */
  | 'Schedule';

/**
 * Custom events, kept to a closed union for the same reason the standard ones
 * are: a free-form string is how a health term eventually reaches Meta as an
 * event name, which is the surface that gets a dataset classified.
 *
 * ── QualifiedLead is WIRED BUT NOT FIRED on this build. ──────────────────
 * The mechanism is complete: the route validates it, the packer carries the
 * answer, the webhook forwards it. What is missing is the client decision it
 * depends on. QualifiedLead is a segment label on an existing step, fired at
 * the same instant as InitiateCheckout for the half of the buyers the client
 * sells to most, and NOBODY HAS SAID which half that is for Deepti.
 *
 * It is deliberately not invented here, for two reasons. Inventing a
 * qualifying question puts a made-up field on a live checkout, and the
 * obvious candidates for a metabolic-health offer ("what is your primary
 * concern", "do you have recent blood reports") name a condition in
 * custom_data, which is the exact surface this file exists to keep clean.
 * Occupation is safe but means nothing to this offer.
 *
 * Turning it on later is: add the select to the checkout, pass `occupation`
 * through `trackInitiateCheckout`, and nothing else. Known price when you do:
 * one Aggregated Event Measurement slot on iOS, where standard events rank
 * above custom ones.
 */
export type CustomEvent = 'QualifiedLead';

export type SendableEvent = StandardEvent | CustomEvent;

/**
 * The segment answer, as a closed union rather than a string.
 *
 * This is the ONE descriptive value that would ever be allowed into
 * custom_data, and the type is what keeps that true: neither member is a
 * health or condition term, and a free-form string here would be an open door
 * for the next field someone decides to "just add". Reserved for the
 * QualifiedLead split described above. Nothing sets it today.
 */
export type Occupation = 'working_professional' | 'homemaker';

export function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/* Normalisation rules are Meta's, not ours. Each helper returns undefined for
   an empty field rather than hashing the empty string, which would otherwise
   ship a hash that matches every other empty field. */
export function hashEmail(v: string) {
  const s = v.trim().toLowerCase();
  return s ? sha256Hex(s) : undefined;
}
export function hashPhone(v: string) {
  const s = v.replace(/\D/g, ''); // E.164 without the plus
  return s ? sha256Hex(s) : undefined;
}
export function hashName(v: string) {
  const s = v.trim().toLowerCase();
  return s ? sha256Hex(s) : undefined;
}
export function hashCountry(v: string) {
  const s = v.trim().toLowerCase(); // ISO 3166-1 alpha-2
  return s ? sha256Hex(s) : undefined;
}

/* City: lowercase, and strip spaces and punctuation entirely. Meta's own
   normalisation removes them, so "New Delhi" and "newdelhi" must hash to the
   same value or the match is silently lost. */
export function hashCity(v: string) {
  const s = v.trim().toLowerCase().replace(/[^a-z]/g, '');
  return s ? sha256Hex(s) : undefined;
}

export type UserSignals = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  externalId?: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
};

function buildUserData(u: UserSignals) {
  return {
    ...(u.email && { em: [hashEmail(u.email)!] }),
    ...(u.phone && { ph: [hashPhone(u.phone)!] }),
    ...(u.firstName && { fn: [hashName(u.firstName)!] }),
    ...(u.lastName && { ln: [hashName(u.lastName)!] }),
    ...(u.country && { country: [hashCountry(u.country)!] }),
    ...(u.city && { ct: [hashCity(u.city)!] }),
    ...(u.externalId && { external_id: [sha256Hex(u.externalId)] }),
    ...(u.fbc && { fbc: u.fbc }),
    ...(u.fbp && { fbp: u.fbp }),
    ...(u.clientIp && { client_ip_address: u.clientIp }),
    ...(u.clientUserAgent && { client_user_agent: u.clientUserAgent }),
  };
}

/**
 * One event, one POST. Returns Meta's response so routes can log it; never
 * throws into a request, because a failed analytics call must not fail a
 * payment or a page.
 */
export async function sendCapiEvent(params: {
  pixelId: string;
  accessToken: string;
  eventName: SendableEvent;
  eventId: string;
  eventSourceUrl: string;
  user: UserSignals;
  valueRupees: number;
  currency: string;
  /* An opaque Razorpay id. It says nothing about what was bought, and Meta
     uses it for its own deduplication of a purchase across sources. */
  orderId?: string;
  /* Reserved for the QualifiedLead split. Typed, not free-form. Nothing on
     this build sets it: see the Occupation note above. */
  occupation?: Occupation;
  testEventCode?: string;
}): Promise<{ ok: boolean; status: number; body: unknown }> {
  const body = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        event_source_url: originOnly(params.eventSourceUrl),
        action_source: 'website',
        user_data: buildUserData(params.user),
        /* Nothing may be added here without the same review these keys got.
           See the classification note at the top of this file: every key
           below is a number, an opaque id, or a reviewed enum value, and that
           is the property that keeps this dataset unclassified on a domain
           selling against diabetes, fatty liver and thyroid. */
        custom_data: {
          currency: params.currency,
          value: params.valueRupees,
          ...(params.orderId && { order_id: params.orderId }),
          ...(params.occupation && { occupation: params.occupation }),
        },
      },
    ],
    ...(params.testEventCode && { test_event_code: params.testEventCode }),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${params.pixelId}/events?access_token=${params.accessToken}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    return { ok: res.ok, status: res.status, body: await res.json() };
  } catch (e) {
    return { ok: false, status: 0, body: String(e) };
  }
}
