"use client";

import { ArrowRight, CheckCircle2, Lock, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/AppButton";
import { GraficoOrcamentoQuiz } from "@/components/cursos/GraficoOrcamentoQuiz";
import { getCurso, proximaTrilha, type QuestaoQuiz } from "@/data/content";
import { useSessao } from "@/hooks/useSessao";
import { salvarResultadoQuiz, type ResultadoQuiz } from "@/lib/progresso";
import { salvarResultadoQuizRemoto } from "@/lib/supabase/quiz-remoto";
import { carregarDadosXp } from "@/hooks/useXp";
import {
  registrarPrimeiraTentativaLocal,
  XP_QUIZ_TUDO_CERTO,
  XP_QUIZ_UM_ERRO,
  xpDoQuiz,
} from "@/lib/xp";

const PERCENTUAL_APROVACAO = 0.7;

type Rodada = { questoes: QuestaoQuiz[]; ordens: number[][] };

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mesmaOrdem(a: number[], b?: number[]): boolean {
  return !!b && a.length === b.length && a.every((v, i) => v === b[i]);
}

function montarRodada(questoes: QuestaoQuiz[], ordensAnteriores?: number[][]): Rodada {
  const ordens: number[][] = [];
  const embaralhadas = questoes.map((q, qi) => {
    const indices = q.opcoes.map((_, i) => i);
    let ordem = embaralhar(indices);
    for (let tentativa = 0; tentativa < 10 && indices.length > 1; tentativa++) {
      if (!mesmaOrdem(ordem, ordensAnteriores?.[qi])) break;
      ordem = embaralhar(indices);
    }
    ordens.push(ordem);
    return { ...q, opcoes: ordem.map((i) => q.opcoes[i]), correta: ordem.indexOf(q.correta) };
  });
  return { questoes: embaralhadas, ordens };
}

type QuizTrilhaProps = {
  cursoSlug: string;
  questoes: QuestaoQuiz[];

  liberado: boolean;
};

export function QuizTrilha({ cursoSlug, questoes, liberado }: QuizTrilhaProps) {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;

  const [primeiraTentativa, setPrimeiraTentativa] = useState<ResultadoQuiz | null | undefined>(
    undefined,
  );

  const [xpGanho, setXpGanho] = useState<number | null>(null);

  const [indice, setIndice] = useState(0);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const [rodada, setRodada] = useState<Rodada | null>(null);

  useEffect(() => {
    setRodada(montarRodada(questoes));
  }, [questoes]);

  const questao = rodada?.questoes[indice];

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;
    carregarDadosXp(userId).then(({ primeirasTentativas }) => {
      if (cancelado) return;
      setPrimeiraTentativa(primeirasTentativas.find((r) => r.cursoSlug === cursoSlug) ?? null);
    });
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao, cursoSlug]);

  useEffect(() => {
    if (!finalizado) return;

    const resultado: ResultadoQuiz = {
      cursoSlug,
      acertos,
      total: questoes.length,
      data: new Date().toISOString(),
    };

    if (primeiraTentativa === null) {
      setXpGanho(xpDoQuiz(resultado.acertos, resultado.total));
      setPrimeiraTentativa(resultado);
      if (!userId) registrarPrimeiraTentativaLocal(resultado);
    } else {
      setXpGanho(null);
    }

    if (userId) {
      void salvarResultadoQuizRemoto(userId, resultado);
    } else {
      salvarResultadoQuiz(resultado);
    }

  }, [finalizado]);

  const responder = (opcaoIndice: number) => {
    if (respondida || !questao) return;
    setSelecionada(opcaoIndice);
    setRespondida(true);
    if (opcaoIndice === questao.correta) setAcertos((v) => v + 1);
  };

  const proxima = () => {
    if (indice + 1 >= questoes.length) {
      setFinalizado(true);
      return;
    }
    setIndice((v) => v + 1);
    setSelecionada(null);
    setRespondida(false);
  };

  const reiniciar = () => {
    setRodada((anterior) => montarRodada(questoes, anterior?.ordens));
    setIndice(0);
    setSelecionada(null);
    setRespondida(false);
    setAcertos(0);
    setFinalizado(false);
    setXpGanho(null);
  };

  if (!liberado) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-6 text-center sm:p-8">
        <Lock className="mx-auto h-6 w-6 text-subtle-foreground" aria-hidden="true" />
        <h3 className="mt-3 text-[15px] font-bold">Quiz bloqueado</h3>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground">
          Marque como concluídos todos os blocos da trilha (dando “check” na leitura de
          cada um) para liberar o quiz de fixação.
        </p>
      </div>
    );
  }

  if (finalizado) {
    const aprovado = acertos / questoes.length >= PERCENTUAL_APROVACAO;
    const proximoSlug = proximaTrilha[cursoSlug];
    const proximoCurso = proximoSlug ? getCurso(proximoSlug) : undefined;

    return (
      <div className="rounded-3xl border border-primary/30 bg-primary-dim p-6 text-center sm:p-8">
        <Trophy className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-bold">
          Você acertou {acertos} de {questoes.length}
        </h3>
        {xpGanho !== null ? (
          <p
            className={`mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold ${
              xpGanho > 0 ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {xpGanho > 0
              ? `+${xpGanho} XP na primeira tentativa!`
              : "Sem XP desta vez: era preciso acertar pelo menos 4 na primeira tentativa"}
          </p>
        ) : primeiraTentativa ? (
          <p className="mt-3 text-[12px] text-muted-foreground">
            O XP deste quiz já foi contabilizado na sua primeira tentativa (
            {primeiraTentativa.acertos} de {primeiraTentativa.total} acertos, +
            {xpDoQuiz(primeiraTentativa.acertos, primeiraTentativa.total)} XP).
          </p>
        ) : null}
        <p className="mt-2 text-[13px] text-muted-foreground">
          Resultado salvo no seu perfil. Pode refazer o quiz quantas vezes quiser para treinar;
          o XP vale só na primeira tentativa.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={reiniciar}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Refazer quiz
          </Button>

          {aprovado && proximoCurso ? (
            <ButtonLink href={`/trilhas/${proximoCurso.slug}`} size="sm">
              Seguir para próxima trilha
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </ButtonLink>
          ) : null}
        </div>

        {aprovado && proximoCurso ? (
          <p className="mt-3 text-[12px] text-muted-foreground">
            Próxima: <span className="font-semibold text-foreground">{proximoCurso.titulo}</span>
          </p>
        ) : null}
      </div>
    );
  }

  if (!questao) return null;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Quiz de fixação</p>
        <span className="font-mono text-[11px] text-subtle-foreground">
          {indice + 1} / {questoes.length}
        </span>
      </div>

      {indice === 0 && !respondida && primeiraTentativa !== undefined ? (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary-dim px-3 py-2 text-[12px] text-primary-light">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {primeiraTentativa === null
            ? `Primeira tentativa vale XP: acertando todas, +${XP_QUIZ_TUDO_CERTO} XP; errando só uma, +${XP_QUIZ_UM_ERRO} XP. Refazer depois não soma mais XP.`
            : "Você já fez este quiz: refazer serve para treinar, sem somar XP."}
        </p>
      ) : null}

      <h3 className="mt-4 text-[15px] font-bold leading-snug">{questao.pergunta}</h3>

      {questao.grafico ? <GraficoOrcamentoQuiz grafico={questao.grafico} /> : null}

      <div className="mt-5 space-y-2.5">
        {questao.opcoes.map((opcao, i) => {
          const éCorreta = i === questao.correta;
          const éSelecionada = i === selecionada;
          let estilo =
            "border-border bg-surface-hi text-foreground hover:border-primary/40";
          if (respondida && éCorreta) {
            estilo = "border-primary bg-primary-dim text-foreground";
          } else if (respondida && éSelecionada && !éCorreta) {
            estilo = "border-destructive bg-destructive/10 text-foreground";
          }
          return (
            <button
              key={opcao}
              type="button"
              disabled={respondida}
              onClick={() => responder(i)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left text-[13px] transition-all disabled:cursor-default ${estilo}`}
            >
              <span className="min-w-0">{opcao}</span>
              {respondida && éCorreta ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              ) : null}
              {respondida && éSelecionada && !éCorreta ? (
                <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>

      {respondida && questao.explicacao ? (
        <p
          role="status"
          className={`mt-4 rounded-2xl border px-4 py-3 text-[13px] leading-relaxed ${
            selecionada === questao.correta
              ? "border-primary/40 bg-primary-dim text-foreground"
              : "border-border bg-surface-hi text-muted-foreground"
          }`}
        >
          <span className="font-semibold text-foreground">
            {selecionada === questao.correta ? "Isso mesmo! " : "Quase! "}
          </span>
          {questao.explicacao}
        </p>
      ) : null}

      {respondida ? (
        <Button className="mt-6 w-full" onClick={proxima}>
          {indice + 1 >= questoes.length ? "Ver resultado" : "Próxima pergunta"}
        </Button>
      ) : null}
    </div>
  );
}
