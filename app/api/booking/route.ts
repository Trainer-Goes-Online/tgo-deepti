import { NextResponse, after } from 'next/server';

import { isTestMode } from '@/lib/checkout-config';
import {
  OTHER,
  allValid,
  investmentForWebhook,
  validateBooking,
  type BookingAnswers,
} from '@/lib/booking-form';
import {
  readClientIp,
  readClientUserAgent,
  readRequestCookie,
} from '@/lib/request-signals';

/**
 * The booking form's hand-off (2026-11-12). Replaces Cal.com.
 *
 * /book-a-call posts the buyer's answers and preferred language here, and this
 * forwards them to BOOKING_WEBHOOK_URL (a NEW webhook, separate from the
 * purchase one in PABBLY_WEBHOOK_URL).
 *
 * Why a server route rather than posting from the browser straight to the
 * webhook: the webhook url stays private (a public url invites junk rows),
 * the answers are re-validated against the same lists the page renders, and
 * the IP, user agent and Meta cookies are read from the request itself.
 *
 * Unlike the Razorpay webhook, a failure here IS reported to the browser. The
 * buyer is still on the page and can retry; a silently swallowed failure
 * would be a lost booking from someone who has already paid.
 *
 * Payload is FLAT (one level deep) because Pabbly maps fields one level deep.
 * Multi-select answers are joined with " | " for the same reason, and every
 * key is always present so the first test payload maps every column.
 */
/* ── DELIVERY THAT NEVER BLAMES THE BUYER (2026-11-12) ──────────────────
   A paid buyer who has just answered every question must never see "we
   could not send your details" because OUR webhook is down, slow or not
   configured. So:
     1. One quick inline attempt (5s). Success: done.
     2. Otherwise the buyer is told it worked, and delivery carries on AFTER
        the response (next/server `after`) with retries and backoff.
     3. If every retry fails, the full payload is written to the server log
        under "[booking] UNDELIVERED", so no submission is ever lost; it can
        be replayed from the log by hand.
   Only a genuinely invalid payload is refused, and the page's own
   validation means a real buyer never hits that. */
const ATTEMPT_TIMEOUT_MS = 5000;
const RETRY_DELAYS_MS = [1500, 4000, 10000];

async function postOnce(url: string, body: string): Promise<boolean> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      signal: ctl.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function deliverWithRetries(url: string, body: string, ref: string) {
  for (const delay of RETRY_DELAYS_MS) {
    await sleep(delay);
    if (await postOnce(url, body)) {
      console.log(`[booking] delivered on retry for ${ref}`);
      return;
    }
  }
  console.error(`[booking] UNDELIVERED after retries for ${ref}. Payload follows for replay:`);
  console.error(`[booking] UNDELIVERED ${body}`);
}

export async function POST(req: Request) {
  const url = (process.env.BOOKING_WEBHOOK_URL ?? '').trim();

  let body: Partial<BookingAnswers> & {
    paymentId?: string;
    orderBump?: boolean;
    signals?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-json' }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 600) : '');
  const arr = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 20) : [];

  const a: BookingAnswers = {
    firstName: str(body.firstName),
    lastName: str(body.lastName),
    country: str(body.country) || 'in',
    dialCode: str(body.dialCode),
    phone: str(body.phone),
    email: str(body.email),
    age: str(body.age),
    city: str(body.city),
    state: str(body.state),
    situation: str(body.situation),
    situationOther: str(body.situationOther),
    concerns: arr(body.concerns),
    concernsOther: str(body.concernsOther),
    tried: arr(body.tried),
    whyNow: str(body.whyNow),
    investment: str(body.investment),
    investmentAmount: str(body.investmentAmount),
    commitment: str(body.commitment),
    profession: str(body.profession),
    decision: str(body.decision),
    showUp: str(body.showUp),
    preferredLanguage: str(body.preferredLanguage),
  };

  const v = validateBooking(a);
  if (!allValid(v)) {
    const bad = Object.entries(v)
      .filter(([, ok]) => !ok)
      .map(([k]) => k);
    return NextResponse.json({ ok: false, reason: 'invalid', fields: bad }, { status: 400 });
  }

  const sig = (body.signals ?? {}) as Record<string, unknown>;
  const utm = (sig.utm ?? {}) as Record<string, unknown>;
  const digits = a.phone.replace(/\D/g, '');
  const dialDigits = a.dialCode.replace(/\D/g, '');
  const situation = a.situation === OTHER ? `${OTHER}: ${a.situationOther.trim()}` : a.situation;
  const concerns = a.concerns
    .map((c) => (c === OTHER ? `${OTHER}: ${a.concernsOther.trim()}` : c))
    .join(' | ');

  const payload = {
    type: 'booking',
    event: 'booking',
    submitted_at: new Date().toISOString(),
    is_test: isTestMode(),

    /* Ties this row to the purchase row the Razorpay webhook already sent. */
    payment_id: str(body.paymentId),
    order_bump: Boolean(body.orderBump),

    first_name: a.firstName,
    last_name: a.lastName,
    name: `${a.firstName} ${a.lastName}`.trim(),
    email: a.email,
    /* E.164 without the plus, and the parts kept apart, same as the purchase
       payload, so the two rows join on phone without reformatting. */
    phone: `${dialDigits}${digits}`,
    dial_code: a.dialCode,
    phone_national: digits,
    country_code: a.country,
    age: Number(a.age),
    city: a.city,
    state: a.state,

    /* Step 4 (2026-11-16): the call language, which replaced the preferred
       date and time. The team schedules the call itself. */
    preferred_language: a.preferredLanguage,

    current_situation: situation,
    health_concerns: concerns,
    already_tried: a.tried.join(' | '),
    why_now: a.whyNow,
    /* same key as before; the budget option arrives with its amount
       written in, e.g. "...invest upto Rs.5000 on my health" */
    investment_level: investmentForWebhook(a.investment, a.investmentAmount),
    commitment_score: Number(a.commitment),
    profession: a.profession,
    decision_maker: a.decision,
    committed_to_attend: a.showUp,

    fbc: str(sig.fbc) || readRequestCookie(req, '_fbc'),
    fbp: str(sig.fbp) || readRequestCookie(req, '_fbp'),
    external_id: str(sig.externalId),
    client_ip_address: readClientIp(req),
    client_user_agent: readClientUserAgent(req),
    utm_source: str(utm.source),
    utm_medium: str(utm.medium),
    utm_campaign: str(utm.campaign),
    utm_content: str(utm.content),
    utm_term: str(utm.term),
    fbclid: str(sig.fbclid),
    referrer: str(sig.referrer),
    landing_url: str(sig.landingUrl),
  };

  const json = JSON.stringify(payload);
  const ref = `${payload.payment_id || 'no-payment-id'} / ${payload.email}`;

  /* Misconfigured deploy: nothing to send to. Loud in the log, invisible to
     the buyer, and the payload is kept there for replay. */
  if (!url) {
    console.error(`[booking] BOOKING_WEBHOOK_URL is not set. UNDELIVERED for ${ref}:`);
    console.error(`[booking] UNDELIVERED ${json}`);
    return NextResponse.json({ ok: true, delivered: false });
  }

  if (await postOnce(url, json)) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  console.warn(`[booking] first delivery failed for ${ref}; retrying in background`);
  after(() => deliverWithRetries(url, json, ref));
  return NextResponse.json({ ok: true, delivered: 'pending' });
}
