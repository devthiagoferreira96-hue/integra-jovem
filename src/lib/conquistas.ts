

import { cursos, quizzesPorTrilha } from "@/data/content";
import { carregarMetas, carregarReflexoes } from "@/lib/metas-reflexoes";
import { trilhaEstaConcluida, type ProgressoOverlay, type ResultadoQuiz } from "@/lib/progresso";
import { carregarHistoricoCarteira, carregarHistoricoCDI, carregarHistoricoJuros } from "@/lib/simuladores";
import { exercicios, exerciciosConcluidosValidos, type ExercicioUsuario, type TipoAcao } from "@/lib/exercicios";
import { contarMedalhas, ouroOuMelhor, resultadosDosExercicios } from "@/lib/medalhas";
import type { BonusId } from "@/lib/xp";

export type MarcoId = "primeira-simulacao" | "primeira-meta" | "primeira-reflexao";

const CHAVE_MARCOS = "integra-jovem:conquistas:marcos";

export function carregarMarcosLocal(): MarcoId[] {
  if (typeof window === "undefined") return [];
  let salvos: MarcoId[] = [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_MARCOS);
    const dados: unknown = bruto ? JSON.parse(bruto) : [];
    if (Array.isArray(dados)) salvos = dados as MarcoId[];
  } catch {
    salvos = [];
  }

  const atuais = new Set<MarcoId>(salvos);
  const temSimulacao =
    carregarHistoricoJuros().length > 0 ||
    carregarHistoricoCDI().length > 0 ||
    carregarHistoricoCarteira().length > 0;
  if (temSimulacao) atuais.add("primeira-simulacao");
  if (carregarMetas().length > 0) atuais.add("primeira-meta");
  if (carregarReflexoes().length > 0) atuais.add("primeira-reflexao");

  const lista = Array.from(atuais);
  if (lista.length !== salvos.length) {
    try {
      window.localStorage.setItem(CHAVE_MARCOS, JSON.stringify(lista));
    } catch {

    }
  }
  return lista;
}

export type CategoriaConquista = "Leitura" | "Trilhas" | "Quiz" | "Ferramentas" | "Desafios" | "Nível";

export type ContextoConquistas = {
  overlay: ProgressoOverlay;
  primeirasTentativas: ResultadoQuiz[];
  bonusConquistados: BonusId[];
  marcos: MarcoId[];
  nivel: number;
  exerciciosConcluidos?: string[];
  exerciciosUsuario?: ExercicioUsuario[];

  avatarEscolhido?: boolean;
};

type Avaliacao = { atual: number; meta: number };

export type Conquista = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaConquista;
  avaliar: (ctx: ContextoConquistas) => Avaliacao;
};

const TOTAL_BLOCOS = cursos.reduce(
  (soma, c) => soma + c.modulos.reduce((s, m) => s + m.aulas.length, 0),
  0,
);

function blocosConcluidos(overlay: ProgressoOverlay): number {
  let total = 0;
  cursos.forEach((curso) => {
    const marcados = overlay[curso.slug] ?? {};
    curso.modulos.forEach((m) =>
      m.aulas.forEach((a) => {
        if (marcados[a.id]) total += 1;
      }),
    );
  });
  return total;
}

function trilhasConcluidas(ctx: ContextoConquistas): number {
  return cursos.filter((c) => trilhaEstaConcluida(c, ctx.overlay, ctx.primeirasTentativas)).length;
}

function quizzesGabaritados(ctx: ContextoConquistas): number {
  return ctx.primeirasTentativas.filter((r) => r.total > 0 && r.acertos >= r.total).length;
}

const umaVez = (feito: boolean): Avaliacao => ({ atual: feito ? 1 : 0, meta: 1 });

function medalhasDoUsuario(ctx: ContextoConquistas) {
  return contarMedalhas(resultadosDosExercicios(ctx.exerciciosUsuario ?? []));
}

function exerciciosDosTipos(ctx: ContextoConquistas, tipos: TipoAcao[]): Avaliacao {
  const concluidos = new Set(exerciciosConcluidosValidos(ctx.exerciciosUsuario ?? []));
  const doTipo = exercicios.filter((e) => tipos.includes(e.tipo));
  return { atual: doTipo.filter((e) => concluidos.has(e.id)).length, meta: doTipo.length };
}

function totalExerciciosConcluidos(ctx: ContextoConquistas): number {
  return new Set(exerciciosConcluidosValidos(ctx.exerciciosUsuario ?? [])).size;
}

function medalhasPeloMenos(ctx: ContextoConquistas, minima: "platina" | "esmeralda"): number {
  const c = medalhasDoUsuario(ctx);
  return minima === "platina" ? c.platina + c.esmeralda + c.diamante : c.esmeralda + c.diamante;
}

function trilhaDourada(ctx: ContextoConquistas): number {
  const resultados = resultadosDosExercicios(ctx.exerciciosUsuario ?? []);
  const porId = new Map(resultados.map((r) => [r.exercicioId, r]));
  return cursos.some((curso) => {
    const doCurso = exercicios.filter((e) => e.id.startsWith(`${curso.slug}:`));
    return doCurso.length > 0 && doCurso.every((e) => {
      const r = porId.get(e.id);
      return r ? ouroOuMelhor(r.medalha) : false;
    });
  })
    ? 1
    : 0;
}

const CURSOS_COM_QUIZ = cursos.filter((c) => quizzesPorTrilha[c.slug]);

function quizzesFeitos(ctx: ContextoConquistas): number {
  return CURSOS_COM_QUIZ.filter((c) => ctx.primeirasTentativas.some((r) => r.cursoSlug === c.slug)).length;
}

const nomesEspecialista: Record<string, string> = {
  "primeiro-dinheiro": "Dinheiro no controle",
  "saude-emocional": "Guardião contra golpes",
  "descobrindo-profissoes": "Mestre do orçamento",
  "quem-eu-sou": "Crédito consciente",
  "vida-adulta-burocracia": "Poupador estratégico",
  "uso-consciente-tecnologia": "Mago dos juros",
};

const conquistasEspecialista: Conquista[] = cursos.map((curso) => ({
  id: `especialista-${curso.slug}`,
  titulo: nomesEspecialista[curso.slug] ?? `Especialista: ${curso.titulo}`,
  descricao: `Conclua a trilha “${curso.titulo}” (todos os blocos e o quiz).`,
  categoria: "Trilhas" as const,
  avaliar: (ctx: ContextoConquistas) =>
    umaVez(trilhaEstaConcluida(curso, ctx.overlay, ctx.primeirasTentativas)),
}));

function ourosOuMelhores(ctx: ContextoConquistas): number {
  return resultadosDosExercicios(ctx.exerciciosUsuario ?? []).filter((r) => ouroOuMelhor(r.medalha)).length;
}

export const conquistas: Conquista[] = [
  {
    id: "primeiro-passo",
    titulo: "Primeiro passo",
    descricao: "Conclua seu primeiro bloco de trilha.",
    categoria: "Leitura",
    avaliar: (ctx) => ({ atual: blocosConcluidos(ctx.overlay), meta: 1 }),
  },
  {
    id: "leitor-dedicado",
    titulo: "Leitor dedicado",
    descricao: "Conclua 25 blocos de trilha.",
    categoria: "Leitura",
    avaliar: (ctx) => ({ atual: blocosConcluidos(ctx.overlay), meta: 25 }),
  },
  {
    id: "maratonista",
    titulo: "Maratonista do saber",
    descricao: `Conclua todos os ${TOTAL_BLOCOS} blocos das trilhas.`,
    categoria: "Leitura",
    avaliar: (ctx) => ({ atual: blocosConcluidos(ctx.overlay), meta: TOTAL_BLOCOS }),
  },
  {
    id: "primeira-trilha",
    titulo: "Trilha completa",
    descricao: "Termine uma trilha inteira, com blocos e quiz.",
    categoria: "Trilhas",
    avaliar: (ctx) => ({ atual: trilhasConcluidas(ctx), meta: 1 }),
  },
  {
    id: "meio-caminho",
    titulo: "Meio caminho",
    descricao: "Termine 3 trilhas.",
    categoria: "Trilhas",
    avaliar: (ctx) => ({ atual: trilhasConcluidas(ctx), meta: 3 }),
  },
  {
    id: "jornada-completa",
    titulo: "Jornada completa",
    descricao: `Termine todas as ${cursos.length} trilhas.`,
    categoria: "Trilhas",
    avaliar: (ctx) => ({ atual: trilhasConcluidas(ctx), meta: cursos.length }),
  },
  ...conquistasEspecialista,
  {
    id: "gabaritou",
    titulo: "Gabaritou!",
    descricao: "Acerte todas as perguntas de um quiz na primeira tentativa.",
    categoria: "Quiz",
    avaliar: (ctx) => ({ atual: quizzesGabaritados(ctx), meta: 1 }),
  },
  {
    id: "mestre-quizzes",
    titulo: "Mestre dos quizzes",
    descricao: "Gabarite 3 quizzes na primeira tentativa.",
    categoria: "Quiz",
    avaliar: (ctx) => ({ atual: quizzesGabaritados(ctx), meta: 3 }),
  },
  {
    id: "todos-os-quizzes",
    titulo: "Curioso de plantão",
    descricao: `Faça os ${CURSOS_COM_QUIZ.length} quizzes das trilhas.`,
    categoria: "Quiz",
    avaliar: (ctx) => ({ atual: quizzesFeitos(ctx), meta: CURSOS_COM_QUIZ.length }),
  },
  {
    id: "gabarito-total",
    titulo: "Gabarito total",
    descricao: "Gabarite todos os quizzes na primeira tentativa.",
    categoria: "Quiz",
    avaliar: (ctx) => ({ atual: quizzesGabaritados(ctx), meta: CURSOS_COM_QUIZ.length }),
  },
  {
    id: "dono-do-dinheiro",
    titulo: "Dono do próprio dinheiro",
    descricao: "Faça seu primeiro registro no Controle de Gastos.",
    categoria: "Ferramentas",
    avaliar: (ctx) => umaVez(ctx.bonusConquistados.includes("primeiro-gasto")),
  },
  {
    id: "cientista-dos-juros",
    titulo: "Cientista dos juros",
    descricao: "Salve sua primeira simulação em Finanças.",
    categoria: "Ferramentas",
    avaliar: (ctx) => umaVez(ctx.marcos.includes("primeira-simulacao")),
  },
  {
    id: "sonho-com-plano",
    titulo: "Sonho com plano",
    descricao: "Crie sua primeira meta no Perfil.",
    categoria: "Ferramentas",
    avaliar: (ctx) => umaVez(ctx.marcos.includes("primeira-meta")),
  },
  {
    id: "momento-de-pausa",
    titulo: "Momento de pausa",
    descricao: "Escreva sua primeira reflexão no diário.",
    categoria: "Ferramentas",
    avaliar: (ctx) => umaVez(ctx.marcos.includes("primeira-reflexao")),
  },
  {
    id: "kit-completo",
    titulo: "Kit completo",
    descricao: "Use todas as ferramentas: Controle de Gastos, simulador, metas e diário.",
    categoria: "Ferramentas",
    avaliar: (ctx) => ({
      atual:
        (ctx.bonusConquistados.includes("primeiro-gasto") ? 1 : 0) +
        (["primeira-simulacao", "primeira-meta", "primeira-reflexao"] as MarcoId[]).filter((m) =>
          ctx.marcos.includes(m),
        ).length,
      meta: 4,
    }),
  },
  {
    id: "nova-identidade",
    titulo: "Nova identidade",
    descricao: "Escolha seu avatar na Jornada.",
    categoria: "Ferramentas",
    avaliar: (ctx) => umaVez(Boolean(ctx.avatarEscolhido)),
  },
  {
    id: "mestre-da-planilha",
    titulo: "Mestre da planilha",
    descricao: "Conclua todos os exercícios do Controle de Gastos.",
    categoria: "Ferramentas",
    avaliar: (ctx) => exerciciosDosTipos(ctx, ["gasto", "renda", "meta_reserva"]),
  },
  {
    id: "laboratorio-de-juros",
    titulo: "Laboratório de juros",
    descricao: "Conclua todos os exercícios do Simulador de Juros Compostos.",
    categoria: "Ferramentas",
    avaliar: (ctx) => exerciciosDosTipos(ctx, ["simulacao_juros"]),
  },
  {
    id: "investidor-iniciante",
    titulo: "Investidor iniciante",
    descricao: "Conclua todos os exercícios da Carteira de Investimentos.",
    categoria: "Ferramentas",
    avaliar: (ctx) => exerciciosDosTipos(ctx, ["simulacao_carteira"]),
  },
  {
    id: "mao-na-massa",
    titulo: "Mão na massa",
    descricao: "Conclua 5 exercícios práticos das trilhas.",
    categoria: "Ferramentas",
    avaliar: (ctx) => ({ atual: totalExerciciosConcluidos(ctx), meta: 5 }),
  },
  {
    id: "praticante",
    titulo: "Praticante",
    descricao: "Conclua 15 exercícios práticos.",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: totalExerciciosConcluidos(ctx), meta: 15 }),
  },
  {
    id: "todos-os-exercicios",
    titulo: "Nada ficou para trás",
    descricao: `Conclua todos os ${exercicios.length} exercícios práticos.`,
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: totalExerciciosConcluidos(ctx), meta: exercicios.length }),
  },
  {
    id: "primeiro-ouro",
    titulo: "Primeiro ouro",
    descricao: "Ganhe uma medalha de ouro (ou melhor) num exercício prático.",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: ourosOuMelhores(ctx), meta: 1 }),
  },
  {
    id: "mao-de-ouro",
    titulo: "Mão de ouro",
    descricao: "Ganhe 5 medalhas de ouro (ou melhores).",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: ourosOuMelhores(ctx), meta: 5 }),
  },
  {
    id: "primeira-platina",
    titulo: "Toque de platina",
    descricao: "Ganhe uma medalha de platina ou melhor (até 3 minutos).",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: medalhasPeloMenos(ctx, "platina"), meta: 1 }),
  },
  {
    id: "primeira-esmeralda",
    titulo: "Joia verde",
    descricao: "Ganhe uma medalha de esmeralda ou melhor (até 2 minutos).",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: medalhasPeloMenos(ctx, "esmeralda"), meta: 1 }),
  },
  {
    id: "brilho-de-diamante",
    titulo: "Brilho de diamante",
    descricao: "Ganhe uma medalha de diamante (exercício feito em até 1 minuto).",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: medalhasDoUsuario(ctx).diamante, meta: 1 }),
  },
  {
    id: "chuva-de-diamantes",
    titulo: "Chuva de diamantes",
    descricao: "Ganhe 5 medalhas de diamante.",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: medalhasDoUsuario(ctx).diamante, meta: 5 }),
  },
  {
    id: "trilha-dourada",
    titulo: "Trilha dourada",
    descricao: "Faça todos os exercícios de uma trilha com ouro ou melhor.",
    categoria: "Desafios",
    avaliar: (ctx) => ({ atual: trilhaDourada(ctx), meta: 1 }),
  },
  {
    id: "colecionador",
    titulo: "Colecionador de medalhas",
    descricao: "Tenha pelo menos uma medalha de cada um dos 6 tipos.",
    categoria: "Desafios",
    avaliar: (ctx) => ({
      atual: Object.values(medalhasDoUsuario(ctx)).filter((n) => n > 0).length,
      meta: 6,
    }),
  },
  {
    id: "nivel-3",
    titulo: "Nível 3",
    descricao: "Alcance o nível 3 de experiência.",
    categoria: "Nível",
    avaliar: (ctx) => ({ atual: ctx.nivel, meta: 3 }),
  },
  {
    id: "nivel-5",
    titulo: "Nível 5",
    descricao: "Alcance o nível 5 de experiência.",
    categoria: "Nível",
    avaliar: (ctx) => ({ atual: ctx.nivel, meta: 5 }),
  },
  {
    id: "nivel-10",
    titulo: "Nível 10",
    descricao: "Alcance o nível 10 de experiência.",
    categoria: "Nível",
    avaliar: (ctx) => ({ atual: ctx.nivel, meta: 10 }),
  },
  {
    id: "nivel-20",
    titulo: "Nível 20",
    descricao: "Alcance o nível 20 de experiência.",
    categoria: "Nível",
    avaliar: (ctx) => ({ atual: ctx.nivel, meta: 20 }),
  },
  {
    id: "nivel-30",
    titulo: "Mestre da Jornada",
    descricao: "Chegue ao nível 30, o máximo: todas as atividades feitas e os quizzes gabaritados de primeira.",
    categoria: "Nível",
    avaliar: (ctx) => ({ atual: ctx.nivel, meta: 30 }),
  },
];

export type ConquistaAvaliada = Conquista & {
  conquistada: boolean;
  atual: number;
  meta: number;
};

export function avaliarConquistas(ctx: ContextoConquistas): ConquistaAvaliada[] {
  return conquistas.map((c) => {
    const { atual, meta } = c.avaliar(ctx);
    return { ...c, atual: Math.min(atual, meta), meta, conquistada: atual >= meta };
  });
}
