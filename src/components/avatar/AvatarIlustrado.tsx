import { useId, type ReactNode } from "react";

import type { AvatarId } from "@/lib/avatares";

type Props = { id: AvatarId; className?: string; titulo?: string };

const OLHO = "#1f2433";

type Base = {
  fundo: string;
  pele: string;
  roupa: string;
  cabelo?: string;
  estiloCabelo?: "curto" | "longo" | "cacheado" | "coque" | "nenhum";

  atras?: ReactNode;

  frente?: ReactNode;

  cabecaCustom?: ReactNode;

  peito?: ReactNode;
  semRosto?: boolean;

  boca?: "sorriso" | "aberta" | "neutra";
};

function Cabelo({ cor, estilo }: { cor: string; estilo: Base["estiloCabelo"] }) {
  switch (estilo) {
    case "curto":
      return (
        <path
          d="M37 54 C35 34 48 27 60 27 C73 27 86 34 83 54 C79 45 71 40 60 40 C49 40 41 45 37 54 Z"
          fill={cor}
        />
      );
    case "coque":
      return (
        <g fill={cor}>
          <circle cx="60" cy="24" r="9" />
          <path d="M37 54 C35 34 48 28 60 28 C73 28 86 34 83 54 C79 44 71 39 60 39 C49 39 41 44 37 54 Z" />
        </g>
      );
    case "cacheado":
      return (
        <g fill={cor}>
          {[
            [40, 44],
            [46, 34],
            [56, 29],
            [66, 29],
            [75, 34],
            [81, 44],
            [38, 54],
            [83, 54],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" />
          ))}
        </g>
      );
    case "longo":
      return (
        <path
          d="M37 54 C35 34 48 27 60 27 C73 27 86 34 83 54 C77 46 70 42 62 42 C56 46 47 49 37 54 Z"
          fill={cor}
        />
      );
    default:
      return null;
  }
}

function Molde({ uid, base }: { uid: string; base: Base }) {
  const clip = `avatar-clip-${uid}`;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="60" fill={base.fundo} />
      <g clipPath={`url(#${clip})`}>
        {base.estiloCabelo === "longo" ? (
          <path d="M35 52 C33 30 87 30 85 52 L88 92 L32 92 Z" fill={base.cabelo} />
        ) : null}
        {base.atras}

        <path d="M18 122 C18 94 37 83 60 83 C83 83 102 94 102 122 Z" fill={base.roupa} />
        {base.peito}
        {base.cabecaCustom ?? (
          <>
            <rect x="52" y="68" width="16" height="18" rx="6" fill={base.pele} />
            <ellipse cx="60" cy="54" rx="23" ry="25" fill={base.pele} />
            <ellipse cx="37.5" cy="57" rx="3.5" ry="5" fill={base.pele} />
            <ellipse cx="82.5" cy="57" rx="3.5" ry="5" fill={base.pele} />
            {base.semRosto ? null : (
              <>
                <circle cx="51.5" cy="57" r="2.8" fill={OLHO} />
                <circle cx="68.5" cy="57" r="2.8" fill={OLHO} />
                <circle cx="46" cy="64" r="3" fill="#ff8a8a" opacity="0.35" />
                <circle cx="74" cy="64" r="3" fill="#ff8a8a" opacity="0.35" />
                {base.boca === "neutra" ? (
                  <path d="M55 67.5 Q60 68.5 65 67.5" fill="none" stroke={OLHO} strokeWidth="2.2" strokeLinecap="round" />
                ) : base.boca === "aberta" ? (
                  <g>
                    <path d="M51 65 Q60 64 69 65 Q67 76 60 76 Q53 76 51 65 Z" fill="#6b1d1d" />
                    <path d="M52.5 65.4 Q60 64.6 67.5 65.4 L67 68 Q60 69 53 68 Z" fill="#ffffff" />
                    <path d="M55 73.5 Q60 71.5 65 73.5 Q62.5 75.8 60 75.8 Q57.5 75.8 55 73.5 Z" fill="#e86a6a" />
                  </g>
                ) : (
                  <path
                    d="M53 66 Q60 72 67 66"
                    fill="none"
                    stroke={OLHO}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                )}
              </>
            )}
            {base.cabelo ? <Cabelo cor={base.cabelo} estilo={base.estiloCabelo} /> : null}
          </>
        )}
        {base.frente}
      </g>
    </>
  );
}

const desenhos: Record<AvatarId, Base> = {

  "heroi-seta": {
    fundo: "#12383a",
    pele: "#c98e6a",
    roupa: "#2dd4a3",
    cabelo: "#2b1a12",
    estiloCabelo: "longo",
    atras: <path d="M6 122 L24 86 Q42 80 60 84 Q78 80 96 86 L114 122 Z" fill="#f97316" />,
    peito: (
      <g transform="translate(60 102)">
        <circle r="9" fill="#0f2a2a" />
        <path d="M-4 3 L-4 -1 Q-4 -4 -1 -4 L3 -4 L3 -7 L7 -2.5 L3 2 L3 -1 L-1 -1 L-1 3 Z" fill="#2dd4a3" />
      </g>
    ),
    frente: (
      <g>
        <path
          d="M38 51 Q60 45 82 51 L81 60 Q72 63 66 58 Q60 55 54 58 Q48 63 39 60 Z"
          fill="#f97316"
        />
        <ellipse cx="51.5" cy="56" rx="4.2" ry="3.4" fill="#fff7ed" />
        <ellipse cx="68.5" cy="56" rx="4.2" ry="3.4" fill="#fff7ed" />
        <circle cx="51.5" cy="56.3" r="2.3" fill={OLHO} />
        <circle cx="68.5" cy="56.3" r="2.3" fill={OLHO} />
      </g>
    ),
  },
  astronauta: {
    fundo: "#1e2458",
    pele: "#8d5a3b",
    roupa: "#e5e7eb",
    cabelo: "#1a1a1a",
    estiloCabelo: "curto",
    peito: (
      <g>
        <rect x="46" y="98" width="28" height="12" rx="3" fill="#94a3b8" />
        <circle cx="52" cy="104" r="2.5" fill="#22c55e" />
        <circle cx="60" cy="104" r="2.5" fill="#facc15" />
        <circle cx="68" cy="104" r="2.5" fill="#ef4444" />
      </g>
    ),
    frente: (
      <g>
        <circle cx="60" cy="55" r="31" fill="#bfdbfe" opacity="0.18" stroke="#e5e7eb" strokeWidth="5" />
        <path d="M44 34 Q52 28 60 28" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        {[
          [18, 24],
          [100, 30],
          [96, 70],
          [22, 76],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" fill="#fde68a" />
        ))}
      </g>
    ),
  },
  gamer: {
    fundo: "#2a1541",
    pele: "#f1c7a3",
    roupa: "#7c3aed",
    cabelo: "#d97706",
    estiloCabelo: "curto",
    peito: (
      <g transform="translate(60 102)">
        <rect x="-12" y="-6" width="24" height="12" rx="6" fill="#1f1235" />
        <path d="M-7 0 H-3 M-5 -2 V2" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="5" cy="-1" r="1.4" fill="#f472b6" />
        <circle cx="8" cy="1.5" r="1.4" fill="#22d3ee" />
      </g>
    ),
    frente: (
      <g>
        <path d="M35 56 Q35 24 60 24 Q85 24 85 56" fill="none" stroke="#111827" strokeWidth="5" />
        <rect x="29" y="50" width="11" height="18" rx="5" fill="#111827" />
        <rect x="80" y="50" width="11" height="18" rx="5" fill="#111827" />
        <rect x="31" y="53" width="3" height="12" rx="1.5" fill="#22d3ee" />
        <path d="M36 66 Q40 76 52 74" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="53" cy="74" r="2.5" fill="#22d3ee" />
      </g>
    ),
  },
  skatista: {
    fundo: "#3b2a12",
    pele: "#6b4226",
    roupa: "#facc15",
    cabelo: "#111111",
    estiloCabelo: "cacheado",
    peito: (
      <g>
        <path d="M44 104 H76" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
        <circle cx="49" cy="109" r="2.5" fill="#1f2937" />
        <circle cx="71" cy="109" r="2.5" fill="#1f2937" />
      </g>
    ),
    frente: (
      <g>
        <path d="M37 44 Q38 26 60 26 Q82 26 83 44 Z" fill="#ef4444" />
        <path d="M70 42 Q88 40 98 46 Q88 49 76 47 Z" fill="#b91c1c" />
        <circle cx="60" cy="27" r="2.5" fill="#b91c1c" />
      </g>
    ),
  },
  cientista: {
    fundo: "#0f3242",
    pele: "#e0ac85",
    roupa: "#f8fafc",
    cabelo: "#6b3f1d",
    estiloCabelo: "coque",
    peito: (
      <g>
        <path d="M60 83 L52 100 L60 96 L68 100 Z" fill="#38bdf8" />
        <rect x="70" y="98" width="10" height="3" rx="1.5" fill="#38bdf8" />
        <path d="M44 100 L48 112 H40 Z" fill="#a3e635" opacity="0.9" />
      </g>
    ),
    frente: (
      <g>
        <path d="M36 44 H84" stroke="#334155" strokeWidth="3" />
        <circle cx="50" cy="44" r="7" fill="#7dd3fc" stroke="#334155" strokeWidth="3" />
        <circle cx="70" cy="44" r="7" fill="#7dd3fc" stroke="#334155" strokeWidth="3" />
      </g>
    ),
  },
  artista: {
    fundo: "#3f1330",
    pele: "#b87650",
    roupa: "#0ea5e9",
    cabelo: "#241208",
    estiloCabelo: "curto",
    peito: (
      <g>
        <circle cx="48" cy="102" r="4" fill="#f472b6" />
        <circle cx="58" cy="108" r="3" fill="#facc15" />
        <circle cx="70" cy="100" r="3.5" fill="#a3e635" />
      </g>
    ),
    frente: (
      <g>
        <ellipse cx="56" cy="33" rx="25" ry="8" fill="#e11d48" transform="rotate(-10 56 33)" />
        <circle cx="46" cy="27" r="3" fill="#e11d48" />
        <path d="M84 70 L96 58" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <path d="M96 58 L99 55" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
      </g>
    ),
  },
  exploradora: {
    fundo: "#16361f",
    pele: "#f5d0b0",
    roupa: "#65a30d",
    cabelo: "#b45309",
    estiloCabelo: "longo",
    peito: (
      <g>
        <path d="M40 90 L56 122" stroke="#78350f" strokeWidth="4" />
        <circle cx="70" cy="104" r="7" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
        <path d="M70 99 L72 104 L70 109 L68 104 Z" fill="#dc2626" />
      </g>
    ),
    frente: (
      <g>
        <ellipse cx="60" cy="36" rx="34" ry="7" fill="#a16207" />
        <path d="M42 36 Q44 18 60 18 Q76 18 78 36 Z" fill="#ca8a04" />
        <path d="M43 32 H77" stroke="#78350f" strokeWidth="3" />
      </g>
    ),
  },
  robo: {
    fundo: "#1f2937",
    pele: "#9ca3af",
    roupa: "#475569",
    semRosto: true,
    peito: (
      <g>
        <rect x="48" y="96" width="24" height="14" rx="3" fill="#0f172a" />
        <path d="M51 103 H56 L58 99 L61 107 L63 103 H69" fill="none" stroke="#34d399" strokeWidth="1.8" />
      </g>
    ),
    cabecaCustom: (
      <g>
        <rect x="54" y="70" width="12" height="16" fill="#64748b" />
        <line x1="60" y1="30" x2="60" y2="20" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="60" cy="18" r="4" fill="#f97316" />
        <rect x="36" y="30" width="48" height="42" rx="12" fill="#cbd5e1" />
        <rect x="31" y="44" width="6" height="14" rx="2" fill="#94a3b8" />
        <rect x="83" y="44" width="6" height="14" rx="2" fill="#94a3b8" />
        <rect x="42" y="40" width="36" height="18" rx="8" fill="#0f172a" />
        <circle cx="52" cy="49" r="4" fill="#34d399" />
        <circle cx="68" cy="49" r="4" fill="#34d399" />
        <path d="M50 64 H70" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },

  "piloto-tubarao": {
    fundo: "#0c2d48",
    pele: "#c68642",
    roupa: "#1e3a5f",
    cabelo: "#1f1308",
    estiloCabelo: "curto",
    peito: (
      <g>
        <path d="M34 90 Q60 100 86 90 L86 94 Q60 104 34 94 Z" fill="#94a3b8" />
        {[42, 50, 58, 66, 74].map((x) => (
          <path key={x} d={`M${x} 95 L${x + 4} 102 L${x + 8} 95 Z`} fill="#f8fafc" />
        ))}
        <circle cx="60" cy="110" r="3" fill="#38bdf8" />
      </g>
    ),
    frente: (
      <g>
        <path d="M58 25 L68 6 Q70 16 72 27 Z" fill="#475569" />
        <path d="M35 50 Q34 22 60 22 Q86 22 85 50 Q72 44 60 44 Q48 44 35 50 Z" fill="#64748b" />
        <path d="M38 46 Q60 38 82 46" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <path d="M78 30 L76 36 M82 32 L80 38" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
  },
  "gata-neon": {
    fundo: "#1a0b2e",
    pele: "#f1c7a3",
    roupa: "#0f172a",
    cabelo: "#db2777",
    estiloCabelo: "longo",
    peito: (
      <g fill="#f472b6">
        <ellipse cx="60" cy="106" rx="6" ry="5" />
        <circle cx="52" cy="98" r="2.6" />
        <circle cx="60" cy="95" r="2.6" />
        <circle cx="68" cy="98" r="2.6" />
      </g>
    ),
    frente: (
      <g>
        <path d="M40 32 L42 14 L54 26 Z" fill="#111827" />
        <path d="M80 32 L78 14 L66 26 Z" fill="#111827" />
        <path d="M44 28 L45 19 L51 25 Z" fill="#f472b6" />
        <path d="M76 28 L75 19 L69 25 Z" fill="#f472b6" />
        <path d="M35 56 Q35 26 60 26 Q85 26 85 56" fill="none" stroke="#111827" strokeWidth="5" />
        <rect x="29" y="50" width="11" height="17" rx="5" fill="#111827" />
        <rect x="80" y="50" width="11" height="17" rx="5" fill="#111827" />
        <rect x="31" y="54" width="3" height="9" rx="1.5" fill="#f472b6" />
        <rect x="86" y="54" width="3" height="9" rx="1.5" fill="#f472b6" />
      </g>
    ),
  },
  "capuz-raposa": {
    fundo: "#2a1206",
    pele: "#8d5a3b",
    roupa: "#ea580c",
    atras: (
      <g>
        <path d="M29 62 Q27 24 60 22 Q93 24 91 62 L94 90 L26 90 Z" fill="#f97316" />
        <path d="M34 36 L36 8 L54 24 Z" fill="#f97316" />
        <path d="M86 36 L84 8 L66 24 Z" fill="#f97316" />
        <path d="M38 28 L39 14 L49 23 Z" fill="#7c2d12" />
        <path d="M82 28 L81 14 L71 23 Z" fill="#7c2d12" />
        <ellipse cx="60" cy="56" rx="27" ry="29" fill="#fff7ed" />
      </g>
    ),
    cabelo: "#1a1a1a",
    estiloCabelo: "curto",
    peito: (
      <g>
        <path d="M60 84 L60 122" stroke="#9a3412" strokeWidth="2" />
        <circle cx="52" cy="96" r="2" fill="#fff7ed" />
        <circle cx="68" cy="96" r="2" fill="#fff7ed" />
      </g>
    ),
    frente: (
      <g>
        <circle cx="68.5" cy="57" r="6.5" fill="#22d3ee" opacity="0.25" stroke="#22d3ee" strokeWidth="2" />
        <path d="M75 57 L82 54" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
  },
  "visao-coruja": {
    fundo: "#3f2d1c",
    pele: "#e0ac85",
    roupa: "#78350f",
    cabelo: "#292524",
    estiloCabelo: "coque",
    peito: (
      <g fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
        <path d="M46 96 L52 102 L58 96" />
        <path d="M62 96 L68 102 L74 96" />
        <path d="M54 106 L60 112 L66 106" />
      </g>
    ),
    frente: (
      <g>
        <path d="M34 50 L30 38 L42 46 Z" fill="#b45309" />
        <path d="M86 50 L90 38 L78 46 Z" fill="#b45309" />
        <path d="M36 54 H84" stroke="#451a03" strokeWidth="3" />
        <circle cx="51.5" cy="57" r="8.5" fill="#fbbf24" opacity="0.35" stroke="#92400e" strokeWidth="3" />
        <circle cx="68.5" cy="57" r="8.5" fill="#fbbf24" opacity="0.35" stroke="#92400e" strokeWidth="3" />
        <circle cx="51.5" cy="57" r="5" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.8" />
        <circle cx="68.5" cy="57" r="5" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.8" />
      </g>
    ),
  },
  "armadura-besouro": {
    fundo: "#052e16",
    pele: "#f5d0b0",
    roupa: "#047857",
    peito: (
      <g>
        <path d="M60 86 Q38 88 32 122 H60 Z" fill="#059669" />
        <path d="M60 86 Q82 88 88 122 H60 Z" fill="#10b981" />
        <path d="M60 86 V122" stroke="#022c22" strokeWidth="2" />
        <path d="M44 100 Q50 96 54 100" fill="none" stroke="#a7f3d0" strokeWidth="1.5" opacity="0.7" />
      </g>
    ),
    frente: (
      <g>
        <path d="M58 26 Q54 8 66 2 Q62 14 64 26 Z" fill="#10b981" />
        <path d="M35 48 Q35 22 60 22 Q85 22 85 48 Q72 42 60 42 Q48 42 35 48 Z" fill="#047857" />
        <path d="M40 40 Q60 30 80 40" fill="none" stroke="#6ee7b7" strokeWidth="2" opacity="0.7" />
        <circle cx="60" cy="30" r="2.5" fill="#a7f3d0" />
      </g>
    ),
  },
  "abelha-jet": {
    fundo: "#3b2f04",
    pele: "#6b4226",
    roupa: "#facc15",
    cabelo: "#111111",
    estiloCabelo: "cacheado",
    atras: (
      <g fill="#bae6fd" opacity="0.55">
        <ellipse cx="26" cy="86" rx="16" ry="10" transform="rotate(-30 26 86)" />
        <ellipse cx="94" cy="86" rx="16" ry="10" transform="rotate(30 94 86)" />
      </g>
    ),
    peito: (
      <g fill="#111827">
        <path d="M24 100 H96 L98 106 H22 Z" />
        <path d="M20 112 H100 L101 118 H19 Z" />
      </g>
    ),
    frente: (
      <g>
        <path d="M50 30 Q44 14 38 10" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M70 30 Q76 14 82 10" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="10" r="4" fill="#fde047" />
        <circle cx="82" cy="10" r="4" fill="#fde047" />
        <circle cx="38" cy="10" r="7" fill="#fde047" opacity="0.25" />
        <circle cx="82" cy="10" r="7" fill="#fde047" opacity="0.25" />
      </g>
    ),
  },
  "tigre-turbo": {
    fundo: "#1f1033",
    pele: "#f1c7a3",
    roupa: "#f97316",
    cabelo: "#111111",
    estiloCabelo: "curto",
    peito: (
      <g stroke="#111827" strokeWidth="3" strokeLinecap="round">
        <path d="M28 100 L36 96" />
        <path d="M24 110 L34 106" />
        <path d="M92 100 L84 96" />
        <path d="M96 110 L86 106" />
        <path d="M60 88 V100" stroke="#fde047" />
      </g>
    ),
    frente: (
      <g>
        <circle cx="40" cy="30" r="8" fill="#f97316" />
        <circle cx="80" cy="30" r="8" fill="#f97316" />
        <circle cx="40" cy="30" r="4" fill="#111827" />
        <circle cx="80" cy="30" r="4" fill="#111827" />
        <path d="M36 46 Q36 24 60 24 Q84 24 84 46 Z" fill="#f97316" />
        <path d="M52 26 L54 34 M60 24 V33 M68 26 L66 34" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
        <rect x="35" y="42" width="50" height="6" rx="3" fill="#fde047" />
      </g>
    ),
  },
  "coelho-orbital": {
    fundo: "#0e1a40",
    pele: "#d1a07a",
    roupa: "#e2e8f0",
    cabelo: "#6b3f1d",
    estiloCabelo: "longo",
    peito: (
      <g>
        <circle cx="60" cy="104" r="6" fill="#a78bfa" />
        <ellipse cx="60" cy="104" rx="11" ry="3" fill="none" stroke="#f472b6" strokeWidth="1.8" transform="rotate(-20 60 104)" />
        <path d="M34 94 Q40 90 46 94" fill="none" stroke="#94a3b8" strokeWidth="2" />
      </g>
    ),
    frente: (
      <g>
        <rect x="42" y="4" width="11" height="30" rx="5.5" fill="#f8fafc" transform="rotate(-10 47 30)" />
        <rect x="67" y="4" width="11" height="30" rx="5.5" fill="#f8fafc" transform="rotate(10 73 30)" />
        <rect x="45" y="9" width="5" height="20" rx="2.5" fill="#f472b6" transform="rotate(-10 47 30)" />
        <rect x="70" y="9" width="5" height="20" rx="2.5" fill="#f472b6" transform="rotate(10 73 30)" />
        <path d="M38 36 Q60 26 82 36" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        {[
          [18, 24],
          [102, 36],
          [96, 78],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" fill="#fde68a" />
        ))}
      </g>
    ),
  },

  kaua: {
    fundo: "#3f7d2c",
    pele: "#c68a5e",
    roupa: "#111111",
    boca: "aberta",
    peito: (
      <g>
        <defs>
          <clipPath id="kaua-camisa">
            <path d="M18 122 C18 94 37 83 60 83 C83 83 102 94 102 122 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#kaua-camisa)" fill="#f8fafc">
          {[26, 38, 50, 64, 76, 88].map((x) => (
            <rect key={x} x={x} y="80" width="5" height="45" />
          ))}
        </g>
      </g>
    ),
    frente: (
      <g>

        <g fill="#2b1a10">
          <path d="M37 52 C36 40 44 33 60 33 C76 33 84 40 83 52 C80 46 72 42 60 42 C48 42 40 46 37 52 Z" />
          {[
            [41, 38, 6.5],
            [47, 31, 7],
            [55, 27, 7.5],
            [64, 26.5, 7.5],
            [72, 30, 7],
            [78, 37, 6.5],
            [50, 36, 6],
            [60, 33, 6.5],
            [70, 36, 6],
            [38, 46, 5],
            [82, 45, 5],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <g fill="none" stroke="#4a2e1c" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
          <path d="M45 30 q3 -3 5 1" />
          <path d="M57 25 q3 -3 5 1" />
          <path d="M68 28 q3 -3 5 1" />
          <path d="M52 37 q3 -3 5 1" />
          <path d="M64 35 q3 -3 5 1" />
        </g>

        <g>
          <rect x="41" y="51" width="16.5" height="10" rx="4" fill="#3b0d0d" stroke="#111111" strokeWidth="1.8" />
          <rect x="62.5" y="51" width="16.5" height="10" rx="4" fill="#3b0d0d" stroke="#111111" strokeWidth="1.8" />
          <path d="M57.5 55 Q60 53.5 62.5 55" fill="none" stroke="#111111" strokeWidth="1.8" />
          <path d="M41 54 L36.5 53" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M79 54 L83.5 53" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M44 53.5 L48 53.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M65.5 53.5 L69.5 53.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </g>
      </g>
    ),
  },
  "integrante-2": {

    fundo: "#1f4e5f",
    pele: "#f3cfb3",
    roupa: "#5b5f66",
    boca: "aberta",
    atras: <circle cx="60" cy="23" r="9" fill="#d9ab5f" />,
    peito: (
      <g>
        <path d="M44 85 L60 100 L76 85" fill="none" stroke="#facc15" strokeWidth="3" />
        <path d="M45 86 L55 104 L60 98 Z" fill="#6b7078" />
        <path d="M75 86 L65 104 L60 98 Z" fill="#6b7078" />
        <path d="M60 98 V122" stroke="#4b4f55" strokeWidth="1.2" />
        {[104, 112, 120].map((y) => (
          <circle key={y} cx="62.5" cy={y} r="1.3" fill="#c7cbd1" />
        ))}
        <path d="M55 86 Q60 94 65 86" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
        <circle cx="60" cy="94.5" r="1.1" fill="#e5e7eb" />
      </g>
    ),
    frente: (
      <g>
        <path d="M37 54 C35 34 48 28 60 28 C73 28 86 34 83 54 C80 44 72 38 60 38 C48 38 40 44 37 54 Z" fill="#d9ab5f" />
        <g fill="none" stroke="#e8c27c" strokeWidth="1.3" strokeLinecap="round" opacity="0.9">
          <path d="M45 33 q4 -3 8 0" />
          <path d="M60 30 q4 -3 8 0" />
          <path d="M70 34 q3 -2 6 1" />
        </g>

        <g fill="none" stroke="#d9ab5f" strokeWidth="3" strokeLinecap="round">
          <path d="M37 50 q-4 5 0 9 q4 4 0 9 q-3 4 1 7" />
          <path d="M83 50 q4 5 0 9 q-4 4 0 9 q3 4 -1 7" />
        </g>

        <g fill="#fef3c7" fillOpacity="0.15" stroke="#b89468" strokeWidth="1.4">
          <circle cx="51.5" cy="57" r="6.8" />
          <circle cx="68.5" cy="57" r="6.8" />
        </g>
        <path d="M58.3 56 Q60 55 61.7 56" fill="none" stroke="#b89468" strokeWidth="1.3" />
        <path d="M44.7 56 L38 54.5 M75.3 56 L82 54.5" stroke="#b89468" strokeWidth="1.3" strokeLinecap="round" />
      </g>
    ),
  },
  "integrante-3": {

    fundo: "#2b3a55",
    pele: "#e2ae88",
    roupa: "#1e3a8a",
    peito: <path d="M50 84 Q60 92 70 84" fill="none" stroke="#172554" strokeWidth="3" />,
    frente: (
      <g>
        <path d="M36 52 C33 32 46 24 61 24 C76 24 87 32 84 50 C80 42 74 39 66 39 C58 40 46 42 36 52 Z" fill="#2b1d14" />
        <path d="M44 30 Q58 22 76 28" fill="none" stroke="#4a3426" strokeWidth="1.5" strokeLinecap="round" />

        <path d="M45 50.5 Q51 48 57 50" fill="none" stroke="#1c120c" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M63 50 Q69 48 75 50.5" fill="none" stroke="#1c120c" strokeWidth="2.6" strokeLinecap="round" />

        <path d="M54.5 72.5 Q60 78.5 65.5 72.5 Q60 75.5 54.5 72.5 Z" fill="#2b1d14" />

        <g>
          <rect x="17" y="94" width="18" height="16" rx="5" fill="#e2ae88" />
          <rect x="21" y="79" width="7" height="18" rx="3.5" fill="#e2ae88" />
          <path d="M20 99 H33 M20 103 H33 M21 107 H32" stroke="#c48f6b" strokeWidth="1" />
          <rect x="15" y="108" width="22" height="14" rx="3" fill="#1e3a8a" />
        </g>
      </g>
    ),
  },
  "integrante-4": {

    fundo: "#3a3f4b",
    pele: "#d9a47f",
    roupa: "#1d4ed8",
    boca: "neutra",
    atras: (
      <path
        d="M31 56 C25 26 95 26 89 56 C93 66 90 74 95 82 C98 90 93 96 96 104 L24 104 C27 96 22 90 25 82 C30 74 27 66 31 56 Z"
        fill="#171717"
      />
    ),
    peito: (
      <g>
        <defs>
          <clipPath id="integrante-4-corpo">
            <path d="M18 122 C18 94 37 83 60 83 C83 83 102 94 102 122 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#integrante-4-corpo)">

          <rect x="26" y="82" width="9" height="42" rx="2" fill="#be123c" transform="rotate(-8 30 100)" />
          <rect x="85" y="82" width="9" height="42" rx="2" fill="#be123c" transform="rotate(8 90 100)" />
        </g>

        <path d="M44 86 Q60 100 76 86" fill="none" stroke="#1e40af" strokeWidth="5" strokeLinecap="round" />
        <path d="M55 94 V118 M65 94 V116" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    ),
    frente: (
      <g>

        <path d="M35 58 C33 32 46 26 60 26 C74 26 87 32 85 58 C83 48 78 41 70 38 C64 41 56 41 50 38 C42 41 37 48 35 58 Z" fill="#171717" />
        <path d="M36 50 C31 60 35 70 31 80 C36 76 39 68 40 60 Z" fill="#171717" />
        <path d="M84 50 C89 60 85 70 89 80 C84 76 81 68 80 60 Z" fill="#171717" />
        <g fill="none" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
          <path d="M44 33 q5 -3 9 1" />
          <path d="M64 31 q5 -3 9 2" />
          <path d="M29 72 q2 4 0 8" />
          <path d="M91 72 q-2 4 0 8" />
        </g>

        <path d="M50.5 66.5 Q53 60.5 60 62 Q67 60.5 69.5 66.5 Q66.5 63.8 60 64.2 Q53.5 63.8 50.5 66.5 Z" fill="#1c1917" />
        <path d="M57.5 73.5 Q60 77.5 62.5 73.5 Z" fill="#1c1917" />

        <g fill="#e0f2fe" fillOpacity="0.15" stroke="#262626" strokeWidth="2">
          <rect x="42.5" y="51" width="16" height="12" rx="3.5" />
          <rect x="61.5" y="51" width="16" height="12" rx="3.5" />
        </g>
        <path d="M58.5 55.5 Q60 54.2 61.5 55.5" fill="none" stroke="#262626" strokeWidth="1.8" />
      </g>
    ),
  },
  "integrante-5": {

    fundo: "#3b2f4f",
    pele: "#d49b77",
    roupa: "#111111",
    peito: (
      <g>
        <path d="M48 84 Q60 91 72 84" fill="none" stroke="#262626" strokeWidth="3" />
        <g fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M44 98 L50 104 L46 106 L54 116" />
          <path d="M76 98 L70 104 L74 106 L66 116" />
          <path d="M60 96 L57 104 L63 106 L59 118" />
        </g>
        <circle cx="60" cy="108" r="9" fill="#38bdf8" opacity="0.12" />
      </g>
    ),
    frente: (
      <g>
        <path d="M37 50 C36 38 46 32 60 32 C74 32 84 38 83 50 C79 44 71 41 60 41 C49 41 41 44 37 50 Z" fill="#111111" />
        <g fill="#111111">
          {[
            [40, 42], [45, 35], [51, 30], [58, 28], [65, 28], [72, 31], [78, 36], [81, 43],
            [48, 38], [56, 34], [64, 34], [72, 38], [38, 49], [83, 49],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.6" />
          ))}
        </g>
        <g fill="none" stroke="#3f3f46" strokeWidth="1" strokeLinecap="round">
          {[[44, 34], [55, 29], [66, 30], [76, 36], [52, 37], [63, 36]].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} q2 -2 4 0 q2 2 0 3`} />
          ))}
        </g>

        <g fill="#e0f2fe" fillOpacity="0.15" stroke="#6b7280" strokeWidth="1.5">
          <rect x="42.5" y="52" width="16" height="10" rx="3" />
          <rect x="61.5" y="52" width="16" height="10" rx="3" />
        </g>
        <path d="M58.5 56 Q60 55 61.5 56 M42.5 55.5 L37 54.5 M77.5 55.5 L83 54.5" fill="none" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    ),
  },
  thiago: {

    fundo: "#2f4858",
    pele: "#e6b594",
    roupa: "#1a2236",
    peito: (
      <g>
        <path d="M47 84.5 Q60 95 73 84.5" fill="none" stroke="#111827" strokeWidth="3" />
        <path d="M22 106 Q26 99 33 97 M98 106 Q94 99 87 97" fill="none" stroke="#263049" strokeWidth="1.2" />
      </g>
    ),
    frente: (
      <g>
        <path d="M53.5 67 Q60 71.5 66.5 67" fill="none" stroke="#7a3f36" strokeWidth="2.2" strokeLinecap="round" />

        <path
          d="M36.5 51 C35 36 44 27 57 27 C66 26.5 73 28.5 78 32 C82 35.5 84.5 42 84 51 C81 45 75 41.5 67 41 C62 39 56 41.5 52 42 C45 43.5 40 46.5 36.5 51 Z"
          fill="#2a2320"
        />
        <path d="M52 42.5 Q54 34 64 33.5 Q58 36 57 42 Z" fill="#2a2320" />
        <path d="M66 29 Q73 27 78 31 Q72 30.5 68 33 Z" fill="#2a2320" />
        <g fill="none" stroke="#4a403a" strokeWidth="1.2" strokeLinecap="round">
          <path d="M45 34 q4 -4 9 -3" />
          <path d="M58 29.5 q5 -2 9 0" />
          <path d="M71 32 q3 1 5 4" />
          <path d="M40 43 q1 -3 4 -5" />
        </g>

        <path d="M44.5 51 Q51 48 57.5 50.3" fill="none" stroke="#1f1714" strokeWidth="2.7" strokeLinecap="round" />
        <path d="M62.5 50.3 Q69 48 75.5 51" fill="none" stroke="#1f1714" strokeWidth="2.7" strokeLinecap="round" />
      </g>
    ),
  },
};

export function AvatarIlustrado({ id, className, titulo }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={titulo ?? "Avatar"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Molde uid={uid} base={desenhos[id]} />
    </svg>
  );
}
