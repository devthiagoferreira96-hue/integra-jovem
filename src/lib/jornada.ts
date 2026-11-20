import { cursos, proximaTrilha, type Curso } from "@/data/content";
import {
  calcularProgressoCurso,
  trilhaEstaConcluida,
  type ProgressoOverlay,
  type ResultadoQuiz,
} from "@/lib/progresso";

export type StatusEtapa = "concluida" | "atual" | "bloqueada";

export type EtapaJornada = {
  numero: number;
  curso: Curso;
  status: StatusEtapa;

  percentual: number;
};

export type Jornada = {
  etapas: EtapaJornada[];
  total: number;
  concluidas: number;

  percentual: number;

  atual: EtapaJornada | null;

  emAndamento: number;

  nadaIniciado: boolean;
};

export function ordemDaJornada(): Curso[] {
  const destinos = new Set(Object.values(proximaTrilha));
  const primeira = cursos.find((c) => proximaTrilha[c.slug] && !destinos.has(c.slug)) ?? cursos[0];

  const ordem: Curso[] = [];
  const vistos = new Set<string>();
  let slug: string | undefined = primeira?.slug;
  while (slug && !vistos.has(slug)) {
    const curso = cursos.find((c) => c.slug === slug);
    if (!curso) break;
    ordem.push(curso);
    vistos.add(slug);
    slug = proximaTrilha[slug];
  }
  cursos.forEach((c) => {
    if (!vistos.has(c.slug)) ordem.push(c);
  });
  return ordem;
}

export function montarJornada(overlay: ProgressoOverlay, resultadosQuiz: ResultadoQuiz[]): Jornada {
  let atualDefinida = false;

  const etapas: EtapaJornada[] = ordemDaJornada().map((curso, i) => {
    const { percentual } = calcularProgressoCurso(curso, overlay);
    let status: StatusEtapa;
    if (trilhaEstaConcluida(curso, overlay, resultadosQuiz)) {
      status = "concluida";
    } else if (!atualDefinida) {
      status = "atual";
      atualDefinida = true;
    } else {
      status = "bloqueada";
    }
    return { numero: i + 1, curso, status, percentual };
  });

  const total = etapas.length;
  const concluidas = etapas.filter((e) => e.status === "concluida").length;

  return {
    etapas,
    total,
    concluidas,
    percentual: total === 0 ? 0 : Math.round((concluidas / total) * 100),
    atual: etapas.find((e) => e.status === "atual") ?? null,
    emAndamento: etapas.filter((e) => e.status !== "concluida" && e.percentual > 0).length,
    nadaIniciado: etapas.every((e) => e.percentual === 0),
  };
}
