"use client";

import { History, ShieldAlert, Sparkles, TrendingUp, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Button } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatarMoeda, formatarMoedaQuebravel, formatarValorParaMascara, mascararValorDigitado, valorMascaradoParaNumero } from "@/lib/financas";
import { useSessao } from "@/hooks/useSessao";
import {
  carregarHistoricoCarteiraRemoto,
  inserirSimulacaoCarteiraRemoto,
  limparHistoricoCarteiraRemoto,
} from "@/lib/supabase/simuladores-remoto";
import {
  carregarHistoricoCarteira,
  gerarIdSimulacao,
  limparHistoricoCarteira,
  salvarSimulacaoCarteira,
  simularCarteira,
  type SimulacaoCarteira,
} from "@/lib/simuladores";

const cenarioInfo = {
  conservador: { label: "Conservador", icon: ShieldAlert },
  esperado: { label: "Esperado", icon: TrendingUp },
  otimista: { label: "Otimista", icon: Sparkles },
} as const;

const config: ChartConfig = {
  total: { label: "Resultado simulado", color: "var(--color-primary)" },
};

export function CarteiraInvestimentos() {
  const idBase = useId();
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [saldo, setSaldo] = useState(() => formatarValorParaMascara(1000));
  const [percentualFixa, setPercentualFixa] = useState(70);
  const [meses, setMeses] = useState("12");
  const [historico, setHistorico] = useState<SimulacaoCarteira[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const dados = userId
        ? await carregarHistoricoCarteiraRemoto(userId)
        : carregarHistoricoCarteira();
      if (cancelado) return;
      setHistorico(dados);
      setCarregado(true);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  const numSaldo = valorMascaradoParaNumero(saldo);
  const numMeses = Math.min(60, Math.max(1, Number(meses) || 0));

  const resultado = useMemo(
    () => simularCarteira(numSaldo, percentualFixa, numMeses),
    [numSaldo, percentualFixa, numMeses],
  );

  const dadosGrafico = resultado.cenarios.map((c) => ({
    cenario: cenarioInfo[c.cenario].label,
    total: c.total,
  }));

  const simular = async (event: FormEvent) => {
    event.preventDefault();
    if (!carregado) return;
    const esperado = resultado.cenarios.find((c) => c.cenario === "esperado");
    const simulacao: SimulacaoCarteira = {
      id: gerarIdSimulacao(),
      data: new Date().toISOString(),
      saldoFicticio: numSaldo,
      percentualRendaFixa: percentualFixa,
      meses: numMeses,
      resultadoEsperado: esperado?.total ?? 0,
    };
    if (userId) {
      await inserirSimulacaoCarteiraRemoto(userId, simulacao);
      setHistorico(await carregarHistoricoCarteiraRemoto(userId));
    } else {
      salvarSimulacaoCarteira(simulacao);
      setHistorico(carregarHistoricoCarteira());
    }
  };

  const limparHistorico = async () => {
    if (typeof window === "undefined") return;
    const confirmar = window.confirm(
      "Isso vai apagar todas as simulações de carteira de investimentos salvas. Continuar?",
    );
    if (!confirmar) return;
    if (userId) {
      await limparHistoricoCarteiraRemoto(userId);
    } else {
      limparHistoricoCarteira();
    }
    setHistorico([]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.3fr]">
      <form
        onSubmit={simular}
        className="space-y-6 rounded-3xl border border-border bg-surface p-6 sm:p-7"
      >
        <div>
          <p className="eyebrow">Prática com dinheiro fictício</p>
          <h2 className="mt-2 text-lg font-bold">Carteira de investimentos</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Sem dinheiro real e sem conexão com nenhuma instituição financeira — é só um
            espaço para praticar decisões de alocação.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-saldo`}>Saldo fictício (R$)</Label>
          <Input
            id={`${idBase}-saldo`}
            inputMode="decimal"
            placeholder="0,00"
            value={saldo}
            onChange={(e) => {
              const digitado = e.target.value;
              setSaldo((anterior) => mascararValorDigitado(digitado, anterior));
            }}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label>Divisão entre categorias</Label>
            <span className="font-mono text-[11px] text-muted-foreground">
              {percentualFixa}% renda fixa · {100 - percentualFixa}% renda variável
            </span>
          </div>
          <Slider
            value={[percentualFixa]}
            onValueChange={([v]) => setPercentualFixa(v ?? 70)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-meses`}>Horizonte (meses)</Label>
          <Input
            id={`${idBase}-meses`}
            type="number"
            min={1}
            max={60}
            value={meses}
            onChange={(e) => setMeses(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Salvar esta simulação
        </Button>
      </form>

      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <p className="eyebrow">3 cenários possíveis</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Investimentos não têm resultado garantido. Veja como a mesma divisão se
            comportaria em cenários diferentes.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {resultado.cenarios.map((c) => {
              const Icon = cenarioInfo[c.cenario].icon;
              return (
                <div key={c.cenario} className="rounded-2xl border border-border bg-surface-hi p-3 sm:p-4">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {cenarioInfo[c.cenario].label}
                  </p>
                  <p className="mt-1 font-mono text-[12px] font-bold sm:text-[13px]">
                    {formatarMoedaQuebravel(c.total)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <ChartContainer config={config} className="aspect-video max-h-[240px] w-full">
              <BarChart data={dadosGrafico} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="cenario" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(valor) => (
                        <span className="font-mono font-medium text-foreground">
                          {formatarMoeda(Number(valor))}
                        </span>
                      )}
                    />
                  }
                />
                <Bar dataKey="total" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
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
                    {formatarMoeda(s.saldoFicticio)} · {s.percentualRendaFixa}% fixa ·{" "}
                    {s.meses} meses
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {formatarMoeda(s.resultadoEsperado)}
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
