"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CATEGORIA_RENDA,
  corRenda,
  formatarMesLabel,
  formatarMoeda,
  labelDeChave,
  labelRenda,
  mesesDoAno,
  montarMapaCategorias,
  montarOrdemCategorias,
  ultimosMeses,
  type CategoriaCustom,
  type Gasto,
  type RendaPorMes,
} from "@/lib/financas";

type EvolucaoMensalChartProps = {
  gastos: Gasto[];

  rendas?: RendaPorMes;
  quantidadeMeses?: number;
  categoriasCustom: CategoriaCustom[];
};

export function EvolucaoMensalChart({
  gastos,
  rendas = {},
  quantidadeMeses = 6,
  categoriasCustom,
}: EvolucaoMensalChartProps) {

  const meses = useMemo(
    () => (quantidadeMeses === 12 ? mesesDoAno() : ultimosMeses(quantidadeMeses)),
    [quantidadeMeses],
  );
  const mapaCategorias = useMemo(() => montarMapaCategorias(categoriasCustom), [categoriasCustom]);
  const ordemTodasCategorias = useMemo(
    () => montarOrdemCategorias(categoriasCustom),
    [categoriasCustom],
  );

  const dados = useMemo(() => {
    return meses.map((mes) => {
      const linha: Record<string, number | string> = { mes, mesLabel: formatarMesLabel(mes) };
      ordemTodasCategorias.forEach((chave) => {
        linha[chave] = gastos
          .filter((g) => g.mes === mes && g.categoria === chave)
          .reduce((acc, g) => acc + g.valor, 0);
      });
      linha[CATEGORIA_RENDA] = rendas[mes] ?? 0;
      return linha;
    });
  }, [gastos, meses, rendas, ordemTodasCategorias]);

  const config: ChartConfig = useMemo(() => {
    const base: ChartConfig = {};
    ordemTodasCategorias.forEach((chave) => {
      base[chave] = { label: mapaCategorias[chave].label, color: mapaCategorias[chave].cor };
    });
    base[CATEGORIA_RENDA] = { label: labelRenda, color: corRenda };
    return base;
  }, [ordemTodasCategorias, mapaCategorias]);

  const temDados = dados.some(
    (linha) =>
      ordemTodasCategorias.some((chave) => Number(linha[chave]) > 0) ||
      Number(linha[CATEGORIA_RENDA]) > 0,
  );

  if (!temDados) {
    return (
      <div className="grid aspect-video max-h-[300px] place-items-center rounded-2xl border border-dashed border-border p-6 text-center text-[13px] text-muted-foreground">
        Lance gastos (ou sua renda) em diferentes meses para acompanhar a evolução aqui.
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="aspect-video max-h-[300px] w-full">
      <BarChart data={dados} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="mesLabel"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(valor, nome, item) => (
                <div className="flex w-full items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-muted-foreground">
                    {labelDeChave(String(nome), mapaCategorias)}
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatarMoeda(Number(valor))}
                  </span>
                </div>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {ordemTodasCategorias.map((chave) => (
          <Bar key={chave} dataKey={chave} stackId="gastos" fill={mapaCategorias[chave].cor} />
        ))}
        <Bar dataKey={CATEGORIA_RENDA} fill={corRenda} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
