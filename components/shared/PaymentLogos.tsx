/**
 * The accepted-payment-method strip on the checkout.
 *
 * Inline SVGs, no external assets, so the row reads as a polished brand
 * strip rather than as six words, and so nothing here can 404 or arrive
 * late. Each mark sits in a small white tile with a hairline border, which
 * is what makes six logos with six different intrinsic aspect ratios line
 * up as one object.
 *
 * The tiles are white and not `--card` on purpose: these are other people's
 * brand marks, drawn in their own colours, and a warm cream tile behind
 * them tints them. White is the only neutral that leaves a brand mark alone.
 *
 * Self-scoped under `.dp-paylogos` (skin PART 3, law 3), so the component
 * carries its own names rather than depending on the page it is mounted in.
 * Its CSS lives in app/checkout.css because that is the only route that
 * loads it. Server component.
 */

import type { ReactElement } from 'react';

type LogoProps = { className?: string };

function VisaLogo() {
  return (
    <svg viewBox="0 0 64 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M28.4 1.4L24.6 20.6h-4.7L23.7 1.4h4.7zM48.7 13.8l2.5-6.9 1.4 6.9h-3.9zm5.3 6.8H58l-3.8-19.2h-4c-.9 0-1.7.5-2 1.4l-7.1 17.8h4.9l1-2.7h6l.5 2.7zM41.9 14.4c0-4.7-6.6-5-6.5-7.1 0-.6.6-1.3 2-1.5.7-.1 2.5-.2 4.7 1l.8-3.8c-1.1-.4-2.6-.9-4.5-.9-4.7 0-8 2.5-8 6.1 0 2.7 2.4 4.1 4.2 5 1.9.9 2.5 1.5 2.5 2.3 0 1.3-1.5 1.8-2.9 1.8-2.5 0-3.9-.7-5-1.2l-.9 3.9c1.2.5 3.4 1 5.7 1 5 0 8.2-2.5 8.2-6.3M21.8 1.4L14.2 20.6H9.3l-3.7-14.4C5.4 5.4 5.2 5.1 4.6 4.8 3.5 4.2 1.7 3.7 0 3.4l.1-.5h7.9c1 0 1.9.7 2.1 1.9l2 10.5L17 1.4h4.8z"
        fill="#1A1F71"
      />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="18" cy="15" r="11" fill="#EB001B" />
      <circle cx="30" cy="15" r="11" fill="#F79E1B" />
      <path d="M24 7.5a10.97 10.97 0 010 15 10.97 10.97 0 010-15z" fill="#FF5F00" />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg viewBox="0 0 56 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="56" height="22" rx="2" fill="#006FCF" />
      <text
        x="28" y="10" textAnchor="middle" fill="white"
        fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="5.6" letterSpacing="0.4"
      >
        AMERICAN
      </text>
      <text
        x="28" y="17" textAnchor="middle" fill="white"
        fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="5.6" letterSpacing="0.4"
      >
        EXPRESS
      </text>
    </svg>
  );
}

function RupayLogo() {
  return (
    <svg viewBox="0 0 70 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <text x="0" y="16" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="15" letterSpacing="-0.4">
        <tspan fill="#097D3A">Ru</tspan>
        <tspan fill="#F37021">Pay</tspan>
      </text>
      <path d="M52 6 L 58 11 L 52 16" stroke="#F37021" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function UpiLogo() {
  return (
    <svg viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <text x="0" y="16" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="15" letterSpacing="-0.4">
        <tspan fill="#097D3A">U</tspan>
        <tspan fill="#1A4FA0">P</tspan>
        <tspan fill="#F37021">I</tspan>
      </text>
      <g transform="translate(33,4)">
        <path d="M0 14 L 7 0 L 14 14 Z" fill="#097D3A" opacity="0.95" />
        <path d="M3 14 L 8.5 3 L 14 14 Z" fill="#1A4FA0" opacity="0.95" />
        <path d="M7 14 L 10 8 L 14 14 Z" fill="#F37021" opacity="0.95" />
      </g>
    </svg>
  );
}

function MaestroLogo() {
  return (
    <svg viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="18" cy="15" r="11" fill="#0099DF" />
      <circle cx="30" cy="15" r="11" fill="#ED1C2E" />
      <path d="M24 7.5a10.97 10.97 0 010 15 10.97 10.97 0 010-15z" fill="#7375CF" />
    </svg>
  );
}

const LOGOS: { id: string; label: string; Logo: (p: LogoProps) => ReactElement; w: number }[] = [
  { id: 'visa', label: 'Visa', Logo: VisaLogo, w: 42 },
  { id: 'mc', label: 'Mastercard', Logo: MastercardLogo, w: 30 },
  { id: 'rupay', label: 'RuPay', Logo: RupayLogo, w: 50 },
  { id: 'upi', label: 'UPI', Logo: UpiLogo, w: 44 },
  { id: 'amex', label: 'American Express', Logo: AmexLogo, w: 42 },
  { id: 'maestro', label: 'Maestro', Logo: MaestroLogo, w: 30 },
];

export function PaymentLogos() {
  return (
    <div className="dp-paylogos" role="list" aria-label="Accepted payment methods">
      {LOGOS.map(({ id, label, Logo, w }) => (
        <span key={id} className="dp-paylogo" role="listitem" aria-label={label} style={{ width: w + 18 }}>
          <Logo />
        </span>
      ))}
    </div>
  );
}
