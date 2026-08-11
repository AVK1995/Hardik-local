/**
 * Payment-network marks for the checkout page.
 *
 * Drawn inline rather than pulled from a CDN: a strict-privacy checkout should
 * not be making third-party requests, and these are five tiny shapes. They are
 * simplified representations of each network's mark — enough to be recognised
 * at 22px, which is all a "we accept these" row has to do. If the client wants
 * the exact licensed brand assets, drop the official SVGs in /public and swap
 * the `art` for an <img>.
 *
 * Each viewBox is 48x16 so the row lines up on one baseline regardless of how
 * different the real logos' proportions are.
 */

function Visa() {
  return (
    <svg viewBox="0 0 48 16" role="img" aria-label="Visa">
      <text
        x="24" y="12.5" textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="700"
        fontStyle="italic" letterSpacing="0.6" fill="#1A1F71"
      >
        VISA
      </text>
    </svg>
  );
}

function Mastercard() {
  return (
    <svg viewBox="0 0 48 16" role="img" aria-label="Mastercard">
      <circle cx="20" cy="8" r="6.4" fill="#EB001B" />
      <circle cx="28" cy="8" r="6.4" fill="#F79E1B" />
      {/* The overlap is the whole identity of this mark. */}
      <path d="M24 3.1a6.4 6.4 0 0 0 0 9.8 6.4 6.4 0 0 0 0-9.8z" fill="#FF5F00" />
    </svg>
  );
}

function RuPay() {
  return (
    <svg viewBox="0 0 48 16" role="img" aria-label="RuPay">
      <text
        x="2" y="12.5"
        fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="700" fontStyle="italic"
        fill="#097A3D"
      >
        Ru
      </text>
      <text
        x="19" y="12.5"
        fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="700" fontStyle="italic"
        fill="#F26C21"
      >
        Pay
      </text>
    </svg>
  );
}

function Upi() {
  return (
    <svg viewBox="0 0 48 16" role="img" aria-label="UPI">
      {/* The two chevrons that sit beside the UPI wordmark. */}
      <path d="M3 2.5 8.5 8 3 13.5h3.4L11.9 8 6.4 2.5z" fill="#097A3D" />
      <path d="M8.6 2.5 14.1 8 8.6 13.5H12L17.5 8 12 2.5z" fill="#F26C21" />
      <text
        x="20" y="12.3"
        fontFamily="Arial, Helvetica, sans-serif" fontSize="10.5" fontWeight="700"
        fill="#0F2B5B"
      >
        UPI
      </text>
    </svg>
  );
}

function Amex() {
  return (
    <svg viewBox="0 0 48 16" role="img" aria-label="American Express">
      <rect x="6" y="1" width="36" height="14" rx="2" fill="#1F72CD" />
      <text
        x="24" y="11.4" textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif" fontSize="7.4" fontWeight="700"
        letterSpacing="0.3" fill="#fff"
      >
        AMEX
      </text>
    </svg>
  );
}

export const payMarks = [
  { key: 'visa', Art: Visa },
  { key: 'mastercard', Art: Mastercard },
  { key: 'rupay', Art: RuPay },
  { key: 'upi', Art: Upi },
  { key: 'amex', Art: Amex },
];
