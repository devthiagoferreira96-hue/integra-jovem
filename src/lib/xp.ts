

import { cursos, getCurso } from "@/data/content";
import { carregarGastos } from "@/lib/financas";
import { XP_POR_EXERCICIO } from "@/lib/exercicios";
import { carregarResultadosQuiz, type ProgressoOverlay, type ResultadoQuiz } from "@/lib/progresso";

export const XP_POR_BLOCO = 10;
export const XP_QUIZ_TUDO_CERTO = 100;
export const XP_QUIZ_UM_ERRO = 60;

export const XP_POR_NIVEL = 100;

export const NIVEL_MAXIMO = 30;

export type BonusId = "primeiro-gasto";

export type Bonus = {
  id: BonusId;
  titulo: string;

  convite: string;
  xp: number;
  href: string;
  rotuloLink: string;
};

export const bonusCatalogo: Record<BonusId, Bonus> = {
  "primeiro-gasto": {
    id: "primeiro-gasto",
    titulo: "Primeiro registro no Controle de Gastos",
    convite:
      "Faça seu primeiro registro de gasto no Controle de Gastos e ganhe um bônus. Ler este bloco já vale XP; o registro é um extra.",
    xp: 50,
    href: "/financas",
    rotuloLink: "Ir para o Controle de Gastos",
  },
};

export function xpDoQuiz(acertos: number, total: number): number {
  if (total <= 0) return 0;
  if (acertos >= total) return XP_QUIZ_TUDO_CERTO;
  if (acertos === total - 1) return XP_QUIZ_UM_ERRO;
  return 0;
}

export type ExtratoXp = {
  total: number;
  blocos: { quantidade: number; xp: number };
  quizzes: { cursoSlug: string; titulo: string; acertos: number; totalQuestoes: number; xp: number }[];
  bonus: { id: BonusId; titulo: string; xp: number }[];
  exercicios: { quantidade: number; xp: number };
  nivel: number;

  xpNoNivel: number;
};

export function calcularXp(dados: {
  overlay: ProgressoOverlay;
  primeirasTentativas: ResultadoQuiz[];
  bonusConquistados: BonusId[];

  exerciciosConcluidos?: string[];
}): ExtratoXp {

  let blocosConcluidos = 0;
  cursos.forEach((curso) => {
    const marcados = dados.overlay[curso.slug] ?? {};
    curso.modulos.forEach((m) =>
      m.aulas.forEach((a) => {
        if (marcados[a.id]) blocosConcluidos += 1;
      }),
    );
  });

  const quizzes = dados.primeirasTentativas
    .filter((r) => getCurso(r.cursoSlug))
    .map((r) => ({
      cursoSlug: r.cursoSlug,
      titulo: getCurso(r.cursoSlug)?.titulo ?? r.cursoSlug,
      acertos: r.acertos,
      totalQuestoes: r.total,
      xp: xpDoQuiz(r.acertos, r.total),
    }));

  const bonus = Array.from(new Set(dados.bonusConquistados))
    .filter((id) => bonusCatalogo[id])
    .map((id) => ({ id, titulo: bonusCatalogo[id].titulo, xp: bonusCatalogo[id].xp }));

  const xpBlocos = blocosConcluidos * XP_POR_BLOCO;
  const qtdExercicios = new Set(dados.exerciciosConcluidos ?? []).size;
  const xpExercicios = qtdExercicios * XP_POR_EXERCICIO;
  const total =
    xpBlocos +
    quizzes.reduce((s, q) => s + q.xp, 0) +
    bonus.reduce((s, b) => s + b.xp, 0) +
    xpExercicios;

  return {
    total,
    blocos: { quantidade: blocosConcluidos, xp: xpBlocos },
    quizzes,
    bonus,
    exercicios: { quantidade: qtdExercicios, xp: xpExercicios },
    nivel: Math.min(NIVEL_MAXIMO, Math.floor(total / XP_POR_NIVEL) + 1),

    xpNoNivel: Math.floor(total / XP_POR_NIVEL) + 1 >= NIVEL_MAXIMO ? XP_POR_NIVEL : total % XP_POR_NIVEL,
  };
}

const CHAVE_PRIMEIRAS = "integra-jovem:xp:quiz-primeira-tentativa";
const CHAVE_BONUS = "integra-jovem:xp:bonus";

function lerJson<T>(chave: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravarJson(chave: string, valor: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {

  }
}

export function carregarPrimeirasTentativasLocal(): ResultadoQuiz[] {
  const salvas = lerJson<ResultadoQuiz[]>(CHAVE_PRIMEIRAS, []);
  const lista = Array.isArray(salvas) ? salvas : [];
  const jaTem = new Set(lista.map((r) => r.cursoSlug));
  const faltando = carregarResultadosQuiz().filter((r) => !jaTem.has(r.cursoSlug));
  if (faltando.length > 0) {
    const completa = [...lista, ...faltando];
    gravarJson(CHAVE_PRIMEIRAS, completa);
    return completa;
  }
  return lista;
}

export function registrarPrimeiraTentativaLocal(resultado: ResultadoQuiz): void {
  const lista = carregarPrimeirasTentativasLocal();
  if (lista.some((r) => r.cursoSlug === resultado.cursoSlug)) return;
  gravarJson(CHAVE_PRIMEIRAS, [...lista, resultado]);
}

export function carregarBonusLocal(): BonusId[] {
  const salvos = lerJson<BonusId[]>(CHAVE_BONUS, []);
  const lista = Array.isArray(salvos) ? salvos : [];
  if (!lista.includes("primeiro-gasto") && carregarGastos().length > 0) {
    const nova: BonusId[] = [...lista, "primeiro-gasto"];
    gravarJson(CHAVE_BONUS, nova);
    return nova;
  }
  return lista;
}
