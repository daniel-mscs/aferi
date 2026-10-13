export default function AnimatedLogo({ className = "" }) {
  return (
    <svg viewBox="0 0 512 512" className={`animated-logo ${className}`} aria-hidden="true">
      <rect width="512" height="512" rx="96" fill="#181b21" />
      <polyline
        className="splash-line"
        points="96,272 176,272 216,176 272,352 312,240 336,272 416,272"
        fill="none"
        stroke="#4ade80"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}