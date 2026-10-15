// The TechToday mark (a "T" inside an orbit, on a blue–violet tile) plus the
// wordmark. `idPrefix` keeps the SVG gradient id unique when the logo appears
// more than once on a page (header and footer).
export function LogoMark({ idPrefix = "tt" }: { idPrefix?: string }) {
  const gradient = `${idPrefix}-logo-gradient`;
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradient}
          x1="4"
          y1="2"
          x2="36"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.55" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradient})`} />
      <ellipse
        cx="20"
        cy="21"
        rx="15.5"
        ry="6.2"
        transform="rotate(-24 20 21)"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.3"
        strokeWidth="1.6"
      />
      <rect x="11.5" y="11.5" width="17" height="5" rx="2.5" fill="#fff" />
      <rect x="17.5" y="11.5" width="5" height="18.5" rx="2.5" fill="#fff" />
      <circle cx="32.2" cy="13" r="2.4" fill="#67e8f9" />
    </svg>
  );
}

export default function Logo({ idPrefix }: { idPrefix?: string }) {
  return (
    <>
      <LogoMark idPrefix={idPrefix} />
      <span className="brand-word">
        Tech<b>Today</b>
      </span>
    </>
  );
}
