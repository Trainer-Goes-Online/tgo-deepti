import type { Metadata } from 'next';
import '../legal.css';
import { LegalPage, type Clause } from '@/components/legal/LegalPage';
import { business } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${business.legalName} collects, uses and protects your personal and health information.`,
  robots: { index: false, follow: false },
};

const UPDATED = '8 September 2026';

/* Health data is the whole reason this policy is not boilerplate. The
   assessment asks for blood reports, medical history and medication, which
   under India's DPDP Act 2023 is personal data a reader will reasonably
   expect to be handled more carefully than a name and an email. So the
   sensitive-data clause comes early, not buried at 09. */
const CLAUSES: Clause[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    body: (
      <p>
        This website is operated by {business.legalName}, trading as{' '}
        {business.tradingName}, from {business.address.city},{' '}
        {business.address.state}. Where this policy says &ldquo;we&rdquo;,
        &ldquo;us&rdquo; or &ldquo;our&rdquo;, it means that business. Our full
        contact details are at the foot of this page, and you can reach us about
        anything in this policy at{' '}
        <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
    ),
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: (
      <>
        <p>We collect only what we need to deliver the assessment and the programme.</p>
        <ul>
          <li>
            <b>Contact details</b> you give us: your name, email address, phone
            or WhatsApp number, and your city or country.
          </li>
          <li>
            <b>Health information</b> you choose to share for your assessment:
            blood reports and test results, height and weight, symptoms, medical
            history, current medication, eating patterns and lifestyle, and your
            previous weight-loss history.
          </li>
          <li>
            <b>Payment information</b> processed by our payment gateway. Card
            and banking details are handled by the gateway and are never stored
            on our servers.
          </li>
          <li>
            <b>Usage information</b> collected automatically when you visit:
            pages viewed, referring source, approximate location from your IP
            address, and device and browser type.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'health-information',
    heading: 'Your health information',
    body: (
      <>
        <p>
          Health information is the most sensitive thing you will share with us,
          and we treat it that way. We use it for one purpose: to understand your
          current health picture, prepare your personalised plan and review your
          progress during the programme.
        </p>
        <ul>
          <li>
            It is seen only by {business.legalName} and the qualified
            nutritionists working on your plan.
          </li>
          <li>
            We do not sell it, rent it, or share it with advertisers, and we do
            not use it to target advertising to you.
          </li>
          <li>
            We do not publish your reports, photographs or results anywhere,
            including on this website or on social media, without asking you
            first and getting your agreement in writing.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-it',
    heading: 'How we use your information',
    nav: 'How we use it',
    body: (
      <>
        <p>We use what we collect to:</p>
        <ul>
          <li>carry out your health assessment and build your personalised plan;</li>
          <li>
            contact you about your assessment, your plan and your progress
            reviews, including over email, phone and WhatsApp;
          </li>
          <li>take payment and issue receipts;</li>
          <li>
            understand how this website is used, so we can improve it and
            measure which of our advertisements are working;
          </li>
          <li>meet our legal and tax obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies, analytics and advertising',
    nav: 'Cookies and advertising',
    body: (
      <>
        <p>
          This website uses cookies and similar technologies. Some are necessary
          for the site and the checkout to work. Others help us measure traffic
          and advertising performance, and these are the ones that share limited
          information with third parties.
        </p>
        <ul>
          <li>
            <b>Google Analytics</b>, to understand how people find and use the
            site.
          </li>
          <li>
            <b>Meta (Facebook and Instagram)</b>, to measure the results of our
            advertising. This may include a hashed version of your email address
            or phone number so Meta can match a purchase to an advertisement.
          </li>
          <li>
            <b>Vimeo</b>, which hosts the videos on this page. The players are
            embedded directly, so Vimeo may set its own cookies when the page
            loads, not only when you press play.
          </li>
          <li>
            <b>Our payment gateway</b>, which sets cookies needed to process a
            payment securely.
          </li>
        </ul>
        <p>
          You can block or delete cookies in your browser settings. If you block
          the necessary ones, the checkout may stop working.
        </p>
      </>
    ),
  },
  {
    id: 'who-we-share-with',
    heading: 'Who we share information with',
    nav: 'Who we share with',
    body: (
      <>
        <p>
          We share your information only with the service providers we need to
          run the business, and only with what they need to do their job. These
          are our payment gateway, our email and messaging providers, our website
          and file hosting, and the analytics and advertising platforms named
          above. We may also disclose information where the law requires it.
        </p>
        <p>We do not sell your personal information to anyone.</p>
      </>
    ),
  },
  {
    id: 'how-long-we-keep-it',
    heading: 'How long we keep it',
    body: (
      <p>
        We keep your health information for as long as you are a client and for
        a reasonable period afterwards, so that we can answer questions about
        your plan and honour our guarantee. We keep billing records for as long
        as tax law requires. When information is no longer needed for either
        reason, we delete it.
      </p>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: (
      <>
        <p>
          You can ask us to show you the personal information we hold about you,
          correct anything that is wrong, or delete it. You can withdraw your
          consent to our using it at any time, and you can ask us to stop
          contacting you about anything other than an active programme.
        </p>
        <p>
          Email <a href={`mailto:${business.email}`}>{business.email}</a> and we
          will respond. Deleting your health information while a programme is
          running will usually mean we can no longer deliver it, and we will tell
          you if that is the case before acting.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    heading: 'Security',
    body: (
      <p>
        We take reasonable steps to protect your information, including
        restricting who can see health records and using reputable providers for
        payment and hosting. No method of transmission or storage is completely
        secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: 'children',
    heading: 'Children',
    body: (
      <p>
        This programme is intended for adults. We do not knowingly collect
        information from anyone under 18. If you believe a child has given us
        information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    nav: 'Changes',
    body: (
      <p>
        We may update this policy from time to time. The date at the top of this
        page shows when it was last changed. Continuing to use the website after
        a change means you accept the updated policy.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title={
        <>
          How we handle your <em>information</em>
        </>
      }
      updated={UPDATED}
      lede={
        <p>
          This assessment asks you for blood reports, medical history and
          medication. That is sensitive information, and this page sets out
          plainly what we collect, what we do with it, who else sees it and how
          you can get it back or have it deleted.
        </p>
      }
      clauses={CLAUSES}
      close={{
        heading: (
          <>
            Ask us about <em>your information</em>
          </>
        ),
        body: 'You can ask to see what we hold, correct anything that is wrong, or have it deleted. Write to us either way and we will respond.',
      }}
    />
  );
}
