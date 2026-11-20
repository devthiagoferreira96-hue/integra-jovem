"use client";

import { TIPOS_UNICOS, type Memoria, type NovaMemoria, type TipoMemoria } from "@/lib/assistente-memoria";
import { createClient } from "@/lib/supabase/client";

export async function carregarMemoriasRemoto(userId: string): Promise<Memoria[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("assistente_memorias")
    .select("id, tipo, texto, valor, criado_em")
    .eq("user_id", userId)
    .order("criado_em", { ascending: true });
  if (error || !data) {
    if (error) console.error("[assistente-memoria] falha ao carregar:", error.message);
    return [];
  }
  return data.map((l) => ({
    id: String(l.id),
    tipo: l.tipo as TipoMemoria,
    texto: l.texto as string,
    valor: l.valor === null ? null : Number(l.valor),
    criadoEm: l.criado_em as string,
  }));
}

export async function salvarMemoriaRemoto(userId: string, nova: NovaMemoria): Promise<Memoria | null> {
  const supabase = createClient();
  if (!supabase) return null;
  if (TIPOS_UNICOS.includes(nova.tipo)) {
    await supabase.from("assistente_memorias").delete().eq("user_id", userId).eq("tipo", nova.tipo);
  } else {
    await supabase
      .from("assistente_memorias")
      .delete()
      .eq("user_id", userId)
      .eq("tipo", nova.tipo)

      .eq("texto", nova.texto);
  }
  const { data, error } = await supabase
    .from("assistente_memorias")
    .insert({ user_id: userId, tipo: nova.tipo, texto: nova.texto.slice(0, 120), valor: nova.valor })
    .select("id, tipo, texto, valor, criado_em")
    .single();
  if (error || !data) {
    if (error) console.error("[assistente-memoria] falha ao salvar:", error.message);
    return null;
  }
  return {
    id: String(data.id),
    tipo: data.tipo as TipoMemoria,
    texto: data.texto as string,
    valor: data.valor === null ? null : Number(data.valor),
    criadoEm: data.criado_em as string,
  };
}

export async function removerMemoriasRemoto(
  userId: string,
  filtro: { id?: string; tipo?: TipoMemoria } = {},
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;
  let consulta = supabase.from("assistente_memorias").delete().eq("user_id", userId);
  if (filtro.id) consulta = consulta.eq("id", filtro.id);
  if (filtro.tipo) consulta = consulta.eq("tipo", filtro.tipo);
  const { error } = await consulta;
  if (error) console.error("[assistente-memoria] falha ao apagar:", error.message);
  return !error;
}
