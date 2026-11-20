"use client";

import type { LinkResposta, Tema } from "@/lib/assistente";
import { createClient } from "@/lib/supabase/client";

type Linha = {
  id: string;
  sugestao: string;
  palavras: unknown;
  resposta: string;
  links: unknown;
  fonte_rotulo: string | null;
  fonte_url: string | null;
  sugerir?: boolean | null;
};

export async function carregarTemasRemoto(): Promise<Tema[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("assistente_temas")
    .select("id, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir")
    .order("ordem", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error("[assistente-remoto] falha ao carregar temas:", error.message);
    return null;
  }

  return (data as Linha[]).map((l) => ({
    id: l.id,
    sugestao: l.sugestao,
    palavras: Array.isArray(l.palavras) ? l.palavras.map(String) : [],
    resposta: l.resposta,
    links: Array.isArray(l.links)
      ? (l.links as LinkResposta[]).filter((x) => typeof x?.href === "string" && x.href.startsWith("/"))
      : [],
    fonte:
      l.fonte_rotulo && l.fonte_url && l.fonte_url.startsWith("https://")
        ? { rotulo: l.fonte_rotulo, url: l.fonte_url }
        : undefined,

    sugerir: l.sugerir !== false,
  }));
}
