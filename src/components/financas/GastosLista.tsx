"use client";

import { Trash2 } from "lucide-react";
import { useMemo } from "react";

import {
  formatarMoeda,
  infoDaCategoria,
  montarMapaCategorias,
  type CategoriaCustom,
  type Gasto,
} from "@/lib/financas";

type GastosListaProps = {
  gastos: Gasto[];
  onRemover: (id: string) => void;
  categoriasCustom: CategoriaCustom[];
};

export function GastosLista({ gastos, onRemover, categoriasCustom }: GastosListaProps) {
  const mapaCategorias = useMemo(() => montarMapaCategorias(categoriasCustom), [categoriasCustom]);

  if (gastos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-6 text-center text-[13px] text-muted-foreground">
        Nenhum gasto lançado neste mês ainda. Use o formulário para adicionar o primeiro.
      </div>
    );
  }

  const ordenados = [...gastos].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );

  return (
    <ul className="space-y-2.5">
      {ordenados.map((gasto) => {
        const info = infoDaCategoria(gasto.categoria, mapaCategorias);
        const Icon = info.icon;
        return (
          <li
            key={gasto.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5"
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${info.cor}22`, color: info.cor }}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold">{info.label}</p>
              {gasto.observacao ? (
                <p className="text-[12px] text-muted-foreground">{gasto.observacao}</p>
              ) : null}
            </div>
            <span className="shrink-0 whitespace-nowrap font-mono text-[13px] font-semibold">
              {formatarMoeda(gasto.valor)}
            </span>
            <button
              type="button"
              onClick={() => onRemover(gasto.id)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Remover gasto de ${info.label}, ${formatarMoeda(gasto.valor)}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
