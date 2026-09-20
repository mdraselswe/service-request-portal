export function OperationsIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full"
      fill="none"
      viewBox="0 0 560 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="workspace-card" x1="96" x2="442" y1="34" y2="278">
          <stop stopColor="white" stopOpacity="0.18" />
          <stop offset="1" stopColor="white" stopOpacity="0.07" />
        </linearGradient>
        <linearGradient id="workspace-accent" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#2DD4BF" />
        </linearGradient>
        <filter id="workspace-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="16" floodColor="#020617" floodOpacity="0.22" stdDeviation="18" />
        </filter>
      </defs>

      <circle cx="480" cy="54" r="44" fill="#2DD4BF" opacity="0.1" />
      <circle cx="58" cy="230" r="54" fill="#60A5FA" opacity="0.08" />
      <path
        d="M82 225C159 175 198 240 274 184C342 133 392 168 490 92"
        opacity="0.24"
        stroke="url(#workspace-accent)"
        strokeDasharray="5 8"
        strokeLinecap="round"
        strokeWidth="2"
      />

      <g className="illustration-float" filter="url(#workspace-shadow)">
        <rect fill="url(#workspace-card)" height="220" rx="24" stroke="white" strokeOpacity="0.18" width="374" x="92" y="34" />
        <rect fill="white" fillOpacity="0.08" height="220" rx="24" width="84" x="92" y="34" />
        <circle cx="119" cy="65" fill="url(#workspace-accent)" r="11" />
        <rect fill="white" fillOpacity="0.62" height="6" rx="3" width="28" x="136" y="61" />
        <rect fill="white" fillOpacity="0.12" height="30" rx="9" width="58" x="105" y="98" />
        <rect fill="white" fillOpacity="0.08" height="30" rx="9" width="58" x="105" y="138" />

        <rect fill="white" fillOpacity="0.66" height="8" rx="4" width="90" x="202" y="62" />
        <rect fill="white" fillOpacity="0.18" height="5" rx="2.5" width="126" x="202" y="80" />

        <g className="illustration-card illustration-card-one">
          <rect fill="white" fillOpacity="0.1" height="48" rx="12" width="230" x="202" y="108" />
          <circle cx="222" cy="132" fill="#6EE7B7" r="8" />
          <rect fill="white" fillOpacity="0.65" height="6" rx="3" width="80" x="241" y="120" />
          <rect fill="white" fillOpacity="0.2" height="5" rx="2.5" width="116" x="241" y="137" />
          <rect fill="#6EE7B7" fillOpacity="0.2" height="20" rx="10" width="56" x="363" y="122" />
        </g>
        <g className="illustration-card illustration-card-two">
          <rect fill="white" fillOpacity="0.08" height="48" rx="12" width="230" x="202" y="168" />
          <circle cx="222" cy="192" fill="#93C5FD" r="8" />
          <rect fill="white" fillOpacity="0.55" height="6" rx="3" width="98" x="241" y="180" />
          <rect fill="white" fillOpacity="0.18" height="5" rx="2.5" width="88" x="241" y="197" />
          <rect fill="#93C5FD" fillOpacity="0.18" height="20" rx="10" width="56" x="363" y="182" />
        </g>
      </g>

      <g className="illustration-orbit">
        <circle cx="466" cy="220" fill="#0F766E" r="31" stroke="white" strokeOpacity="0.22" />
        <path d="m453 220 8 8 17-18" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      </g>
      <g className="illustration-orbit illustration-orbit-delayed">
        <circle cx="92" cy="78" fill="#1E3A5F" r="24" stroke="white" strokeOpacity="0.18" />
        <path d="M83 78h18M92 69v18" stroke="white" strokeLinecap="round" strokeWidth="3" />
      </g>
    </svg>
  );
}
