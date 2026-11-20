"use client";

import { createClient } from "@/lib/supabase/client";
import type { SimulacaoCarteira, SimulacaoCDI, SimulacaoJuros } from "@/lib/simuladores";

const LIMITE_HISTORICO = 10;

export async function carregarHistoricoJurosRemoto(userId: string): Promise<SimulacaoJuros[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("simulacoes_juros")
    .select("id, valor_inicial, aporte_mensal, taxa_mensal, meses, total_final, juros_ganhos, criado_em")
    .eq("user_id", userId)
    .order("criado_em", { ascending: false })
    .limit(LIMITE_HISTORICO);

  if (error || !data) return [];

  return data.map((linha) => ({
    id: linha.id as string,
    data: linha.criado_em as string,
    valorInicial: Number(linha.valor_inicial),
    aporteMensal: Number(linha.aporte_mensal),
    taxaMensal: Number(linha.taxa_mensal),
    meses: linha.meses as number,
    totalFinal: Number(linha.total_final),
    jurosGanhos: Number(linha.juros_ganhos),
  }));
}

export async function inserirSimulacaoJurosRemoto(
  userId: string,
  simulacao: SimulacaoJuros,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("simulacoes_juros").insert({
    id: simulacao.id,
    user_id: userId,
    valor_inicial: simulacao.valorInicial,
    aporte_mensal: simulacao.aporteMensal,
    taxa_mensal: simulacao.taxaMensal,
    meses: simulacao.meses,
    total_final: simulacao.totalFinal,
    juros_ganhos: simulacao.jurosGanhos,
    criado_em: simulacao.data,
  });

  return !error;
}

export async function limparHistoricoJurosRemoto(userId: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  await supabase.from("simulacoes_juros").delete().eq("user_id", userId);
}

export async function carregarHistoricoCDIRemoto(userId: string): Promise<SimulacaoCDI[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("simulacoes_cdi")
    .select(
      "id, banco_id, banco_nome, tipo, percentual_cdi, cdi_anual, valor_inicial, aporte_mensal, meses, total_final, juros_ganhos, criado_em",
    )
    .eq("user_id", userId)
    .order("criado_em", { ascending: false })
    .limit(LIMITE_HISTORICO);

  if (error || !data) return [];

  return data.map((linha) => ({
    id: linha.id as string,
    data: linha.criado_em as string,
    bancoId: linha.banco_id as string,
    bancoNome: linha.banco_nome as string,
    tipo: linha.tipo as SimulacaoCDI["tipo"],
    percentualCDI: Number(linha.percentual_cdi),
    cdiAnual: Number(linha.cdi_anual),
    valorInicial: Number(linha.valor_inicial),
    aporteMensal: Number(linha.aporte_mensal),
    meses: linha.meses as number,
    totalFinal: Number(linha.total_final),
    jurosGanhos: Number(linha.juros_ganhos),
  }));
}

export async function inserirSimulacaoCDIRemoto(
  userId: string,
  simulacao: SimulacaoCDI,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("simulacoes_cdi").insert({
    id: simulacao.id,
    user_id: userId,
    banco_id: simulacao.bancoId,
    banco_nome: simulacao.bancoNome,
    tipo: simulacao.tipo,
    percentual_cdi: simulacao.percentualCDI,
    cdi_anual: simulacao.cdiAnual,
    valor_inicial: simulacao.valorInicial,
    aporte_mensal: simulacao.aporteMensal,
    meses: simulacao.meses,
    total_final: simulacao.totalFinal,
    juros_ganhos: simulacao.jurosGanhos,
    criado_em: simulacao.data,
  });

  return !error;
}

export async function limparHistoricoCDIRemoto(userId: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  await supabase.from("simulacoes_cdi").delete().eq("user_id", userId);
}

export async function carregarHistoricoCarteiraRemoto(userId: string): Promise<SimulacaoCarteira[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("simulacoes_carteira")
    .select("id, saldo_ficticio, percentual_renda_fixa, meses, resultado_esperado, criado_em")
    .eq("user_id", userId)
    .order("criado_em", { ascending: false })
    .limit(LIMITE_HISTORICO);

  if (error || !data) return [];

  return data.map((linha) => ({
    id: linha.id as string,
    data: linha.criado_em as string,
    saldoFicticio: Number(linha.saldo_ficticio),
    percentualRendaFixa: linha.percentual_renda_fixa as number,
    meses: linha.meses as number,
    resultadoEsperado: Number(linha.resultado_esperado),
  }));
}

export async function inserirSimulacaoCarteiraRemoto(
  userId: string,
  simulacao: SimulacaoCarteira,
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("simulacoes_carteira").insert({
    id: simulacao.id,
    user_id: userId,
    saldo_ficticio: simulacao.saldoFicticio,
    percentual_renda_fixa: simulacao.percentualRendaFixa,
    meses: simulacao.meses,
    resultado_esperado: simulacao.resultadoEsperado,
    criado_em: simulacao.data,
  });

  return !error;
}

export async function limparHistoricoCarteiraRemoto(userId: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  await supabase.from("simulacoes_carteira").delete().eq("user_id", userId);
}
