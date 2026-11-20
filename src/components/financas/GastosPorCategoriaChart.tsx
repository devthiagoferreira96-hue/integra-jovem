"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CATEGORIA_RENDA,
  corDeChave,
  corRenda,
  formatarMoeda,
  labelDeChave,
  labelRenda,
  montarMapaCategorias,
  montarOrdemCategorias,
  type CategoriaCustom,
  type Gasto,
} from "@/lib/financas";

type GastosPorCategoriaChartProps = {
  gastos: Gasto[];

  renda?: number;
  categoriasCustom: CategoriaCustom[];
};

export function GastosPorCategoriaChart({
  gastos,
  renda = 0,
  categoriasCustom,
}: GastosPorCategoriaChartProps) {
  const mapaCategorias = useMemo(() => montarMapaCategorias(categoriasCustom), [categoriasCustom]);
  const ordemTodasCategorias = useMemo(
    () => montarOrdemCategorias(categoriasCustom),
    [categoriasCustom],
  );

  const dados = useMemo(() => {
    const itensDespesa = ordemTodasCategorias
      .map((chave) => {
        const valor = gastos
          .filter((g) => g.categoria === chave)
          .reduce((acc, g) => acc + g.valor, 0);
        return {
          categoria: chave,
          valor,
          fill: mapaCategorias[chave].cor,
        };
      })
      .filter((item) => item.valor > 0);

    if (renda > 0) {
      itensDespesa.unshift({ categoria: CATEGORIA_RENDA, valor: renda, fill: corRenda });
    }

    return itensDespesa;
  }, [gastos, renda, ordemTodasCategorias, mapaCategorias]);

  const config: ChartConfig = useMemo(() => {
    const base: ChartConfig = {};
    ordemTodasCategorias.forEach((chave) => {
      base[chave] = { label: mapaCategorias[chave].label, color: mapaCategorias[chave].cor };
    });
    base[CATEGORIA_RENDA] = { label: labelRenda, color: corRenda };
    return base;
  }, [ordemTodasCategorias, mapaCategorias]);

  if (dados.length === 0) {
    return (
      <div className="grid aspect-square max-h-[280px] place-items-center rounded-2xl border border-dashed border-border p-6 text-center text-[13px] text-muted-foreground">
        Adicione um gasto neste mês para ver a distribuição por categoria.
      </div>
    );
  }

  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0);

  return (
    <div>
      <ChartContainer config={config} className="mx-auto aspect-square max-h-[260px]">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="categoria"
                formatter={(valor, nome, item) => (
                  <div className="flex w-full items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: (item.payload as { fill?: string })?.fill }}
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
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="categoria"
            innerRadius={58}
            outerRadius={98}
            strokeWidth={4}
            stroke="var(--color-surface)"
          >
            {dados.map((item) => (
              <Cell key={item.categoria} fill={item.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {dados.map((item) => (
          <div
            key={item.categoria}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground"
          >
            <span
              className="h-2 w-2 rounded-[2px]"
              style={{ backgroundColor: corDeChave(item.categoria, mapaCategorias) }}
              aria-hidden="true"
            />
            {labelDeChave(item.categoria, mapaCategorias)} · {formatarMoeda(item.valor)}
          </div>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">
        Total de gastos no mês: <span className="text-foreground">{formatarMoeda(totalGastos)}</span>
      </p>
    </div>
  );
}
