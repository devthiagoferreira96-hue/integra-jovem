"use client";

import { BookMarked, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { buttonClass } from "@/components/ui/AppButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { glossario, type Curso } from "@/data/content";

function termosDaTrilha(curso: Curso) {
  const textoDaTrilha = [
    curso.titulo,
    curso.descricao,
    curso.resumoLongo,
    ...curso.modulos.flatMap((m) => [
      m.titulo,
      m.resumo,
      ...m.aulas.flatMap((a) => [a.titulo, a.conteudo ?? "", a.pergunta ?? ""]),
    ]),
  ]
    .join(" \n ")
    .toLowerCase();

  return glossario.filter((t) => textoDaTrilha.includes(t.termo.toLowerCase()));
}

export function GlossarioTrilha({ curso }: { curso: Curso }) {
  const [aberto, setAberto] = useState(false);
  const termos = useMemo(() => termosDaTrilha(curso), [curso]);

  return (
    <Collapsible open={aberto} onOpenChange={setAberto}>
      <CollapsibleTrigger
        className={buttonClass(
          "outline",
          "md",
          "w-full justify-between !border-cyan-400/50 !text-cyan-300 hover:!border-cyan-300 hover:!text-cyan-200",
        )}
      >
        <span className="inline-flex items-center gap-2">
          <BookMarked className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
          Consultar glossário
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-cyan-300 transition-transform duration-200 ${
            aberto ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3 overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1">
        <div className="rounded-2xl border border-border bg-surface-hi p-4">
          {termos.length > 0 ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.08em] text-subtle-foreground">
                Termos desta trilha
              </p>
              <dl className="mt-3 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                {termos.map((t) => (
                  <div key={t.termo}>
                    <dt className="text-[13px] font-bold text-primary-light">{t.termo}</dt>
                    <dd className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                      {t.definicao}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Nenhum termo do glossário aparece nesta trilha ainda.
            </p>
          )}
          <Link
            href="/glossario"
            className="mt-4 inline-block text-[12px] font-semibold text-primary hover:text-primary-light"
          >
            Ver glossário completo →
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
