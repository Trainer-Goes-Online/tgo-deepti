import { NextResponse } from 'next/server';

import { CHECKOUT_CONFIG, capiReady, siteUrlReady } from '@/lib/checkout-config';
import {
  sendCapiEvent,
  sha256Hex,
  type Occupation,
  type SendableEvent,
} from '@/lib/meta-capi';

/**
 * One route for the pre-payment events: ViewContent, AddToCart,
 * InitiateCheckout, and QualifiedLead if the segment is ever switched on.
 *
 * The allow-list below is what keeps a single route from becoming a hole: only
 * reviewed names are accepted, and PURCHASE IS EXPLICITLY NOT AMONG THEM.
 * Purchase is only ever sent by the Razorpay webhook, where the payment is
 * proven, so this public endpoint can never be used to forge a sale.
 *
 * The client IP and user agent are read from THIS request's headers, which is
 * the correct source: this is a fetch from the buyer's own browser. The
 * webhook's equivalent values have to travel via the order notes, because that
 * request comes from Razorpay.
 */
const ALLOWED: SendableEvent[] = [
  'ViewContent',
  'AddToCart',
  'InitiateCheckout',
  'QualifiedLead',
];

/* The reserved segment answers, validated against this list rather than passed
   through, so a renamed form option cannot quietly ship a new string to Meta:
   an unrecognised value becomes undefined and the key is simply omitted, which
   is the safe failure. Nothing on this build sends one. */
const OCCUPATIONS: Occupation[] = ['working_professional', 'homemaker'];

export async function POST(req: Request) {
  if (!capiReady()) {
    return NextResponse.json({ ok: false, reason: 'capi-not-configured' });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-json' }, { status: 400 });
  }

  const eventName = String(body.eventName ?? '') as SendableEvent;
  if (!ALLOWED.includes(eventName)) {
    return NextResponse.json(
      { ok: false, reason: 'event-not-allowed' },
      { status: 400 },
    );
  }

  const email = typeof body.email === 'string' ? body.email : '';
  const fbp = typeof body.fbp === 'string' ? body.fbp : undefined;

  const rawOccupation = String(body.occupation ?? '') as Occupation;
  const occupation = OCCUPATIONS.includes(rawOccupation)
    ? rawOccupation
    : undefined;

  /* QualifiedLead means exactly one thing: a qualifying buyer reached the
     payment sheet. Firing it without that answer would dilute the audience it
     exists to build, so the route refuses rather than sending a vaguer event. */
  if (eventName === 'QualifiedLead' && occupation !== 'working_professional') {
    return NextResponse.json(
      { ok: false, reason: 'not-qualified' },
      { status: 400 },
    );
  }

  const eventSourceUrl =
    (typeof body.eventSourceUrl === 'string' && body.eventSourceUrl) ||
    CHECKOUT_CONFIG.fallbackEventSourceUrl;

  /* Loud, not silent. A browser always sends its own href, so this only bites
     when something calls the route without one AND the domain is unset, and an
     empty event_source_url is worthless to Meta while looking like nothing is
     wrong. Law 8: design against the silent no-op. */
  if (!eventSourceUrl) {
    console.error(
      '[meta] no event_source_url: NEXT_PUBLIC_SITE_URL is unset and the caller sent none',
    );
  } else if (!siteUrlReady()) {
    console.warn('[meta] NEXT_PUBLIC_SITE_URL is unset, falling back to the caller url');
  }

  /* Dedup keys, deterministic so Meta's 48h window collapses double-fires:
     by email where we have one, otherwise by the browser's _fbp. */
  const seed = email || fbp || `${Date.now()}_${Math.random()}`;
  const eventId = sha256Hex(`${seed}|${eventName}`);

  const result = await sendCapiEvent({
    pixelId: CHECKOUT_CONFIG.meta.pixelId,
    accessToken: CHECKOUT_CONFIG.meta.accessToken,
    eventName,
    eventId,
    /* Reduced to the origin inside sendCapiEvent, server-side, because the
       value arriving here is window.location.href with the fbclid on it. */
    eventSourceUrl,
    user: {
      email: email || undefined,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      firstName: typeof body.firstName === 'string' ? body.firstName : undefined,
      lastName: typeof body.lastName === 'string' ? body.lastName : undefined,
      /* The checkout asks, so an overseas buyer is not reported as Indian: a
         wrong hashed value is worse than a missing one. Falls back to India for
         the landing-page events, which carry no form. Deepti's own copy claims
         clients across India, USA, Canada, UK, Australia and the Middle East,
         so this is not a theoretical case. */
      country:
        typeof body.country === 'string' && body.country.length === 2
          ? body.country.toLowerCase()
          : 'in',
      city: typeof body.city === 'string' ? body.city : undefined,
      externalId:
        typeof body.externalId === 'string' ? body.externalId : undefined,
      fbc: typeof body.fbc === 'string' ? body.fbc : undefined,
      fbp,
      clientIp:
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      clientUserAgent: req.headers.get('user-agent') ?? undefined,
    },
    valueRupees: CHECKOUT_CONFIG.amountRupees,
    currency: CHECKOUT_CONFIG.currency,
    /* Reserved, and undefined on every event this build sends. */
    occupation,
    /* No content_name, no UTMs, no order id. These events happen before an
       order exists, so custom_data carries value and currency alone. See the
       classification note at the top of lib/meta-capi.ts: this is a domain
       selling against diabetes, fatty liver and thyroid, and custom_data is
       the surface that gets a dataset restricted at the root domain. The UTMs
       the browser still sends in this body are deliberately read for nothing
       here; they reach the sale through Razorpay's notes and Pabbly instead. */
    testEventCode: CHECKOUT_CONFIG.meta.testEventCode || undefined,
  });

  return NextResponse.json({ ok: result.ok, eventName, eventId });
}
