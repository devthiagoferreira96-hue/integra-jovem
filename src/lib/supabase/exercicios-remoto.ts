"use client";

import type { Exercicio, ExercicioUsuario, TipoAcao } from "@/lib/exercicios";
import { createClient } from "@/lib/supabase/client";

export async function carregarExerciciosRemoto(userId: string): Promise<ExercicioUsuario[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("exercicios_usuario")
    .select("exercicio_id, tipo, iniciado_em, concluido_em")
    .eq("user_id", userId);

  if (error || !data) {
    console.error("[exercicios-remoto] falha ao carregar exercicios_usuario:", error?.message);
    return [];
  }
  return data.map((linha) => ({
    id: linha.exercicio_id as string,
    tipo: linha.tipo as TipoAcao,
    iniciadoEm: linha.iniciado_em as string,
    concluidoEm: (linha.concluido_em as string | null) ?? null,
  }));
}

export async function iniciarExercicioRemoto(userId: string, exercicio: Exercicio): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("exercicios_usuario")
    .upsert(
      { user_id: userId, exercicio_id: exercicio.id, tipo: exercicio.tipo },
      { onConflict: "user_id,exercicio_id", ignoreDuplicates: true },
    );

  if (error) {
    console.error("[exercicios-remoto] falha ao iniciar exercício:", error.message);
  }
  return !error;
}

export async function cancelarExercicioRemoto(userId: string, exercicioId: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("exercicios_usuario")
    .delete()
    .eq("user_id", userId)
    .eq("exercicio_id", exercicioId)
    .is("concluido_em", null);

  if (error) {
    console.error("[exercicios-remoto] falha ao cancelar exercício:", error.message);
  }
  return !error;
}
