'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  clearBuyerPrefill,
  readBuyerPrefill,
  usablePrefill,
  CONCERNS,
  DECISION,
  BUDGET_BLANK,
  INVESTMENT,
  INVESTMENT_BUDGET,
  cleanBudgetAmount,
  isBudgetAmount,
  LANGUAGE,
  OTHER,
  SHOW_UP,
  SITUATION,
  TRIED,
  WHY_NOW,
  allValid,
  cleanEmail,
  cleanName,
  cleanPhone,
  fieldError,
  validateBooking,
  type BookingAnswers,
} from '@/lib/booking-form';
import { COUNTRIES } from '@/lib/countries';
import { collectSignals } from '@/lib/client-signals';
import { trackSchedule } from '@/lib/track';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/shared/icons';

/**
 * THE CONSULTATION PROFILE FORM (2026-11-12). Replaces the Cal.com calendar.
 *
 * FOUR STEPS, one group of questions at a time, so a paid buyer never faces
 * the whole questionnaire at once: About you · Your health · Your commitment
 * · Your preferred language. Each step validates on its own "Continue"; the last
 * one posts everything to /api/booking, which forwards it to the booking
 * webhook.
 *
 * On success the form does NOT navigate. It hands a short summary to the
 * page through `onDone`, and the page swaps itself for the confirmation
 * (components/book-a-call/BookingSuccess.tsx). The Schedule event still
 * fires here first, exactly as the Cal handoff did.
 *
 * Name, email, phone and city are prefilled from the checkout (session only).
 */

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const EMPTY: BookingAnswers = {
  firstName: '',
  lastName: '',
  country: 'in',
  dialCode: '+91',
  phone: '',
  email: '',
  age: '',
  city: '',
  state: '',
  situation: '',
  situationOther: '',
  concerns: [],
  concernsOther: '',
  tried: [],
  whyNow: '',
  investment: '',
  investmentAmount: '',
  commitment: '',
  profession: '',
  decision: '',
  showUp: '',
  preferredLanguage: '',
};

type Key = keyof ReturnType<typeof validateBooking>;

/* The four steps, and which answers each one owns. Validation is per step,
   so "Continue" only ever complains about what is on screen. */
const STEPS: { title: string; deck: string; keys: Key[] }[] = [
  {
    title: 'About you',
    deck: 'The basics, so your consultant knows who they are speaking with.',
    keys: ['firstName', 'lastName', 'phone', 'email', 'age', 'city', 'state'],
  },
  {
    title: 'Your health',
    deck: 'Where you are today, so the call starts from your story, not from scratch.',
    keys: ['situation', 'concerns', 'tried', 'whyNow'],
  },
  {
    title: 'Your commitment',
    deck: 'A few honest answers help us prepare the right plan for you.',
    keys: ['investment', 'commitment', 'profession', 'decision', 'showUp'],
  },
  {
    /* Replaced the preferred date and time pickers (2026-11-16): the team
       schedules the call itself and only needs the language to hold it in. */
    title: 'Your preferred language',
    deck: 'Tell us which language you would like your consultation call in.',
    keys: ['preferredLanguage'],
  },
];

/** What the confirmation screen shows back to the buyer. */
export type BookingSummary = {
  firstName: string;
  whatsapp: string;
  preferredLanguage: string;
};

export function BookingForm({
  paymentId,
  withBump,
  onDone,
}: {
  paymentId: string;
  withBump: boolean;
  onDone: (s: BookingSummary) => void;
}) {
  const [a, setA] = useState<BookingAnswers>(EMPTY);
  const [step, setStep] = useState(0);
  /* Which way the last move went, so the next pane slides in from the
     correct side. */
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [touched, setTouched] = useState<boolean[]>([false, false, false, false]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  /* Prefill from the checkout: first name, last name, email, city and the
     WhatsApp number with its country. Each field is taken only if the
     checkout value passes this form's own rule (usablePrefill); anything
     missing or different is skipped and left for the buyer. Never
     overwrites something already typed here. */
  useEffect(() => {
    const p = usablePrefill(readBuyerPrefill());
    if (!Object.keys(p).length) return;
    setA((s) => ({
      ...s,
      firstName: s.firstName || p.firstName || '',
      lastName: s.lastName || p.lastName || '',
      email: s.email || p.email || '',
      city: s.city || p.city || '',
      ...(s.phone || !p.phone
        ? {}
        : { phone: p.phone, country: p.country ?? s.country, dialCode: p.dialCode ?? s.dialCode }),
    }));
  }, []);

  const set = <K extends keyof BookingAnswers>(k: K, val: BookingAnswers[K]) =>
    setA((s) => ({ ...s, [k]: val }));

  const toggle = (k: 'concerns' | 'tried', opt: string) =>
    setA((s) => ({
      ...s,
      [k]: s[k].includes(opt) ? s[k].filter((x) => x !== opt) : [...s[k], opt],
    }));

  const v = useMemo(() => validateBooking(a), [a]);

  const stepOf = (k: Key) => STEPS.findIndex((s) => s.keys.includes(k));
  const bad = (k: Key) => touched[stepOf(k)] && !v[k];
  /** The message under a failing field, once its step has been checked. */
  const err = (k: Key) => (bad(k) ? fieldError(a, k) : '');
  const stepValid = (i: number) => STEPS[i].keys.every((k) => v[k]);

  /* Bring the top of the card back into view on every step change, so a
     buyer who scrolled down to "Continue" lands on the next step's first
     question rather than its last. */
  const scrollToCard = () =>
    requestAnimationFrame(() => {
      const card = formRef.current?.closest('.bk-card') as HTMLElement | null;
      const top = (card ?? formRef.current)?.getBoundingClientRect().top ?? 0;
      if (top < 0 || top > window.innerHeight * 0.4) {
        (card ?? formRef.current)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

  const showFirstBad = () =>
    requestAnimationFrame(() => {
      const first = formRef.current?.querySelector<HTMLElement>('[data-bad="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

  const goBack = () => {
    if (step === 0 || busy) return;
    setFailed('');
    setDir('back');
    setStep((s) => s - 1);
    scrollToCard();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setFailed('');
    setTouched((t) => t.map((x, i) => (i === step ? true : x)));

    if (!stepValid(step)) {
      showFirstBad();
      return;
    }

    /* Not the last step: move on. */
    if (step < STEPS.length - 1) {
      setDir('fwd');
      setStep((s) => s + 1);
      scrollToCard();
      return;
    }

    /* Last step. Belt and braces: every step was validated on its own way
       through, but a back-and-edit could have broken an earlier one. */
    if (!allValid(v)) {
      const firstBadStep = STEPS.findIndex((s) => s.keys.some((k) => !v[k]));
      setTouched([true, true, true, true]);
      setDir('back');
      setStep(firstBadStep);
      showFirstBad();
      return;
    }

    setBusy(true);
    const body = JSON.stringify({
      ...a,
      paymentId,
      orderBump: withBump,
      signals: collectSignals(),
    });

    /* ── SUBMIT, QUIETLY RESILIENT (2026-11-12) ──────────────────────────
       The server already answers "ok" even when OUR webhook is down (it
       retries in the background), so the only failures left here are the
       buyer's own connection dropping or a server blip. Those are retried
       silently, up to three tries, while the button keeps saying "Sending",
       before the buyer is ever told anything. */
    let out: { ok?: boolean; reason?: string; fields?: string[] } = {};
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
        });
        out = await res.json().catch(() => ({}));
        if (res.ok && out?.ok) break;
        if (out?.reason === 'invalid') break; // retrying the same answers cannot help
      } catch {
        out = {};
      }
      if (attempt < 2) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }

    if (!out?.ok) {
      setBusy(false);
      if (out?.reason === 'invalid' && Array.isArray(out.fields)) {
        /* The server disagreed with an answer: take the buyer straight to
           it, with its message showing, instead of a dead-end error. */
        const firstBad = STEPS.findIndex((s) => s.keys.some((k) => out.fields!.includes(k)));
        setTouched([true, true, true, true]);
        if (firstBad >= 0 && firstBad !== step) {
          setDir('back');
          setStep(firstBad);
        }
        showFirstBad();
        return;
      }
      setFailed(
        'Your connection seems to have dropped. Your answers are all still here, so just tap “Submit my details” again.',
      );
      return;
    }

    /* The step this funnel exists to produce. capi() sends with keepalive. */
    trackSchedule(paymentId);
    clearBuyerPrefill();
    onDone({
      firstName: a.firstName.trim(),
      whatsapp: `${a.dialCode} ${a.phone.replace(/\D/g, '')}`,
      preferredLanguage: a.preferredLanguage,
    });
  };

  const last = step === STEPS.length - 1;

  return (
    <form ref={formRef} className="bk-form" onSubmit={submit} noValidate>
      {/* ── progress ─────────────────────────────────────────────── */}
      <div className="bk-progress">
        <div className="bk-progress-top">
          <span className="bk-progress-count">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="bk-progress-name">{STEPS[step].title}</span>
        </div>
        <ol className="bk-progress-track" aria-label="Form progress">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={i < step ? 'done' : i === step ? 'now' : undefined}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className="bk-progress-bar" />
              <span className="bk-progress-label">{s.title.replace('Your preferred language', 'Language')}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── the current step. Keyed on the step so it remounts and plays its
          entrance; the direction class decides which side it slides from. */}
      <fieldset key={step} className={`bk-group bk-step ${dir}`}>
        <legend className="bk-group-title">
          <span className="bk-group-num">{String(step + 1).padStart(2, '0')}</span>
          {STEPS[step].title}
        </legend>
        <p className="bk-group-deck">{STEPS[step].deck}</p>

        {step === 0 && (
          <>
            <div className="bk-two">
              <Text
                label="First name"
                value={a.firstName}
                onChange={(x) => set('firstName', cleanName(x))}
                bad={bad('firstName')}
                error={err('firstName')}
                autoComplete="given-name"
                maxLength={50}
              />
              <Text
                label="Last name"
                value={a.lastName}
                onChange={(x) => set('lastName', cleanName(x))}
                bad={bad('lastName')}
                error={err('lastName')}
                autoComplete="family-name"
                maxLength={50}
              />
            </div>

            <label className="bk-field" data-bad={bad('phone') || undefined}>
              <span className="bk-label">
                WhatsApp number <Req />
              </span>
              <div className="bk-phone">
                <select
                  aria-label="Country dialling code"
                  autoComplete="tel-country-code"
                  value={a.country}
                  onChange={(e) => {
                    const iso = e.target.value;
                    setA((s) => ({
                      ...s,
                      country: iso,
                      dialCode: COUNTRIES.find((c) => c.iso === iso)?.dial ?? '+91',
                      /* re-clean for the new country's length rule */
                      phone: cleanPhone(iso, s.phone),
                    }));
                  }}
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
                  pattern="[0-9]*"
                  autoComplete="tel-national"
                  placeholder={a.country === 'in' ? '98765 43210' : 'Mobile number'}
                  value={a.phone}
                  /* Digits only, as typed or pasted. Letters never reach state. */
                  onChange={(e) => set('phone', cleanPhone(a.country, e.target.value))}
                  aria-invalid={bad('phone') || undefined}
                  aria-describedby="err-phone"
                />
              </div>
              {err('phone') ? (
                <span className="bk-err" id="err-phone">
                  {err('phone')}
                </span>
              ) : (
                <span className="bk-note">You will receive confirmation and reminders on this.</span>
              )}
            </label>

            <Text
              label="Email address"
              type="email"
              inputMode="email"
              value={a.email}
              onChange={(x) => set('email', cleanEmail(x))}
              bad={bad('email')}
              error={err('email')}
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={254}
            />

            <div className="bk-three">
              <Text
                label="Age"
                type="text"
                inputMode="numeric"
                value={a.age}
                onChange={(x) => set('age', x.replace(/\D/g, '').replace(/^0+/, '').slice(0, 3))}
                bad={bad('age')}
                error={err('age')}
                maxLength={3}
                placeholder="e.g. 38"
              />
              <Text
                label="City/Town"
                value={a.city}
                onChange={(x) => set('city', cleanName(x))}
                bad={bad('city')}
                error={err('city')}
                autoComplete="address-level2"
                maxLength={50}
              />
              <StateSelect
                value={a.state}
                onChange={(x) => set('state', cleanName(x))}
                bad={bad('state')}
                error={err('state')}
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Choice
              name="situation"
              question="Where are you right now with your weight and health?"
              options={SITUATION}
              value={a.situation}
              onChange={(x) => set('situation', x)}
              bad={bad('situation')} error={err('situation')}
              other={{ value: a.situationOther, onChange: (x) => set('situationOther', x) }}
            />
            <Multi
              question="Which health concerns are you currently dealing with?"
              options={CONCERNS}
              value={a.concerns}
              onToggle={(x) => toggle('concerns', x)}
              bad={bad('concerns')} error={err('concerns')}
              other={{ value: a.concernsOther, onChange: (x) => set('concernsOther', x) }}
            />
            <Multi
              question="What have you already tried?"
              options={TRIED}
              value={a.tried}
              onToggle={(x) => toggle('tried', x)}
              bad={bad('tried')} error={err('tried')}
            />
            <Choice
              name="whyNow"
              question="Why is solving this now important to you?"
              options={WHY_NOW}
              value={a.whyNow}
              onChange={(x) => set('whyNow', x)}
              bad={bad('whyNow')} error={err('whyNow')}
            />
          </>
        )}

        {step === 2 && (
          <>
            <InvestmentChoice
              question="If we identify the right approach for you during your consultation and you feel confident moving forward, what level of investment would you be comfortable making in your health?"
              value={a.investment}
              amount={a.investmentAmount}
              onChange={(x) => set('investment', x)}
              onAmount={(x) => set('investmentAmount', cleanBudgetAmount(x))}
              bad={bad('investment')}
              error={err('investment')}
            />

            <div className="bk-q" data-bad={bad('commitment') || undefined}>
              <p className="bk-q-text" id="q-commitment">
                On a scale of 1 to 10, how committed are you to improving your weight and health
                right now? <Req />
              </p>
              <CommitSlider
                value={a.commitment}
                onChange={(n) => set('commitment', n)}
                bad={bad('commitment')} error={err('commitment')}
              />
            </div>

            <Text
              label="What is your current profession? (Please mention your designation and company. For example: Associate VP @ IBM.)"
              value={a.profession}
              onChange={(x) => set('profession', x)}
              bad={bad('profession')} error={err('profession')}
              autoComplete="organization-title"
              placeholder="e.g. Associate VP @ IBM"
              maxLength={120}
              plain
            />

            <Choice
              name="decision"
              question="Regarding this decision, I am..."
              options={DECISION}
              value={a.decision}
              onChange={(x) => set('decision', x)}
              bad={bad('decision')} error={err('decision')}
            />

            <Choice
              name="showUp"
              question="Are you 100% committed to showing up for your scheduled health assessment?"
              hint="We value your time and ours, so please only continue if you're serious about attending."
              options={SHOW_UP}
              value={a.showUp}
              onChange={(x) => set('showUp', x)}
              bad={bad('showUp')} error={err('showUp')}
            />
          </>
        )}

        {step === 3 && (
          <Choice
            name="preferredLanguage"
            question="Preferred Language"
            options={LANGUAGE}
            value={a.preferredLanguage}
            onChange={(x) => set('preferredLanguage', x)}
            bad={bad('preferredLanguage')}
            error={err('preferredLanguage')}
          />
        )}
      </fieldset>

      {touched[step] && !stepValid(step) && (
        <p className="bk-error" role="alert">
          Please answer the highlighted {STEPS[step].keys.length > 2 ? 'questions' : 'fields'} to continue.
        </p>
      )}
      {failed && (
        <p className="bk-error" role="alert">
          {failed}
        </p>
      )}

      <div className="bk-nav">
        {step > 0 && (
          <button type="button" className="bk-back" onClick={goBack} disabled={busy}>
            <ArrowLeftIcon size={13} />
            <span className="bk-back-txt">Back</span>
          </button>
        )}
        <button type="submit" className="bk-btn lg bk-submit" disabled={busy}>
          {busy ? (
            <>
              <span className="bk-spinner" aria-hidden />
              Sending your details…
            </>
          ) : (
            <>
              {last ? 'Submit my details' : 'Continue'}
              <span className="bk-submit-arrow" aria-hidden>
                <ArrowRightIcon size={14} />
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ── small pieces ──────────────────────────────────────────────── */

/* What each score reads as, shown live under the slider. The two ends are
   the client's own anchors ("Just exploring" / "Ready to make this a
   priority"); the middle bands are connective copy. */
const COMMIT_MOODS: [number, string][] = [
  [2, 'Just exploring'],
  [4, 'Curious, but not ready yet'],
  [6, 'Getting serious about it'],
  [8, 'Ready to commit'],
  [10, 'Ready to make this a priority'],
];
const moodFor = (n: number) => COMMIT_MOODS.find(([max]) => n <= max)?.[1] ?? '';

/**
 * The 1 to 10 commitment score as a draggable slider.
 *
 * Pointer events cover mouse, touch and pen in one path: press anywhere on
 * the track to jump there, drag to move, and it snaps to whole numbers. The
 * thumb carries a bubble with the live number, the fill runs garnet to gold
 * as the score rises, and a caption names what that score means. A short
 * vibration on each step on phones that support it.
 *
 * Starts EMPTY on purpose (the thumb rests ghosted in the middle with a
 * "drag to choose" hint), because a preset value would be an answer the
 * buyer never gave. Keyboard: arrows, Page Up/Down, Home/End, per the ARIA
 * slider pattern.
 */
function CommitSlider({
  value,
  onChange,
  bad,
  error = '',
}: {
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  error?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const n = Number(value) || 0;
  const set = n > 0;
  /* 1 sits at 0%, 10 at 100%; unset rests in the middle */
  const pct = set ? ((n - 1) / 9) * 100 : 50;

  const commit = (next: number) => {
    const v = Math.min(10, Math.max(1, next));
    if (v !== n) {
      onChange(String(v));
      try {
        navigator.vibrate?.(8);
      } catch {
        /* not supported */
      }
    }
  };

  const fromPointer = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const ratio = (clientX - r.left) / r.width;
    commit(Math.round(ratio * 9) + 1);
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    fromPointer(e.clientX);
    /* keep keyboard users and screen readers on the control */
    (e.currentTarget.querySelector('[role="slider"]') as HTMLElement | null)?.focus({ preventScroll: true });
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) fromPointer(e.clientX);
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    const base = set ? n : 5;
    const map: Record<string, number> = {
      ArrowRight: base + (set ? 1 : 0),
      ArrowUp: base + (set ? 1 : 0),
      ArrowLeft: base - (set ? 1 : 0),
      ArrowDown: base - (set ? 1 : 0),
      PageUp: base + 3,
      PageDown: base - 3,
      Home: 1,
      End: 10,
    };
    if (e.key in map) {
      e.preventDefault();
      commit(map[e.key]);
    }
  };

  return (
    <div
      className={['bk-slide', set ? 'is-set' : '', dragging ? 'is-drag' : '', bad ? 'is-bad' : '']
        .filter(Boolean)
        .join(' ')}
      style={{ '--p': `${pct}%`, '--t': set ? (n - 1) / 9 : 0 } as React.CSSProperties}
    >
      <div
        className="bk-slide-hit"
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="bk-slide-track">
          <div className="bk-slide-fill" />
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={set && i + 1 <= n ? 'bk-slide-notch on' : 'bk-slide-notch'}
              style={{ left: `${(i / 9) * 100}%` }}
            />
          ))}
        </div>

        <div
          className="bk-slide-thumb"
          role="slider"
          tabIndex={0}
          aria-labelledby="q-commitment"
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={set ? n : undefined}
          aria-valuetext={set ? `${n} out of 10, ${moodFor(n)}` : 'Not chosen yet'}
          aria-invalid={bad || undefined}
          onKeyDown={onKey}
        >
          <span className="bk-slide-bubble" aria-hidden>
            {set ? n : '?'}
          </span>
          <span className="bk-slide-grip" aria-hidden />
        </div>
      </div>

      <div className="bk-slide-nums" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            className={set && i + 1 === n ? 'on' : undefined}
            style={{ left: `${(i / 9) * 100}%` }}
            onClick={() => commit(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="bk-slide-foot" aria-hidden>
        <span>Just exploring</span>
        <span key={set ? n : 0} className={set ? 'bk-slide-mood' : 'bk-slide-mood hint'}>
          {set ? moodFor(n) : '← Drag to choose →'}
        </span>
        <span>Top priority</span>
      </div>
      {error && <span className="bk-err">{error}</span>}
    </div>
  );
}

/**
 * The State field. A themed, searchable dropdown in place of the browser's
 * <datalist>, which renders in the OS's own black popup and drags Chrome's
 * "Manage addresses" autofill in with it.
 *
 * Type to filter, arrow keys to move, Enter to pick, Escape to close. Free
 * text is still accepted, because buyers outside India have no state on the
 * list. Built to the ARIA combobox pattern so screen readers announce it.
 */
function StateSelect({
  value,
  onChange,
  bad,
  error = '',
}: {
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const q = value.trim().toLowerCase();
  /* Matches that START with the text first, then ones that merely contain
     it, so "ma" puts Maharashtra and Manipur above Himachal Pradesh. An exact
     pick shows the whole list again, so reopening lets them change it. */
  const options = useMemo(() => {
    if (!q || INDIAN_STATES.some((s) => s.toLowerCase() === q)) return INDIAN_STATES;
    const starts = INDIAN_STATES.filter((s) => s.toLowerCase().startsWith(q));
    const has = INDIAN_STATES.filter((s) => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q));
    return [...starts, ...has];
  }, [q]);

  /* close on any press outside */
  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);

  /* keep the highlighted row in view while arrowing */
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  /* Opening jumps to the state already chosen, if any, rather than the top. */
  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const pick = (s: string) => {
    onChange(s);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && options[active]) {
      /* Enter picks the row rather than submitting the step. */
      e.preventDefault();
      pick(options[active]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className="bk-field bk-combo" data-bad={bad || undefined} ref={wrapRef}>
      <label className="bk-label" htmlFor="bk-state">
        State <Req />
      </label>
      <div className="bk-combo-box">
        <input
          id="bk-state"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="bk-state-list"
          aria-autocomplete="list"
          aria-activedescendant={open && options[active] ? `bk-state-${active}` : undefined}
          /* "off" alone is ignored by Chrome for address-like fields; an
             unrecognised token is what actually keeps its autofill popup away. */
          autoComplete="new-state"
          placeholder="Select or type your state"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => !open && openList()}
          onClick={() => !open && openList()}
          onKeyDown={onKey}
          aria-invalid={bad || undefined}
        />
        <button
          type="button"
          className="bk-combo-toggle"
          tabIndex={-1}
          aria-label={open ? 'Close state list' : 'Open state list'}
          onClick={() => (open ? setOpen(false) : openList())}
        >
          <span className={open ? 'bk-combo-chev up' : 'bk-combo-chev'} aria-hidden />
        </button>
      </div>
      {open && (
        <ul className="bk-combo-list" id="bk-state-list" role="listbox" ref={listRef}>
          {options.length ? (
            options.map((s, i) => (
              <li
                key={s}
                id={`bk-state-${i}`}
                role="option"
                aria-selected={s === value}
                className={[i === active ? 'active' : '', s === value ? 'picked' : ''].join(' ').trim() || undefined}
                onPointerDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(s)}
              >
                {s}
                {s === value && <span className="bk-combo-tick" aria-hidden>✓</span>}
              </li>
            ))
          ) : (
            <li className="bk-combo-empty" aria-disabled>
              Not on the list? Keep typing, &ldquo;{value.trim()}&rdquo; works too.
            </li>
          )}
        </ul>
      )}
      {error && <span className="bk-err">{error}</span>}
    </div>
  );
}

function Req() {
  return (
    <span className="bk-req" aria-hidden>
      *
    </span>
  );
}

function Text({
  label,
  value,
  onChange,
  bad,
  error = '',
  type = 'text',
  autoComplete,
  placeholder,
  note,
  optional,
  inputMode,
  list,
  plain,
  maxLength,
}: {
  maxLength?: number;
  label: string;
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  note?: string;
  optional?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  list?: string;
  /** Render the label as a question rather than a small-caps field label. */
  plain?: boolean;
}) {
  return (
    <label className="bk-field" data-bad={bad || undefined}>
      <span className={plain ? 'bk-q-text' : 'bk-label'}>
        {label} {!optional && <Req />}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        list={list}
        maxLength={maxLength}
        autoCapitalize={type === 'email' ? 'off' : undefined}
        spellCheck={type === 'email' ? false : undefined}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={bad || undefined}
      />
      {error ? <span className="bk-err">{error}</span> : note && <span className="bk-note">{note}</span>}
    </label>
  );
}

type OtherProps = { value: string; onChange: (v: string) => void };

/**
 * The investment question (2026-11-21). A normal single choice, except the
 * last option ("I’m on a tight budget, I can only invest upto Rs. __ on my
 * health") has an amount box sitting in the "__". The box is mandatory when
 * that option is picked, takes whole rupees only, and grows with the number:
 * 4 digits wide by default, one digit wider per extra digit.
 * Focusing or typing in the box selects its option, so the buyer never has
 * to tap the radio first.
 */
function InvestmentChoice({
  question,
  value,
  amount,
  onChange,
  onAmount,
  bad,
  error = '',
}: {
  question: string;
  value: string;
  amount: string;
  onChange: (v: string) => void;
  onAmount: (v: string) => void;
  bad: boolean;
  error?: string;
}) {
  const id = 'q-investment';
  const [before, after] = INVESTMENT_BUDGET.split(BUDGET_BLANK);
  const amountBad = bad && value === INVESTMENT_BUDGET && !isBudgetAmount(amount);
  return (
    <div className="bk-q" data-bad={bad || undefined}>
      <p className="bk-q-text" id={id}>
        {question} <Req />
      </p>
      <div className="bk-opts" role="radiogroup" aria-labelledby={id}>
        {INVESTMENT.map((o) => {
          const on = value === o;
          if (o !== INVESTMENT_BUDGET) {
            return (
              <label key={o} className={on ? 'bk-opt on' : 'bk-opt'}>
                <input type="radio" name="investment" value={o} checked={on} onChange={() => onChange(o)} />
                <span className="bk-opt-mark radio" aria-hidden />
                <span className="bk-opt-text">{o}</span>
              </label>
            );
          }
          return (
            <label key={o} className={on ? 'bk-opt bk-opt-budget on' : 'bk-opt bk-opt-budget'}>
              <input type="radio" name="investment" value={o} checked={on} onChange={() => onChange(o)} />
              <span className="bk-opt-mark radio" aria-hidden />
              <span className="bk-opt-text">
                {before.replace(/Rs\. $/, '')}
                {/* "Rs." and the box never wrap apart */}
                <span className="bk-budget">
                  Rs.
                  <input
                    className="bk-budget-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    placeholder="0000"
                    aria-label="Amount you can invest, in rupees"
                    value={amount}
                    style={{ width: `calc(${Math.max(4, amount.length)}ch + 22px)` }}
                    onFocus={() => !on && onChange(o)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      if (!on) onChange(o);
                      onAmount(e.target.value);
                    }}
                    aria-invalid={amountBad || undefined}
                  />
                </span>
                {after}
              </span>
            </label>
          );
        })}
      </div>
      {error && <span className="bk-err">{error}</span>}
    </div>
  );
}

function Choice({
  name,
  question,
  hint,
  options,
  value,
  onChange,
  bad,
  error = '',
  other,
}: {
  name: string;
  question: string;
  hint?: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  error?: string;
  other?: OtherProps;
}) {
  const id = `q-${name}`;
  return (
    <div className="bk-q" data-bad={bad || undefined}>
      <p className="bk-q-text" id={id}>
        {question} <Req />
      </p>
      {hint && <p className="bk-q-hint">{hint}</p>}
      <div className="bk-opts" role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <label key={o} className={value === o ? 'bk-opt on' : 'bk-opt'}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            <span className="bk-opt-mark radio" aria-hidden />
            <span className="bk-opt-text">{o}</span>
          </label>
        ))}
      </div>
      {other && value === OTHER && (
        <input
          className="bk-other"
          type="text"
          placeholder="Please tell us more"
          aria-label="Other, please specify"
          maxLength={120}
          value={other.value}
          onChange={(e) => other.onChange(e.target.value)}
          aria-invalid={(bad && other.value.trim().length < 2) || undefined}
        />
      )}
      {error && <span className="bk-err">{error}</span>}
    </div>
  );
}

function Multi({
  question,
  options,
  value,
  onToggle,
  bad,
  error = '',
  other,
}: {
  question: string;
  options: readonly string[];
  value: string[];
  onToggle: (v: string) => void;
  bad: boolean;
  error?: string;
  other?: OtherProps;
}) {
  return (
    <div className="bk-q" data-bad={bad || undefined}>
      <p className="bk-q-text">
        {question} <span className="bk-q-sub">(Select all that apply)</span> <Req />
      </p>
      {/* Two columns on wider screens: these lists are long and the options
          short, so a single column is mostly empty space. */}
      <div className="bk-opts cols">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <label key={o} className={on ? 'bk-opt on' : 'bk-opt'}>
              <input type="checkbox" checked={on} onChange={() => onToggle(o)} />
              <span className="bk-opt-mark box" aria-hidden />
              <span className="bk-opt-text">{o}</span>
            </label>
          );
        })}
      </div>
      {other && value.includes(OTHER) && (
        <input
          className="bk-other"
          type="text"
          placeholder="Please tell us more"
          aria-label="Other, please specify"
          maxLength={120}
          value={other.value}
          onChange={(e) => other.onChange(e.target.value)}
          aria-invalid={(bad && other.value.trim().length < 2) || undefined}
        />
      )}
      {error && <span className="bk-err">{error}</span>}
    </div>
  );
}
