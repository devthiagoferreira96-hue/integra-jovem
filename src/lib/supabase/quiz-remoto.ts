"use client";

import { createClient } from "@/lib/supabase/client";
import type { ResultadoQuiz } from "@/lib/progresso";

export async function carregarResultadosQuizRemoto(userId: string): Promise<ResultadoQuiz[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("resultados_quiz")
    .select("curso_slug, acertos, total, criado_em")
    .eq("user_id", userId);

  if (error) {
    console.error("[quiz-remoto] falha ao carregar resultados_quiz:", error.message);
  }
  if (error || !data) return [];

  return data.map((linha) => ({
    cursoSlug: linha.curso_slug as string,
    acertos: linha.acertos as number,
    total: linha.total as number,
    data: linha.criado_em as string,
  }));
}

export async function salvarResultadoQuizRemoto(
  userId: string,
  resultado: ResultadoQuiz,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("resultados_quiz").upsert(
    {
      user_id: userId,
      curso_slug: resultado.cursoSlug,
      acertos: resultado.acertos,
      total: resultado.total,
      criado_em: resultado.data,
    },
    { onConflict: "user_id,curso_slug" },
  );

  if (error) {
    console.error("[quiz-remoto] falha ao gravar resultados_quiz:", error.message);
  }

  return !error;
}
