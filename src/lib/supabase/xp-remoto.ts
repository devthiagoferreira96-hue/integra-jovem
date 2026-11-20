"use client";

import { createClient } from "@/lib/supabase/client";
import type { ResultadoQuiz } from "@/lib/progresso";
import { carregarResultadosQuizRemoto } from "@/lib/supabase/quiz-remoto";
import type { BonusId } from "@/lib/xp";

export async function carregarPrimeirasTentativasRemoto(userId: string): Promise<ResultadoQuiz[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("quiz_primeira_tentativa")
    .select("curso_slug, acertos, total, feito_em")
    .eq("user_id", userId);

  if (error || !data) {

    console.error("[xp-remoto] falha ao carregar quiz_primeira_tentativa:", error?.message);
    return carregarResultadosQuizRemoto(userId);
  }

  return data.map((linha) => ({
    cursoSlug: linha.curso_slug as string,
    acertos: linha.acertos as number,
    total: linha.total as number,
    data: linha.feito_em as string,
  }));
}

export async function carregarBonusRemoto(userId: string): Promise<BonusId[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("xp_bonus").select("bonus_id").eq("user_id", userId);

  if (error || !data) {
    console.error("[xp-remoto] falha ao carregar xp_bonus:", error?.message);
    return [];
  }
  return data.map((linha) => linha.bonus_id as BonusId);
}
