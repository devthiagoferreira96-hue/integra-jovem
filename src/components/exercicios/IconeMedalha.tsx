import { useId } from "react";

import { infoMedalha, type Medalha } from "@/lib/medalhas";

type Props = {
  medalha: Medalha;
  className?: string;

  bloqueada?: boolean;
};

const PREMIUM: Medalha[] = ["platina", "esmeralda", "diamante"];

export function IconeMedalha({ medalha, className = "h-6 w-6", bloqueada = false }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const info = infoMedalha[medalha];
  const premium = PREMIUM.includes(medalha);
  const brilhoExtra = info.brilhoExtra && !bloqueada;
  const cor = bloqueada ? "#52525b" : info.cor;
  const corEscura = bloqueada ? "#27272a" : info.corEscura;
  const traco = bloqueada ? "#71717a" : medalha === "diamante" ? "#0e7490" : "#065f46";

  return (
    <svg
      viewBox="-6 -4 52 56"
      className={`overflow-visible ${className}`}
      role="img"
      aria-label={`Medalha ${info.nome.toLowerCase()}${bloqueada ? " (ainda não conquistada)" : ""}`}
    >
      <defs>
        <linearGradient id={`m-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={cor} />
          <stop offset="100%" stopColor={corEscura} />
        </linearGradient>
        {brilhoExtra ? (
          <>
            <radialGradient id={`aura-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="45%" stopColor={info.cor} stopOpacity="0.75" />
              <stop offset="100%" stopColor={info.cor} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`reflexo-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </>
        ) : null}
      </defs>

      {brilhoExtra ? (
        <circle cx="20" cy="30" r="23" fill={`url(#aura-${uid})`} className="motion-safe:animate-pulse" />
      ) : null}

      <path d="M10 0 H18 L22 14 H14 Z" fill={bloqueada ? "#3f3f46" : premium ? "#7c3aed" : "#2dd4a3"} />
      <path d="M30 0 H22 L18 14 H26 Z" fill={bloqueada ? "#52525b" : premium ? "#db2777" : "#0ea5e9"} />

      <circle cx="20" cy="30" r="15" fill={`url(#m-${uid})`} stroke={corEscura} strokeWidth="2" />
      <circle
        cx="20"
        cy="30"
        r="10.5"
        fill="none"
        stroke="#ffffff"
        strokeOpacity={bloqueada ? 0.15 : brilhoExtra ? 0.8 : 0.45}
        strokeWidth="1.5"
      />

      {medalha === "esmeralda" ? (
        <g>
          <path d="M16 22 H24 L28 26 V34 L24 38 H16 L12 34 V26 Z" fill={bloqueada ? "#3f3f46" : "#10b981"} stroke={bloqueada ? traco : "#ecfdf5"} strokeWidth="1.2" />
          <path d="M17.5 25 H22.5 L25 27.5 V32.5 L22.5 35 H17.5 L15 32.5 V27.5 Z" fill={bloqueada ? "#52525b" : "#a7f3d0"} opacity="0.85" />
          <path d="M16 22 L17.5 25 M24 22 L22.5 25 M28 26 L25 27.5 M28 34 L25 32.5 M24 38 L22.5 35 M16 38 L17.5 35 M12 34 L15 32.5 M12 26 L15 27.5" stroke={traco} strokeWidth="0.6" />
        </g>
      ) : medalha === "diamante" ? (
        <g>
          <path d="M13 25 L16.5 21.5 H23.5 L27 25 L20 39 Z" fill={bloqueada ? "#3f3f46" : "#f0fdff"} stroke={traco} strokeWidth="1" />
          <path d="M13 25 H27 M16.5 21.5 L18.3 25 L20 39 M23.5 21.5 L21.7 25 L20 39 M18.3 25 L20 21.5 L21.7 25" fill="none" stroke={traco} strokeWidth="0.8" />
          {!bloqueada ? <path d="M15.5 25 L18.3 25 L19.5 33 Z" fill="#a5f3fc" opacity="0.8" /> : null}
        </g>
      ) : medalha === "platina" ? (
        <path d="M20 20.5 L22 28 L29.5 30 L22 32 L20 39.5 L18 32 L10.5 30 L18 28 Z" fill="#ffffff" fillOpacity={bloqueada ? 0.25 : 0.9} />
      ) : (
        <path
          d="M20 23 L22.2 27.6 L27 28.2 L23.5 31.5 L24.4 36.3 L20 34 L15.6 36.3 L16.5 31.5 L13 28.2 L17.8 27.6 Z"
          fill="#ffffff"
          fillOpacity={bloqueada ? 0.25 : 0.85}
        />
      )}

      {brilhoExtra ? (
        <>
          <path d="M8 26 A13 13 0 0 1 22 17 L20 22 A8 8 0 0 0 12 27 Z" fill={`url(#reflexo-${uid})`} />
          <g fill="#ffffff" className="motion-safe:animate-pulse">
            <path d="M34 16 L35.3 19.2 L38.5 20.5 L35.3 21.8 L34 25 L32.7 21.8 L29.5 20.5 L32.7 19.2 Z" />
            <path d="M5 38 L5.9 40.1 L8 41 L5.9 41.9 L5 44 L4.1 41.9 L2 41 L4.1 40.1 Z" />
            <circle cx="36" cy="40" r="1.2" />
            <circle cx="3" cy="22" r="1" />
          </g>
        </>
      ) : medalha === "platina" && !bloqueada ? (
        <g fill="#ffffff">
          <path d="M31 17 L32 19.5 L34.5 20.5 L32 21.5 L31 24 L30 21.5 L27.5 20.5 L30 19.5 Z" />
        </g>
      ) : null}
    </svg>
  );
}
