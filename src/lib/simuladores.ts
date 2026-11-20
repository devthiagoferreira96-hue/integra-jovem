

const CHAVE_HISTORICO_JUROS = "integra-jovem:simulacoes:juros-compostos";
const CHAVE_HISTORICO_CARTEIRA = "integra-jovem:simulacoes:carteira";

export type PontoEvolucao = {
  mes: number;
  aportado: number;
  total: number;
  juros: number;
};

export function calcularJurosCompostos(
  valorInicial: number,
  aporteMensal: number,
  taxaMensalPercentual: number,
  meses: number,
): PontoEvolucao[] {
  const taxa = taxaMensalPercentual / 100;
  const pontos: PontoEvolucao[] = [];
  let total = valorInicial;
  let aportado = valorInicial;

  pontos.push({ mes: 0, aportado, total, juros: 0 });

  for (let mes = 1; mes <= meses; mes++) {
    total = total * (1 + taxa) + aporteMensal;
    aportado += aporteMensal;
    pontos.push({ mes, aportado, total: Math.round(total * 100) / 100, juros: Math.round((total - aportado) * 100) / 100 });
  }

  return pontos;
}

export type SimulacaoJuros = {
  id: string;
  data: string;
  valorInicial: number;
  aporteMensal: number;
  taxaMensal: number;
  meses: number;
  totalFinal: number;
  jurosGanhos: number;
};

export function carregarHistoricoJuros(): SimulacaoJuros[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_HISTORICO_JUROS);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as SimulacaoJuros[]) : [];
  } catch {
    return [];
  }
}

export function salvarSimulacaoJuros(simulacao: SimulacaoJuros): void {
  if (typeof window === "undefined") return;
  try {
    const atuais = carregarHistoricoJuros();
    const novas = [simulacao, ...atuais].slice(0, 10);
    window.localStorage.setItem(CHAVE_HISTORICO_JUROS, JSON.stringify(novas));
  } catch {

  }
}

export function limparHistoricoJuros(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE_HISTORICO_JUROS);
  } catch {

  }
}

export type CenarioCarteira = "conservador" | "esperado" | "otimista";

const RETORNO_MENSAL: Record<CenarioCarteira, { fixa: number; variavel: number }> = {
  conservador: { fixa: 0.006, variavel: -0.01 },
  esperado: { fixa: 0.008, variavel: 0.012 },
  otimista: { fixa: 0.009, variavel: 0.03 },
};

export function simularCarteira(
  saldoFicticio: number,
  percentualRendaFixa: number,
  meses: number,
) {
  const pctFixa = Math.min(100, Math.max(0, percentualRendaFixa)) / 100;
  const pctVariavel = 1 - pctFixa;
  const valorFixa = saldoFicticio * pctFixa;
  const valorVariavel = saldoFicticio * pctVariavel;

  const cenarios = (Object.keys(RETORNO_MENSAL) as CenarioCarteira[]).map((cenario) => {
    const { fixa, variavel } = RETORNO_MENSAL[cenario];
    const totalFixa = valorFixa * Math.pow(1 + fixa, meses);
    const totalVariavel = valorVariavel * Math.pow(1 + variavel, meses);
    const total = totalFixa + totalVariavel;
    return {
      cenario,
      total: Math.round(total * 100) / 100,
      variacao: Math.round((total - saldoFicticio) * 100) / 100,
    };
  });

  return { valorFixa, valorVariavel, cenarios };
}

export type SimulacaoCarteira = {
  id: string;
  data: string;
  saldoFicticio: number;
  percentualRendaFixa: number;
  meses: number;
  resultadoEsperado: number;
};

export function carregarHistoricoCarteira(): SimulacaoCarteira[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_HISTORICO_CARTEIRA);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as SimulacaoCarteira[]) : [];
  } catch {
    return [];
  }
}

export function salvarSimulacaoCarteira(simulacao: SimulacaoCarteira): void {
  if (typeof window === "undefined") return;
  try {
    const atuais = carregarHistoricoCarteira();
    const novas = [simulacao, ...atuais].slice(0, 10);
    window.localStorage.setItem(CHAVE_HISTORICO_CARTEIRA, JSON.stringify(novas));
  } catch {

  }
}

export function limparHistoricoCarteira(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE_HISTORICO_CARTEIRA);
  } catch {

  }
}

export function gerarIdSimulacao(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const CHAVE_HISTORICO_CDI = "integra-jovem:simulacoes:juros-bancos-cdi";

export type TipoInvestimentoCDI = "cdi" | "cdb";

export type BancoCDI = {
  id: string;
  nome: string;

  percentualCDI: Record<TipoInvestimentoCDI, number>;
};

export const bancosCDI: BancoCDI[] = [
  { id: "nubank", nome: "Nubank", percentualCDI: { cdi: 100, cdb: 105 } },
  { id: "inter", nome: "Banco Inter", percentualCDI: { cdi: 100, cdb: 102 } },
  { id: "c6", nome: "C6 Bank", percentualCDI: { cdi: 100, cdb: 108 } },
  { id: "xp", nome: "XP Investimentos", percentualCDI: { cdi: 100, cdb: 110 } },
  { id: "btg", nome: "BTG Pactual", percentualCDI: { cdi: 100, cdb: 113 } },
  { id: "itau", nome: "Itaú", percentualCDI: { cdi: 85, cdb: 95 } },
  { id: "bb", nome: "Banco do Brasil", percentualCDI: { cdi: 88, cdb: 97 } },
  { id: "caixa", nome: "Caixa Econômica Federal", percentualCDI: { cdi: 86, cdb: 94 } },
];

export const CDI_ANUAL_REFERENCIA = 10.75;

export function taxaMensalEquivalenteCDI(
  cdiAnualPercentual: number,
  percentualDoCDI: number,
): number {
  const cdiAnual = cdiAnualPercentual / 100;
  const cdiMensal = Math.pow(1 + cdiAnual, 1 / 12) - 1;
  const taxaEfetivaMensal = cdiMensal * (percentualDoCDI / 100);
  return taxaEfetivaMensal * 100;
}

export type SimulacaoCDI = {
  id: string;
  data: string;
  bancoId: string;
  bancoNome: string;
  tipo: TipoInvestimentoCDI;
  percentualCDI: number;
  cdiAnual: number;
  valorInicial: number;
  aporteMensal: number;
  meses: number;
  totalFinal: number;
  jurosGanhos: number;
};

export function carregarHistoricoCDI(): SimulacaoCDI[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_HISTORICO_CDI);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as SimulacaoCDI[]) : [];
  } catch {
    return [];
  }
}

export function salvarSimulacaoCDI(simulacao: SimulacaoCDI): void {
  if (typeof window === "undefined") return;
  try {
    const atuais = carregarHistoricoCDI();
    const novas = [simulacao, ...atuais].slice(0, 10);
    window.localStorage.setItem(CHAVE_HISTORICO_CDI, JSON.stringify(novas));
  } catch {

  }
}

export function limparHistoricoCDI(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE_HISTORICO_CDI);
  } catch {

  }
}
