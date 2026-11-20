"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChamaDias, nivelDaChama } from "@/components/layout/ChamaDias";
import { useSessao } from "@/hooks/useSessao";
import {
  dataDeHojeEmBrasilia,
  registrarEContarAcessos,
  type DiasDeAcesso,
} from "@/lib/supabase/acessos-remoto";

const INTERVALO_CONFERENCIA_MS = 5 * 60 * 1000;

export function ContadorDias({ className = "" }: { className?: string }) {
  const { usuario } = useSessao();
  const userId = usuario?.id;
  const [dias, setDias] = useState<DiasDeAcesso | null>(null);
  const diaRegistrado = useRef<string | null>(null);

  const registrar = useCallback(
    async (forcar = false) => {
      if (!userId) return;
      const hoje = dataDeHojeEmBrasilia();
      if (!forcar && diaRegistrado.current === hoje) return;
      const resultado = await registrarEContarAcessos(userId);
      if (resultado) {
        diaRegistrado.current = resultado.hoje || hoje;
        setDias(resultado);
      }
    },
    [userId],
  );

  useEffect(() => {
    diaRegistrado.current = null;
    setDias(null);
    if (!userId) return;

    void registrar(true);

    const aoVoltar = () => {
      if (document.visibilityState === "visible") void registrar();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    window.addEventListener("focus", aoVoltar);
    const intervalo = window.setInterval(() => void registrar(), INTERVALO_CONFERENCIA_MS);

    return () => {
      document.removeEventListener("visibilitychange", aoVoltar);
      window.removeEventListener("focus", aoVoltar);
      window.clearInterval(intervalo);
    };
  }, [userId, registrar]);

  if (!userId || !dias) return null;

  const texto = `${dias.total} ${dias.total === 1 ? "dia" : "dias"}`;
  const nivel = nivelDaChama(dias.total);
  const nomeNivel = ["", "faísca", "chama", "chama média", "chama forte", "fogo intenso", "fogo lendário"][nivel];
  const detalhe = `Você já entrou no Integra Jovem em ${texto} no total (${nomeNivel}!). Cada dia logado soma +1, e os dias nunca são zerados.`;

  return (
    <span
      title={detalhe}
      aria-label={detalhe}
      className={`inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-foreground ${className}`}
    >
      <ChamaDias dias={dias.total} />
      {texto}
    </span>
  );
}
