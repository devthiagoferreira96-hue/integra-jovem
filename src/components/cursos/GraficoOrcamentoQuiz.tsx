import type { GraficoOrcamento } from "@/data/content";
import { formatarMoeda } from "@/lib/financas";

export function GraficoOrcamentoQuiz({ grafico }: { grafico: GraficoOrcamento }) {
  const total = grafico.itens.reduce((soma, item) => soma + item.valor, 0);
  const saldo = grafico.renda - total;
  const maior = Math.max(grafico.renda, ...grafico.itens.map((i) => i.valor));
  const descricao = `${grafico.titulo}. Renda de ${formatarMoeda(grafico.renda)}. ${grafico.itens
    .map((i) => `${i.nome}: ${formatarMoeda(i.valor)}`)
    .join(", ")}. Total de ${formatarMoeda(total)}, saldo de ${formatarMoeda(saldo)}.`;

  return (
    <figure className="mt-4 rounded-2xl border border-border bg-background p-4" aria-label={descricao}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 text-[12px]">
        <span className="font-semibold text-foreground">{grafico.titulo}</span>
        <span className="font-mono text-subtle-foreground">Renda: {formatarMoeda(grafico.renda)}</span>
      </figcaption>

      <ul className="mt-3 space-y-2.5" aria-hidden="true">
        {grafico.itens.map((item) => (
          <li
            key={item.nome}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)_5.5rem] items-center gap-2.5 text-[12.5px]"
          >
            <span className="truncate text-muted-foreground">{item.nome}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-surface-hi">
              <span
                className={`block h-full rounded-full ${item.destaque ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${Math.max(3, (item.valor / maior) * 100)}%` }}
              />
            </span>
            <span className="text-right tabular-nums text-foreground">{formatarMoeda(item.valor)}</span>
          </li>
        ))}
      </ul>

      <div
        className="mt-4 flex flex-wrap justify-between gap-2 border-t border-border pt-3 text-[12.5px] tabular-nums"
        aria-hidden="true"
      >
        <span className="text-muted-foreground">
          Total gasto: <span className="font-semibold text-foreground">{formatarMoeda(total)}</span>
        </span>
        <span className="text-muted-foreground">
          Saldo:{" "}
          <span className={`font-semibold ${saldo < 0 ? "text-destructive" : "text-primary"}`}>
            {formatarMoeda(saldo)}
          </span>
        </span>
      </div>
    </figure>
  );
}
