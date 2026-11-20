"use client";

import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { EvolucaoMensalChart } from "@/components/financas/EvolucaoMensalChart";
import { GastoForm } from "@/components/financas/GastoForm";
import { GastosLista } from "@/components/financas/GastosLista";
import { GastosPorCategoriaChart } from "@/components/financas/GastosPorCategoriaChart";
import { RendaCard } from "@/components/financas/RendaCard";
import { ResumoCards } from "@/components/financas/ResumoCards";
import { ButtonLink } from "@/components/ui/AppButton";
import { PageHeading } from "@/components/layout/PageHeading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSessao } from "@/hooks/useSessao";
import {
  carregarCategoriasCustomRemoto,
  carregarGastosRemoto,
  carregarMetaReservaRemoto,
  carregarRendasRemoto,
  definirMetaReservaRemoto,
  definirRendaRemoto,
  inserirCategoriaCustomRemoto,
  inserirGastoRemoto,
  limparDadosFinancasRemoto,
  removerCategoriaCustomRemoto,
  removerGastoRemoto,
  renomearCategoriaCustomRemoto,
} from "@/lib/supabase/financas-remoto";
import {
  carregarCategoriasCustom,
  carregarGastos,
  carregarMetaReserva,
  carregarRendas,
  categoriasDespesa,
  criarCategoriaCustom,
  formatarMesCompleto,
  limparDadosFinancas,
  mesAtual,
  salvarCategoriasCustom,
  salvarGastos,
  salvarMetaReserva,
  salvarRendas,
  totalPorCategoria,
  type CategoriaCustom,
  type Gasto,
  type RendaPorMes,
} from "@/lib/financas";

export default function FinancasPage() {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const estaLogado = Boolean(usuario);
  const userId = usuario?.id;

  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [metaReserva, setMetaReserva] = useState(600);
  const [rendas, setRendas] = useState<RendaPorMes>({});
  const [categoriasCustom, setCategoriasCustom] = useState<CategoriaCustom[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState(() => mesAtual());
  const [periodoEvolucao, setPeriodoEvolucao] = useState<"6" | "12">("6");
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      if (userId) {
        const [gastosRemoto, rendasRemoto, metaRemoto, categoriasRemoto] = await Promise.all([
          carregarGastosRemoto(userId),
          carregarRendasRemoto(userId),
          carregarMetaReservaRemoto(userId),
          carregarCategoriasCustomRemoto(userId),
        ]);
        if (cancelado) return;
        setGastos(gastosRemoto);
        setRendas(rendasRemoto);
        setMetaReserva(metaRemoto ?? 600);
        setCategoriasCustom(categoriasRemoto);
      } else {
        setGastos(carregarGastos());
        setMetaReserva(carregarMetaReserva());
        setRendas(carregarRendas());
        setCategoriasCustom(carregarCategoriasCustom());
      }
      if (!cancelado) setCarregado(true);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  useEffect(() => {
    if (!carregado || estaLogado) return;
    salvarGastos(gastos);
  }, [gastos, carregado, estaLogado]);

  useEffect(() => {
    if (!carregado || estaLogado) return;
    salvarRendas(rendas);
  }, [rendas, carregado, estaLogado]);

  useEffect(() => {
    if (!carregado || estaLogado) return;
    salvarCategoriasCustom(categoriasCustom);
  }, [categoriasCustom, carregado, estaLogado]);

  const adicionarGasto = (gasto: Gasto) => {
    setGastos((prev) => [...prev, gasto]);
    setMesSelecionado(gasto.mes);
    if (userId) void inserirGastoRemoto(userId, gasto);
  };

  const removerGasto = (id: string) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
    if (userId) void removerGastoRemoto(userId, id);
  };

  const alterarMetaReserva = (valor: number) => {
    setMetaReserva(valor);
    if (userId) {
      void definirMetaReservaRemoto(userId, valor);
    } else {
      salvarMetaReserva(valor);
    }
  };

  const definirRendaDoMes = (valor: number) => {
    setRendas((prev) => ({ ...prev, [mesSelecionado]: valor }));
    if (userId) void definirRendaRemoto(userId, mesSelecionado, valor);
  };

  const criarCategoria = (label: string) => {
    const nova = criarCategoriaCustom(label, categoriasCustom);
    setCategoriasCustom((prev) => [...prev, nova]);
    if (userId) void inserirCategoriaCustomRemoto(userId, nova);
  };

  const renomearCategoria = (id: string, novoLabel: string) => {
    setCategoriasCustom((prev) =>
      prev.map((c) => (c.id === id ? { ...c, label: novoLabel } : c)),
    );
    if (userId) void renomearCategoriaCustomRemoto(userId, id, novoLabel);
  };

  const removerCategoria = (id: string) => {
    if (typeof window === "undefined") return;
    const usosExistentes = gastos.filter((g) => g.categoria === id).length;
    const aviso =
      usosExistentes > 0
        ? `Essa categoria tem ${usosExistentes} lançamento(s). Eles não serão apagados, mas vão aparecer como "Categoria removida". Continuar?`
        : "Remover esta categoria?";
    if (!window.confirm(aviso)) return;
    setCategoriasCustom((prev) => prev.filter((c) => c.id !== id));
    if (userId) void removerCategoriaCustomRemoto(userId, id);
  };

  const limparTudo = () => {
    if (typeof window === "undefined") return;
    const confirmar = window.confirm(
      "Isso vai apagar todos os gastos, a renda, a meta de reserva e as categorias criadas por você. Continuar?",
    );
    if (!confirmar) return;
    if (userId) {
      void limparDadosFinancasRemoto(userId);
    } else {
      limparDadosFinancas();
    }
    setGastos([]);
    setMetaReserva(600);
    setRendas({});
    setCategoriasCustom([]);
  };

  const mesesDisponiveis = useMemo(() => {
    const conjunto = new Set(gastos.map((g) => g.mes));
    conjunto.add(mesSelecionado);
    conjunto.add(mesAtual());
    return Array.from(conjunto).sort().reverse();
  }, [gastos, mesSelecionado]);

  const gastosDoMes = useMemo(
    () => gastos.filter((g) => g.mes === mesSelecionado),
    [gastos, mesSelecionado],
  );

  const categoriasDespesaTodas = useMemo(
    () => [...categoriasDespesa, ...categoriasCustom.map((c) => c.id)],
    [categoriasCustom],
  );

  const totalDespesasMes = useMemo(
    () =>
      gastosDoMes
        .filter((g) => categoriasDespesaTodas.includes(g.categoria))
        .reduce((acc, g) => acc + g.valor, 0),
    [gastosDoMes, categoriasDespesaTodas],
  );

  const categoriaMaisPesada = useMemo(() => {
    const totais = categoriasDespesaTodas
      .map((categoria) => ({ categoria, valor: totalPorCategoria(gastosDoMes, categoria) }))
      .filter((item) => item.valor > 0);
    if (totais.length === 0) return null;
    return totais.reduce((maior, atual) => (atual.valor > maior.valor ? atual : maior));
  }, [gastosDoMes, categoriasDespesaTodas]);

  const totalReservaAcumulado = useMemo(() => totalPorCategoria(gastos, "reserva"), [gastos]);

  const rendaDoMes = rendas[mesSelecionado] ?? 0;

  const totalGastosDoMes = useMemo(
    () => gastosDoMes.reduce((acc, g) => acc + g.valor, 0),
    [gastosDoMes],
  );

  const saldoDoMes = rendaDoMes - totalGastosDoMes;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <Link
        href="/trilhas/primeiro-dinheiro"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar para a trilha
      </Link>

      <div className="mt-6">
        <PageHeading
          eyebrow="Vida Prática"
          title="Controle de Gastos"
          description="Anote suas contas manualmente — luz, energia, aluguel, mercado, academia e sua reserva de emergência — e acompanhe para onde o dinheiro está indo com gráficos simples."
          action={
            <ButtonLink href="/financas/simulacoes" variant="outline" size="sm">
              Simuladores
            </ButtonLink>
          }
        />
      </div>

      <div className="mt-8 flex flex-col items-stretch gap-3 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-[13px] text-muted-foreground">
          {estaLogado
            ? "Registre manualmente contas e gastos do mês. Os dados ficam salvos na sua conta."
            : "Registre manualmente contas e gastos do mês. Os dados ficam salvos só no seu dispositivo."}
        </p>
        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <RendaCard valor={rendaDoMes} saldo={saldoDoMes} onSalvar={definirRendaDoMes} />
          <button
            type="button"
            onClick={limparTudo}
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-3.5 w-3.5" aria-hidden="true" />
            Limpar dados
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.3fr]">

        <div className="space-y-6">
          <GastoForm
            onAdicionar={adicionarGasto}
            categoriasCustom={categoriasCustom}
            onCriarCategoria={criarCategoria}
            onRenomearCategoria={renomearCategoria}
            onRemoverCategoria={removerCategoria}
          />

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                Lançamentos
              </h2>
              <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
                <SelectTrigger className="h-8 w-auto min-w-[9.5rem] text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mesesDisponiveis.map((mes) => (
                    <SelectItem key={mes} value={mes}>
                      {formatarMesCompleto(mes)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <GastosLista
              gastos={gastosDoMes}
              onRemover={removerGasto}
              categoriasCustom={categoriasCustom}
            />
          </div>
        </div>

        <div className="space-y-6">
          <ResumoCards
            totalDespesasMes={totalDespesasMes}
            categoriaMaisPesada={categoriaMaisPesada}
            quantidadeLancamentosMes={gastosDoMes.length}
            totalReservaAcumulado={totalReservaAcumulado}
            metaReserva={metaReserva}
            onAlterarMetaReserva={alterarMetaReserva}
            categoriasCustom={categoriasCustom}
          />

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
            <p className="eyebrow">{formatarMesCompleto(mesSelecionado)}</p>
            <h2 className="mt-2 text-lg font-bold">Gastos por categoria</h2>
            <div className="mt-5">
              <GastosPorCategoriaChart
                gastos={gastosDoMes}
                renda={rendaDoMes}
                categoriasCustom={categoriasCustom}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">
                  {periodoEvolucao === "12"
                    ? `Janeiro a dezembro de ${new Date().getFullYear()}`
                    : "Últimos 6 meses"}
                </p>
                <h2 className="mt-2 text-lg font-bold">Evolução mensal</h2>
              </div>
              <ToggleGroup
                type="single"
                value={periodoEvolucao}
                onValueChange={(valor) => valor && setPeriodoEvolucao(valor as "6" | "12")}
                className="gap-1.5"
              >
                <ToggleGroupItem
                  value="6"
                  className="h-8 rounded-lg border border-border px-3 text-[12px] data-[state=on]:border-primary data-[state=on]:bg-primary-dim data-[state=on]:text-primary-light"
                >
                  6 meses
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="12"
                  className="h-8 rounded-lg border border-border px-3 text-[12px] data-[state=on]:border-primary data-[state=on]:bg-primary-dim data-[state=on]:text-primary-light"
                >
                  12 meses
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="mt-5 overflow-x-auto">
              <div className={periodoEvolucao === "12" ? "min-w-[640px]" : ""}>
                <EvolucaoMensalChart
                  gastos={gastos}
                  rendas={rendas}
                  categoriasCustom={categoriasCustom}
                  quantidadeMeses={Number(periodoEvolucao)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
