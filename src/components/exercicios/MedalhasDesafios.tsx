"use client";

import { Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IconeMedalha } from "@/components/exercicios/IconeMedalha";
import { carregarDadosXp } from "@/hooks/useXp";
import { useSessao } from "@/hooks/useSessao";
import { exercicios } from "@/lib/exercicios";
import {
  contarMedalhas,
  faixaDeTempo,
  formatarDuracao,
  infoMedalha,
  ORDEM_MEDALHAS,
  resultadosDosExercicios,
  type ResultadoExercicio,
} from "@/lib/medalhas";
import { hrefDoBloco } from "@/lib/retorno-trilha";

export function MedalhasDesafios() {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [resultados, setResultados] = useState<ResultadoExercicio[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;
    carregarDadosXp(userId).then(({ exerciciosUsuario }) => {
      if (cancelado) return;
      setResultados(resultadosDosExercicios(exerciciosUsuario));
      setCarregando(false);
    });
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  const contagem = contarMedalhas(resultados);

  return (
    <section aria-label="Medalhas dos desafios" className="mt-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow flex items-center gap-2">
          <Timer className="h-3.5 w-3.5" aria-hidden="true" />
          Medalhas dos desafios
        </p>
        <span className="font-mono text-[11px] text-subtle-foreground">
          {carregando ? "…" : `${resultados.length} de ${exercicios.length} exercícios`}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {ORDEM_MEDALHAS.map((m) => {
          const qtd = contagem[m];
          const brilho = infoMedalha[m].brilhoExtra && qtd > 0;
          return (
            <div
              key={m}
              className={`flex flex-col items-center rounded-xl border p-3 text-center ${
                brilho ? "border-primary/40 bg-primary-dim" : "border-border bg-surface-hi"
              }`}
            >
              <IconeMedalha medalha={m} bloqueada={!carregando && qtd === 0} className="h-14 w-14" />
              <p className="mt-1 font-display text-xl font-extrabold">{carregando ? "–" : qtd}</p>
              <p className="text-[11px] font-semibold">{infoMedalha[m].nome}</p>
              <p className="font-mono text-[10px] text-subtle-foreground">{faixaDeTempo(m)}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[12px] text-muted-foreground">
        O tempo conta do “Começar exercício” até a conclusão. Quanto mais rápido, melhor a medalha, mas sem
        pressa: todo exercício concluído vale XP e ganha pelo menos bronze.
      </p>

      {resultados.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {resultados.slice(0, 6).map((r) => {
            const aulaId = r.exercicioId.split(":")[1] ?? "";
            return (
              <li key={r.exercicioId}>
                <Link
                  href={hrefDoBloco(r.cursoSlug, aulaId)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-hi px-3 py-2 hover:border-primary/40"
                >
                  <IconeMedalha medalha={r.medalha} className="h-8 w-7 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{r.bloco}</p>
                    <p className="truncate text-[11px] text-subtle-foreground">{r.trilha}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {formatarDuracao(r.duracaoMs)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : !carregando ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-center text-[12px] text-muted-foreground">
          Nenhum exercício concluído ainda. Procure o quadro amarelo “Exercício bônus” nos blocos das trilhas.
        </p>
      ) : null}
    </section>
  );
}
