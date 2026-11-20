"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeading } from "@/components/layout/PageHeading";
import { glossario } from "@/data/content";

export default function GlossarioPage() {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const alvo = busca.trim().toLowerCase();
    if (!alvo) return glossario;
    return glossario.filter(
      (t) =>
        t.termo.toLowerCase().includes(alvo) || t.definicao.toLowerCase().includes(alvo),
    );
  }, [busca]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <PageHeading
        eyebrow="Sempre à mão"
        title="Glossário financeiro"
        description="Termos que aparecem nas trilhas e nos simuladores, explicados sem jargão. Acesse esta página a qualquer momento pelo menu."
      />

      <label className="relative mt-8 block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">Buscar termo</span>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar um termo (ex.: CDI, reserva, aporte...)"
          className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm placeholder:text-subtle-foreground focus:border-primary focus:outline-none"
        />
      </label>

      <dl className="mt-8 space-y-3">
        {filtrados.map((t) => (
          <div key={t.termo} className="rounded-2xl border border-border bg-surface p-5">
            <dt className="text-[15px] font-bold text-primary-light">{t.termo}</dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              {t.definicao}
            </dd>
          </div>
        ))}
        {filtrados.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
            Nenhum termo encontrado para &quot;{busca}&quot;.
          </p>
        ) : null}
      </dl>
    </div>
  );
}
