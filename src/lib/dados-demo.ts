import { cursos } from "@/data/content";
import {
  limparDadosFinancas,
  salvarCategoriasCustom,
  salvarGastos,
  salvarMetaReserva,
  salvarRendas,
  ultimosMeses,
  type CategoriaCustom,
  type Gasto,
  type RendaPorMes,
} from "@/lib/financas";
import type { ProgressoOverlay } from "@/lib/progresso";

const CHAVE_PROGRESSO = "integra-jovem:progresso:aulas";

const CATEGORIAS_DEMO: CategoriaCustom[] = [
  { id: "demo-streaming", label: "Assinaturas de streaming e jogos online", cor: "#60A5FA" },
  { id: "demo-lanches", label: "Lanches", cor: "#FBBF24" },
  { id: "demo-celular", label: "Celular", cor: "#F472B6" },
];

const BASE_MENSAL: { categoria: string; valor: number; observacao?: string }[] = [
  { categoria: "aluguel", valor: 1450, observacao: "Aluguel dividido com dois amigos, inclui condomínio e taxa de lixo" },
  { categoria: "mercado", valor: 862.4 },
  { categoria: "transporte", valor: 214.5, observacao: "Bilhete único + aplicativo nos dias de chuva" },
  { categoria: "energia", valor: 189.9 },
  { categoria: "academia", valor: 119.9 },
  { categoria: "reserva", valor: 300 },
  { categoria: "demo-streaming", valor: 89.7 },
  { categoria: "demo-lanches", valor: 236.35, observacao: "Lanche depois do curso" },
  { categoria: "demo-celular", valor: 59.99 },
];

export function carregarDadosDemo(): void {
  const meses = ultimosMeses(12);
  const gastos: Gasto[] = [];
  const rendas: RendaPorMes = {};

  meses.forEach((mes, i) => {
    const variacao = 0.85 + ((i * 37) % 30) / 100;
    rendas[mes] = i === meses.length - 1 ? 123456.78 : Math.round(3200 * variacao * 100) / 100;

    BASE_MENSAL.forEach((item, j) => {
      gastos.push({
        id: `demo_${mes}_${j}`,
        categoria: item.categoria,
        valor: Math.round(item.valor * (0.8 + ((i + j) % 5) / 10) * 100) / 100,
        mes,
        criadoEm: new Date().toISOString(),
        observacao: item.observacao,
      });
    });
  });

  const mesAtualDemo = meses[meses.length - 1];
  gastos.push({
    id: `demo_${mesAtualDemo}_grande`,
    categoria: "aluguel",
    valor: 98765.43,
    mes: mesAtualDemo,
    criadoEm: new Date().toISOString(),
    observacao: "Valor alto de teste para conferir se tudo cabe na tela do celular",
  });

  salvarCategoriasCustom(CATEGORIAS_DEMO);
  salvarGastos(gastos);
  salvarRendas(rendas);
  salvarMetaReserva(25000);

  const progresso: ProgressoOverlay = {};
  cursos.forEach((curso, ci) => {
    const aulas = curso.modulos.flatMap((m) => m.aulas);
    const fracao = [1, 0.66, 0.33, 0.5, 0, 0.11][ci % 6];
    const concluidas = Math.round(aulas.length * fracao);
    progresso[curso.slug] = Object.fromEntries(aulas.slice(0, concluidas).map((a) => [a.id, true]));
  });
  try {
    window.localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso));
  } catch {

  }
}

export function apagarDadosDemo(): void {
  limparDadosFinancas();
  try {
    window.localStorage.removeItem(CHAVE_PROGRESSO);
  } catch {

  }
}
