import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { GlossarioTrilha } from "@/components/cursos/GlossarioTrilha";
import { TrilhaHero } from "@/components/cursos/TrilhaHero";
import { TrilhaInterativa } from "@/components/cursos/TrilhaInterativa";
import { getCurso } from "@/data/content";
import { categoriaVisual, categoriaVisualPadrao } from "@/lib/categorias-visual";
import { TemaTrilha } from "@/components/cursos/TemaTrilha";
import { moduloIconesPorTrilha, corPorTrilha, temaPorTrilha } from "@/lib/trilha-ilustracoes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const curso = getCurso(slug);

  if (!curso) {
    return {
      title: "Trilha não encontrada — Integra Jovem",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${curso.titulo} — Integra Jovem`,
    description: curso.descricao,
    openGraph: {
      title: `${curso.titulo} — Integra Jovem`,
      description: curso.descricao,
    },
  };
}

export default async function CursoDetalhe({ params }: PageProps) {
  const { slug } = await params;
  const curso = getCurso(slug);
  if (!curso) notFound();

  const visual = corPorTrilha[curso.slug] ?? categoriaVisual[curso.categoria] ?? categoriaVisualPadrao;
  const iconesModulos = moduloIconesPorTrilha[curso.slug];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      {temaPorTrilha[curso.slug] ? <TemaTrilha tema={temaPorTrilha[curso.slug]!} /> : null}
      <Link
        href="/trilhas"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Todas as trilhas
      </Link>

      <div className="mt-6">
        <TrilhaHero curso={curso} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
            <p className="eyebrow">Currículo da trilha</p>
            <h2 className="mt-2 text-lg font-bold">O que você vai aprender</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {curso.modulos.map((modulo, i) => {
                const IconeModulo = iconesModulos?.[i];
                return (
                  <li key={modulo.titulo} className="rounded-2xl border border-border bg-background p-4">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border ${visual.iconeCor}`}
                    >
                      {IconeModulo ? (
                        <IconeModulo className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <span className="font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                      )}
                    </span>
                    <p className="mt-3 text-[13px] font-bold leading-snug">{modulo.titulo}</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                      {modulo.resumo}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-subtle-foreground">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      {modulo.aulas.length} blocos
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div id="conteudo-da-trilha" className="mt-6 scroll-mt-24">
            <TrilhaInterativa curso={curso} />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <GlossarioTrilha curso={curso} />
          </div>

          <p className="px-1 text-[12px] leading-relaxed text-subtle-foreground">
            Conteúdo informativo baseado em fontes reconhecidas. Não substitui
            acompanhamento profissional.
          </p>
        </aside>
      </div>
    </div>
  );
}
