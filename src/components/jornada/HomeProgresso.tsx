"use client";

import { BookOpen, Sparkles, Target } from "lucide-react";

import { LogoIcon } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/AppButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import { desafioDoDia } from "@/data/content";
import { useJornada } from "@/hooks/useJornada";

export function ContinuarDeOndeParou() {
  const { atual, concluidas, emAndamento, nadaIniciado, carregando } = useJornada();

  const titulo = atual ? atual.curso.titulo : "Jornada concluída";
  const descricao = atual
    ? atual.curso.descricao
    : "Você concluiu todas as trilhas disponíveis. Novas etapas estão em curadoria.";
  const rotuloProgresso = carregando
    ? "Carregando seu progresso…"
    : !atual
      ? "100% • todas as trilhas concluídas"
      : atual.percentual === 0
        ? "Você ainda não começou esta trilha"
        : `${atual.percentual}% da trilha • salvo automaticamente`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">{nadaIniciado ? "Comece por aqui" : "Continue de onde parou"}</p>
            <h2 className="mt-2 truncate text-xl font-bold">{titulo}</h2>
          </div>
          <LogoIcon className="h-10 w-10 shrink-0" />
        </div>
        <p className="mt-3 text-[13px] text-muted-foreground">{descricao}</p>
        <ProgressBar
          className="mt-6"
          size="md"
          value={carregando ? 0 : atual ? atual.percentual : 100}
          label={rotuloProgresso}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={atual ? `/trilhas/${atual.curso.slug}` : "/trilhas"}>
            {!atual ? "Revisar trilhas" : atual.percentual === 0 ? "Começar trilha" : "Continuar trilha"}
          </ButtonLink>
          <ButtonLink href="/jornada" variant="outline">
            Ver jornada completa
          </ButtonLink>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-primary/30 bg-primary-dim p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="eyebrow">Desafio de hoje</span>
          </div>
          <p className="mt-3 font-display text-[15px] font-bold leading-snug">
            {desafioDoDia.titulo}
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">{desafioDoDia.descricao}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <Target className="h-4 w-4 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-xl font-extrabold">{carregando ? "–" : emAndamento}</p>
            <p className="text-[12px] text-muted-foreground">trilhas em andamento</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-xl font-extrabold">{carregando ? "–" : concluidas}</p>
            <p className="text-[12px] text-muted-foreground">trilhas concluídas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JornadaTeaserEtapas() {
  const { etapas } = useJornada();

  return (
    <ol className="relative space-y-3 border-l border-border pl-6">
      {etapas.slice(0, 4).map((etapa) => (
        <li key={etapa.curso.slug} className="relative">
          <span
            className={`absolute -left-[31px] top-3 h-2.5 w-2.5 rounded-full ${
              etapa.status === "bloqueada" ? "bg-border" : "bg-primary"
            }`}
            aria-hidden="true"
          />
          <div className="rounded-2xl border border-border bg-surface-hi p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="truncate text-[14px] font-bold">{etapa.curso.titulo}</h3>
              <Tag
                variant={
                  etapa.status === "atual" ? "solid" : etapa.status === "concluida" ? "outline" : "muted"
                }
              >
                {etapa.status === "atual" ? "Agora" : etapa.status === "concluida" ? "Feito" : "A seguir"}
              </Tag>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[12px] text-muted-foreground">
              {etapa.curso.descricao}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
