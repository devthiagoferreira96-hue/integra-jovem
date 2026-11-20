"use client";

import { createClient } from "@/lib/supabase/client";
import type { Meta, Reflexao } from "@/lib/metas-reflexoes";

export async function carregarMetasRemoto(userId: string): Promise<Meta[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("metas_pessoais")
    .select("id, titulo, prazo, progresso, criado_em")
    .eq("user_id", userId)
    .order("criado_em", { ascending: false });

  if (error || !data) return [];

  return data.map((linha) => ({
    id: linha.id as string,
    titulo: linha.titulo as string,
    prazo: (linha.prazo as string | null) ?? "",
    progresso: linha.progresso as number,
    criadoEm: linha.criado_em as string,
  }));
}

export async function inserirMetaRemoto(userId: string, meta: Meta): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("metas_pessoais").insert({
    id: meta.id,
    user_id: userId,
    titulo: meta.titulo,
    prazo: meta.prazo || null,
    progresso: meta.progresso,
    criado_em: meta.criadoEm,
  });

  return !error;
}

export async function carregarReflexoesRemoto(userId: string): Promise<Reflexao[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("diario_reflexoes")
    .select("id, pergunta, texto, criado_em")
    .eq("user_id", userId)
    .order("criado_em", { ascending: false });

  if (error || !data) return [];

  return data.map((linha) => ({
    id: linha.id as string,
    pergunta: linha.pergunta as string,
    texto: linha.texto as string,
    criadoEm: linha.criado_em as string,
  }));
}

export async function inserirReflexaoRemoto(userId: string, reflexao: Reflexao): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("diario_reflexoes").insert({
    id: reflexao.id,
    user_id: userId,
    pergunta: reflexao.pergunta,
    texto: reflexao.texto,
    criado_em: reflexao.criadoEm,
  });

  return !error;
}
