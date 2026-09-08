'use client';

import { useEffect, useState } from 'react';
import { SectionMasthead } from '@/components/shared/SectionMasthead';

/**
 * BEAT 10 — FAQ.
 *
 * Shape: OBJECTION-SET. Five doubts, each answered. §5's ruled ledger:
 * hairline rows rather than card boxes, an ordinal per row, and the open
 * row lifting to white with an accent border while its + rotates 45° into
 * an ×. It reads like a record of questions actually asked.
 *
 * FAIL-OPEN, same trick as the page's reveal. The server renders EVERY
 * answer expanded, and the accordion only exists once JS has mounted and
 * set `armed`. So with JS off, or broken, or still loading, all five
 * answers are readable — an FAQ whose content is hostage to a click
 * handler is an FAQ that silently disappears for the people most likely
 * to have doubts.
 *
 * Q3 carries a `[SEE OUR PROOF]` marker in the copy source — an
 * unresolved instruction, not a sentence. It is resolved here as an
 * in-page anchor to the proof section (#proof) rather than dropped or
 * left as visible bracket text. See the build output.
 */
const QUESTIONS: {
  q: string;
  a: React.ReactNode[];
}[] = [
  {
    q: 'Is this a sales call?',
    a: [
      <>No. This is a personalised health assessment.</>,
      <>
        Deepti and her team will understand your current weight, health reports,
        symptoms, eating habits, lifestyle, medical history and previous
        weight-loss efforts to identify what may be keeping you stuck.
      </>,
      <>
        The goal is to help you understand your current health picture and
        whether Deepti&apos;s programme is the right next step for you. If the
        programme genuinely isn&apos;t the right fit, we&apos;ll tell you
        honestly. No pressure. No unnecessary selling.
      </>,
    ],
  },
  {
    q: "I've tried diets and weight-loss programmes before. How is this different?",
    a: [
      <>
        Most weight-loss plans focus primarily on calories, food and exercise,
        often giving people similar plans based on the same goal or health
        condition. Deepti&apos;s approach goes deeper by looking at your
        individual body type, digestion, liver and metabolic health, especially
        when concerns like fatty liver, high blood sugar, cholesterol or
        hypothyroidism are also present.
      </>,
      <>
        Your plan is then personalised around what foods, combinations and eating
        patterns are better suited to your body and health needs, rather than
        simply giving you another calorie target or generic diet to follow.
      </>,
    ],
  },
  {
    q: 'Is it really possible to lose weight if I have diabetes, thyroid, fatty liver or high cholesterol?',
    a: [
      <>
        Yes. These conditions can make weight management more complex, but they
        don&apos;t mean sustainable weight loss is out of reach. The key is to
        stop treating your weight in isolation and personalise your approach
        around your health reports, symptoms, medications, lifestyle and
        metabolic health.{' '}
        <a className="sdp-proof-link" href="#proof">
          See our proof
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </>,
      <>
        That&apos;s exactly why Deepti&apos;s approach goes beyond simply cutting
        calories or increasing exercise. Your nutrition and lifestyle plan is
        built around both the weight you want to lose and the health conditions
        that may be influencing your progress.
      </>,
    ],
  },
  {
    q: 'Will I have to follow a very restrictive diet to lose 5–15 kilos?',
    a: [
      <>
        No. The goal isn&apos;t to make you eat differently for 12 weeks only to
        regain the weight afterwards. Your nutrition is personalised around your
        individual body type, food preferences, lifestyle, health needs and
        routine, so you&apos;re not unnecessarily restricting foods that may work
        perfectly well for you.
      </>,
      <>
        You won&apos;t be expected to survive on salads, eliminate entire food
        groups unnecessarily or make your whole life revolve around dieting.
        Instead, you&apos;ll learn which foods, combinations and eating patterns
        are better suited to your body, so the changes you make are realistic
        enough to continue long-term.
      </>,
    ],
  },
  {
    q: "What happens if I follow the programme but don't see results?",
    a: [
      <>
        Your progress is reviewed throughout the programme and your plan is
        adjusted based on how your weight, measurements, symptoms and relevant
        health markers respond.
      </>,
      <>
        And with our 100% Results Guarantee, if you consistently follow your
        personalised plan for the full 12 weeks but don&apos;t see measurable
        progress, we&apos;ll continue supporting you at no additional cost until
        you do.
      </>,
    ],
  },
];

export function Faq() {
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(0);

  useEffect(() => setArmed(true), []);

  return (
    <section id="faq" className="sdp-faq sdp-light">
      <div className="sdp-wrap">
        <SectionMasthead
          title={
            <>
              Common <em>Questions</em> Clients Ask Before Getting Started
            </>
          }
          delay=".06s"
        />

        <div className="sdp-faq-list">
          {QUESTIONS.map((item, i) => {
            const isOpen = !armed || open === i;
            return (
              <div className={`sdp-q${isOpen ? ' open' : ''}`} key={item.q}>
                <button
                  className="sdp-q-head"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-body-${i}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <span>
                    <span className="qn" aria-hidden>
                      Q.{String(i + 1).padStart(2, '0')}
                    </span>
                    {item.q}
                  </span>
                  <span className="ic" aria-hidden>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                <div className="sdp-q-body" id={`faq-body-${i}`}>
                  <div className="sdp-q-inner">
                    {item.a.map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
