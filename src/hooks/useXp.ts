"use client";

import { useCallback, useEffect, useState } from "react";

import { useSessao } from "@/hooks/useSessao";
import {
  carregarExerciciosLocal,
  exerciciosConcluidosValidos,
  type ExercicioUsuario,
} from "@/lib/exercicios";
import { carregarProgresso, type ResultadoQuiz } from "@/lib/progresso";
import { carregarExerciciosRemoto } from "@/lib/supabase/exercicios-remoto";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";
import { carregarBonusRemoto, carregarPrimeirasTentativasRemoto } from "@/lib/supabase/xp-remoto";
import {
  calcularXp,
  carregarBonusLocal,
  carregarPrimeirasTentativasLocal,
  type BonusId,
  type ExtratoXp,
} from "@/lib/xp";

export type DadosXp = {
  primeirasTentativas: ResultadoQuiz[];
  bonusConquistados: BonusId[];
  exerciciosUsuario: ExercicioUsuario[];
  exerciciosConcluidos: string[];
};

export async function carregarDadosXp(userId: string | undefined): Promise<DadosXp> {
  if (userId) {
    const [primeirasTentativas, bonusConquistados, exerciciosUsuario] = await Promise.all([
      carregarPrimeirasTentativasRemoto(userId),
      carregarBonusRemoto(userId),
      carregarExerciciosRemoto(userId),
    ]);
    return {
      primeirasTentativas,
      bonusConquistados,
      exerciciosUsuario,
      exerciciosConcluidos: exerciciosConcluidosValidos(exerciciosUsuario),
    };
  }
  const exerciciosUsuario = carregarExerciciosLocal();
  return {
    primeirasTentativas: carregarPrimeirasTentativasLocal(),
    bonusConquistados: carregarBonusLocal(),
    exerciciosUsuario,
    exerciciosConcluidos: exerciciosConcluidosValidos(exerciciosUsuario),
  };
}

export function useXp(): ExtratoXp & { carregando: boolean; recarregar: () => void } {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [extrato, setExtrato] = useState<ExtratoXp>(() =>
    calcularXp({ overlay: {}, primeirasTentativas: [], bonusConquistados: [] }),
  );
  const [carregando, setCarregando] = useState(true);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const [overlay, dados] = await Promise.all([
        userId ? carregarProgressoRemoto(userId) : Promise.resolve(carregarProgresso()),
        carregarDadosXp(userId),
      ]);
      if (cancelado) return;
      setExtrato(calcularXp({ overlay, ...dados }));
      setCarregando(false);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return { ...extrato, carregando, recarregar };
}
