/**
 * THE BOOKING FORM · questions and answer options (2026-11-12)
 *
 * Replaces the Cal.com calendar on /book-a-call. The buyer answers these and
 * picks a preferred language; the team then schedules the call.
 *
 * ONE source for both sides: the form renders from these lists and the
 * /api/booking route validates against them, so an option can never be on
 * the page and rejected by the server, or the other way round.
 *
 * Option text is the client's own wording. Two fixes to the pasted copy:
 *   · "portion contro" -> "portion control"
 *   · the "why now" list had two options run together on one line (the
 *     "tired of starting over" option with the "take control" option glued
 *     on, which then appeared again on its own line). They are split back
 *     into the two options they plainly were.
 *
 * Changing an option's wording changes the value the webhook receives, so a
 * Pabbly router condition matching on the old text will stop matching.
 */

import { COUNTRIES } from './countries';

export const OTHER = 'Other';

const COUNTRY_DIAL: Record<string, string> = Object.fromEntries(COUNTRIES.map((c) => [c.iso, c.dial]));

export const SITUATION = [
  'I have stubborn weight that is becoming harder to lose despite trying different things',
  'My weight has increased alongside concerns like diabetes, thyroid, fatty liver or high cholesterol',
  'My health reports are getting worse even though I am trying to eat better and take care of myself',
  OTHER,
] as const;

export const CONCERNS = [
  'Diabetes, pre-diabetes or insulin resistance',
  'Fatty liver',
  'Thyroid concerns',
  'High cholesterol or triglycerides',
  'High blood pressure',
  'High uric acid',
  'Gut or digestive issues',
  OTHER,
] as const;

export const TRIED = [
  'Calorie counting or portion control',
  'Keto, low-carb or other restrictive diets',
  'Intermittent fasting',
  'A nutritionist or dietitian',
  'Gym, exercise or personal training',
  'Supplements, detoxes or wellness products',
  'Medication for my existing health conditions',
  'I have tried multiple things, but the results never lasted',
  "I haven't tried anything structured yet",
] as const;

export const WHY_NOW = [
  'My weight or health concerns are already affecting my energy, confidence or daily life',
  "My health reports are getting worse and I don't want to wait until the problem becomes more serious",
  'I have been trying to solve this for years and I am tired of repeatedly starting over',
  'I want to take control of my health now instead of managing more conditions or medications later',
  'I am interested in improving my health, but the timing does not feel urgent right now',
] as const;

/* Investment options (2026-11-21, client's wording). The last one carries a
   typed amount: the buyer fills the "__" with a whole number of rupees, and
   the webhook receives the sentence with the amount in place, e.g.
   "I’m on a tight budget, I can only invest upto Rs.5000 on my health". */
export const BUDGET_BLANK = '__';
export const INVESTMENT_BUDGET = `I’m on a tight budget, I can only invest upto Rs. ${BUDGET_BLANK} on my health`;
export const INVESTMENT = [
  '35k for 3 months (6 meal plans + Weekly Consultation + Weekly detox strategies + guided 1-1 workout planning + emotional health support + WhatsApp coaching support + a roadmap at the end of the journey + option to pause anytime)',
  '25k for 3 months (6 Meal plans + Fortnightly Consultation + WhatsApp coaching support)',
  '15k (3 meal plans + Monthly consultation + WhatsApp support)',
  INVESTMENT_BUDGET,
] as const;

/** Whole rupees, 1 to 8 digits, no leading zero. */
export const isBudgetAmount = (s: string) => /^[1-9]\d{0,7}$/.test(s);

/** Amount box sanitiser: digits only, no leading zeros, at most 8 digits. */
export const cleanBudgetAmount = (s: string) => s.replace(/\D/g, '').replace(/^0+/, '').slice(0, 8);

/** The investment answer as the webhook receives it: the budget option gets
 *  its amount written into the blank, every other option is sent as is. */
export function investmentForWebhook(investment: string, amount: string) {
  return investment === INVESTMENT_BUDGET
    ? INVESTMENT_BUDGET.replace(`Rs. ${BUDGET_BLANK}`, `Rs.${amount}`)
    : investment;
}

export const DECISION = [
  'The sole decision-maker',
  'Making this decision together with my spouse or partner',
  'I would need to discuss it with my family before making a decision',
] as const;

export const SHOW_UP = [
  "Yes, I'll be there. I'm serious about improving my health.",
  "No, I'm not ready to commit to the call.",
] as const;

/* Step 4 (2026-11-16): replaced the preferred date and time pickers. The
   team now schedules the call itself, so the only thing it needs from the
   buyer here is the language to hold it in. */
export const LANGUAGE = ['English only', 'Hindi only', 'I am comfortable with both'] as const;

/** The answers as the browser sends them to /api/booking. */
export type BookingAnswers = {
  firstName: string;
  lastName: string;
  country: string;
  dialCode: string;
  phone: string;
  email: string;
  age: string;
  city: string;
  state: string;
  situation: string;
  situationOther: string;
  concerns: string[];
  concernsOther: string;
  tried: string[];
  whyNow: string;
  investment: string;
  /** Rupees typed into the budget option's blank; '' for other options. */
  investmentAmount: string;
  commitment: string;
  profession: string;
  decision: string;
  showUp: string;
  preferredLanguage: string; // one of LANGUAGE
};

/* ── FIELD RULES (2026-11-12) ──────────────────────────────────────────
   Shared by the browser (to block bad keystrokes and explain errors) and
   by /api/booking (to refuse a tampered payload), so both enforce exactly
   the same thing. */

/** Letters (any script, so Hindi and Tamil names pass), spaces, . ' - */
const NAME_RE = /^\p{L}[\p{L}\p{M} .'-]*$/u;
/** A real address shape: no spaces, one @, a dot in the domain, a 2+ letter TLD. */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
/** Indian mobiles are 10 digits and start 6, 7, 8 or 9. */
const IN_MOBILE_RE = /^[6-9]\d{9}$/;

export const AGE_MIN = 12;
export const AGE_MAX = 100;

const isName = (s: string) => NAME_RE.test(s.trim());
const isEmail = (s: string) => s.trim().length <= 254 && EMAIL_RE.test(s.trim());
const hasLetter = (s: string) => /\p{L}/u.test(s);
const oneOf = (list: readonly string[], v: string) => list.includes(v);

export function isValidPhone(country: string, phone: string) {
  if (!/^\d+$/.test(phone)) return false; // digits only, nothing stripped
  return country === 'in' ? IN_MOBILE_RE.test(phone) : phone.length >= 7 && phone.length <= 12;
}

/* ── INPUT SANITISERS: applied as the buyer types ─────────────────────── */

/** Names, cities, states: drop anything that is not a letter, space, . ' - */
export const cleanName = (s: string) =>
  s.replace(/[^\p{L}\p{M} .'-]/gu, '').replace(/\s{2,}/g, ' ').replace(/^\s+/, '').slice(0, 50);

/** Emails: no spaces, ever. */
export const cleanEmail = (s: string) => s.replace(/\s/g, '').slice(0, 254);

/**
 * Phone: digits only, capped at the country's length. A pasted
 * "+91 98765-43210" or "098765 43210" for India becomes "9876543210", so
 * people who type the country code or a trunk zero out of habit are not
 * punished for it.
 */
export function cleanPhone(country: string, raw: string) {
  /* A leading "+<code>" is always the country code, whether pasted whole or
     typed a key at a time, so it is dropped before the digits are read. */
  const dial = COUNTRY_DIAL[country];
  let s = raw.trimStart();
  if (dial && s.startsWith(dial)) s = s.slice(dial.length);
  else if (s.startsWith('+')) s = s.replace(/^\+\d{0,3}/, '');
  let d = s.replace(/\D/g, '');
  if (country === 'in') {
    if (d.length > 10 && d.startsWith('91')) d = d.slice(2);
    if (d.length > 10 && d.startsWith('0')) d = d.replace(/^0+/, '');
    if (d.startsWith('0')) d = d.replace(/^0+/, '');
    return d.slice(0, 10);
  }
  return d.slice(0, 12);
}

/**
 * The message shown under a field that fails, or '' when it passes. One
 * wording per failure, so the buyer is told what to fix rather than only
 * that something is wrong.
 */
export function fieldError(a: BookingAnswers, k: keyof ReturnType<typeof validateBooking>): string {
  const v = validateBooking(a);
  if (v[k]) return '';
  switch (k) {
    case 'firstName':
      return a.firstName.trim() ? 'Use letters only, at least 2 characters.' : 'Please enter your first name.';
    case 'lastName':
      return a.lastName.trim() ? 'Use letters only.' : 'Please enter your last name.';
    case 'phone':
      if (!a.phone) return 'Please enter your WhatsApp number.';
      return a.country === 'in'
        ? 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.'
        : 'Enter a valid number, 7 to 12 digits, without the country code.';
    case 'email':
      return a.email.trim() ? 'Enter a valid email address, like name@example.com.' : 'Please enter your email address.';
    case 'age':
      return a.age ? `Enter an age between ${AGE_MIN} and ${AGE_MAX}.` : 'Please enter your age.';
    case 'city':
      return a.city.trim() ? 'Use letters only, at least 2 characters.' : 'Please enter your city or town.';
    case 'state':
      return a.state.trim() ? 'Use letters only, at least 2 characters.' : 'Please select or type your state.';
    case 'profession':
      return a.profession.trim()
        ? 'Please describe your role in a few words, e.g. Associate VP @ IBM.'
        : 'Please enter your current profession.';
    case 'situation':
      return a.situation === OTHER ? 'Please tell us a little more in the box above.' : 'Please choose one option.';
    case 'concerns':
      return a.concerns.includes(OTHER) && a.concerns.length
        ? 'Please describe your other concern in the box above.'
        : 'Please select at least one.';
    case 'tried':
      return 'Please select at least one.';
    case 'investment':
      if (a.investment === INVESTMENT_BUDGET) {
        return a.investmentAmount
          ? 'Enter the amount in whole rupees, numbers only (e.g. 5000).'
          : 'Please enter the amount you can invest, in rupees.';
      }
      return 'Please choose one option.';
    case 'commitment':
      return 'Please drag the slider to choose a score.';
    case 'preferredLanguage':
      return 'Please choose the language you would like your call in.';
    default:
      return 'Please choose one option.';
  }
}

/**
 * Field-by-field validity. Used by the form to mark fields and by the API
 * route to refuse a tampered payload, so both enforce the same rules.
 */
export function validateBooking(a: BookingAnswers) {
  const age = /^\d{1,3}$/.test(a.age) ? Number(a.age) : NaN;
  const commitment = Number(a.commitment);
  const otherOk = (s: string) => s.trim().length > 1 && hasLetter(s);
  return {
    firstName: a.firstName.trim().length > 1 && isName(a.firstName),
    lastName: a.lastName.trim().length > 0 && isName(a.lastName),
    phone: isValidPhone(a.country, a.phone),
    email: isEmail(a.email),
    age: Number.isInteger(age) && age >= AGE_MIN && age <= AGE_MAX,
    city: a.city.trim().length > 1 && isName(a.city),
    state: a.state.trim().length > 1 && isName(a.state),
    situation: oneOf(SITUATION, a.situation) && (a.situation !== OTHER || otherOk(a.situationOther)),
    concerns:
      a.concerns.length > 0 &&
      a.concerns.every((c) => oneOf(CONCERNS, c)) &&
      (!a.concerns.includes(OTHER) || otherOk(a.concernsOther)),
    tried: a.tried.length > 0 && a.tried.every((t) => oneOf(TRIED, t)),
    whyNow: oneOf(WHY_NOW, a.whyNow),
    investment:
      oneOf(INVESTMENT, a.investment) &&
      (a.investment !== INVESTMENT_BUDGET || isBudgetAmount(a.investmentAmount)),
    commitment: Number.isInteger(commitment) && commitment >= 1 && commitment <= 10,
    profession: a.profession.trim().length > 1 && a.profession.trim().length <= 120 && hasLetter(a.profession),
    decision: oneOf(DECISION, a.decision),
    showUp: oneOf(SHOW_UP, a.showUp),
    preferredLanguage: oneOf(LANGUAGE, a.preferredLanguage),
  };
}

export const allValid = (v: Record<string, boolean>) => Object.values(v).every(Boolean);

/* ── CHECKOUT → BOOKING FORM PREFILL (2026-11-14) ──────────────────────
   The checkout saves what the buyer typed (name, email, city, WhatsApp
   number) just before the payment sheet opens; the booking form reads it
   on arrival so nobody types it twice.

   Written to BOTH sessionStorage and localStorage. sessionStorage alone
   dies whenever the payment finishes somewhere other than the original tab
   (a UPI app hand-back, a bank page that reopens the site); the local copy
   covers that, and carries a timestamp so it is ignored after
   PREFILL_TTL_MS and never fills a stranger's form on a shared phone. Both
   copies are removed the moment the booking form is submitted. */
export const BUYER_PREFILL_KEY = 'dp_buyer';
const PREFILL_TTL_MS = 6 * 60 * 60 * 1000;

export type BuyerPrefill = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  phone: string;
};

export function writeBuyerPrefill(p: BuyerPrefill) {
  const json = JSON.stringify({ ...p, savedAt: Date.now() });
  try {
    sessionStorage.setItem(BUYER_PREFILL_KEY, json);
  } catch {
    /* blocked */
  }
  try {
    localStorage.setItem(BUYER_PREFILL_KEY, json);
  } catch {
    /* blocked */
  }
}

export function readBuyerPrefill(): Partial<BuyerPrefill> | null {
  const parse = (raw: string | null) => {
    if (!raw) return null;
    try {
      const o = JSON.parse(raw) as Partial<BuyerPrefill> & { savedAt?: number };
      if (typeof o.savedAt === 'number' && Date.now() - o.savedAt > PREFILL_TTL_MS) return null;
      return o;
    } catch {
      return null;
    }
  };
  let s: string | null = null;
  let l: string | null = null;
  try {
    s = sessionStorage.getItem(BUYER_PREFILL_KEY);
  } catch {
    /* blocked */
  }
  try {
    l = localStorage.getItem(BUYER_PREFILL_KEY);
  } catch {
    /* blocked */
  }
  return parse(s) ?? parse(l);
}

export function clearBuyerPrefill() {
  try {
    sessionStorage.removeItem(BUYER_PREFILL_KEY);
  } catch {
    /* blocked */
  }
  try {
    localStorage.removeItem(BUYER_PREFILL_KEY);
  } catch {
    /* blocked */
  }
}

/**
 * The checkout values the booking form may use, field by field. A value is
 * taken ONLY if it already passes the booking form's own rule; anything
 * missing, different in shape, or invalid is left out, and that field stays
 * empty for the buyer to fill. Nothing is "repaired" on the way in.
 * The phone travels with its country: one is never used without the other.
 */
export function usablePrefill(b: Partial<BuyerPrefill> | null): Partial<BookingAnswers> {
  if (!b) return {};
  const t = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const out: Partial<BookingAnswers> = {};

  const first = t(b.firstName);
  if (first.length > 1 && first.length <= 50 && isName(first)) out.firstName = first;

  const last = t(b.lastName);
  if (last.length > 0 && last.length <= 50 && isName(last)) out.lastName = last;

  const email = t(b.email);
  if (isEmail(email)) out.email = email;

  const city = t(b.city);
  if (city.length > 1 && city.length <= 50 && isName(city)) out.city = city;

  const country = t(b.country);
  const dial = COUNTRY_DIAL[country];
  const phone = t(b.phone);
  if (dial && isValidPhone(country, phone)) {
    out.country = country;
    out.dialCode = dial;
    out.phone = phone;
  }

  return out;
}
