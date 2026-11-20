"use client";

import { Award, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { EmblemaConquista } from "@/components/conquistas/EmblemaConquista";
import { useConquistas } from "@/hooks/useConquistas";
import { useSessao } from "@/hooks/useSessao";
import {
  carregarEstatisticasConquistas,
  type EstatisticasConquistas,
} from "@/lib/supabase/conquistas-remoto";

function textoPercentual(qtd: number, total: number): string {
  if (total <= 0) return "0%";
  const pct = (qtd / total) * 100;
  if (pct > 0 && pct < 1) return "menos de 1%";
  return `${Math.round(pct)}%`;
}

function emblemasNovos(chave: string, conquistadas: string[]): string[] {
  try {
    const bruto = window.localStorage.getItem(chave);
    window.localStorage.setItem(chave, JSON.stringify(conquistadas));
    if (bruto === null) return [];
    const vistas = new Set<string>(JSON.parse(bruto) as string[]);
    return conquistadas.filter((id) => !vistas.has(id));
  } catch {
    return [];
  }
}

export function MinhasConquistas({ className = "" }: { className?: string }) {
  const { conquistas, carregando } = useConquistas();
  const { usuario, carregando: carregandoSessao } = useSessao();
  const feitas = conquistas.filter((c) => c.conquistada).length;
  const [novas, setNovas] = useState<string[]>([]);

  useEffect(() => {
    if (carregando || carregandoSessao) return;
    const chave = `integra-jovem:conquistas-vistas:${usuario?.id ?? "visitante"}`;
    setNovas(emblemasNovos(chave, conquistas.filter((c) => c.conquistada).map((c) => c.id)));

  }, [carregando, carregandoSessao, usuario?.id]);

  const titulosNovos = conquistas.filter((c) => novas.includes(c.id)).map((c) => c.titulo);

  const ordenadas = [...conquistas].sort((a, b) => {
    if (a.conquistada !== b.conquistada) return a.conquistada ? -1 : 1;
    return b.atual / b.meta - a.atual / a.meta;
  });

  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasConquistas | null>(null);

  useEffect(() => {
    let cancelado = false;
    carregarEstatisticasConquistas().then((e) => {
      if (!cancelado) setEstatisticas(e);
    });
    return () => {
      cancelado = true;
    };
  }, []);
  const detalhe = conquistas.find((c) => c.id === selecionada) ?? null;

  return (

    <div className={`relative ${className}`}>
      <section
        aria-label="Minhas conquistas"
        className="flex flex-col rounded-2xl border border-border bg-surface p-5 lg:absolute lg:inset-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="eyebrow flex items-center gap-2">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            Minhas conquistas
          </p>
          <span className="font-mono text-[11px] text-subtle-foreground">
            {carregando ? "…" : `${feitas} de ${conquistas.length}`}
          </span>
        </div>

        {titulosNovos.length > 0 ? (
          <div
            role="status"
            className="mt-3 flex items-start gap-2 rounded-xl border border-primary/50 bg-primary-dim p-2.5"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <p className="flex-1 text-[12px]">
              <span className="font-bold">
                {titulosNovos.length === 1 ? "Novo emblema: " : "Novos emblemas: "}
              </span>
              {titulosNovos.join(", ")}
            </p>
            <button
              type="button"
              onClick={() => setNovas([])}
              aria-label="Fechar aviso"
              className="rounded-md p-0.5 text-subtle-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <ul className="mt-3 grid min-h-0 flex-1 grid-cols-4 content-start gap-2 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-4">
          {ordenadas.map((c) => {
            const conquistada = c.conquistada && !carregando;
            const ativa = selecionada === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelecionada(ativa ? null : c.id)}
                  title={`${c.titulo}: ${c.descricao}`}
                  aria-pressed={ativa}
                  className={`flex w-full flex-col items-center rounded-xl border p-2 text-center transition-colors ${
                    ativa
                      ? "border-primary bg-primary-dim"
                      : conquistada
                        ? "border-primary/30 bg-primary-dim/60 hover:border-primary/60"
                        : "border-border bg-surface-hi hover:border-primary/30"
                  }`}
                >
                  <EmblemaConquista
                    id={c.id}
                    categoria={c.categoria}
                    conquistada={conquistada}
                    className="h-10 w-10"
                  />
                  <span
                    className={`mt-1.5 line-clamp-2 break-words text-[9px] font-semibold min-[360px]:text-[10px] leading-tight ${
                      conquistada ? "" : "text-muted-foreground"
                    }`}
                  >
                    {c.titulo}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 min-h-[64px] rounded-xl border border-border bg-surface-hi p-3">
          {detalhe ? (
            <>
              <p className="text-[12px] font-bold">
                {detalhe.titulo}
                {detalhe.conquistada && !carregando ? (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-primary">
                    Conquistado
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{detalhe.descricao}</p>
              {estatisticas ? (
                estatisticas.totalUsuarios >= estatisticas.minimo ? (
                  (() => {
                    const qtd = estatisticas.porConquista[detalhe.id] ?? 0;
                    const pct = Math.min(100, (qtd / estatisticas.totalUsuarios) * 100);
                    return (
                      <div className="mt-2">
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="text-muted-foreground">
                            {qtd === 0
                              ? "Ninguém conquistou ainda. Seja o primeiro!"
                              : `${textoPercentual(qtd, estatisticas.totalUsuarios)} dos usuários conquistaram`}
                          </span>
                          <span className="font-mono text-[10px] text-subtle-foreground">
                            {qtd}/{estatisticas.totalUsuarios}
                          </span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full bg-sky-400/70" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="mt-2 text-[10.5px] text-subtle-foreground">
                    A porcentagem de usuários aparece quando o site tiver pelo menos {estatisticas.minimo}{" "}
                    pessoas cadastradas.
                  </p>
                )
              ) : null}
              {!detalhe.conquistada && detalhe.meta > 1 ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${Math.round((detalhe.atual / detalhe.meta) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-subtle-foreground">
                    {detalhe.atual} / {detalhe.meta}
                  </span>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-[11px] text-subtle-foreground">
              Toque num emblema para ver como conquistar.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
