"use client";

import { PlusCircle } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/AppButton";
import {
  VALOR_MAXIMO,
  formatarMoeda,
  formatarMoedaQuebravel,
  formatarValorParaMascara,
  limitarValorDigitado,
  valorMascaradoParaNumero,
} from "@/lib/financas";

type RendaCardProps = {

  valor: number;

  saldo: number;
  onSalvar: (valor: number) => void;
};

export function RendaCard({ valor, saldo, onSalvar }: RendaCardProps) {
  const idCampo = useId();
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(formatarValorParaMascara(valor));
  const [excedeu, setExcedeu] = useState(false);

  const abrirEdicao = () => {
    setRascunho(formatarValorParaMascara(valor));
    setExcedeu(false);
    setEditando(true);
  };

  const digitar = (texto: string) => {
    const resultado = limitarValorDigitado(texto, rascunho);
    setRascunho(resultado.valor);
    setExcedeu(resultado.excedeu);
  };

  const confirmar = () => {
    const numero = valorMascaradoParaNumero(rascunho);
    if (Number.isFinite(numero) && numero >= 0 && numero <= VALOR_MAXIMO) {
      onSalvar(numero);
      setEditando(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-4 sm:w-fit sm:min-w-72">
      <p className="eyebrow whitespace-nowrap">Minha Renda Mensal</p>

      {editando ? (
        <div className="mt-2.5 space-y-2.5">
          <label htmlFor={idCampo} className="sr-only">
            Valor da minha renda (salário ou mesada)
          </label>
          <input
            id={idCampo}
            inputMode="decimal"
            autoFocus
            placeholder="Ex: 800 ou 800,00"
            value={rascunho}
            aria-describedby={excedeu ? `${idCampo}-limite` : undefined}
            aria-invalid={excedeu || undefined}
            onChange={(e) => digitar(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmar()}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-[13px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            style={{ width: `${Math.max(rascunho.length + 3, 10)}ch`, maxWidth: "100%" }}
          />
          {excedeu && (
            <p id={`${idCampo}-limite`} role="status" className="text-[12px] text-destructive">
              Use no máximo 9 dígitos antes da vírgula (até 999.999.999,99).
            </p>
          )}
          <Button type="button" size="sm" className="w-full" onClick={confirmar}>
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Salvar renda
          </Button>
        </div>
      ) : (
        <>
          {valor > 0 ? (
            <p
              className={`mt-1.5 font-display text-xl font-extrabold sm:whitespace-nowrap sm:text-2xl ${
                saldo >= 0 ? "text-primary-light" : "text-destructive"
              }`}
            >
              {formatarMoedaQuebravel(saldo)}
            </p>
          ) : (
            <p className="mt-1.5 text-[12px] text-muted-foreground sm:whitespace-nowrap">
              Some seu salário ou mesada para ver quanto sobra depois dos gastos.
            </p>
          )}
          {valor > 0 && (
            <p className="mt-1 text-[12px] text-muted-foreground sm:whitespace-nowrap">
              Renda: {formatarMoedaQuebravel(valor)}
            </p>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-3 w-full"
            onClick={abrirEdicao}
          >
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {valor > 0 ? "Editar renda" : "Adicionar renda"}
          </Button>
        </>
      )}
    </div>
  );
}
