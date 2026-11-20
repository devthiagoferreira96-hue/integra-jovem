"use client";

import { createClient } from "@/lib/supabase/client";
import type { ProgressoOverlay } from "@/lib/progresso";

export async function carregarProgressoRemoto(userId: string): Promise<ProgressoOverlay> {
  const supabase = createClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("progresso_aulas")
    .select("curso_slug, aula_id, concluida")
    .eq("user_id", userId);

  if (error) {
    console.error("[progresso-remoto] Falha ao carregar progresso do Supabase:", error.message);
    return {};
  }
  if (!data) return {};

  const overlay: ProgressoOverlay = {};
  data.forEach((linha) => {
    const slug = linha.curso_slug as string;
    overlay[slug] = { ...overlay[slug], [linha.aula_id as string]: Boolean(linha.concluida) };
  });
  return overlay;
}

export async function definirConclusaoAulaRemoto(
  userId: string,
  cursoSlug: string,
  aulaId: string,
  concluida: boolean,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("progresso_aulas").upsert(
    {
      user_id: userId,
      curso_slug: cursoSlug,
      aula_id: aulaId,
      concluida,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "user_id,curso_slug,aula_id" },
  );

  if (error) {
    console.error("[progresso-remoto] Falha ao gravar conclusão de aula:", error.message);
  }

  return !error;
}
