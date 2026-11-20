"use client";

import { PiggyBank, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  formatarMoeda,
  formatarMoedaQuebravel,
  formatarValorParaMascara,
  labelDeChave,
  mascararValorDigitado,
  montarMapaCategorias,
  valorMascaradoParaNumero,
  type CategoriaCustom,
  type CategoriaGasto,
} from "@/lib/financas";

type ResumoCardsProps = {
  totalDespesasMes: number;
  categoriaMaisPesada: { categoria: CategoriaGasto; valor: number } | null;
  quantidadeLancamentosMes: number;
  totalReservaAcumulado: number;
  metaReserva: number;
  onAlterarMetaReserva: (valor: number) => void;
  categoriasCustom: CategoriaCustom[];
};

export function ResumoCards({
  totalDespesasMes,
  categoriaMaisPesada,
  quantidadeLancamentosMes,
  totalReservaAcumulado,
  metaReserva,
  onAlterarMetaReserva,
  categoriasCustom,
}: ResumoCardsProps) {
  const mapaCategorias = useMemo(() => montarMapaCategorias(categoriasCustom), [categoriasCustom]);
  const idMeta = useId();
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [metaRascunho, setMetaRascunho] = useState(formatarValorParaMascara(metaReserva));

  const progresso = metaReserva > 0 ? (totalReservaAcumulado / metaReserva) * 100 : 0;

  const textoCategoriaMaisPesada = categoriaMaisPesada
    ? labelDeChave(categoriaMaisPesada.categoria, mapaCategorias)
    : "—";

  const confirmarMeta = () => {
    const valor = valorMascaradoParaNumero(metaRascunho);
    if (Number.isFinite(valor) && valor > 0) {
      onAlterarMetaReserva(valor);
    }
    setEditandoMeta(false);
  };

  return (

    <div className="flex flex-wrap gap-4">
      <div className="min-w-0 flex-1 basis-[calc(50%-0.5rem)] rounded-2xl sm:min-w-fit sm:basis-auto border border-border bg-surface p-5">
        <Receipt className="h-4 w-4 text-primary" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-extrabold sm:whitespace-nowrap sm:text-xl">
          {formatarMoedaQuebravel(totalDespesasMes)}
        </p>
        <p className="text-[12px] text-muted-foreground sm:whitespace-nowrap">
          gasto no mês selecionado
        </p>
      </div>

      <div className="min-w-0 flex-1 basis-[calc(50%-0.5rem)] rounded-2xl sm:min-w-fit sm:basis-auto border border-border bg-surface p-5">
        <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-extrabold sm:whitespace-nowrap sm:text-xl">
          {textoCategoriaMaisPesada}
        </p>
        <p className="text-[12px] text-muted-foreground sm:whitespace-nowrap">
          {categoriaMaisPesada
            ? `maior gasto · ${formatarMoedaQuebravel(categoriaMaisPesada.valor)}`
            : "nenhum gasto ainda"}
        </p>
      </div>

      <div className="min-w-0 flex-1 basis-[calc(50%-0.5rem)] rounded-2xl sm:min-w-fit sm:basis-auto border border-border bg-surface p-5">
        <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-extrabold sm:whitespace-nowrap sm:text-xl">
          {quantidadeLancamentosMes}
        </p>
        <p className="text-[12px] text-muted-foreground sm:whitespace-nowrap">
          lançamentos no mês
        </p>
      </div>

      <div className="min-w-0 flex-1 basis-[calc(50%-0.5rem)] rounded-2xl sm:min-w-fit sm:basis-auto border border-primary/30 bg-primary-dim p-5">
        <PiggyBank className="h-4 w-4 text-primary" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-extrabold sm:whitespace-nowrap sm:text-xl">
          {formatarMoedaQuebravel(totalReservaAcumulado)}
        </p>
        <ProgressBar
          className="mt-3"
          value={progresso}
          label={`${Math.min(100, Math.round(progresso))}% da meta`}
        />
        {editandoMeta ? (
          <div className="mt-2.5 space-y-1.5">
            <label htmlFor={idMeta} className="sr-only">
              Meta da reserva de emergência
            </label>
            <input
              id={idMeta}
              inputMode="decimal"
              value={metaRascunho}
              onChange={(e) => {
              const digitado = e.target.value;
              setMetaRascunho((anterior) => mascararValorDigitado(digitado, anterior));
            }}
              onKeyDown={(e) => e.key === "Enter" && confirmarMeta()}
              className="h-7 rounded-md border border-input bg-transparent px-2 text-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              style={{ width: `${Math.max(metaRascunho.length + 3, 8)}ch`, maxWidth: "100%" }}
              autoFocus
            />
            <button
              type="button"
              onClick={confirmarMeta}
              className="text-[11px] font-semibold text-primary hover:text-primary-light"
            >
              Salvar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMetaRascunho(formatarValorParaMascara(metaReserva));
              setEditandoMeta(true);
            }}
            className="mt-2.5 text-left text-[11px] sm:whitespace-nowrap text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-primary-light"
          >
            Meta: {formatarMoedaQuebravel(metaReserva)} · editar
          </button>
        )}
      </div>
    </div>
  );
}
