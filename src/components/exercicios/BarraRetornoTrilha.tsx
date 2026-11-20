"use client";

import { ArrowLeft, CheckCircle2, Dumbbell, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { carregarDadosXp } from "@/hooks/useXp";
import { useSessao } from "@/hooks/useSessao";
import { descreverRequisito, exercicios, XP_POR_EXERCICIO } from "@/lib/exercicios";
import { infoMedalha, resultadoDoExercicio, type ResultadoExercicio } from "@/lib/medalhas";
import { lerRetorno, limparRetorno, type RetornoTrilha } from "@/lib/retorno-trilha";

const INTERVALO_CONFERENCIA_MS = 4000;
const LIMITE_CONFERENCIA_MS = 15 * 60 * 1000;

export function BarraRetornoTrilha() {
  const pathname = usePathname();
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [retorno, setRetorno] = useState<RetornoTrilha | null>(null);
  const [concluido, setConcluido] = useState(false);
  const [resultado, setResultado] = useState<ResultadoExercicio | null>(null);

  const emFinancas = pathname?.startsWith("/financas") ?? false;

  useEffect(() => {
    const atualizar = () => setRetorno(lerRetorno());
    atualizar();
    window.addEventListener("integra-jovem:retorno-trilha", atualizar);
    return () => window.removeEventListener("integra-jovem:retorno-trilha", atualizar);
  }, [pathname]);

  const exercicio = retorno?.exercicioId
    ? exercicios.find((e) => e.id === retorno.exercicioId)
    : undefined;

  const conferir = useCallback(async () => {
    if (!exercicio) return;
    const { exerciciosUsuario } = await carregarDadosXp(userId);
    const feito = exerciciosUsuario.find((e) => e.id === exercicio.id && e.concluidoEm);
    if (feito) {
      setConcluido(true);
      setResultado(resultadoDoExercicio(feito));
    }
  }, [exercicio, userId]);

  useEffect(() => {
    setConcluido(false);
    setResultado(null);
    if (!emFinancas || !exercicio || carregandoSessao) return;
    const inicio = Date.now();
    void conferir();
    const timer = window.setInterval(() => {
      if (Date.now() - inicio > LIMITE_CONFERENCIA_MS) {
        window.clearInterval(timer);
        return;
      }
      if (document.visibilityState === "visible") void conferir();
    }, INTERVALO_CONFERENCIA_MS);
    return () => window.clearInterval(timer);
  }, [emFinancas, exercicio, carregandoSessao, conferir]);

  if (!emFinancas || !retorno) return null;

  const dados = exercicio ? descreverRequisito(exercicio.requisito) : [];

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 px-3 md:bottom-5">
      <div
        role="status"
        aria-live="polite"
        className={`mx-auto flex max-w-2xl flex-wrap items-center gap-3 rounded-2xl border p-3 shadow-lg backdrop-blur ${
          concluido
            ? "border-primary/60 bg-primary-dim/95"
            : "border-amber-300/50 bg-surface/95"
        }`}
      >
        <span className="shrink-0">
          {concluido ? (
            <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
          ) : (
            <Dumbbell className="h-5 w-5 text-amber-300" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold">
            {concluido
              ? `Exercício concluído! +${XP_POR_EXERCICIO} XP${
                  resultado ? ` · Medalha de ${infoMedalha[resultado.medalha].nome.toLowerCase()}` : ""
                }`
              : exercicio
                ? `Exercício: ${retorno.bloco}`
                : `Você veio do bloco “${retorno.bloco}”`}
          </p>
          {concluido ? (
            <p className="truncate text-[11px] text-muted-foreground">
              Volte para o bloco para continuar a trilha {retorno.trilha}.
            </p>
          ) : dados.length > 0 ? (
            <p className="truncate font-mono text-[11px] text-amber-100">{dados.join(" · ")}</p>
          ) : (
            <p className="truncate text-[11px] text-muted-foreground">Trilha {retorno.trilha}</p>
          )}
        </div>

        <Link
          href={retorno.href}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold ${
            concluido
              ? "bg-primary text-primary-foreground hover:bg-primary-light"
              : "border border-border bg-background/60 text-foreground hover:border-primary"
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Voltar para o bloco
        </Link>

        <button
          type="button"
          onClick={limparRetorno}
          aria-label="Fechar aviso"
          className="shrink-0 rounded-lg p-1 text-subtle-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
