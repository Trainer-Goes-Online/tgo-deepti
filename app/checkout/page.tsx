'use client';

/**
 * /checkout  ·  the paid assessment.
 *
 * Built to the house checkout anatomy: a header with a way back, a centred
 * masthead, then a two-column body with the form on the left and a STICKY
 * order summary on the right that collapses into a tap-to-open accordion on a
 * phone. Skinned in this project's own Garnet and Gold tokens, and it declares
 * no colour of its own: everything comes from :root via app/checkout.css.
 *
 * WHAT IS BEING SOLD HERE IS THE ASSESSMENT, NOT THE PROGRAMME. The fee is
 * ninety-seven rupees, it buys a consultation in which reports are reviewed
 * and the client is told honestly whether the programme suits them, and it
 * enrols nobody in anything. Every string on the page that describes it comes
 * from FAQ 1 of the copy source via ./included.ts.
 *
 * THE FLOW:
 *   mount            -> trackBeginCheckout() + trackAddToCart()
 *   submit           -> trackInitiateCheckout({...})
 *                    -> POST /api/razorpay/create-order  (signals into notes)
 *                    -> new window.Razorpay({...}).open()
 *   handler(payment) -> redirect to /book-a-call?p=<payment_id>
 *   (the thank-you now sits AFTER the booking, not after the payment)
 *
 * The Razorpay `handler` ONLY NAVIGATES. It fires no Purchase. The webhook
 * owns that, because a UPI payer finishes inside their bank app and never
 * returns to this tab.
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { business, feeLabel } from '@/lib/site';
import { collectSignals } from '@/lib/client-signals';
import {
  trackAddToCart,
  trackBeginCheckout,
  trackInitiateCheckout,
} from '@/lib/track';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { PaymentLogos } from '@/components/shared/PaymentLogos';
import {
  AlertIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CardIcon,
  CheckIcon,
  LockIcon,
  ShieldCheckIcon,
} from '@/components/shared/icons';

import {
  ASSESSMENT_COVERS,
  ASSESSMENT_PRICE_LABEL,
  ASSESSMENT_PROMISE,
  ASSESSMENT_TITLE,
  NOT_A_SALES_CALL,
  SCOPE_NOTE,
} from './included';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const RZP_SDK = 'https://checkout.razorpay.com/v1/checkout.js';

/* Loaded on demand rather than in the layout: it is roughly 100KB that only
   matters once someone actually presses pay. */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RZP_SDK}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const el = document.createElement('script');
    el.src = RZP_SDK;
    el.async = true;
    el.onload = () => resolve(true);
    el.onerror = () => resolve(false);
    document.body.appendChild(el);
  });
}

/* Dial codes carry the ISO-2 alongside them, because Meta's CAPI wants the
   COUNTRY as a hashed ISO 3166-1 alpha-2 code and not a dial code.

   India first, then the countries the client's own copy names: "700+ clients
   across India, USA, Canada, UK, Australia & The Middle East". The Gulf states
   are listed individually because "Middle East" is not a dial code. */
const COUNTRIES: { iso: string; dial: string; label: string }[] = [
  { iso: 'in', dial: '+91', label: 'India (+91)' },
  { iso: 'ae', dial: '+971', label: 'UAE (+971)' },
  { iso: 'sa', dial: '+966', label: 'Saudi Arabia (+966)' },
  { iso: 'qa', dial: '+974', label: 'Qatar (+974)' },
  { iso: 'om', dial: '+968', label: 'Oman (+968)' },
  { iso: 'kw', dial: '+965', label: 'Kuwait (+965)' },
  { iso: 'bh', dial: '+973', label: 'Bahrain (+973)' },
  { iso: 'us', dial: '+1', label: 'USA (+1)' },
  { iso: 'ca', dial: '+1', label: 'Canada (+1)' },
  { iso: 'gb', dial: '+44', label: 'UK (+44)' },
  { iso: 'au', dial: '+61', label: 'Australia (+61)' },
  { iso: 'nz', dial: '+64', label: 'New Zealand (+64)' },
  { iso: 'sg', dial: '+65', label: 'Singapore (+65)' },
  { iso: 'my', dial: '+60', label: 'Malaysia (+60)' },
  { iso: 'za', dial: '+27', label: 'South Africa (+27)' },
];

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string; // ISO-2
  phone: string;
};

export default function CheckoutPage() {
  const [f, setF] = useState<Fields>({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: 'in',
    phone: '',
  });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  /* The post-payment acknowledgement. Ported from the Sreshtha checkout, where
     it exists because of a real failure mode on this exact flow: Razorpay's
     handler only fires once the sheet has settled, and a buyer who closes the
     tab on seeing "success" never reaches /book-a-call. They have paid and have
     no slot, and the first anyone knows is a support message.

     It is a separate piece of state from the fields because it is a different
     kind of thing: the fields are data we collect, this is a promise we ask for
     before taking money. */
  const [ack, setAck] = useState(false);

  /* ARRIVAL at the checkout. GA4 gets begin_checkout, Meta gets AddToCart.
     Meta's InitiateCheckout deliberately does NOT fire here: it waits until the
     details are valid and the payment sheet actually opens, which is a far
     stronger buying signal than a page load and is what the ads optimise on.

     This is also the ONLY Meta event a DIRECT arrival ever gets. Someone who
     opens /checkout from an email, a retargeting ad or a bookmark never touches
     the landing page, so without this they are invisible to Meta until the pay
     tap. Ref-guarded so StrictMode's double effect and a remount cannot inflate
     the count. */
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current) return;
    arrived.current = true;
    trackBeginCheckout();
    trackAddToCart();
  }, []);

  const v = useMemo(() => {
    const digits = f.phone.replace(/\D/g, '');
    return {
      firstName: f.firstName.trim().length > 1,
      lastName: f.lastName.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()),
      city: f.city.trim().length > 1,
      /* The dial code comes from the picker, so this validates the SUBSCRIBER
         number only: 7 to 12 digits covers every country in the list without
         pulling in libphonenumber-js. India is the strict case at exactly 10. */
      phone: f.country === 'in' ? digits.length === 10 : digits.length >= 7 && digits.length <= 12,
    };
  }, [f]);
  const valid = v.firstName && v.lastName && v.email && v.city && v.phone;

  const dial = COUNTRIES.find((c) => c.iso === f.country)?.dial ?? '+91';
  /* E.164 without the plus, which is what both Meta and Razorpay expect. */
  const e164 = `${dial}${f.phone}`.replace(/\D/g, '');

  const startPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFailed('');
    if (!valid || !ack || busy) return;
    setBusy(true);

    /* Meta InitiateCheckout + GA4 add_payment_info. Fired BEFORE the sheet
       opens rather than after payment, because this is the moment intent is
       real: the details are valid and the buyer is committing. */
    trackInitiateCheckout({
      email: f.email.trim(),
      phone: e164,
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      city: f.city.trim(),
      country: f.country,
    });

    try {
      const sdk = await loadRazorpay();
      if (!sdk) throw new Error('sdk');

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim(),
          phone: e164,
          city: f.city.trim(),
          country: f.country,
          /* Sent SEPARATELY from the phone, which goes up as full E.164.
             Pabbly gets its own `dial_code` column, so a workflow can route or
             format on the country without having to parse a number back
             apart. */
          dialCode: dial,
          ...collectSignals(),
        }),
      });
      const order = await res.json();

      if (!res.ok || !order?.ok) {
        setBusy(false);
        setFailed(
          order?.reason === 'not-configured'
            ? 'Payments are not switched on yet. Nothing has been charged.'
            : 'We could not start the payment. Please try again.',
        );
        return;
      }

      const rzp = new window.Razorpay!({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        /* The REGISTERED name, not a brand nickname. This is the name that
           appears in the payment sheet and on the buyer's card statement, and
           a mismatch between the two is a chargeback reason on its own. */
        name: business.legalName,
        /* ⚠️ NO BRAND MARK SUPPLIED. Razorpay renders `image` inside an iframe
           served from its own domain, so it must be an ABSOLUTE url or it
           resolves against checkout.razorpay.com and 404s into a blank tile.
           The key is omitted entirely rather than pointed at a file that does
           not exist: an empty tile looks broken, a missing one looks plain.
           Drop a square logo at /public/brand/deepti-square.jpg, bump ASSET_V,
           and add:
             image: `${window.location.origin}${asset('/brand/deepti-square.jpg')}` */
        description: ASSESSMENT_TITLE,
        prefill: {
          name: `${f.firstName.trim()} ${f.lastName.trim()}`.trim(),
          email: f.email.trim(),
          contact: e164,
        },
        /* Garnet, read from the stylesheet rather than hardcoded, so the sheet
           follows a re-theme like everything else on this build. Razorpay wants
           a literal hex string, which is the one place a token cannot be passed
           through directly. */
        theme: { color: readToken('--brand-deep', '#5A1526') },
        modal: { ondismiss: () => setBusy(false) },
        /* Purchase is NOT fired here. The webhook owns it, so a UPI payer who
           finishes in their bank app and never returns is still counted. This
           handler only moves the buyer on. */
        handler: (r: { razorpay_payment_id: string }) => {
          window.location.href = `/book-a-call?p=${encodeURIComponent(r.razorpay_payment_id)}`;
        },
      });
      rzp.open();
    } catch {
      setBusy(false);
      setFailed('We could not start the payment. Please try again.');
    }
  };

  return (
    <div className="dp-pay">
      <section className="pay-body">
        <div className="wrap">
          <div className="pay-mast">
            <span className="pay-pill">
              <ShieldCheckIcon size={13} />
              {NOT_A_SALES_CALL}
            </span>
            <h1>
              Your <em>{ASSESSMENT_TITLE}</em>
            </h1>
            <p className="pay-deck">{ASSESSMENT_PROMISE}</p>
          </div>

          <div className="pay-grid">
            {/* id is load-bearing: the mobile docked bar lives OUTSIDE this
                form (it has to, to be position:fixed against the viewport
                without the form's stacking context) and submits it by
                `form="pay-form"`. That routes it through the same
                startPayment, the same validation and the same busy guard, so
                there is one payment path and not two to keep in step. */}
            <form id="pay-form" className="pay-card" onSubmit={startPayment} noValidate>
              <p className="pay-eyebrow">YOUR DETAILS</p>
              <h2>Where should we reach you?</h2>
              <p className="pay-hint">
                Deepti&rsquo;s team uses these to arrange your assessment and to
                send you the receipt.
              </p>

              {/* THE ONE INSTRUCTION THAT HAS TO LAND BEFORE PAYMENT, ported
                  from the Sreshtha checkout. It sits ABOVE the fields, not
                  beside the button: by the time someone is on the button they
                  are committing, and this is a thing they need to know while
                  they still have attention to spare for it.

                  Razorpay's handler is what navigates to /book-a-call, so the
                  gap between "payment succeeded" and "calendar opens" is real
                  and a closed tab lands a paid buyer with no slot. */}
              <div className="pay-note" role="note">
                <span className="pay-note-chip" aria-hidden>
                  <AlertIcon size={13} />
                </span>
                <p>
                  <strong>
                    Important: please don&rsquo;t close this page after paying.
                  </strong>{' '}
                  The moment your payment succeeds, please wait up to{' '}
                  <strong>10 seconds</strong> without closing or refreshing this
                  tab. You&rsquo;ll then be taken automatically to the calendar
                  to pick your preferred date and time and book your assessment.
                  Leaving early may stop your booking from being completed.
                </p>
              </div>

              <div className="pay-fields">
                {/* First and last are SEPARATE fields, not one "Full name"
                    split on a space. Splitting guesses: it hands a two-word
                    surname to the first name, and gives a single-word entry no
                    last name at all. Meta hashes fn and ln independently, so a
                    bad guess is a permanently worse match, not a cosmetic one. */}
                <div className="pay-two">
                  <Field
                    label="First name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={f.firstName}
                    onChange={(x) => setF((s) => ({ ...s, firstName: x }))}
                    bad={touched && !v.firstName}
                  />
                  <Field
                    label="Last name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={f.lastName}
                    onChange={(x) => setF((s) => ({ ...s, lastName: x }))}
                    bad={touched && !v.lastName}
                  />
                </div>

                <Field
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={f.email}
                  onChange={(x) => setF((s) => ({ ...s, email: x }))}
                  bad={touched && !v.email}
                  note="Your receipt and assessment details go here."
                />

                {/* City and country are on this form because they are Meta
                    match keys (ct and country), and city hashing strips spaces
                    and punctuation, so "New Delhi" and "newdelhi" hash the
                    same. Every field on this form is here to be SENT, not to
                    be collected: a field that raises no match quality and
                    drives no segment does not belong on a checkout. */}
                <Field
                  label="Town / City"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Your town or city"
                  value={f.city}
                  onChange={(x) => setF((s) => ({ ...s, city: x }))}
                  bad={touched && !v.city}
                />

                <label>
                  <span className="f-label">WhatsApp number</span>
                  <div className="pay-phone">
                    <select
                      autoComplete="tel-country-code"
                      aria-label="Country dialling code"
                      value={f.country}
                      onChange={(e) => setF((s) => ({ ...s, country: e.target.value }))}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="98XXX XXXXX"
                      value={f.phone}
                      onChange={(e) => setF((s) => ({ ...s, phone: e.target.value }))}
                      aria-invalid={(touched && !v.phone) || undefined}
                    />
                  </div>
                  <span className="f-note">
                    Deepti&rsquo;s team will contact you on this number.
                  </span>
                </label>
              </div>

              {/* The same promise as the note above, asked for rather than
                  told, at the moment of paying. Its own line of error text and
                  not the fields' one: "add your name and a valid number" is
                  useless feedback to someone whose name is already filled in
                  and whose only miss is the tick. */}
              <label className="pay-ack">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  aria-invalid={(touched && !ack) || undefined}
                />
                <span>
                  I understand that after payment, I&rsquo;ll wait up to{' '}
                  <strong>10 seconds</strong> for the booking page to open, then
                  pick my preferred date and time to book my assessment.
                </span>
              </label>

              {touched && !valid && (
                <p className="pay-error">
                  Please add your name, a working email, your city and a valid
                  number.
                </p>
              )}
              {touched && valid && !ack && (
                <p className="pay-error">
                  Please tick the box above so we know to expect you on the
                  booking page.
                </p>
              )}
              {failed && <p className="pay-error">{failed}</p>}

              <button type="submit" className="pay-cta" disabled={busy}>
                <span>
                  {busy
                    ? 'Taking you to payment'
                    : `Pay ${feeLabel} & Get My Assessment`}
                </span>
                <span className="arrow" aria-hidden>
                  <ArrowRightIcon size={13} />
                </span>
              </button>

              {/* THE THREE POINTERS. House standard under every checkout CTA.
                  The third one is normally the refund line in words; here it is
                  a LINK to the refund policy instead, because whether the
                  assessment fee is refundable is one of the three commercial
                  facts nobody has confirmed. Writing "fully refundable" or
                  "non-refundable" here would be inventing a term the client has
                  not agreed, so the page points at the policy and the policy
                  says plainly that the term is pending. */}
              <div className="pay-points">
                <span>
                  <LockIcon />
                  Razorpay Secured
                </span>
                <span className="sep" aria-hidden>
                  &middot;
                </span>
                <span>SSL Encrypted</span>
                <span className="sep" aria-hidden>
                  &middot;
                </span>
                <span>
                  <Link href="/refund">Refund &amp; cancellation policy</Link>
                </span>
              </div>

              <p className="pay-privacy">
                Your personal data is used to process this payment, to arrange
                your assessment, and for the purposes described in our{' '}
                <Link href="/privacy">privacy policy</Link>. Your health
                information is handled under the same policy.
              </p>

              <div className="pay-methods">
                <span className="pay-methods-label">100% secure and safe payments</span>
                <PaymentLogos />
              </div>
            </form>

            <div className="pay-sum-col">
              <OrderSummary />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE MOBILE DOCKED BAR (2026-09-18, Atul) ──────────────────────
          Below 1000px the layout is one column and the summary column stops
          being sticky, so the price and the action both scroll away while the
          fields are being filled. This puts them back.

          It is NOT the landing page's StickyCta. That bar's job is to send
          someone to /checkout, which is where this reader already is, so
          reusing it would dock a button that links to the current page. This
          one submits the form instead.

          The label carries the price because it is the only place the price
          appears once the summary has scrolled off. */}
      <div className="pay-stuck" aria-hidden={busy ? true : undefined}>
        <div className="pay-stuck-inner">
          <span className="pay-stuck-fig">
            <span className="pay-stuck-cap">Total due today</span>
            <strong>{feeLabel}</strong>
          </span>
          <button
            type="submit"
            form="pay-form"
            className="pay-stuck-go"
            disabled={busy}
          >
            <span>{busy ? 'Taking you to payment' : 'Pay & book'}</span>
            <span className="arrow" aria-hidden>
              <ArrowRightIcon size={12} />
            </span>
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

/**
 * Read a CSS custom property off the document root.
 *
 * Razorpay's sheet takes a literal hex and cannot read a token, and this is the
 * only value on the build that has to leave CSS. Reading it back rather than
 * retyping the hex means a re-theme moves the payment sheet with it, and the
 * fallback covers the server render and any browser that returns an empty
 * string.
 */
function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  } catch {
    return fallback;
  }
}

/**
 * THE ORDER SUMMARY.
 *
 * One line item, its real price, and no invented value stack. See the note at
 * the top of included.ts for why there is no struck-through figure here.
 *
 * Accordion below 1000px, always open above it. The toggle keeps its
 * aria-expanded on both, because the CSS hides the caret rather than removing
 * the button, and a screen reader on a wide viewport should not be told about
 * a control that does nothing (hence pointer-events: none on the desktop rule
 * and the details being unconditionally visible there).
 */
function OrderSummary() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sum">
      <button
        type="button"
        className="sum-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="sum-details"
      >
        <span>
          <span className="sum-kicker">ORDER SUMMARY</span>
          <span className="sum-title">What you are paying for</span>
          <span className="sum-tap">
            {open ? 'Tap to hide the details' : 'Tap to see what is included'}
          </span>
        </span>
        <span className="sum-caret" aria-hidden>
          <CaretDownIcon />
        </span>
      </button>

      {/* The lead item, always visible on every viewport: it is the thing
          being bought, and it is the only line on the order. */}
      <div className="sum-lead">
        <span className="sum-lead-chip" aria-hidden>
          1 of 1
        </span>
        <span className="sum-lead-body">
          <b>{ASSESSMENT_TITLE}</b>
          <span>With Deepti and her team of qualified nutritionists</span>
        </span>
        <span className="sum-lead-price">{ASSESSMENT_PRICE_LABEL}</span>
      </div>

      <div id="sum-details" className={open ? 'sum-details open' : 'sum-details'}>
        <p className="sum-sub">WHAT IS REVIEWED IN IT</p>
        <ul className="sum-covers">
          {ASSESSMENT_COVERS.map((c) => (
            <li key={c}>
              <span className="ck" aria-hidden>
                <CheckIcon size={10} />
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sum-rule" />

      <div className="sum-total">
        <span className="sum-total-label">Total</span>
        <span className="sum-total-fig">{ASSESSMENT_PRICE_LABEL}</span>
      </div>

      <div className="sum-method">
        <CardIcon />
        <span>
          <b>UPI &middot; Cards &middot; NetBanking</b>
          <span>Paid securely through Razorpay.</span>
        </span>
      </div>

      <div className="sum-scope">
        <b>WHAT THIS FEE COVERS</b>
        <p>{SCOPE_NOTE}</p>
      </div>
    </div>
  );
}

/**
 * One field. Kept as a component so every input carries the same label
 * treatment, the same error state and the same focus ring, and so a new field
 * cannot be added with a different one.
 */
function Field({
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  bad,
  note,
}: {
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  note?: string;
}) {
  return (
    <label>
      <span className="f-label">{label}</span>
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={bad || undefined}
      />
      {note && <span className="f-note">{note}</span>}
    </label>
  );
}
