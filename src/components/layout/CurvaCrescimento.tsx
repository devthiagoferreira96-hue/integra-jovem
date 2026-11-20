const CURVA = "M0 470 C 320 466, 560 440, 760 360 S 1060 150, 1200 40";

const PONTOS = [
  { x: 380, y: 458 },
  { x: 760, y: 360 },
  { x: 1010, y: 190 },
];

export function CurvaCrescimento() {
  return (
    <svg
      aria-hidden="true"
      className="curva-crescimento"
      viewBox="0 0 1200 500"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="curva-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="curva-traco" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="35%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path className="curva-area" d={`${CURVA} L 1200 500 L 0 500 Z`} fill="url(#curva-area)" />
      <path
        className="curva-linha"
        d={CURVA}
        fill="none"
        stroke="url(#curva-traco)"
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
      />
      {PONTOS.map((p) => (
        <line
          key={p.x}
          className="curva-ponto"
          x1={p.x}
          y1={p.y}
          x2={p.x}
          y2={p.y}
          stroke="var(--primary)"
          strokeWidth="9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
