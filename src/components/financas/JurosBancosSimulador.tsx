"use client";

import { Calculator, History, Landmark, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Button } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  formatarMoeda,
  formatarMoedaQuebravel,
  formatarValorParaMascara,
  mascararValorDigitado,
  valorMascaradoParaNumero,
} from "@/lib/financas";
import { useSessao } from "@/hooks/useSessao";
import {
  carregarHistoricoCDIRemoto,
  inserirSimulacaoCDIRemoto,
  limparHistoricoCDIRemoto,
} from "@/lib/supabase/simuladores-remoto";
import {
  bancosCDI,
  calcularJurosCompostos,
  carregarHistoricoCDI,
  CDI_ANUAL_REFERENCIA,
  gerarIdSimulacao,
  limparHistoricoCDI,
  salvarSimulacaoCDI,
  taxaMensalEquivalenteCDI,
  type SimulacaoCDI,
  type TipoInvestimentoCDI,
} from "@/lib/simuladores";

const config: ChartConfig = {
  total: { label: "Total acumulado", color: "var(--color-primary)" },
  aportado: { label: "Total aportado", color: "var(--color-muted-foreground)" },
};

const BANCO_PADRAO = bancosCDI[0].id;
const TIPO_PADRAO: TipoInvestimentoCDI = "cdb";
const VALOR_INICIAL_PADRAO = () => formatarValorParaMascara(1000);
const APORTE_MENSAL_PADRAO = () => formatarValorParaMascara(100);
const CDI_ANUAL_PADRAO = String(CDI_ANUAL_REFERENCIA).replace(".", ",");
const MESES_PADRAO = "12";

export function JurosBancosSimulador() {
  const idBase = useId();
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [bancoId, setBancoId] = useState(BANCO_PADRAO);
  const [tipo, setTipo] = useState<TipoInvestimentoCDI>(TIPO_PADRAO);
  const [cdiAnual, setCdiAnual] = useState(CDI_ANUAL_PADRAO);
  const [valorInicial, setValorInicial] = useState(VALOR_INICIAL_PADRAO);
  const [aporteMensal, setAporteMensal] = useState(APORTE_MENSAL_PADRAO);
  const [meses, setMeses] = useState(MESES_PADRAO);
  const [historico, setHistorico] = useState<SimulacaoCDI[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const dados = userId ? await carregarHistoricoCDIRemoto(userId) : carregarHistoricoCDI();
      if (cancelado) return;
      setHistorico(dados);
      setCarregado(true);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  const banco = useMemo(
    () => bancosCDI.find((b) => b.id === bancoId) ?? bancosCDI[0],
    [bancoId],
  );

  const numMeses = Math.min(360, Math.max(1, Number(meses) || 0));
  const numCdiAnual = Number(cdiAnual.replace(",", ".")) || 0;
  const numInicial = valorMascaradoParaNumero(valorInicial);
  const numAporte = valorMascaradoParaNumero(aporteMensal);

  const taxaMensal = useMemo(
    () => taxaMensalEquivalenteCDI(numCdiAnual, banco.percentualCDI[tipo]),
    [numCdiAnual, banco.percentualCDI, tipo],
  );

  const pontos = useMemo(
    () => calcularJurosCompostos(numInicial, numAporte, taxaMensal, numMeses),
    [numInicial, numAporte, taxaMensal, numMeses],
  );

  const ultimo = pontos[pontos.length - 1];

  const limparSimulacao = () => {
    setBancoId(BANCO_PADRAO);
    setTipo(TIPO_PADRAO);
    setCdiAnual(CDI_ANUAL_PADRAO);
    setValorInicial(VALOR_INICIAL_PADRAO());
    setAporteMensal(APORTE_MENSAL_PADRAO());
    setMeses(MESES_PADRAO);
  };

  const limparHistorico = async () => {
    if (typeof window === "undefined") return;
    const confirmar = window.confirm(
      "Isso vai apagar todas as simulações de Juros Bancos CDI salvas. Continuar?",
    );
    if (!confirmar) return;
    if (userId) {
      await limparHistoricoCDIRemoto(userId);
    } else {
      limparHistoricoCDI();
    }
    setHistorico([]);
  };

  const simular = async (event: FormEvent) => {
    event.preventDefault();
    if (!carregado || !ultimo) return;
    const simulacao: SimulacaoCDI = {
      id: gerarIdSimulacao(),
      data: new Date().toISOString(),
      bancoId: banco.id,
      bancoNome: banco.nome,
      tipo,
      percentualCDI: banco.percentualCDI[tipo],
      cdiAnual: numCdiAnual,
      valorInicial: numInicial,
      aporteMensal: numAporte,
      meses: numMeses,
      totalFinal: ultimo.total,
      jurosGanhos: ultimo.juros,
    };
    if (userId) {
      await inserirSimulacaoCDIRemoto(userId, simulacao);
      setHistorico(await carregarHistoricoCDIRemoto(userId));
    } else {
      salvarSimulacaoCDI(simulacao);
      setHistorico(carregarHistoricoCDI());
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.3fr]">
      <form
        onSubmit={simular}
        className="space-y-5 rounded-3xl border border-border bg-surface p-6 sm:p-7"
      >
        <div>
          <p className="eyebrow">Comparador educativo</p>
          <h2 className="mt-2 text-lg font-bold">Juros Bancos CDI</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Percentuais do CDI ilustrativos (não são taxas reais/atualizadas dos bancos).
            O CDI de referência é editável — atualize com a taxa vigente se quiser.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-tipo`}>Tipo de investimento</Label>
          <ToggleGroup
            id={`${idBase}-tipo`}
            type="single"
            value={tipo}
            onValueChange={(valor) => valor && setTipo(valor as TipoInvestimentoCDI)}
            className="justify-start gap-2"
          >
            <ToggleGroupItem
              value="cdi"
              className="rounded-lg border border-border px-4 data-[state=on]:border-primary data-[state=on]:bg-primary-dim data-[state=on]:text-primary-light"
            >
              CDI
            </ToggleGroupItem>
            <ToggleGroupItem
              value="cdb"
              className="rounded-lg border border-border px-4 data-[state=on]:border-primary data-[state=on]:bg-primary-dim data-[state=on]:text-primary-light"
            >
              CDB
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-[12px] text-muted-foreground">
            {tipo === "cdi"
              ? "Conta ou fundo referenciado no CDI: liquidez diária, sem prazo mínimo."
              : "CDB: geralmente rende mais, mas prende o dinheiro por um prazo."}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-banco`}>Banco</Label>
          <Select value={bancoId} onValueChange={setBancoId}>
            <SelectTrigger id={`${idBase}-banco`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bancosCDI.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Landmark className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            Rende {banco.percentualCDI[tipo]}% do CDI ({tipo === "cdi" ? "conta CDI" : "CDB"}) ·
            muda automaticamente ao trocar o banco ou o tipo
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${idBase}-cdi`}>CDI ao ano (%)</Label>
            <Input
              id={`${idBase}-cdi`}
              inputMode="decimal"
              value={cdiAnual}
              onChange={(e) => setCdiAnual(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idBase}-meses`}>Prazo (meses)</Label>
            <Input
              id={`${idBase}-meses`}
              type="number"
              min={1}
              max={360}
              value={meses}
              onChange={(e) => setMeses(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-inicial`}>Valor inicial (R$)</Label>
          <Input
            id={`${idBase}-inicial`}
            inputMode="decimal"
            placeholder="0,00"
            value={valorInicial}
            onChange={(e) => {
              const digitado = e.target.value;
              setValorInicial((anterior) => mascararValorDigitado(digitado, anterior));
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-aporte`}>Aporte mensal (R$)</Label>
          <Input
            id={`${idBase}-aporte`}
            inputMode="decimal"
            placeholder="0,00"
            value={aporteMensal}
            onChange={(e) => {
              const digitado = e.target.value;
              setAporteMensal((anterior) => mascararValorDigitado(digitado, anterior));
            }}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="flex-1">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Salvar esta simulação
          </Button>
          <Button type="button" variant="outline" onClick={limparSimulacao}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpar simulação
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="eyebrow">Total investido</p>
              <p className="mt-2 font-display text-xl font-extrabold">
                {formatarMoedaQuebravel(ultimo?.aportado ?? 0)}
              </p>
            </div>
            <div>
              <p className="eyebrow">Ganho com juros</p>
              <p className="mt-2 font-display text-xl font-extrabold text-primary">
                {formatarMoedaQuebravel(ultimo?.juros ?? 0)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow">Total final</p>
              <p className="mt-2 font-display text-xl font-extrabold">
                {formatarMoedaQuebravel(ultimo?.total ?? 0)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[12px] text-muted-foreground">
            Taxa equivalente: {taxaMensal.toFixed(3).replace(".", ",")}% ao mês, calculada a
            partir de {numCdiAnual.toString().replace(".", ",")}% de CDI ao ano ×{" "}
            {banco.percentualCDI[tipo]}% do {banco.nome} ({tipo === "cdi" ? "conta CDI" : "CDB"}).
          </p>

          <div className="mt-6">
            <ChartContainer config={config} className="aspect-video max-h-[280px] w-full">
              <LineChart data={pontos} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => `${v}m`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(valor, nome) => (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="text-muted-foreground">
                            {nome === "total" ? "Total acumulado" : "Total aportado"}
                          </span>
                          <span className="font-mono font-medium text-foreground">
                            {formatarMoeda(Number(valor))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="aportado"
                  stroke="var(--color-muted-foreground)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        {historico.length > 0 ? (
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="text-[15px] font-bold">Histórico de simulações</h3>
            </div>
            <ul className="mt-4 space-y-2">
              {historico.slice(0, 5).map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface-hi px-4 py-2.5 text-[12px]"
                >
                  <span className="text-muted-foreground">
                    {s.bancoNome} · {s.percentualCDI}% do CDI ({s.tipo === "cdi" ? "conta CDI" : "CDB"}
                    , {s.cdiAnual}% a.a.) · {formatarMoeda(s.valorInicial)} inicial +{" "}
                    {formatarMoeda(s.aporteMensal)}/mês · {s.meses} meses
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {formatarMoeda(s.totalFinal)}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={limparHistorico}
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Limpar histórico
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
