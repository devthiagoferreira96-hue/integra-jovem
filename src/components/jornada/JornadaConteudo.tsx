"use client";

import Link from "next/link";
import { Check, Flag, Lock, Play } from "lucide-react";

import { PageHeading } from "@/components/layout/PageHeading";
import { ButtonLink } from "@/components/ui/AppButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import { CartaoXp } from "@/components/jornada/CartaoXp";
import { MinhasConquistas } from "@/components/conquistas/MinhasConquistas";
import { MedalhasDesafios } from "@/components/exercicios/MedalhasDesafios";
import { useJornada } from "@/hooks/useJornada";

const statusInfo = {
  concluida: { label: "Concluída", icon: Check },
  atual: { label: "Você está aqui", icon: Play },
  bloqueada: { label: "A seguir", icon: Lock },
} as const;

export function JornadaConteudo() {
  const { etapas, total, concluidas, percentual, atual, nadaIniciado, carregando } = useJornada();

  const acaoPrincipal = !atual
    ? { href: "/trilhas", texto: "Revisar trilhas" }
    : nadaIniciado
      ? { href: `/trilhas/${atual.curso.slug}`, texto: "Começar jornada" }
      : { href: `/trilhas/${atual.curso.slug}`, texto: "Continuar trilha" };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <PageHeading
        eyebrow="Trilha de evolução"
        title="Sua jornada até a vida adulta"
        description="Cada etapa concluída libera a próxima. Nada aqui é cobrança: se você parar por uma semana, a jornada continua exatamente onde estava."
        action={<ButtonLink href={acaoPrincipal.href}>{acaoPrincipal.texto}</ButtonLink>}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-2">
          <p className="eyebrow">Progresso da jornada</p>
          <ProgressBar
            className="mt-4"
            size="md"
            value={carregando ? 0 : percentual}
            label={
              carregando
                ? "Carregando seu progresso…"
                : `${concluidas} de ${total} etapas • ${percentual}% concluído`
            }
          />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="eyebrow">Etapa atual</p>
          <p className="mt-3 font-display text-2xl font-extrabold">
            {atual ? String(atual.numero).padStart(2, "0") : "✓"}
          </p>
          <p className="mt-1 truncate text-[12px] text-muted-foreground">
            {atual ? atual.curso.titulo : "jornada concluída"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <CartaoXp className="lg:col-span-2" />
        <MinhasConquistas className="min-h-[420px] lg:min-h-0" />
      </div>
      <MedalhasDesafios />

      <ol className="mt-12 relative space-y-4 pl-10 sm:pl-14">
        <span
          className="absolute left-[15px] top-2 bottom-2 w-px bg-border sm:left-[23px]"
          aria-hidden="true"
        />
        {etapas.map((etapa) => {
          const { label, icon: Icon } = statusInfo[etapa.status];
          const ativa = etapa.status === "atual";
          const bloqueada = etapa.status === "bloqueada";
          const iniciada = etapa.percentual > 0;

          const mostrarLink = !bloqueada || iniciada;
          const textoLink =
            etapa.status === "concluida"
              ? "Revisar conteúdo"
              : iniciada
                ? "Continuar etapa"
                : "Começar etapa";

          return (
            <li key={etapa.curso.slug} className="relative">
              <span
                className={`absolute -left-10 top-5 grid h-8 w-8 place-items-center rounded-full border sm:-left-14 sm:h-12 sm:w-12 ${
                  bloqueada
                    ? "border-border bg-surface text-subtle-foreground"
                    : "border-primary bg-primary text-primary-foreground"
                }`}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>

              <div
                className={`rounded-2xl border p-5 transition-colors sm:p-6 ${
                  ativa
                    ? "border-primary/40 bg-primary-dim"
                    : "border-border bg-surface hover:border-primary/30"
                } ${bloqueada ? "opacity-70" : ""}`}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle-foreground">
                      Etapa {String(etapa.numero).padStart(2, "0")}
                    </span>
                    <h2 className="mt-1 text-[17px] font-bold">{etapa.curso.titulo}</h2>
                  </div>
                  <Tag variant={ativa ? "solid" : bloqueada ? "muted" : "outline"}>{label}</Tag>
                </div>

                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {etapa.curso.descricao}
                </p>

                {etapa.status !== "concluida" && iniciada ? (
                  <ProgressBar
                    className="mt-4 max-w-sm"
                    value={etapa.percentual}
                    label={`${etapa.percentual}% da trilha lida`}
                  />
                ) : null}

                {mostrarLink ? (
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/trilhas/${etapa.curso.slug}`}
                      className="text-[13px] font-semibold text-primary hover:text-primary-light"
                    >
                      {textoLink}
                    </Link>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}

        <li className="relative">
          <span
            className="absolute -left-10 top-5 grid h-8 w-8 place-items-center rounded-full border border-dashed border-primary/60 text-primary sm:-left-14 sm:h-12 sm:w-12"
            aria-hidden="true"
          >
            <Flag className="h-4 w-4" />
          </span>
          <div className="rounded-2xl border border-dashed border-border p-5 sm:p-6">
            <h2 className="text-[15px] font-bold">Novas etapas em curadoria</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              O catálogo real está sendo montado pela equipe. Novas trilhas entram aqui como
              próximas etapas da jornada.
            </p>
          </div>
        </li>
      </ol>
    </div>
  );
}
