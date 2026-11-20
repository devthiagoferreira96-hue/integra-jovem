import type { ReactNode } from "react";

type Props = {
  className?: string;

  corClasse: string;

  corAcento: string;

  glifo: ReactNode;
};

export function EmblemaTrilha({ className, corClasse, corAcento, glifo }: Props) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="210,172 120,224 30,172 30,68 120,16 210,68"
        stroke="currentColor"
        className={corClasse}
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <polygon
        points="196,164 120,208 44,164 44,76 120,32 196,76"
        stroke="currentColor"
        className={corClasse}
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
      <polygon
        points="210,172 120,224 30,172 30,68 120,16 210,68"
        fill="currentColor"
        className={corClasse}
        fillOpacity="0.05"
      />

      {[
        [210, 172],
        [30, 172],
        [30, 68],
        [210, 68],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <line
            x1={x}
            y1={y}
            x2={120}
            y2={112}
            stroke={corAcento}
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
          <circle cx={x} cy={y} r="3.5" fill={corAcento} fillOpacity="0.8" />
        </g>
      ))}

      <circle cx="120" cy="112" r="46" fill="var(--color-surface)" />
      <circle cx="120" cy="112" r="46" stroke="currentColor" className={corClasse} strokeWidth="2.5" />
      <circle
        cx="120"
        cy="112"
        r="34"
        stroke="currentColor"
        className={corClasse}
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />

      <g transform="translate(120 112)">{glifo}</g>

      <g transform="translate(74 180)">
        <rect x="0" y="14" width="10" height="10" rx="2" fill="currentColor" className={corClasse} fillOpacity="0.5" />
        <rect x="16" y="8" width="10" height="16" rx="2" fill="currentColor" className={corClasse} fillOpacity="0.7" />
        <rect x="32" y="0" width="10" height="24" rx="2" fill={corAcento} />
        <path d="M2 12l16-6 16-8 16-6" stroke={corAcento} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}
