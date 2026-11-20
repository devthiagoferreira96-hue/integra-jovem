"use client";

import { createClient } from "@/lib/supabase/client";

export type DiasDeAcesso = {

  total: number;

  sequencia: number;

  hoje: string;
};

export async function registrarEContarAcessos(userId: string): Promise<DiasDeAcesso | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("registrar_acesso");
  if (!error && data) {
    const r = data as { total?: number; sequencia?: number; hoje?: string };
    return { total: Number(r.total ?? 0), sequencia: Number(r.sequencia ?? 0), hoje: String(r.hoje ?? "") };
  }
  if (error) console.error("[acessos] registrar_acesso falhou, usando o modo antigo:", error.message);
  return registrarModoAntigo(userId);
}

async function registrarModoAntigo(userId: string): Promise<DiasDeAcesso | null> {
  const supabase = createClient();
  if (!supabase) return null;

  await supabase.from("acessos_usuario").upsert({ user_id: userId }, { onConflict: "user_id,dia", ignoreDuplicates: true });
  const { data, error, count } = await supabase
    .from("acessos_usuario")
    .select("dia", { count: "exact" })
    .eq("user_id", userId)
    .order("dia", { ascending: false })
    .limit(400);
  if (error || !data) return null;

  const dias = data.map((l) => String(l.dia));
  const hoje = dataDeHojeEmBrasilia();

  let sequencia = dias[0] === hoje ? 1 : 0;
  for (let i = 1; sequencia > 0 && i < dias.length; i += 1) {
    const diferenca = Math.round(
      (new Date(`${dias[i - 1]}T12:00:00`).getTime() - new Date(`${dias[i]}T12:00:00`).getTime()) / 86_400_000,
    );
    if (diferenca !== 1) break;
    sequencia += 1;
  }
  return { total: count ?? dias.length, sequencia, hoje };
}

export function dataDeHojeEmBrasilia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
