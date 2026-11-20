"use client";

import type { MarcoId } from "@/lib/conquistas";
import { createClient } from "@/lib/supabase/client";

export async function carregarMarcosRemoto(userId: string): Promise<MarcoId[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("marcos_usuario")
    .select("marco_id")
    .eq("user_id", userId);

  if (error || !data) {
    console.error("[conquistas-remoto] falha ao carregar marcos_usuario:", error?.message);
    return [];
  }
  return data.map((linha) => linha.marco_id as MarcoId);
}

export async function registrarConquistasRemoto(userId: string, ids: string[]): Promise<void> {
  const supabase = createClient();
  if (!supabase || ids.length === 0) return;

  const { error } = await supabase
    .from("conquistas_usuario")
    .upsert(
      ids.map((conquista_id) => ({ user_id: userId, conquista_id })),
      { onConflict: "user_id,conquista_id", ignoreDuplicates: true },
    );
  if (error) console.error("[conquistas-remoto] falha ao registrar conquistas:", error.message);
}

export type EstatisticasConquistas = {
  totalUsuarios: number;
  minimo: number;

  porConquista: Record<string, number>;
};

export async function carregarEstatisticasConquistas(): Promise<EstatisticasConquistas | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("estatisticas_conquistas");
  if (error || !data) {
    console.error("[conquistas-remoto] falha ao carregar estatísticas:", error?.message);
    return null;
  }
  const bruto = data as { total_usuarios?: number; minimo?: number; por_conquista?: Record<string, number> };
  return {
    totalUsuarios: Number(bruto.total_usuarios ?? 0),
    minimo: Number(bruto.minimo ?? 5),
    porConquista: bruto.por_conquista ?? {},
  };
}
