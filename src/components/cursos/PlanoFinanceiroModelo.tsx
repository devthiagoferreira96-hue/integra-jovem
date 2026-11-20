"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  carregarGastos,
  carregarRendas,
  formatarMoeda,
  formatarValorParaMascara,
  gerarId,
  mascararValorDigitado,
  mesAtual,
  salvarGastos,
  salvarRendas,
  valorMascaradoParaNumero,
  type Gasto,
} from "@/lib/financas";
import { useSessao } from "@/hooks/useSessao";
import { inserirGastoRemoto, definirRendaRemoto } from "@/lib/supabase/financas-remoto";

type CategoriaExemplo = "mercado" | "transporte" | "energia" | "academia";

const categoriaLabel: Record<CategoriaExemplo, string> = {
  mercado: "Lanches e compras",
  transporte: "Transporte",
  energia: "Contas/energia",
  academia: "Lazer",
};

const planoExemplo = {
  renda: 150,
  categorias: {
    mercado: 60,
    transporte: 40,
    energia: 20,
    academia: 20,
  } as Record<CategoriaExemplo, number>,
  metaNome: "Meu objetivo",
  metaValor: 300,
  metaPrazoMeses: 4,
  reservaMensal: 10,
};

type Props = {

  antesDeExportar?: () => Promise<void>;

  onExportado?: () => void;
};

export function PlanoFinanceiroModelo({ antesDeExportar, onExportado }: Props = {}) {
  const { usuario } = useSessao();
  const userId = usuario?.id;

  const [renda, setRenda] = useState(formatarValorParaMascara(planoExemplo.renda));
  const [categorias, setCategorias] = useState<Record<CategoriaExemplo, string>>(
    Object.fromEntries(
      Object.entries(planoExemplo.categorias).map(([c, v]) => [c, formatarValorParaMascara(v)]),
    ) as Record<CategoriaExemplo, string>,
  );
  const [metaNome, setMetaNome] = useState(planoExemplo.metaNome);
  const [metaValor, setMetaValor] = useState(formatarValorParaMascara(planoExemplo.metaValor));
  const [metaPrazoMeses, setMetaPrazoMeses] = useState(String(planoExemplo.metaPrazoMeses));
  const [reservaMensal, setReservaMensal] = useState(
    formatarValorParaMascara(planoExemplo.reservaMensal),
  );
  const [exportado, setExportado] = useState(false);
  const [exportando, setExportando] = useState(false);

  const numRenda = valorMascaradoParaNumero(renda);
  const numCategorias = Object.fromEntries(
    Object.entries(categorias).map(([c, v]) => [c, valorMascaradoParaNumero(v)]),
  ) as Record<CategoriaExemplo, number>;
  const numMetaValor = valorMascaradoParaNumero(metaValor);
  const numMetaPrazo = Math.max(1, Number(metaPrazoMeses) || 1);
  const numReserva = valorMascaradoParaNumero(reservaMensal);

  const totalOrcamento = useMemo(
    () => Object.values(numCategorias).reduce((acc, v) => acc + v, 0) + numReserva,
    [numCategorias, numReserva],
  );
  const saldo = numRenda - totalOrcamento;
  const aporteNecessarioMeta = numMetaValor / numMetaPrazo;

  const exportar = async () => {
    setExportando(true);
    if (antesDeExportar) await antesDeExportar();
    const mes = mesAtual();

    const novosGastos: Gasto[] = [
      ...Object.entries(numCategorias)
        .filter(([, valor]) => valor > 0)
        .map(([categoria, valor]) => ({
          id: gerarId(),
          categoria,
          valor,
          mes,
          criadoEm: new Date().toISOString(),
          observacao: "Plano financeiro (trilha Seu primeiro dinheiro)",
        })),
      ...(numReserva > 0
        ? [
            {
              id: gerarId(),
              categoria: "reserva",
              valor: numReserva,
              mes,
              criadoEm: new Date().toISOString(),
              observacao: `Reserva do plano — meta: ${metaNome || "meu objetivo"}`,
            },
          ]
        : []),
    ];

    if (userId) {
      await Promise.all([
        definirRendaRemoto(userId, mes, numRenda),
        ...novosGastos.map((g) => inserirGastoRemoto(userId, g)),
      ]);
    } else {
      salvarRendas({ ...carregarRendas(), [mes]: numRenda });
      salvarGastos([...carregarGastos(), ...novosGastos]);
    }

    setExportando(false);
    setExportado(true);

    onExportado?.();
  };

  return (
    <div className="mt-3 space-y-4 rounded-xl border border-dashed border-primary/40 bg-primary-dim p-4">
      <div>
        <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary-light">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Plano de exemplo — edite os valores como quiser
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Já vem preenchido com o exemplo da aula. Mude qualquer número antes de exportar.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="plano-renda" className="text-[12px]">
            Renda mensal (R$)
          </Label>
          <Input
            id="plano-renda"
            inputMode="numeric"
            value={renda}
            onChange={(e) => {
              const digitado = e.target.value;
              setRenda((anterior) => mascararValorDigitado(digitado, anterior));
            }}
            className="h-9 text-[13px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Reserva mensal (R$)</Label>
          <Input
            inputMode="numeric"
            value={reservaMensal}
            onChange={(e) => {
              const digitado = e.target.value;
              setReservaMensal((anterior) => mascararValorDigitado(digitado, anterior));
            }}
            className="h-9 text-[13px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[12px]">Orçamento por categoria (R$)</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(categoriaLabel) as CategoriaExemplo[]).map((c) => (
            <div key={c} className="flex items-center gap-2">
              <span className="w-32 shrink-0 truncate text-[12px] text-muted-foreground">
                {categoriaLabel[c]}
              </span>
              <Input
                inputMode="numeric"
                value={categorias[c]}
                onChange={(e) =>
                  setCategorias((prev) => ({ ...prev, [c]: mascararValorDigitado(e.target.value, prev[c]) }))
                }
                className="h-8 text-[13px]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <Label className="text-[12px]">Nome da meta</Label>
          <Input
            value={metaNome}
            onChange={(e) => setMetaNome(e.target.value)}
            className="h-9 text-[13px]"
            maxLength={40}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Valor da meta (R$)</Label>
          <Input
            inputMode="numeric"
            value={metaValor}
            onChange={(e) => {
              const digitado = e.target.value;
              setMetaValor((anterior) => mascararValorDigitado(digitado, anterior));
            }}
            className="h-9 text-[13px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Prazo (meses)</Label>
          <Input
            type="number"
            min={1}
            max={60}
            value={metaPrazoMeses}
            onChange={(e) => setMetaPrazoMeses(e.target.value)}
            className="h-9 text-[13px]"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-3 text-[12px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Saldo do plano (renda − orçamento − reserva)</span>
          <span className={`font-mono font-semibold ${saldo >= 0 ? "text-primary-light" : "text-destructive"}`}>
            {formatarMoeda(saldo)}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-muted-foreground">Aporte necessário para a meta</span>
          <span className="font-mono font-semibold">{formatarMoeda(aporteNecessarioMeta)}/mês</span>
        </div>
        {aporteNecessarioMeta > numReserva ? (
          <p className="mt-1.5 text-[11px] text-destructive">
            A meta pede mais por mês do que a reserva planejada — ajuste o prazo, o valor da
            meta ou a reserva.
          </p>
        ) : null}
      </div>

      {exportado ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/40 bg-background/40 p-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="flex-1 text-[12px] text-muted-foreground">
            Plano exportado para o mês atual no Controle de Gastos.
          </p>
          <Link
            href="/financas"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-light"
          >
            Ver no Controle de Gastos
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button type="button" size="sm" onClick={exportar} disabled={exportando}>
            {exportando ? "Exportando..." : "Exportar para o Controle de Gastos"}
          </Button>
          <Link
            href={`/financas/simulacoes?aporte=${Math.round(numReserva)}&meses=${numMetaPrazo}`}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-light"
          >
            Testar a meta no Simulador de Juros Compostos
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
