"use client";

export type NivelChama = 1 | 2 | 3 | 4 | 5 | 6;

export function nivelDaChama(dias: number): NivelChama {
  if (dias >= 100) return 6;
  if (dias >= 30) return 5;
  if (dias >= 15) return 4;
  if (dias >= 7) return 3;
  if (dias >= 3) return 2;
  return 1;
}

const ESTILOS: Record<
  NivelChama,
  { tamanho: number; corExterna: string; corInterna: string; corBase: string; brilho: number; velocidade: number }
> = {
  1: { tamanho: 16, corExterna: "#f59e0b", corInterna: "#fcd34d", corBase: "#f59e0b", brilho: 0, velocidade: 2.4 },
  2: { tamanho: 18, corExterna: "#f97316", corInterna: "#fde047", corBase: "#f97316", brilho: 1, velocidade: 2.1 },
  3: { tamanho: 20, corExterna: "#f97316", corInterna: "#fbbf24", corBase: "#ea580c", brilho: 2, velocidade: 1.8 },
  4: { tamanho: 22, corExterna: "#ef4444", corInterna: "#fbbf24", corBase: "#f97316", brilho: 3, velocidade: 1.5 },
  5: { tamanho: 25, corExterna: "#ef4444", corInterna: "#fde047", corBase: "#3b82f6", brilho: 4, velocidade: 1.2 },
  6: { tamanho: 28, corExterna: "#f43f5e", corInterna: "#fef08a", corBase: "#2563eb", brilho: 6, velocidade: 1.0 },
};

export function ChamaDias({ dias, className = "" }: { dias: number; className?: string }) {
  const nivel = nivelDaChama(dias);
  const e = ESTILOS[nivel];
  const id = `chama-${nivel}`;

  return (
    <span className={`relative inline-grid place-items-center ${className}`} style={{ width: e.tamanho, height: e.tamanho }}>

      {e.brilho >= 4 ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${e.corBase}66 0%, transparent 70%)`,
            animation: `chama-aura ${e.velocidade * 1.4}s ease-in-out infinite`,
          }}
        />
      ) : null}

      <svg
        viewBox="0 0 24 24"
        width={e.tamanho}
        height={e.tamanho}
        className="relative"
        style={{ filter: e.brilho ? `drop-shadow(0 0 ${e.brilho}px ${e.corExterna}aa)` : undefined }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-ext`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={e.corBase} />
            <stop offset="60%" stopColor={e.corExterna} />
            <stop offset="100%" stopColor={e.corInterna} />
          </linearGradient>
        </defs>

        <path
          d="M12 2c2 3 5 5 5 9a5 5 0 0 1-10 0c0-1.6.8-3 2-4-.3 1.3.3 2.4 1 3 .5-2 .5-5 2-8z"
          fill={`url(#${id}-ext)`}
          style={{ transformOrigin: "12px 18px", animation: `chama-dancar ${e.velocidade}s ease-in-out infinite` }}
        />

        <path
          d="M12 9c1 1.6 2.2 2.6 2.2 4.4a2.2 2.2 0 0 1-4.4 0c0-1.2 1-2.2 2.2-4.4z"
          fill={e.corInterna}
          style={{ transformOrigin: "12px 17px", animation: `chama-dancar ${e.velocidade * 0.8}s ease-in-out infinite reverse` }}
        />

        {e.brilho >= 3 ? (
          <>
            <circle cx="8" cy="7" r="0.7" fill={e.corInterna} style={{ animation: `chama-fagulha ${e.velocidade * 1.3}s ease-out infinite` }} />
            <circle cx="16" cy="6" r="0.6" fill={e.corInterna} style={{ animation: `chama-fagulha ${e.velocidade * 1.6}s ease-out infinite 0.4s` }} />
          </>
        ) : null}
        {e.brilho >= 6 ? (
          <circle cx="12" cy="3" r="0.8" fill="#fde68a" style={{ animation: `chama-fagulha ${e.velocidade * 1.1}s ease-out infinite 0.8s` }} />
        ) : null}
      </svg>

      <style>{`
        @keyframes chama-dancar {
          0%, 100% { transform: scaleY(1) scaleX(1) rotate(-1deg); }
          50% { transform: scaleY(1.12) scaleX(0.94) rotate(1deg); }
        }
        @keyframes chama-aura {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.18); }
        }
        @keyframes chama-fagulha {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-6px) scale(0.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="chama-"] { animation: none !important; }
        }
      `}</style>
    </span>
  );
}
