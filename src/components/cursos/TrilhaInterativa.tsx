"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  FileText,
  Dumbbell,
  Gift,
  Lightbulb,
  Lock,
  PlayCircle,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { quizzesPorTrilha, type Aula, type Curso } from "@/data/content";
import { carregarDadosXp } from "@/hooks/useXp";
import { useSessao } from "@/hooks/useSessao";
import {
  calcularProgressoCurso,
  carregarProgresso,
  definirConclusaoAula,
  type ProgressoOverlay,
} from "@/lib/progresso";
import {
  carregarProgressoRemoto,
  definirConclusaoAulaRemoto,
} from "@/lib/supabase/progresso-remoto";
import { QuizTrilha } from "./QuizTrilha";
import { PlanoFinanceiroModelo } from "./PlanoFinanceiroModelo";
import { TextoComLinks } from "./TextoComLinks";
import { bonusCatalogo, XP_POR_BLOCO, type BonusId } from "@/lib/xp";
import {
  acoes,
  descreverRequisito,
  cancelarExercicioLocal,
  getExercicio,
  iniciarExercicioLocal,
  XP_POR_EXERCICIO,
  type Exercicio,
  type ExercicioUsuario,
} from "@/lib/exercicios";
import { cancelarExercicioRemoto, iniciarExercicioRemoto } from "@/lib/supabase/exercicios-remoto";
import { IconeMedalha } from "@/components/exercicios/IconeMedalha";
import {
  faixaDeTempo,
  formatarDuracao,
  infoMedalha,
  ORDEM_MEDALHAS,
  resultadoDoExercicio,
} from "@/lib/medalhas";
import { hrefDoBloco, lerRetorno, limparRetorno, salvarRetorno } from "@/lib/retorno-trilha";

const iconePorTipo: Record<Aula["tipo"], typeof FileText> = {
  "Leitura curta": FileText,
  "Atividade prática": Lightbulb,
  Reflexão: Star,
  "Vídeo": PlayCircle,
};

export function TrilhaInterativa({ curso }: { curso: Curso }) {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [overlay, setOverlay] = useState<ProgressoOverlay>({});
  const [aulaAberta, setAulaAberta] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);
  const [modulosAbertos, setModulosAbertos] = useState<Set<number>>(() => new Set([0]));
  const [bonusConquistados, setBonusConquistados] = useState<BonusId[]>([]);
  const [exerciciosUsuario, setExerciciosUsuario] = useState<ExercicioUsuario[]>([]);
  const [iniciando, setIniciando] = useState<string | null>(null);
  const [blocoDestacado, setBlocoDestacado] = useState<string | null>(null);
  const [confirmandoCancelar, setConfirmandoCancelar] = useState<string | null>(null);
  const [cancelando, setCancelando] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const [dados, xp] = await Promise.all([
        userId ? carregarProgressoRemoto(userId) : Promise.resolve(carregarProgresso()),
        carregarDadosXp(userId),
      ]);
      if (cancelado) return;
      setOverlay(dados);
      setBonusConquistados(xp.bonusConquistados);
      setExerciciosUsuario(xp.exerciciosUsuario);
      setPronto(true);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  const { concluidasPorId, total, concluidas, percentual } = useMemo(
    () => calcularProgressoCurso(curso, overlay),
    [curso, overlay],
  );

  const temQuiz = Boolean(quizzesPorTrilha[curso.slug]);
  const trilhaCompleta = total > 0 && concluidas === total;

  const modulosInfo = useMemo(() => {
    let anteriorCompleto = true;
    return curso.modulos.map((modulo) => {
      const feitas = modulo.aulas.filter((a) => concluidasPorId.get(a.id)).length;
      const completo = modulo.aulas.length > 0 && feitas === modulo.aulas.length;
      const desbloqueado = anteriorCompleto;
      anteriorCompleto = completo;
      return { modulo, feitas, completo, desbloqueado };
    });
  }, [curso, concluidasPorId]);

  const aulaIdsBloqueadas = useMemo(() => {
    const bloqueadas = new Set<string>();
    modulosInfo.forEach(({ modulo, desbloqueado }) => {
      if (!desbloqueado) modulo.aulas.forEach((a) => bloqueadas.add(a.id));
    });
    return bloqueadas;
  }, [modulosInfo]);

  const estadoAulas = useMemo(() => {
    const sequencia = modulosInfo.flatMap(({ modulo, desbloqueado }) =>
      modulo.aulas.map((a) => ({ aula: a, moduloLiberado: desbloqueado })),
    );
    const mapa = new Map<string, { liberada: boolean; podeDesmarcar: boolean }>();
    sequencia.forEach(({ aula, moduloLiberado }, i) => {
      const anterior = sequencia[i - 1];
      const proxima = sequencia[i + 1];
      const anteriorConcluida = !anterior || (concluidasPorId.get(anterior.aula.id) ?? false);
      mapa.set(aula.id, {
        liberada: moduloLiberado && anteriorConcluida,
        podeDesmarcar: !proxima || !(concluidasPorId.get(proxima.aula.id) ?? false),
      });
    });
    return mapa;
  }, [modulosInfo, concluidasPorId]);

  const alternarConclusao = (aulaId: string) => {
    if (aulaIdsBloqueadas.has(aulaId)) return;
    const estado = estadoAulas.get(aulaId);
    if (!estado?.liberada) return;

    const atual = concluidasPorId.get(aulaId) ?? false;
    if (atual && !estado.podeDesmarcar) return;
    const novaConclusao = !atual;

    setOverlay((prev) => ({
      ...prev,
      [curso.slug]: { ...prev[curso.slug], [aulaId]: novaConclusao },
    }));

    if (userId) {
      void definirConclusaoAulaRemoto(userId, curso.slug, aulaId, novaConclusao);
    } else {
      definirConclusaoAula(curso.slug, aulaId, novaConclusao);
    }
  };

  const recarregarExercicios = useCallback(async () => {
    const xp = await carregarDadosXp(userId);
    setExerciciosUsuario(xp.exerciciosUsuario);
    setBonusConquistados(xp.bonusConquistados);
  }, [userId]);

  useEffect(() => {
    if (!pronto) return;
    const aoVoltar = () => {
      if (document.visibilityState === "visible") void recarregarExercicios();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => document.removeEventListener("visibilitychange", aoVoltar);
  }, [pronto, recarregarExercicios]);

  const comecarExercicio = async (exercicio: Exercicio, aulaTitulo?: string) => {
    setIniciando(exercicio.id);
    if (userId) {
      await iniciarExercicioRemoto(userId, exercicio);
    } else {
      iniciarExercicioLocal(exercicio);
    }
    setIniciando(null);
    if (exercicio.noBloco) {

      setExerciciosUsuario((prev) =>
        prev.some((e) => e.id === exercicio.id)
          ? prev
          : [
              ...prev,
              { id: exercicio.id, tipo: exercicio.tipo, iniciadoEm: new Date().toISOString(), concluidoEm: null },
            ],
      );
      return;
    }
    const aulaId = exercicio.id.split(":")[1] ?? "";
    salvarRetorno({
      href: hrefDoBloco(curso.slug, aulaId),
      trilha: curso.titulo,
      bloco: aulaTitulo ?? "",
      exercicioId: exercicio.id,
    });
    router.push(acoes[exercicio.tipo].href);
  };

  const cancelarExercicio = async (exercicioId: string) => {
    setCancelando(exercicioId);
    let ok = true;
    if (userId) {
      ok = await cancelarExercicioRemoto(userId, exercicioId);
    } else {
      cancelarExercicioLocal(exercicioId);
    }
    setCancelando(null);
    setConfirmandoCancelar(null);
    if (!ok) return;

    await recarregarExercicios();

    if (lerRetorno()?.exercicioId === exercicioId) limparRetorno();
  };

  const guardarRetornoDoLink = (
    evento: MouseEvent<HTMLElement>,
    aulaId: string,
    aulaTitulo: string,
    exercicioEmAndamento?: string,
  ) => {
    const link = (evento.target as HTMLElement).closest("a");
    const href = link?.getAttribute("href") ?? "";
    if (!href.startsWith("/financas")) return;
    salvarRetorno({
      href: hrefDoBloco(curso.slug, aulaId),
      trilha: curso.titulo,
      bloco: aulaTitulo,
      exercicioId: exercicioEmAndamento,
    });
  };

  useEffect(() => {
    if (!pronto) return;
    const alvo = new URLSearchParams(window.location.search).get("bloco");
    if (!alvo) return;
    const indiceModulo = curso.modulos.findIndex((m) => m.aulas.some((a) => a.id === alvo));
    if (indiceModulo < 0) return;

    setModulosAbertos((prev) => new Set(prev).add(indiceModulo));
    if (estadoAulas.get(alvo)?.liberada) setAulaAberta(alvo);
    setBlocoDestacado(alvo);
    limparRetorno();
    router.replace(window.location.pathname, { scroll: false });

    const rolar = window.setTimeout(() => {
      document.getElementById(`bloco-${alvo}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    const apagar = window.setTimeout(() => setBlocoDestacado(null), 4000);
    return () => {
      window.clearTimeout(rolar);
      window.clearTimeout(apagar);
    };

  }, [pronto]);

  const alternarModulo = (i: number, desbloqueado: boolean) => {
    if (!desbloqueado) return;
    setModulosAbertos((prev) => {
      const novo = new Set(prev);
      if (novo.has(i)) novo.delete(i);
      else novo.add(i);
      return novo;
    });
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Conteúdo da trilha</h2>
        {pronto ? (
          <span className="font-mono text-[11px] text-subtle-foreground">
            {concluidas}/{total} blocos
          </span>
        ) : null}
      </div>

      {modulosInfo.map(({ modulo, feitas, desbloqueado }, i) => {
        const aberto = modulosAbertos.has(i) && desbloqueado;
        return (
          <div
            key={modulo.titulo}
            className={`rounded-2xl border border-border bg-surface ${
              desbloqueado ? "" : "opacity-60"
            }`}
          >
            <button
              type="button"
              onClick={() => alternarModulo(i, desbloqueado)}
              disabled={!desbloqueado}
              aria-expanded={aberto}
              className={`flex w-full items-center gap-4 p-5 text-left ${
                desbloqueado ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border font-mono text-[12px] text-muted-foreground">
                {desbloqueado ? (
                  String(i + 1).padStart(2, "0")
                ) : (
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[15px] font-bold">
                  {modulo.titulo}
                </span>
                <span className="block truncate text-[12px] text-muted-foreground">
                  {desbloqueado
                    ? modulo.resumo
                    : "Marque como concluído o módulo anterior para desbloquear"}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-subtle-foreground">
                {feitas}/{modulo.aulas.length}
              </span>
              {desbloqueado ? (
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    aberto ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              ) : null}
            </button>

            {aberto ? (
              <ul className="border-t border-border px-5 py-2">
                {modulo.aulas.map((a) => {
                  const Icone = iconePorTipo[a.tipo];
                  const concluida = concluidasPorId.get(a.id) ?? false;
                  const { liberada, podeDesmarcar } = estadoAulas.get(a.id) ?? {
                    liberada: false,
                    podeDesmarcar: false,
                  };
                  const abertaAula = aulaAberta === a.id && liberada;
                  const bonus = a.bonus ? bonusCatalogo[a.bonus] : undefined;
                  const bonusFeito = a.bonus ? bonusConquistados.includes(a.bonus) : false;
                  const exercicio = getExercicio(curso.slug, a.id);
                  const estadoExercicio = exercicio
                    ? exerciciosUsuario.find((e) => e.id === exercicio.id)
                    : undefined;
                  const exercicioFeito = Boolean(estadoExercicio?.concluidoEm);
                  const resultadoExercicio = estadoExercicio ? resultadoDoExercicio(estadoExercicio) : null;
                  return (
                    <li
                      key={a.id}
                      id={`bloco-${a.id}`}
                      className={`scroll-mt-28 border-b border-border/60 py-3 transition-colors last:border-0 ${
                        blocoDestacado === a.id ? "-mx-2 rounded-xl bg-primary/10 px-2 ring-1 ring-primary/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => alternarConclusao(a.id)}
                          disabled={!liberada || (concluida && !podeDesmarcar)}
                          title={
                            !liberada
                              ? "Conclua o bloco anterior para liberar"
                              : concluida && !podeDesmarcar
                                ? "Desmarque primeiro os blocos seguintes"
                                : undefined
                          }
                          aria-label={
                            !liberada
                              ? "Bloco bloqueado"
                              : concluida
                                ? "Marcar como não concluída"
                                : "Marcar como concluída"
                          }
                          className="shrink-0 disabled:cursor-not-allowed"
                        >
                          {concluida ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                          ) : liberada ? (
                            <Circle className="h-4 w-4 text-subtle-foreground" aria-hidden="true" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => liberada && setAulaAberta(abertaAula ? null : a.id)}
                          disabled={!liberada}
                          className={`min-w-0 flex-1 text-left ${
                            liberada ? "" : "cursor-not-allowed opacity-60"
                          }`}
                        >
                          <span
                            className={`block truncate text-[13px] ${
                              concluida ? "text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {a.titulo}
                          </span>
                          <span className="mt-0.5 inline-flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle-foreground">
                            <Icone className="h-3 w-3" aria-hidden="true" />
                            {liberada ? a.tipo : "Conclua o bloco anterior"}
                            <span aria-hidden="true">·</span>
                            <span className={concluida ? "text-primary" : ""}>
                              {concluida ? `+${XP_POR_BLOCO} XP` : `${XP_POR_BLOCO} XP`}
                            </span>
                            {exercicio ? (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className={exercicioFeito ? "text-primary" : "text-amber-300"}>
                                  {exercicioFeito
                                    ? `Exercício +${XP_POR_EXERCICIO} XP ✓${
                                        resultadoExercicio ? ` · ${infoMedalha[resultadoExercicio.medalha].nome}` : ""
                                      }`
                                    : `Exercício ${XP_POR_EXERCICIO} XP`}
                                </span>
                              </>
                            ) : null}
                            {bonus ? (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className={bonusFeito ? "text-primary" : "text-amber-300"}>
                                  {bonusFeito ? `Bônus +${bonus.xp} XP ✓` : `Bônus ${bonus.xp} XP`}
                                </span>
                              </>
                            ) : null}
                          </span>
                        </button>
                        <span className="shrink-0 font-mono text-[11px] text-subtle-foreground">
                          {a.duracao}
                        </span>
                      </div>

                      {abertaAula ? (
                        <div
                          className="mt-3 ml-7 rounded-xl border border-border bg-surface-hi p-4"
                          onClickCapture={(evento) =>
                            guardarRetornoDoLink(
                              evento,
                              a.id,
                              a.titulo,
                              exercicio && estadoExercicio && !exercicioFeito ? exercicio.id : undefined,
                            )
                          }
                        >
                          <p className="text-[13px] leading-relaxed text-muted-foreground">
                            {a.conteudo ? (
                              <TextoComLinks texto={a.conteudo} />
                            ) : (
                              "Conteúdo em curadoria pela equipe — este bloco ainda não tem o texto final."
                            )}
                          </p>
                          {a.pergunta ? (
                            <div className="mt-3 rounded-lg border border-dashed border-primary/40 bg-primary-dim p-3">
                              <p className="text-[12px] font-semibold text-primary-light">
                                <TextoComLinks texto={a.pergunta} />
                              </p>
                            </div>
                          ) : null}
                          {bonus ? (
                            bonusFeito ? (
                              <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary-dim p-3 text-[12px] font-semibold text-primary-light">
                                <Gift className="h-4 w-4 shrink-0" aria-hidden="true" />
                                Bônus conquistado: {bonus.titulo} (+{bonus.xp} XP)
                              </div>
                            ) : (
                              <div className="mt-3 rounded-lg border border-amber-300/40 bg-amber-300/10 p-3">
                                <p className="flex items-center gap-2 text-[12px] font-bold text-amber-200">
                                  <Gift className="h-4 w-4 shrink-0" aria-hidden="true" />
                                  Desafio bônus: +{bonus.xp} XP
                                </p>
                                <p className="mt-1 text-[12px] text-muted-foreground">
                                  {bonus.convite}
                                </p>
                                <Link
                                  href={bonus.href}
                                  className="mt-2 inline-block text-[12px] font-semibold text-amber-200 underline underline-offset-2 hover:text-amber-100"
                                >
                                  {bonus.rotuloLink}
                                </Link>
                              </div>
                            )
                          ) : null}
                          {exercicio ? (
                            exercicioFeito ? (
                              <div className="mt-3 flex items-center gap-3 rounded-lg border border-primary/40 bg-primary-dim p-3">
                                {resultadoExercicio ? (
                                  <IconeMedalha medalha={resultadoExercicio.medalha} className="h-9 w-8 shrink-0" />
                                ) : (
                                  <Dumbbell className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
                                )}
                                <div className="min-w-0">
                                  <p className="text-[12px] font-semibold text-primary-light">
                                    Exercício concluído: +{XP_POR_EXERCICIO} XP
                                  </p>
                                  {resultadoExercicio ? (
                                    <p className="text-[11px] text-muted-foreground">
                                      Medalha de {infoMedalha[resultadoExercicio.medalha].nome.toLowerCase()} · feito em{" "}
                                      {formatarDuracao(resultadoExercicio.duracaoMs)}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 rounded-lg border border-amber-300/40 bg-amber-300/10 p-3">
                                <p className="flex items-center gap-2 text-[12px] font-bold text-amber-200">
                                  <Dumbbell className="h-4 w-4 shrink-0" aria-hidden="true" />
                                  {estadoExercicio
                                    ? "Exercício em andamento"
                                    : `Exercício bônus: +${XP_POR_EXERCICIO} XP`}
                                </p>
                                <p className="mt-1 text-[12px] text-muted-foreground">
                                  {exercicio.instrucao}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] text-subtle-foreground">
                                  {ORDEM_MEDALHAS.map((m) => (
                                    <span key={m} className="inline-flex items-center gap-0.5" title={infoMedalha[m].nome}>
                                      <IconeMedalha medalha={m} className="h-5 w-5" />
                                      {m === "bronze" ? "+10 min" : `${faixaDeTempo(m).replace("até ", "≤ ")}`}
                                    </span>
                                  ))}
                                </div>
                                <p className="mt-1 text-[11px] text-subtle-foreground">
                                  Sem pressa: concluir sempre vale os +{XP_POR_EXERCICIO} XP; o tempo só melhora a medalha.
                                </p>
                                {descreverRequisito(exercicio.requisito).length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {descreverRequisito(exercicio.requisito).map((item) => (
                                      <span
                                        key={item}
                                        className="rounded-md border border-amber-300/40 bg-background/40 px-2 py-0.5 font-mono text-[11px] text-amber-100"
                                      >
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                                <p className="mt-1 text-[11px] text-subtle-foreground">
                                  {estadoExercicio
                                    ? `Para concluir, ${acoes[exercicio.tipo].comoConcluir} usando exatamente os dados acima. O bônus aparece aqui quando você voltar.`
                                    : `Ler o bloco já vale +${XP_POR_BLOCO} XP. O exercício é um extra: ao começar, ${acoes[exercicio.tipo].comoConcluir}.`}
                                </p>
                                {estadoExercicio && exercicio.noBloco ? (
                                  <p className="mt-2 text-[12px] font-semibold text-amber-200">
                                    Use o modelo abaixo e clique em exportar: o bônus aparece aqui na hora.
                                  </p>
                                ) : estadoExercicio ? (
                                  <Link
                                    href={acoes[exercicio.tipo].href}
                                    className="mt-2 inline-block text-[12px] font-semibold text-amber-200 underline underline-offset-2 hover:text-amber-100"
                                  >
                                    Ir para {acoes[exercicio.tipo].ferramenta}
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => void comecarExercicio(exercicio, a.titulo)}
                                    disabled={iniciando === exercicio.id}
                                    className="mt-2 rounded-lg bg-amber-300 px-3 py-1.5 text-[12px] font-bold text-zinc-900 hover:bg-amber-200 disabled:opacity-60"
                                  >
                                    {iniciando === exercicio.id ? "Abrindo…" : "Começar exercício"}
                                  </button>
                                )}
                                {estadoExercicio ? (
                                  confirmandoCancelar === exercicio.id ? (
                                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-amber-300/20 pt-2 text-[12px]">
                                      <span className="text-muted-foreground">
                                        Cancelar este exercício? Você pode começar de novo quando quiser.
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => void cancelarExercicio(exercicio.id)}
                                        disabled={cancelando === exercicio.id}
                                        className="rounded-md border border-destructive/50 px-2 py-0.5 font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
                                      >
                                        {cancelando === exercicio.id ? "Cancelando…" : "Sim, cancelar"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmandoCancelar(null)}
                                        className="rounded-md border border-border px-2 py-0.5 font-semibold text-muted-foreground hover:text-foreground"
                                      >
                                        Não
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmandoCancelar(exercicio.id)}
                                      className="mt-2 block text-[11px] text-subtle-foreground underline underline-offset-2 hover:text-foreground"
                                    >
                                      Cancelar exercício
                                    </button>
                                  )
                                ) : null}
                              </div>
                            )
                          ) : null}
                          {a.temPlanoInterativo ? (
                            <PlanoFinanceiroModelo
                              antesDeExportar={
                                exercicio?.noBloco && !estadoExercicio
                                  ? () => comecarExercicio(exercicio)
                                  : undefined
                              }
                              onExportado={() => void recarregarExercicios()}
                            />
                          ) : null}
                          {!concluida ? (
                            <button
                              type="button"
                              onClick={() => alternarConclusao(a.id)}
                              className="mt-3 text-[12px] font-semibold text-primary hover:text-primary-light"
                            >
                              Marcar como concluída (+{XP_POR_BLOCO} XP)
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}

      {pronto ? (
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <ProgressBar
            size="md"
            value={percentual}
            label={`${concluidas} de ${total} blocos concluídos • progresso salvo ${
              userId ? "na sua conta" : "neste dispositivo"
            }`}
          />
        </div>
      ) : null}

      <div className="pt-2">
        {temQuiz ? (
          <QuizTrilha
            cursoSlug={curso.slug}
            questoes={quizzesPorTrilha[curso.slug]!}
            liberado={trilhaCompleta}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="text-[13px] text-muted-foreground">
              O quiz de fixação desta trilha ainda está em preparação pela equipe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
