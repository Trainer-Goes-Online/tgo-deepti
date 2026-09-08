import type { Metadata } from 'next';
import '../legal.css';
import { LegalPage, type Clause } from '@/components/legal/LegalPage';
import { business, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `The terms on which ${business.legalName} provides the assessment and the programme.`,
  robots: { index: false, follow: false },
};

const UPDATED = '8 September 2026';

/* The medical disclaimer is clause 02, not an afterthought at the end. This
   page sells a nutrition programme to people managing diabetes, thyroid
   conditions, fatty liver and hypertension, and the landing copy uses the
   words "healing your liver". The single most important thing these terms do
   is state that this is nutrition and lifestyle guidance, that it does not
   replace their doctor, and that they should not stop medication because of
   anything here. That protects the reader first and the business second.

   ⚠ CLAUSE ORDER IS LOAD-BEARING ON THIS PAGE. The prose cites "clause 02"
   (the health disclaimer) and "clause 06" (what we ask of you) in its own
   sentences, and the ordinals are rendered from array position. Reordering
   or inserting a clause silently breaks two cross-references, so check
   those two sentences whenever this array changes. It is also why the
   clause marker keeps its mono ordinal rather than only the accent bar the
   blueprint calls for. */
const CLAUSES: Clause[] = [
  {
    id: 'these-terms',
    heading: 'These terms',
    body: (
      <p>
        These terms apply when you use this website, book an assessment or join
        the programme provided by {business.legalName}, trading as{' '}
        {business.tradingName}. By paying for an assessment or a programme you
        accept these terms. If you do not accept them, please do not book.
      </p>
    ),
  },
  {
    id: 'health-disclaimer',
    heading: 'Health disclaimer, and what this programme is not',
    nav: 'Health disclaimer',
    body: (
      <>
        <p>
          This is a nutrition and lifestyle programme. It is not medical
          treatment, and nothing on this website or in your plan is a medical
          diagnosis or a prescription.
        </p>
        <ul>
          <li>
            We do not replace your doctor, your endocrinologist, your
            gastroenterologist or any other treating clinician.
          </li>
          <li>
            <b>
              Do not start, stop or change any prescribed medication because of
              anything we tell you.
            </b>{' '}
            Medication decisions are for your treating doctor alone.
          </li>
          <li>
            Tell us about your medical conditions and your medication before you
            begin, and keep us updated if they change, so your plan can be built
            around them safely.
          </li>
          <li>
            If you are pregnant or breastfeeding, or you have an eating
            disorder, kidney disease, liver failure or any condition requiring
            a medically supervised diet, speak to your doctor before starting
            and tell us what they advise.
          </li>
          <li>
            If you feel unwell at any point, stop and seek medical attention.
            This programme is never a substitute for urgent care.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'results',
    heading: 'Results are not guaranteed to be identical',
    nav: 'Results are not identical',
    body: (
      <>
        <p>
          The results shown on this website are real outcomes achieved by
          individual clients. They are examples, not a promise of what you will
          achieve. Weight and metabolic health respond differently from person
          to person depending on age, medical conditions, medication, genetics,
          sleep, stress and how consistently a plan is followed.
        </p>
        <p>
          Our results guarantee is set out on the Refund page and in clause 06
          below. It describes what we will do if you follow the programme and do
          not see measurable progress. It is not a promise of a specific number
          of kilos or a specific change in any health marker.
        </p>
      </>
    ),
  },
  {
    id: 'the-assessment',
    heading: 'The assessment',
    body: (
      <p>
        The assessment is a paid consultation, currently ₹{site.feeInr}, in which
        we review your health reports, history, symptoms, lifestyle and previous
        weight-loss efforts, and tell you honestly whether the programme is the
        right next step for you. It is not a sales call, and there is no
        obligation to buy anything afterwards. Booking an assessment does not
        enrol you in the programme.
      </p>
    ),
  },
  {
    id: 'the-programme',
    heading: 'The programme',
    body: (
      <>
        <p>
          If you join, you receive the programme as described on the landing
          page: a personalised nutrition and lifestyle plan built around your
          reports and body type, regular progress reviews with plan adjustments,
          and support from {business.legalName} and her team of qualified
          nutritionists over WhatsApp during your programme.
        </p>
        <p>
          Your place is personal to you. You may not share, resell or transfer
          your plan, your materials or your access to anyone else.
        </p>
      </>
    ),
    pending: (
      <>
        The programme LENGTH and PRICE are not confirmed. The landing copy says
        a 12-week programme throughout, and the registered trading name says 90
        days. These are not the same period, and this clause and the Refund page
        both depend on which is correct. The programme fee is also not on record
        anywhere in this build. Both need confirming before launch.
      </>
    ),
  },
  {
    id: 'what-we-ask',
    heading: 'What we ask of you',
    body: (
      <>
        <p>
          The programme works only if it is followed, and our guarantee depends
          on it. We ask that you:
        </p>
        <ul>
          <li>
            complete the full programme and follow your personalised nutrition
            and lifestyle plan consistently;
          </li>
          <li>attend your scheduled check-ins and submit progress updates on time;</li>
          <li>
            give us accurate and complete health information, including your
            medication and any conditions you are managing;
          </li>
          <li>
            tell us when work, travel, health or life gets in the way, so your
            plan can be adjusted rather than abandoned.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'payment',
    heading: 'Payment',
    body: (
      <p>
        Payments are taken through our payment gateway. Prices are shown in
        Indian Rupees and include any taxes that apply unless stated otherwise at
        checkout. We do not see or store your card details. Refunds and
        cancellations are covered on the Refund page, which forms part of these
        terms.
      </p>
    ),
  },
  {
    id: 'your-content',
    heading: 'Your content and your privacy',
    nav: 'Your content and privacy',
    body: (
      <p>
        You keep ownership of everything you send us, including your reports and
        photographs. We will not publish your reports, photographs, results or
        messages anywhere without asking you first and getting your agreement in
        writing. How we handle your information is set out in full in our Privacy
        Policy.
      </p>
    ),
  },
  {
    id: 'our-materials',
    heading: 'Our materials',
    body: (
      <p>
        The plans, guides, videos and other materials we give you are ours and
        are licensed to you for your personal use during and after your
        programme. Please do not copy, publish or distribute them.
      </p>
    ),
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    body: (
      <p>
        We will provide the assessment and the programme with reasonable care and
        skill. To the extent permitted by law, our total liability to you in
        connection with the assessment or the programme is limited to the amount
        you have paid us. Nothing in these terms limits liability that cannot be
        limited by law, including for death or personal injury caused by
        negligence, or for fraud.
      </p>
    ),
  },
  {
    id: 'ending-the-programme',
    heading: 'Ending the programme',
    body: (
      <p>
        We may end your programme if you are abusive to our team, if you share or
        resell your materials, or if you give us health information that is
        knowingly false in a way that makes it unsafe for us to advise you. Where
        we end a programme for any other reason, we will refund the unused
        portion of your fee.
      </p>
    ),
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of India. The courts at{' '}
        {business.address.city}, {business.jurisdictionState} have exclusive
        jurisdiction over any dispute arising from them.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <p>
        Questions about these terms go to{' '}
        <a href={`mailto:${business.email}`}>{business.email}</a> or{' '}
        <a href={`tel:${business.phoneE164}`}>{business.phone}</a>. Our full
        business details are below.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms & Conditions"
      title={
        <>
          The <em>terms</em> we work with you on
        </>
      }
      updated={UPDATED}
      lede={
        <p>
          These terms cover the paid assessment, the programme itself, what we
          ask of you while you are on it, and the limits of what a nutrition
          programme can do. The health disclaimer in clause 02 is the most
          important part of this page, so please read that one properly.
        </p>
      }
      clauses={CLAUSES}
      close={{
        heading: (
          <>
            Ask before you <em>book</em>
          </>
        ),
        body: 'If anything on this page is unclear, or you are not sure whether the programme is safe alongside a condition you are managing, put the question to us first.',
      }}
    />
  );
}
