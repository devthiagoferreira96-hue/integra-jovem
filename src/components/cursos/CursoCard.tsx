"use client";

import Link from "next/link";
import { ArrowRight, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import type { Curso } from "@/data/content";
import { useSessao } from "@/hooks/useSessao";
import { categoriaVisual, categoriaVisualPadrao } from "@/lib/categorias-visual";
import { calcularProgressoCurso, carregarProgresso, type ProgressoOverlay } from "@/lib/progresso";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";
import { heroIlustracaoPorTrilha, corPorTrilha } from "@/lib/trilha-ilustracoes";

export function CursoCard({ curso }: { curso: Curso }) {
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
  const acento = corPorTrilha[curso.slug] ?? categoriaVisual[curso.categoria] ?? categoriaVisualPadrao;
  const Ilustracao = heroIlustracaoPorTrilha[curso.slug];

  return (
    <Link
      href={`/trilhas/${curso.slug}`}
      className="card-surface group flex flex-col overflow-hidden"
    >
      <div className="relative flex h-28 items-end overflow-hidden border-b border-white/5 p-4">

        <div
          className={`pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full blur-2xl ${acento.glow}`}
          aria-hidden="true"
        />

        {Ilustracao ? (
          <Ilustracao className="pointer-events-none absolute -right-5 -top-9 h-36 w-36" />
        ) : null}

        <span className="pointer-events-none absolute bottom-0.5 right- rounded-full bg-background/70 px-2 py-0.5 font-mono text-[10px] text-subtle-foreground backdrop-blur-sm">
          {curso.blocos} blocos
        </span>

        <span className="absolute bottom-6 left-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className={`h-1.5 w-1.5 rounded-full ${acento.dot}`} aria-hidden="true" />
          {curso.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
         <Tag variant="neutral-soft">{curso.nivel}</Tag>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-subtle-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {curso.duracao}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            <Star className="h-3 w-3 text-primary" aria-hidden="true" />
            {curso.avaliacao.toFixed(1)}
          </span>
        </div>

        <h3 className="mt-3 text-[17px] font-bold leading-snug">{curso.titulo}</h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
          {curso.descricao}
        </p>

        <div className="mt-auto pt-5">
          {iniciado ? (
            <ProgressBar value={percentual} label={`${percentual}% concluído`} />
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-transform group-hover:translate-x-0.5">
              Começar trilha
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}