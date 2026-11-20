"use client";

import { ArrowRight, BookOpen, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import type { Curso } from "@/data/content";
import { useSessao } from "@/hooks/useSessao";
import { categoriaVisual, categoriaVisualPadrao } from "@/lib/categorias-visual";
import { heroIlustracaoPorTrilha, corPorTrilha } from "@/lib/trilha-ilustracoes";
import { calcularProgressoCurso, carregarProgresso, type ProgressoOverlay } from "@/lib/progresso";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";

export function TrilhaHero({ curso }: { curso: Curso }) {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [overlay, setOverlay] = useState<ProgressoOverlay>({});

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const dados = userId ? await carregarProgressoRemoto(userId) : carregarProgresso();
      if (!cancelado) setOverlay(dados);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  const { percentual } = calcularProgressoCurso(curso, overlay);
  const iniciado = percentual > 0;
  const visualCategoria = categoriaVisual[curso.categoria] ?? categoriaVisualPadrao;
  const visual = { ...visualCategoria, ...corPorTrilha[curso.slug] };
  const Icone = visualCategoria.icon;
  const Ilustracao = heroIlustracaoPorTrilha[curso.slug];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface">

      <div
        className={`absolute inset-0 bg-gradient-to-br ${visual.gradiente.de} ${visual.gradiente.para}`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-2xl ${visual.glow}`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full blur-3xl opacity-60 ${visual.glow}`}
        aria-hidden="true"
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id={`grade-${curso.slug}`} width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grade-${curso.slug})`} />
      </svg>

      {!Ilustracao ? (
        <Icone
          className={`pointer-events-none absolute -right-8 -bottom-6 h-52 w-52 opacity-[0.07] ${visual.iconeCor}`}
          aria-hidden="true"
          strokeWidth={1}
        />
      ) : null}

      <div className="relative flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Tag variant="solid">{curso.categoria}</Tag>
            <Tag variant="outline">{curso.nivel}</Tag>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{curso.titulo}</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {curso.resumoLongo}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {curso.duracao}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {curso.blocos} blocos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className={`h-3.5 w-3.5 ${visual.iconeCor}`} aria-hidden="true" />
              {curso.avaliacao.toFixed(1)} / 5
            </span>
          </div>

          <div className="max-w-sm">
            {iniciado ? (
              <ProgressBar value={percentual} label={`${percentual}% concluído`} />
            ) : (
              <a
                href="#conteudo-da-trilha"
                className="inline-flex items-center gap-1.5 text-[14px] font-bold text-primary hover:text-primary-light"
              >
                Começar trilha
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {Ilustracao ? (
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div
              className={`absolute inset-0 rounded-full blur-2xl ${visual.glow}`}
              aria-hidden="true"
            />
            <div className="relative grid h-52 w-52 place-items-center rounded-full border border-white/10 bg-background/40 p-4 backdrop-blur-sm sm:h-72 sm:w-72">
              <Ilustracao className={`h-full w-full ${visual.iconeCor}`} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
