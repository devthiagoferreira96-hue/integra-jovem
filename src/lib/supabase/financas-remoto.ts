"use client";

import { createClient } from "@/lib/supabase/client";
import type { CategoriaCustom, Gasto, RendaPorMes } from "@/lib/financas";

export async function carregarGastosRemoto(userId: string): Promise<Gasto[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gastos")
    .select("id, categoria, valor, mes, observacao, criado_em")
    .eq("user_id", userId)
    .order("criado_em", { ascending: true });

  if (error || !data) return [];

  return data.map((linha) => ({
    id: linha.id as string,
    categoria: linha.categoria as string,
    valor: Number(linha.valor),
    mes: linha.mes as string,
    criadoEm: linha.criado_em as string,
    observacao: (linha.observacao as string | null) ?? undefined,
  }));
}

export async function inserirGastoRemoto(userId: string, gasto: Gasto): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("gastos").insert({
    id: gasto.id,
    user_id: userId,
    categoria: gasto.categoria,
    valor: gasto.valor,
    mes: gasto.mes,
    observacao: gasto.observacao ?? null,
    criado_em: gasto.criadoEm,
  });

  return !error;
}

export async function removerGastoRemoto(userId: string, id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("gastos").delete().eq("user_id", userId).eq("id", id);
  return !error;
}

export async function carregarRendasRemoto(userId: string): Promise<RendaPorMes> {
  const supabase = createClient();
  if (!supabase) return {};

  const { data, error } = await supabase.from("rendas").select("mes, valor").eq("user_id", userId);
  if (error || !data) return {};

  const rendas: RendaPorMes = {};
  data.forEach((linha) => {
    rendas[linha.mes as string] = Number(linha.valor);
  });
  return rendas;
}

export async function definirRendaRemoto(
  userId: string,
  mes: string,
  valor: number,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("rendas")
    .upsert({ user_id: userId, mes, valor }, { onConflict: "user_id,mes" });

  return !error;
}

export async function carregarMetaReservaRemoto(userId: string): Promise<number | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("metas_reserva")
    .select("valor")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return Number(data.valor);
}

export async function definirMetaReservaRemoto(userId: string, valor: number): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("metas_reserva")
    .upsert({ user_id: userId, valor }, { onConflict: "user_id" });

  return !error;
}

export async function carregarCategoriasCustomRemoto(userId: string): Promise<CategoriaCustom[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categorias_custom")
    .select("id, label, cor")
    .eq("user_id", userId);

  if (error || !data) return [];
  return data.map((linha) => ({
    id: linha.id as string,
    label: linha.label as string,
    cor: linha.cor as string,
  }));
}

export async function inserirCategoriaCustomRemoto(
  userId: string,
  categoria: CategoriaCustom,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("categorias_custom").insert({
    id: categoria.id,
    user_id: userId,
    label: categoria.label,
    cor: categoria.cor,
  });

  return !error;
}

export async function renomearCategoriaCustomRemoto(
  userId: string,
  id: string,
  label: string,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("categorias_custom")
    .update({ label })
    .eq("user_id", userId)
    .eq("id", id);

  return !error;
}

export async function removerCategoriaCustomRemoto(userId: string, id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("categorias_custom")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);

  return !error;
}

export async function limparDadosFinancasRemoto(userId: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  await Promise.all([
    supabase.from("gastos").delete().eq("user_id", userId),
    supabase.from("rendas").delete().eq("user_id", userId),
    supabase.from("metas_reserva").delete().eq("user_id", userId),
    supabase.from("categorias_custom").delete().eq("user_id", userId),
  ]);
}
