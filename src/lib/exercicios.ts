

import { carregarGastos, carregarMetaReserva, carregarRendas } from "@/lib/financas";
import { carregarHistoricoCarteira, carregarHistoricoCDI, carregarHistoricoJuros } from "@/lib/simuladores";

export const XP_POR_EXERCICIO = 70;

export type TipoAcao =
  | "gasto"
  | "renda"
  | "meta_reserva"
  | "simulacao_juros"
  | "simulacao_cdi"
  | "simulacao_carteira";

export const acoes: Record<TipoAcao, { ferramenta: string; href: string; comoConcluir: string }> = {
  gasto: {
    ferramenta: "Controle de Gastos",
    href: "/financas",
    comoConcluir: "registre pelo menos um gasto no Controle de Gastos",
  },
  renda: {
    ferramenta: "Controle de Gastos",
    href: "/financas",
    comoConcluir: "defina (ou atualize) a renda do mês no Controle de Gastos",
  },
  meta_reserva: {
    ferramenta: "Controle de Gastos",
    href: "/financas",
    comoConcluir: "defina (ou atualize) a meta de reserva no Controle de Gastos",
  },
  simulacao_juros: {
    ferramenta: "Simulador de Juros Compostos",
    href: "/financas/simulacoes",
    comoConcluir: "faça uma simulação no Simulador de Juros Compostos",
  },
  simulacao_cdi: {
    ferramenta: "Simulador Juros Bancos CDI",
    href: "/financas/simulacoes",
    comoConcluir: "faça uma simulação no simulador Juros Bancos CDI",
  },
  simulacao_carteira: {
    ferramenta: "Carteira de Investimentos",
    href: "/financas/simulacoes",
    comoConcluir: "faça uma simulação na Carteira de Investimentos",
  },
};

export type Requisito = {
  valor?: number;

  observacao_contem?: string;
  valor_inicial?: number;
  aporte_mensal?: number;
  taxa_mensal?: number;
  meses?: number;
  saldo_ficticio?: number;
  percentual_renda_fixa?: number;
};

export type Exercicio = {

  id: string;
  tipo: TipoAcao;
  requisito: Requisito;

  instrucao: string;

  noBloco?: boolean;
};

const ex = (
  cursoSlug: string,
  aulaId: string,
  tipo: TipoAcao,
  requisito: Requisito,
  instrucao: string,
  noBloco = false,
): Exercicio => ({
  id: `${cursoSlug}:${aulaId}`,
  tipo,
  requisito,
  instrucao,
  noBloco,
});

export const exercicios: Exercicio[] = [

  ex("primeiro-dinheiro", "seu-primeiro-orcamento", "renda", { valor: 800 },
    "No Controle de Gastos, defina a renda do mês como R$ 800,00. Depois distribua esse valor entre as categorias até o saldo fechar em zero ou positivo."),
  ex("primeiro-dinheiro", "desafio-do-mes", "gasto", { valor: 150, observacao_contem: "objetivo" },
    "Seu objetivo custa R$ 150,00. Registre no Controle de Gastos um gasto de R$ 150,00 com a observação \"objetivo\" (é o valor que você vai separar) e ajuste as outras categorias para caber no mês."),
  ex("primeiro-dinheiro", "quanto-preciso-guardar", "simulacao_juros", { valor_inicial: 0, aporte_mensal: 50, meses: 24 },
    "No Simulador de Juros Compostos, simule: valor inicial R$ 0, aporte mensal R$ 50,00 e prazo de 24 meses. Veja se o resultado chega perto de uma meta sua."),
  ex("primeiro-dinheiro", "imprevistos-acontecem", "meta_reserva", { valor: 1800 },
    "Imagine que seus gastos essenciais somam R$ 600,00 por mês. No Controle de Gastos, defina a meta de reserva em 3 meses disso: R$ 1.800,00."),
  ex("primeiro-dinheiro", "seu-primeiro-plano-financeiro", "gasto", { observacao_contem: "plano financeiro" },
    "Monte o plano no modelo interativo logo abaixo (renda, categorias, uma meta e uma reserva) e clique em exportar para o Controle de Gastos.",
    true),

  ex("descobrindo-profissoes", "quanto-realmente-entra", "renda", { valor: 1200 },
    "No Controle de Gastos, registre a renda do mês como R$ 1.200,00 e compare com o total dos seus gastos fixos: quanto realmente sobra?"),
  ex("descobrindo-profissoes", "fixos-x-variaveis", "gasto", { valor: 12, observacao_contem: "variavel" },
    "Registre no Controle de Gastos um lanche de R$ 12,00 com a observação \"variável\". Depois pense: quais dos seus gastos são fixos e quais mudam todo mês?"),
  ex("descobrindo-profissoes", "seu-orcamento-esta-negativo", "gasto", { valor: 300, observacao_contem: "estourou" },
    "Simule um mês que estourou: registre no Controle de Gastos um gasto de R$ 300,00 com a observação \"estourou\" e veja qual categoria mais pesou no saldo."),
  ex("descobrindo-profissoes", "primeiro-emprego", "renda", { valor: 900 },
    "Defina no Controle de Gastos uma renda de primeiro emprego de R$ 900,00 e distribua entre transporte, alimentação, lazer e reserva."),
  ex("descobrindo-profissoes", "monte-seu-orcamento", "gasto", { valor: 50, observacao_contem: "lazer planejado" },
    "Monte o orçamento no Controle de Gastos e inclua um lazer planejado: registre R$ 50,00 com a observação \"lazer planejado\"."),

  ex("quem-eu-sou", "parcelamento", "gasto", { valor: 100, observacao_contem: "parcela" },
    "Uma compra de R$ 600,00 em 6 vezes dá parcelas de R$ 100,00. Registre no Controle de Gastos um gasto de R$ 100,00 com a observação \"parcela\" e veja quanto ela ocupa do seu mês."),
  ex("quem-eu-sou", "juros", "simulacao_juros", { valor_inicial: 500, aporte_mensal: 0, taxa_mensal: 12, meses: 12 },
    "No Simulador de Juros Compostos, simule uma dívida de cartão: valor inicial R$ 500,00, aporte R$ 0, taxa de 12% ao mês e 12 meses. Veja quanto ela vira."),
  ex("quem-eu-sou", "desafio-da-fatura", "gasto", { valor: 250, observacao_contem: "fatura" },
    "Sua fatura fictícia deu R$ 250,00. Registre no Controle de Gastos um gasto de R$ 250,00 com a observação \"fatura\" e confira se ele cabe na renda do mês."),

  ex("vida-adulta-burocracia", "meta-financeira", "simulacao_juros", { valor_inicial: 0, aporte_mensal: 100, meses: 12 },
    "Meta: juntar cerca de R$ 1.200,00 em 1 ano. No Simulador de Juros Compostos, simule valor inicial R$ 0, aporte de R$ 100,00 por 12 meses."),
  ex("vida-adulta-burocracia", "reserva", "meta_reserva", { valor: 3000 },
    "No Controle de Gastos, defina uma meta de reserva de R$ 3.000,00, separada dos gastos do dia a dia."),
  ex("vida-adulta-burocracia", "risco-e-retorno", "simulacao_carteira", { saldo_ficticio: 1000, percentual_renda_fixa: 80 },
    "Na Carteira de Investimentos, simule R$ 1.000,00 com 80% em renda fixa (mais conservadora). Depois, se quiser, teste 30% para comparar."),
  ex("vida-adulta-burocracia", "diversificacao", "simulacao_carteira", { saldo_ficticio: 2000, percentual_renda_fixa: 50 },
    "Na Carteira de Investimentos, distribua R$ 2.000,00 meio a meio: 50% em renda fixa e 50% em renda variável."),
  ex("vida-adulta-burocracia", "o-tempo-importa", "simulacao_juros", { aporte_mensal: 50, meses: 240 },
    "No Simulador de Juros Compostos, simule R$ 50,00 por mês durante 240 meses (20 anos). Compare com o mesmo aporte por 120 meses."),
  ex("vida-adulta-burocracia", "aportes-mensais", "simulacao_juros", { aporte_mensal: 150, meses: 36 },
    "No Simulador de Juros Compostos, simule um aporte de R$ 150,00 por 36 meses e compare com um aporte menor no mesmo prazo."),
  ex("vida-adulta-burocracia", "monte-sua-carteira-ficticia", "simulacao_carteira", { saldo_ficticio: 5000, meses: 60 },
    "Objetivo de longo prazo: na Carteira de Investimentos, monte uma carteira de R$ 5.000,00 com horizonte de 60 meses, escolhendo a divisão que combina com ele."),

  ex("uso-consciente-tecnologia", "juros-compostos", "simulacao_juros", { valor_inicial: 100, aporte_mensal: 0, meses: 12 },
    "No Simulador de Juros Compostos, simule R$ 100,00 iniciais, sem aporte, por 12 meses. Compare com juros simples: 100 + (taxa × 12)."),
  ex("uso-consciente-tecnologia", "juros-sobre-juros", "simulacao_juros", { valor_inicial: 100, aporte_mensal: 0, meses: 60 },
    "Agora estenda: simule os mesmos R$ 100,00, sem aporte, por 60 meses e veja a curva se afastar da linha reta."),
  ex("uso-consciente-tecnologia", "comecar-cedo", "simulacao_juros", { aporte_mensal: 30, meses: 180 },
    "Simule R$ 30,00 por mês por 180 meses (começando 5 anos antes) e compare com os mesmos R$ 30,00 por 120 meses."),
  ex("uso-consciente-tecnologia", "e-se-eu-aumentar-o-aporte", "simulacao_juros", { aporte_mensal: 35, meses: 60 },
    "Simule um aporte de R$ 35,00 por 60 meses e compare com R$ 20,00 no mesmo prazo."),
  ex("uso-consciente-tecnologia", "e-se-eu-esperar", "simulacao_juros", { aporte_mensal: 35, meses: 36 },
    "Adiar 2 anos: simule os mesmos R$ 35,00 por só 36 meses e compare com os 60 meses do exercício anterior."),
];

export const getExercicio = (cursoSlug: string, aulaId: string) =>
  exercicios.find((e) => e.id === `${cursoSlug}:${aulaId}`);

const moeda = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function descreverRequisito(r: Requisito): string[] {
  const itens: string[] = [];
  if (r.valor !== undefined) itens.push(`Valor: ${moeda(r.valor)}`);
  if (r.observacao_contem) itens.push(`Observação: “${r.observacao_contem}”`);
  if (r.valor_inicial !== undefined) itens.push(`Valor inicial: ${moeda(r.valor_inicial)}`);
  if (r.aporte_mensal !== undefined) itens.push(`Aporte mensal: ${moeda(r.aporte_mensal)}`);
  if (r.taxa_mensal !== undefined) itens.push(`Taxa: ${r.taxa_mensal}% ao mês`);
  if (r.meses !== undefined) itens.push(`Prazo: ${r.meses} meses`);
  if (r.saldo_ficticio !== undefined) itens.push(`Saldo: ${moeda(r.saldo_ficticio)}`);
  if (r.percentual_renda_fixa !== undefined) itens.push(`Renda fixa: ${r.percentual_renda_fixa}%`);
  return itens;
}

export function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function atendeRequisito(linha: Record<string, unknown>, r: Requisito): boolean {
  return Object.entries(r).every(([chave, esperado]) => {
    if (esperado === undefined) return true;
    if (chave === "observacao_contem") {
      return normalizarTexto(String(linha.observacao ?? "")).includes(normalizarTexto(String(esperado)));
    }
    const valor = Number(linha[chave]);
    return Number.isFinite(valor) && Math.abs(valor - Number(esperado)) < 0.005;
  });
}

export type ExercicioUsuario = {
  id: string;
  tipo: TipoAcao;
  iniciadoEm: string;
  concluidoEm: string | null;
};

export function exerciciosConcluidosValidos(lista: ExercicioUsuario[]): string[] {
  return lista
    .filter((e) => e.concluidoEm && exercicios.some((c) => c.id === e.id && c.tipo === e.tipo))
    .map((e) => e.id);
}

const CHAVE_EXERCICIOS = "integra-jovem:exercicios";

function linhasDaFerramenta(tipo: TipoAcao, desde: string): Record<string, unknown>[] {
  const depois = (data: string | undefined) => !data || data >= desde;
  switch (tipo) {
    case "gasto":
      return carregarGastos()
        .filter((g) => depois(g.criadoEm))
        .map((g) => ({ valor: g.valor, observacao: g.observacao ?? "" }));
    case "renda":
      return Object.values(carregarRendas()).map((valor) => ({ valor }));
    case "meta_reserva":
      return [{ valor: carregarMetaReserva() }];
    case "simulacao_juros":
      return carregarHistoricoJuros()
        .filter((s) => depois(s.data))
        .map((s) => ({
          valor_inicial: s.valorInicial,
          aporte_mensal: s.aporteMensal,
          taxa_mensal: s.taxaMensal,
          meses: s.meses,
        }));
    case "simulacao_cdi":
      return carregarHistoricoCDI()
        .filter((s) => depois(s.data))
        .map((s) => ({ valor_inicial: s.valorInicial, aporte_mensal: s.aporteMensal, meses: s.meses }));
    case "simulacao_carteira":
      return carregarHistoricoCarteira()
        .filter((s) => depois(s.data))
        .map((s) => ({
          saldo_ficticio: s.saldoFicticio,
          percentual_renda_fixa: s.percentualRendaFixa,
          meses: s.meses,
        }));
  }
}

function fotoSemData(tipo: TipoAcao): string | null {
  if (tipo === "renda") return JSON.stringify(carregarRendas());
  if (tipo === "meta_reserva") return String(carregarMetaReserva());
  return null;
}

type ExercicioLocal = ExercicioUsuario & { foto: string | null };

function lerLocais(): ExercicioLocal[] {
  if (typeof window === "undefined") return [];
  try {
    const dados: unknown = JSON.parse(window.localStorage.getItem(CHAVE_EXERCICIOS) ?? "[]");
    return Array.isArray(dados) ? (dados as ExercicioLocal[]) : [];
  } catch {
    return [];
  }
}

function gravarLocais(lista: ExercicioLocal[]): void {
  try {
    window.localStorage.setItem(CHAVE_EXERCICIOS, JSON.stringify(lista));
  } catch {

  }
}

export function iniciarExercicioLocal(exercicio: Exercicio): void {
  const lista = lerLocais();
  if (lista.some((e) => e.id === exercicio.id)) return;
  gravarLocais([
    ...lista,
    {
      id: exercicio.id,
      tipo: exercicio.tipo,
      iniciadoEm: new Date().toISOString(),
      concluidoEm: null,
      foto: fotoSemData(exercicio.tipo),
    },
  ]);
}

export function cancelarExercicioLocal(exercicioId: string): void {
  const lista = lerLocais();
  gravarLocais(lista.filter((e) => !(e.id === exercicioId && !e.concluidoEm)));
}

export function carregarExerciciosLocal(): ExercicioUsuario[] {
  const lista = lerLocais();
  let mudou = false;
  const agora = new Date().toISOString();

  const atualizada = lista.map((e) => {
    if (e.concluidoEm) return e;
    const exercicio = exercicios.find((c) => c.id === e.id);
    if (!exercicio) return e;
    const foto = fotoSemData(e.tipo);
    if (foto !== null && foto === e.foto) return e;
    const feito = linhasDaFerramenta(e.tipo, e.iniciadoEm).some((linha) =>
      atendeRequisito(linha, exercicio.requisito),
    );
    if (!feito) return e;
    mudou = true;
    return { ...e, concluidoEm: agora };
  });

  if (mudou) gravarLocais(atualizada);
  return atualizada.map(({ id, tipo, iniciadoEm, concluidoEm }) => ({ id, tipo, iniciadoEm, concluidoEm }));
}
