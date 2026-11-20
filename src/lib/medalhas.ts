

import { cursos } from "@/data/content";
import { exercicios, type ExercicioUsuario } from "@/lib/exercicios";

export type Medalha = "diamante" | "esmeralda" | "platina" | "ouro" | "prata" | "bronze";

export const ORDEM_MEDALHAS: Medalha[] = ["diamante", "esmeralda", "platina", "ouro", "prata", "bronze"];

export const LIMITES_MIN: Record<Exclude<Medalha, "bronze">, number> = {
  diamante: 1,
  esmeralda: 2,
  platina: 3,
  ouro: 4,
  prata: 10,
};

export const infoMedalha: Record<
  Medalha,
  { nome: string; cor: string; corEscura: string; brilhoExtra: boolean }
> = {
  diamante: { nome: "Diamante", cor: "#ecfeff", corEscura: "#0891b2", brilhoExtra: true },
  esmeralda: { nome: "Esmeralda", cor: "#6ee7b7", corEscura: "#047857", brilhoExtra: true },
  platina: { nome: "Platina", cor: "#eef2ff", corEscura: "#6d6fb3", brilhoExtra: false },
  ouro: { nome: "Ouro", cor: "#facc15", corEscura: "#a16207", brilhoExtra: false },
  prata: { nome: "Prata", cor: "#e2e8f0", corEscura: "#64748b", brilhoExtra: false },
  bronze: { nome: "Bronze", cor: "#fb923c", corEscura: "#9a3412", brilhoExtra: false },
};

export function medalhaPorDuracao(duracaoMs: number): Medalha {
  const minutos = duracaoMs / 60000;
  for (const m of ORDEM_MEDALHAS) {
    if (m === "bronze") break;
    if (minutos <= LIMITES_MIN[m]) return m;
  }
  return "bronze";
}

export function ouroOuMelhor(m: Medalha): boolean {
  return ORDEM_MEDALHAS.indexOf(m) <= ORDEM_MEDALHAS.indexOf("ouro");
}

export function faixaDeTempo(m: Medalha): string {
  if (m === "bronze") return `acima de ${LIMITES_MIN.prata} min`;
  return `até ${LIMITES_MIN[m]} min`;
}

export function formatarDuracao(ms: number): string {
  const segundos = Math.max(0, Math.round(ms / 1000));
  if (segundos < 60) return `${segundos} s`;
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) {
    const s = segundos % 60;
    return s ? `${minutos} min ${s} s` : `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  if (horas < 24) {
    const m = minutos % 60;
    return m ? `${horas} h ${m} min` : `${horas} h`;
  }
  const dias = Math.floor(horas / 24);
  return `${dias} ${dias === 1 ? "dia" : "dias"}`;
}

export type ResultadoExercicio = {
  exercicioId: string;
  cursoSlug: string;
  trilha: string;
  bloco: string;
  medalha: Medalha;
  duracaoMs: number;
  concluidoEm: string;
};

export function resultadoDoExercicio(e: ExercicioUsuario): ResultadoExercicio | null {
  if (!e.concluidoEm) return null;
  const catalogo = exercicios.find((c) => c.id === e.id && c.tipo === e.tipo);
  if (!catalogo) return null;

  const [cursoSlug, aulaId] = e.id.split(":");
  const curso = cursos.find((c) => c.slug === cursoSlug);
  const aula = curso?.modulos.flatMap((m) => m.aulas).find((a) => a.id === aulaId);

  const duracaoMs = new Date(e.concluidoEm).getTime() - new Date(e.iniciadoEm).getTime();
  const duracaoValida = Number.isFinite(duracaoMs) ? Math.max(0, duracaoMs) : Number.MAX_SAFE_INTEGER;

  return {
    exercicioId: e.id,
    cursoSlug,
    trilha: curso?.titulo ?? cursoSlug,
    bloco: aula?.titulo ?? aulaId,
    medalha: medalhaPorDuracao(duracaoValida),
    duracaoMs: duracaoValida,
    concluidoEm: e.concluidoEm,
  };
}

export function resultadosDosExercicios(lista: ExercicioUsuario[]): ResultadoExercicio[] {
  return lista
    .map(resultadoDoExercicio)
    .filter((r): r is ResultadoExercicio => r !== null)
    .sort((a, b) => b.concluidoEm.localeCompare(a.concluidoEm));
}

export function contarMedalhas(resultados: ResultadoExercicio[]): Record<Medalha, number> {
  const contagem = Object.fromEntries(ORDEM_MEDALHAS.map((m) => [m, 0])) as Record<Medalha, number>;
  resultados.forEach((r) => {
    contagem[r.medalha] += 1;
  });
  return contagem;
}
