import crypto from 'crypto';

import { NextResponse } from 'next/server';

import {
  ATTR_COOKIE,
  packJsonNote,
  readAttrCookie,
} from '@/lib/attribution-edge';
import { CHECKOUT_CONFIG, isTestMode } from '@/lib/checkout-config';
import {
  readClientIp,
  readClientUserAgent,
  readRequestCookie,
} from '@/lib/request-signals';

/**
 * Creates the Razorpay order the browser then pays.
 *
 * Called with the Razorpay REST API over fetch rather than the `razorpay` npm
 * package: order creation is one authenticated POST, and avoiding the package
 * keeps a dependency and its transitive tree out of a project whose entire
 * dependency list is next, react and react-dom.
 *
 * THE NOTES ARE THE POINT. Everything Meta needs to match the eventual
 * Purchase to a person and a campaign is written into the order here, because
 * the webhook that fires Purchase receives only what Razorpay stores. Signals
 * not written now are gone by then: the buyer may complete inside a bank app
 * and never return to a page that could report them.
 *
 * This is ALSO the last request the buyer's own browser makes before the
 * payment sheet takes over, which makes it the only honest place to read their
 * IP and user agent. The webhook that fires Purchase is a request from
 * Razorpay, so reading those headers there would record Razorpay's server as
 * the buyer's device. See lib/request-signals.ts.
 *
 * Razorpay allows 15 note keys at 256 chars each and REJECTS the order if
 * either limit is passed.
 *
 * ── ONE KEY PER FIELD. NEVER A CHUNKED BLOB. (2026-09-23) ─────────────────
 * This route used to serialise the whole buyer context into one JSON string
 * and slice it across `x0`..`x9`. That fails ALL-OR-NOTHING: the slice cuts
 * the JSON mid-value, `JSON.parse` throws at the other end, and every field
 * comes back empty together. One long campaign name took the campaign, the
 * landing page, the click id, the device and the city down with it, and it
 * read in the sheet as "some fields are missing sometimes".
 *
 * Now each field is its own note key, and the three that are too small to
 * deserve one are grouped into small JSON bundles (`cust`, `meta`, `utm`)
 * whose packer shortens the longest VALUE rather than cutting the string. A
 * field that runs long now costs itself, and nothing beside it.
 */

const truncate = (v: unknown, max = 256) => {
  const s = v == null ? '' : String(v);
  return s.length > max ? s.slice(0, max) : s;
};

export async function POST(req: Request) {
  const { keyId, keySecret } = CHECKOUT_CONFIG.razorpay;
  if (!keyId || !keySecret) {
    console.error('[create-order] Razorpay keys not configured');
    return NextResponse.json(
      { ok: false, reason: 'not-configured' },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-json' }, { status: 400 });
  }

  const firstName = truncate(body.firstName, 80).trim();
  const lastName = truncate(body.lastName, 80).trim();
  const email = truncate(body.email, 160).trim();
  const phone = truncate(body.phone, 20).replace(/\D/g, '');
  const city = truncate(body.city, 80).trim();
  const country = truncate(body.country, 2).trim().toLowerCase() || 'in';
  /* Reserved for the QualifiedLead segment. Nothing sends it today, so it is
     accepted-if-present rather than required: making it mandatory would fail
     every real order on this build. */
  const occupation = truncate(body.occupation, 32).trim();

  if (!firstName || !lastName || !email || !phone || !city) {
    return NextResponse.json({ ok: false, reason: 'missing-fields' }, { status: 400 });
  }

  const utm = (body.utm ?? {}) as Record<string, string | undefined>;

  /* Identity and timestamp for the fulfilment record. Generated HERE, not in
     the webhook: `created_at` must mean "when this person submitted their
     details", and a webhook stamp would instead record when Razorpay got round
     to calling us, which for a UPI payment can be minutes later. */
  const leadId = crypto.randomUUID();

  /* Read from HEADERS, never from the request body: the browser cannot know
     its own IP, and a user agent sent up in JSON is trivially forged. */
  const clientIp = readClientIp(req);
  const clientUserAgent = readClientUserAgent(req);

  /* ── THE COOKIES ON THIS REQUEST (2026-09-23) ──────────────────────────
     This POST is same-origin, so `_fbc`, `_fbp` and the edge attribution
     cookie written by middleware.ts are already sitting on it. The route used
     to ignore them and trust the JSON body alone.

     That mattered most for `_fbc`. If the pixel is blocked, is still loading,
     or the in-app browser restricted the storage the client reader uses, the
     body arrives with no fbc and the click id is gone for good, while the
     cookie was right there on the request. Reading the cookie server-side is
     the trick the SDP build used and the reason its data was cleaner.

     Body first, cookie second: the client value is the fresher of the two
     when both exist, and the cookie is the one that survives when the browser
     side fails. */
  const fbc = truncate(body.fbc) || truncate(readRequestCookie(req, '_fbc'));
  const fbp = truncate(body.fbp) || truncate(readRequestCookie(req, '_fbp'));

  /* The edge copy of the campaign, written by middleware.ts on the very first
     page view, before any JavaScript ran. The browser copy in the body comes
     from a React effect plus localStorage, which is exactly what fails in the
     Instagram and Facebook in-app browsers, the traffic the ads buy. */
  const edge = readAttrCookie(readRequestCookie(req, ATTR_COOKIE));

  const landingUrl = truncate(body.landingUrl, 256) || truncate(edge.landingUrl, 256);
  const referrer = truncate(body.referrer, 200) || truncate(edge.referrer, 200);
  const fbclid = truncate(body.fbclid, 200) || truncate(edge.fbclid, 200);
  const utmOf = (bodyVal: unknown, edgeVal: unknown, max: number) =>
    truncate(bodyVal, max) || truncate(edgeVal, max);

  /* FOURTEEN KEYS OF THE FIFTEEN ALLOWED. One spare, deliberately.
     NO `phone` KEY: Razorpay returns the buyer's contact on the webhook
     payload, and it holds what they actually paid with rather than what they
     typed. A field that never travels cannot be lost, and this one bought
     back a whole note key. */
  const notes: Record<string, string> = {
    kind: CHECKOUT_CONFIG.orderKind,
    lead_id: leadId,
    /* Human-readable, for the Razorpay dashboard: whoever opens a payment
       there should see who it was without decoding anything. */
    name: truncate(`${firstName} ${lastName}`.trim()),
    email: truncate(email),
    /* Small fields grouped so they do not each burn a key. The packer shortens
       the longest VALUE and re-serialises, so an overlong city costs the city
       and nothing else. Caps are realistic rather than generous: this bundle
       serialises to about 170 of its 256. */
    cust: packJsonNote({
      fn: truncate(firstName, 40),
      ln: truncate(lastName, 40),
      ct: truncate(city, 40),
      co: country,
      dl: truncate(body.dialCode, 6),
    }),
    /* NO `cd` TIMESTAMP. The webhook takes the date from Razorpay's own
       `payment.created_at`, so carrying one here was both a duplicate and a
       liability: a note that failed to pack could take the sale's date with
       it. */
    meta: packJsonNote({
      oc: truncate(occupation, 32),
      xid: truncate(body.externalId, 40),
      ga: truncate(body.gaClientId, 40),
    }),
    /* ── TGO'S OWN UTM CONVENTION, NOT THE STANDARD ONE ─────────────────
       The ad urls are built with Meta's dynamic parameters like this:

         utm_source  = {{placement}}       instagram_reels, facebook_feed
         utm_medium  = {{campaign.name}}
         utm_campaign= {{adset.name}}
         utm_term    = {{ad.id}}           the numeric id, ~18 digits
         utm_content = {{ad.name}}

       READ THAT BEFORE CHANGING A CAP. Three of the five carry Meta NAMES,
       which in an agency account run to forty or sixty characters. The old
       flat 100 each could not fit in one note at all; 20/55/55/55/25
       serialises to 246 of the 256 available.

       THE AD ID GETS 25, NOT 20. Meta's ids are 17 to 18 digits today and have
       grown over the years, and a truncated ad id is worse than a missing one
       because it still looks like an id and joins to nothing. */
    utm: packJsonNote({
      s: utmOf(utm.source, edge.utmSource, 20),
      m: utmOf(utm.medium, edge.utmMedium, 55),
      c: utmOf(utm.campaign, edge.utmCampaign, 55),
      n: utmOf(utm.content, edge.utmContent, 55),
      t: utmOf(utm.term, edge.utmTerm, 25),
    }),
    /* Identifiers get their OWN key, never a shared bundle. A truncated fbc or
       ad id still looks valid and joins to nothing, which is worse than an
       absent one, so none of them may ever compete for space. */
    fbc,
    fbp,
    ip: clientIp,
    ua: truncate(clientUserAgent, 256),
    clid: fbclid,
    ref: referrer,
    lp: landingUrl,
  };

  /* A REJECTED ORDER IS AN UNPAID BUYER, so both of Razorpay's limits are
     asserted rather than assumed, and the length one is REPAIRED rather than
     merely logged: dropping a live order over one long note value would cost
     the sale. */
  for (const [k, v] of Object.entries(notes)) {
    if (v.length > 256) {
      console.error(`[create-order] note "${k}" over 256 chars (${v.length}), trimming`);
      notes[k] = v.slice(0, 256);
    }
  }
  if (Object.keys(notes).length > 15) {
    console.error('[create-order] notes over Razorpay 15-key cap', Object.keys(notes).length);
  }

  try {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: CHECKOUT_CONFIG.amountPaise,
        currency: CHECKOUT_CONFIG.currency,
        receipt: `dp_${Date.now()}`,
        notes,
      }),
    });

    const order = await res.json();
    if (!res.ok || !order?.id) {
      /* Flattened onto ONE line on purpose. Logging the raw object makes the
         host's log viewer pretty-print it across many lines and truncate the
         tail, which is exactly where Razorpay puts `description` and `field`,
         the only two values that say what was actually wrong. */
      const err = order?.error ?? {};
      /* A 401 is never about the payload, so print the SHAPE of the credentials
         beside it. The key id is publishable by design (it is handed to the
         browser below), and a length plus a trimmed-flag says nothing about the
         secret's value while catching all four causes of a bad pair: mixed
         test/live modes, a stray space or quote pasted into the host's env UI,
         a regenerated secret, and the two values entered the wrong way round. */
      if (res.status === 401) {
        console.error(
          `[create-order] auth shape keyIdPrefix=${keyId.slice(0, 9)} ` +
            `keyIdLen=${keyId.length} (expect 23) secretLen=${keySecret.length} (expect 24) ` +
            `keyIdClean=${keyId === keyId.trim()} secretClean=${keySecret === keySecret.trim()} ` +
            `secretLooksLikeKeyId=${keySecret.startsWith('rzp_')}`,
        );
      }
      console.error(
        `[create-order] razorpay rejected http=${res.status} code=${err.code ?? '?'} ` +
          `step=${err.step ?? '?'} field=${err.field ?? '-'} desc=${err.description ?? JSON.stringify(order)}`,
      );
      return NextResponse.json({ ok: false, reason: 'gateway' }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      leadId,
      isTest: isTestMode(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // publishable by design: the browser needs it to open the sheet
    });
  } catch (e) {
    console.error('[create-order] failed', e);
    return NextResponse.json({ ok: false, reason: 'network' }, { status: 502 });
  }
}
