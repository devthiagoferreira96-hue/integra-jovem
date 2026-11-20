"use client";

import { createClient } from "@/lib/supabase/client";

export type MensagemSalva = {
  id: number;
  autor: "usuario" | "assistente";
  texto: string;
  temaId: string | null;
};

export const LIMITE_HISTORICO = 100;

export async function carregarConversa(userId: string): Promise<MensagemSalva[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("assistente_mensagens")
    .select("id, autor, texto, tema_id")
    .eq("user_id", userId)
    .order("id", { ascending: true })
    .limit(LIMITE_HISTORICO);

  if (error || !data) {
    if (error) console.error("[assistente-conversa] falha ao carregar:", error.message);
    return [];
  }
  return data.map((l) => ({
    id: l.id as number,
    autor: l.autor as "usuario" | "assistente",
    texto: l.texto as string,
    temaId: (l.tema_id as string | null) ?? null,
  }));
}

export async function salvarMensagens(
  userId: string,
  mensagens: { autor: "usuario" | "assistente"; texto: string; temaId?: string }[],
): Promise<void> {
  const supabase = createClient();
  if (!supabase || mensagens.length === 0) return;

  const { error } = await supabase.from("assistente_mensagens").insert(
    mensagens.map((m) => ({
      user_id: userId,
      autor: m.autor,
      texto: m.texto.slice(0, 2000),
      tema_id: m.temaId ?? null,
    })),
  );
  if (error) console.error("[assistente-conversa] falha ao salvar:", error.message);
}

export async function limparConversa(userId: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("assistente_mensagens").delete().eq("user_id", userId);
  if (error) console.error("[assistente-conversa] falha ao limpar:", error.message);
  return !error;
}
