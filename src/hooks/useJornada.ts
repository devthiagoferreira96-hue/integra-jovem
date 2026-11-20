"use client";

import { useEffect, useState } from "react";

import { useSessao } from "@/hooks/useSessao";
import { montarJornada, type Jornada } from "@/lib/jornada";
import { carregarProgresso, carregarResultadosQuiz } from "@/lib/progresso";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";
import { carregarResultadosQuizRemoto } from "@/lib/supabase/quiz-remoto";

export function useJornada(): Jornada & { carregando: boolean } {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [jornada, setJornada] = useState<Jornada>(() => montarJornada({}, []));
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const [overlay, quiz] = userId
        ? await Promise.all([carregarProgressoRemoto(userId), carregarResultadosQuizRemoto(userId)])
        : [carregarProgresso(), carregarResultadosQuiz()];
      if (!cancelado) {
        setJornada(montarJornada(overlay, quiz));
        setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  return { ...jornada, carregando };
}
