

import type { User } from "@supabase/supabase-js";

import { cursos, quizzesPorTrilha } from "@/data/content";
import type { RespostaAssistente } from "@/lib/assistente";
import { normalizar } from "@/lib/assistente";
import { avatarValido, getAvatar, type AvatarId } from "@/lib/avatares";
import { avaliarConquistas, carregarMarcosLocal, type ConquistaAvaliada } from "@/lib/conquistas";
import { calcularIdade, isoParaBR } from "@/lib/data-nascimento";
import { exercicios } from "@/lib/exercicios";
import {
  carregarCategoriasCustom,
  carregarGastos,
  carregarMetaReserva,
  carregarRendas,
  formatarMesCompleto,
  formatarMoeda,
  infoDaCategoria,
  mesAtual,
  montarMapaCategorias,
  type Gasto,
  type RendaPorMes,
} from "@/lib/financas";
import { montarJornada, type Jornada } from "@/lib/jornada";
import { contarMedalhas, infoMedalha, ORDEM_MEDALHAS, resultadosDosExercicios } from "@/lib/medalhas";
import { carregarMetas, type Meta } from "@/lib/metas-reflexoes";
import { calcularProgressoCurso, carregarProgresso, type ProgressoOverlay, type ResultadoQuiz } from "@/lib/progresso";
import {
  carregarHistoricoCarteira,
  carregarHistoricoCDI,
  carregarHistoricoJuros,
  type SimulacaoJuros,
} from "@/lib/simuladores";
import { carregarMarcosRemoto } from "@/lib/supabase/conquistas-remoto";
import {
  carregarCategoriasCustomRemoto,
  carregarGastosRemoto,
  carregarMetaReservaRemoto,
  carregarRendasRemoto,
} from "@/lib/supabase/financas-remoto";
import { carregarMetasRemoto } from "@/lib/supabase/metas-reflexoes-remoto";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";
import {
  carregarHistoricoCarteiraRemoto,
  carregarHistoricoCDIRemoto,
  carregarHistoricoJurosRemoto,
} from "@/lib/supabase/simuladores-remoto";
import { calcularXp, NIVEL_MAXIMO, XP_POR_NIVEL, type ExtratoXp } from "@/lib/xp";
import { carregarDadosXp, type DadosXp } from "@/hooks/useXp";

export type ContextoPessoal = {
  logado: boolean;
  nome: string | null;
  email: string | null;
  nascimento: string | null;
  avatarNome: string | null;
  xp: ExtratoXp;
  jornada: Jornada;

  overlay: ProgressoOverlay;
  conquistas: ConquistaAvaliada[];
  dadosXp: DadosXp;
  gastos: Gasto[];
  rendas: RendaPorMes;
  metaReserva: number | null;
  mapaCategorias: ReturnType<typeof montarMapaCategorias>;
  metas: Meta[];
  simulacoes: { juros: SimulacaoJuros[]; cdi: number; carteira: number };
};

function avatarDoVisitante(): AvatarId | null {
  try {
    const v = window.localStorage.getItem("integra-jovem:avatar");
    return avatarValido(v) ? v : null;
  } catch {
    return null;
  }
}

export async function carregarContextoPessoal(usuario: User | null): Promise<ContextoPessoal> {
  const userId = usuario?.id;
  const meta = (usuario?.user_metadata ?? {}) as Record<string, unknown>;

  const [overlay, dadosXp, marcos, gastos, rendas, metaReserva, categoriasCustom, metas, juros, cdi, carteira] =
    await Promise.all([
      userId ? carregarProgressoRemoto(userId) : Promise.resolve(carregarProgresso()),
      carregarDadosXp(userId),
      userId ? carregarMarcosRemoto(userId) : Promise.resolve(carregarMarcosLocal()),
      userId ? carregarGastosRemoto(userId) : Promise.resolve(carregarGastos()),
      userId ? carregarRendasRemoto(userId) : Promise.resolve(carregarRendas()),
      userId ? carregarMetaReservaRemoto(userId) : Promise.resolve(carregarMetaReserva()),
      userId ? carregarCategoriasCustomRemoto(userId) : Promise.resolve(carregarCategoriasCustom()),
      userId ? carregarMetasRemoto(userId) : Promise.resolve(carregarMetas()),
      userId ? carregarHistoricoJurosRemoto(userId) : Promise.resolve(carregarHistoricoJuros()),
      userId ? carregarHistoricoCDIRemoto(userId) : Promise.resolve(carregarHistoricoCDI()),
      userId ? carregarHistoricoCarteiraRemoto(userId) : Promise.resolve(carregarHistoricoCarteira()),
    ]);

  const avatarId = userId ? (avatarValido(meta.avatar) ? meta.avatar : null) : avatarDoVisitante();
  const xp = calcularXp({ overlay, ...dadosXp });

  return {
    logado: Boolean(userId),
    overlay,
    nome: typeof meta.nome === "string" && meta.nome.trim() ? meta.nome.trim() : null,
    email: usuario?.email ?? null,
    nascimento: typeof meta.nascimento === "string" && meta.nascimento ? meta.nascimento : null,
    avatarNome: getAvatar(avatarId)?.nome ?? null,
    xp,
    jornada: montarJornada(overlay, dadosXp.primeirasTentativas),
    conquistas: avaliarConquistas({
      overlay,
      ...dadosXp,
      marcos,
      nivel: xp.nivel,
      avatarEscolhido: Boolean(avatarId),
    }),
    dadosXp,
    gastos,
    rendas,
    metaReserva,
    mapaCategorias: montarMapaCategorias(categoriasCustom),
    metas,
    simulacoes: { juros, cdi: cdi.length, carteira: carteira.length },
  };
}

export type PerguntaPessoal =
  | "nome"
  | "idade"
  | "email"
  | "resumo"
  | "xp"
  | "conquistas"
  | "medalhas"
  | "trilhas"
  | "quiz"
  | "gastos"
  | "saldo"
  | "reserva"
  | "metas"
  | "simulacoes"
  | "exercicios";

const GATILHOS: Record<PerguntaPessoal, string[]> = {
  nome: ["meu nome", "como eu me chamo", "como me chamo", "quem sou eu", "sabe quem eu sou", "sabe meu nome"],
  idade: ["minha idade", "quantos anos eu tenho", "quantos anos tenho", "meu aniversario", "minha data de nascimento", "quando eu nasci", "quando nasci"],
  email: ["meu email", "meu e-mail", "qual email", "qual e-mail"],
  resumo: ["meus dados", "sobre mim", "minhas informacoes", "meu resumo", "o que voce sabe de mim", "resumo da minha conta"],
  xp: ["meu xp", "quanto xp", "quantos xp", "meu nivel", "qual nivel", "que nivel", "minha experiencia", "quantos pontos", "meus pontos"],
  conquistas: ["minhas conquistas", "meus emblemas", "quais conquistas", "quantas conquistas", "quantos emblemas", "quais emblemas", "falta conquistar", "proxima conquista"],
  medalhas: ["minhas medalhas", "quantas medalhas", "quais medalhas", "tenho medalha"],
  trilhas: ["meu progresso", "minhas trilhas", "onde parei", "qual trilha", "proxima trilha", "quantos blocos", "minha jornada", "em que etapa"],
  quiz: ["meus quizzes", "meu quiz", "minhas notas", "quanto acertei", "meus resultados", "minha nota"],
  gastos: ["quanto gastei", "eu gastei", "gastei", "meus gastos", "onde mais gasto", "com o que gasto", "meu maior gasto", "gastos do mes", "gastos de", "gastos em", "gastos no"],
  saldo: ["minha renda", "meu saldo", "quanto sobrou", "quanto sobra", "sobrou", "quanto ganho", "quanto recebo", "minhas contas do mes", "saldo de", "saldo em", "saldo do", "saldo no"],
  reserva: ["minha reserva", "minha meta de reserva", "quanto falta para a reserva"],
  metas: ["minhas metas", "meus objetivos", "quais metas", "quais sao minhas metas"],
  simulacoes: ["minhas simulacoes", "minha ultima simulacao", "ultima simulacao", "simulacoes que fiz"],
  exercicios: ["meus exercicios", "exercicios que fiz", "quais exercicios", "quantos exercicios"],
};

export function detectarPerguntaPessoal(mensagem: string): PerguntaPessoal | null {
  const texto = ` ${normalizar(mensagem)} `;
  let melhor: { id: PerguntaPessoal; tamanho: number } | null = null;
  (Object.keys(GATILHOS) as PerguntaPessoal[]).forEach((id) => {
    GATILHOS[id].forEach((g) => {
      if (texto.includes(` ${g} `) || texto.includes(` ${g}`)) {

        if (!melhor || g.length > melhor.tamanho) melhor = { id, tamanho: g.length };
      }
    });
  });
  return (melhor as { id: PerguntaPessoal } | null)?.id ?? null;
}

const lista = (itens: string[]) =>
  itens.length <= 1 ? itens.join("") : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;

const NOMES_MESES = [
  "janeiro", "fevereiro", "marco", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const NUMEROS: Record<string, number> = { dois: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, doze: 12 };

export type Periodo =
  | { tipo: "mes"; mes: string }
  | { tipo: "varios"; meses: string[] }
  | { tipo: "todos" };

const chaveMes = (ano: number, mes1a12: number) => `${ano}-${String(mes1a12).padStart(2, "0")}`;

function mesesAntes(hoje: Date, quantos: number): string[] {
  return Array.from({ length: quantos }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    return chaveMes(d.getFullYear(), d.getMonth() + 1);
  });
}

export function extrairPeriodo(mensagem: string, hoje = new Date()): Periodo {
  return periodoExplicito(mensagem, hoje) ?? { tipo: "mes", mes: mesAtual(hoje) };
}

export function periodoExplicito(mensagem: string, hoje = new Date()): Periodo | null {
  const t = ` ${normalizar(mensagem)} `;

  const ultimos = t.match(/ ultimos (\d{1,2}|dois|tres|quatro|cinco|seis|doze)? ?meses /);
  if (ultimos) {
    const n = ultimos[1] ? Number(ultimos[1]) || NUMEROS[ultimos[1]] : 3;
    return { tipo: "varios", meses: mesesAntes(hoje, Math.min(Math.max(n, 1), 24)) };
  }
  if (/ (todos os meses|historico|mes a mes|cada mes|por mes) /.test(t)) return { tipo: "todos" };
  if (/ (este|esse|neste|nesse) ano /.test(t)) {
    return { tipo: "varios", meses: mesesAntes(hoje, hoje.getMonth() + 1) };
  }
  if (/ (mes passado|mes anterior|ultimo mes) /.test(t)) return { tipo: "mes", mes: mesesAntes(hoje, 2)[1] };

  const nome = t.match(/ (janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?: de)?(?: (20\d{2}))? /);
  if (nome) {
    const m = NOMES_MESES.indexOf(nome[1]) + 1;

    const ano = nome[2] ? Number(nome[2]) : m > hoje.getMonth() + 1 ? hoje.getFullYear() - 1 : hoje.getFullYear();
    return { tipo: "mes", mes: chaveMes(ano, m) };
  }

  const abrev = t.match(/ (jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez) (\d{2}|20\d{2}) /);
  if (abrev) {
    const m = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"].indexOf(abrev[1]) + 1;
    const ano = abrev[2].length === 2 ? 2000 + Number(abrev[2]) : Number(abrev[2]);
    return { tipo: "mes", mes: chaveMes(ano, m) };
  }

  const numerico = t.match(/ (0?[1-9]|1[0-2]) (20\d{2}) /);
  if (numerico) return { tipo: "mes", mes: chaveMes(Number(numerico[2]), Number(numerico[1])) };

  if (/ (este|esse|neste|nesse) mes | mes atual /.test(t)) return { tipo: "mes", mes: mesAtual(hoje) };
  return null;
}

function resumoDoMes(ctx: ContextoPessoal, mes: string) {
  const doMes = ctx.gastos.filter((g) => g.mes === mes);
  const porCategoria = new Map<string, number>();
  doMes.forEach((g) => porCategoria.set(g.categoria, (porCategoria.get(g.categoria) ?? 0) + g.valor));
  const top = [...porCategoria.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, valor]) => `${infoDaCategoria(cat, ctx.mapaCategorias).label} (${formatarMoeda(valor)})`);
  const total = doMes.reduce((s, g) => s + g.valor, 0);
  return { mes, total, quantidade: doMes.length, top, renda: ctx.rendas[mes] ?? null };
}

export function sobrasRecentes(ctx: ContextoPessoal, quantos = 3): { meses: number; total: number; media: number } {
  const mesesPassados = mesesComRegistro(ctx).filter((m) => m < mesAtual() && ctx.rendas[m] !== undefined).slice(0, quantos);
  const total = mesesPassados.reduce((s, m) => {
    const r = resumoDoMes(ctx, m);
    return s + ((r.renda ?? 0) - r.total);
  }, 0);
  return { meses: mesesPassados.length, total, media: mesesPassados.length ? total / mesesPassados.length : 0 };
}

function gastosDoMes(ctx: ContextoPessoal) {
  return resumoDoMes(ctx, mesAtual());
}

function nomeDoMes(mes: string): string {
  return mes === mesAtual() ? "neste mês" : `em ${formatarMesCompleto(mes).toLowerCase()}`;
}

function mesesComRegistro(ctx: ContextoPessoal): string[] {
  const meses = new Set<string>([...ctx.gastos.map((g) => g.mes), ...Object.keys(ctx.rendas)]);
  return [...meses].sort((a, b) => b.localeCompare(a));
}

function respostaVariosMeses(ctx: ContextoPessoal, meses: string[], foco: "gastos" | "saldo"): string {
  const linhas: string[] = [];
  let totalGastos = 0;
  let totalSobra = 0;
  let mesesComRenda = 0;
  meses.forEach((mes) => {
    const r = resumoDoMes(ctx, mes);
    if (r.quantidade === 0 && r.renda === null) return;
    totalGastos += r.total;
    let linha = `• ${formatarMesCompleto(mes)}: gastos ${formatarMoeda(r.total)}`;
    if (r.renda !== null) {
      const sobra = r.renda - r.total;
      totalSobra += sobra;
      mesesComRenda += 1;
      linha += `, renda ${formatarMoeda(r.renda)}, ${sobra >= 0 ? `sobrou ${formatarMoeda(sobra)}` : `faltou ${formatarMoeda(-sobra)}`}`;
    }
    linhas.push(linha);
  });
  if (linhas.length === 0) return "Não encontrei gastos nem renda registrados nesse período.";
  const fim =
    foco === "saldo" && mesesComRenda > 0
      ? `\nNo total, ${totalSobra >= 0 ? `sobraram ${formatarMoeda(totalSobra)}` : `faltaram ${formatarMoeda(-totalSobra)}`} nos meses com renda definida.`
      : `\nTotal gasto no período: ${formatarMoeda(totalGastos)}.`;
  return `Seus registros mês a mês:\n${linhas.join("\n")}${fim}`;
}

const semConta = "Você está navegando sem conta, então só vejo o que ficou guardado neste navegador.";

export function responderPessoal(
  pergunta: PerguntaPessoal,
  ctx: ContextoPessoal,
  mensagem = "",

  periodoForcado?: Periodo,
): RespostaAssistente {
  const periodo = periodoForcado ?? extrairPeriodo(mensagem);
  const temaId = `pessoal:${pergunta}`;
  const r = (texto: string, links?: RespostaAssistente["links"]): RespostaAssistente => ({
    texto: ctx.logado || ["nome", "idade", "email"].includes(pergunta) ? texto : `${texto}\n\n${semConta}`,
    temaId,
    links,
    sugestoes: sugestoesPessoais(pergunta),
  });

  switch (pergunta) {
    case "nome":
      if (!ctx.logado) return r("Você ainda não entrou na sua conta, então não sei seu nome. Crie uma conta ou entre para eu te chamar pelo nome!", [{ rotulo: "Entrar", href: "/entrar" }]);
      return ctx.nome
        ? r(`Você está cadastrado como ${ctx.nome}.${ctx.avatarNome ? ` E seu avatar é o ${ctx.avatarNome}.` : ""}`, [{ rotulo: "Editar no Perfil", href: "/perfil" }])
        : r("Não encontrei um nome no seu cadastro. Você pode colocar no Perfil.", [{ rotulo: "Abrir o Perfil", href: "/perfil" }]);

    case "idade": {
      if (!ctx.logado) return r("Sem conta eu não sei sua data de nascimento. Ela fica no cadastro.", [{ rotulo: "Entrar", href: "/entrar" }]);
      const idade = ctx.nascimento ? calcularIdade(ctx.nascimento) : null;
      if (idade === null || !ctx.nascimento) return r("Não encontrei sua data de nascimento no cadastro. Você pode informar no Perfil.", [{ rotulo: "Abrir o Perfil", href: "/perfil" }]);
      return r(`Você tem ${idade} anos (nascimento em ${isoParaBR(ctx.nascimento)}).`, [{ rotulo: "Ver no Perfil", href: "/perfil" }]);
    }

    case "email":
      if (!ctx.logado || !ctx.email) return r("Você não está logado, então não há e-mail cadastrado.", [{ rotulo: "Entrar", href: "/entrar" }]);
      return r(`O e-mail da sua conta é ${ctx.email}.`, [{ rotulo: "Alterar no Perfil", href: "/perfil" }]);

    case "xp": {
      const { total, nivel, xpNoNivel, blocos, quizzes, bonus, exercicios: ex } = ctx.xp;
      const xpQuiz = quizzes.reduce((s, q) => s + q.xp, 0);
      const xpBonus = bonus.reduce((s, b) => s + b.xp, 0);
      return r(
        (nivel >= NIVEL_MAXIMO
          ? `Você tem ${total} XP e chegou ao nível ${NIVEL_MAXIMO}, o máximo: completou toda a jornada!\n`
          : `Você tem ${total} XP e está no nível ${nivel} (o máximo é ${NIVEL_MAXIMO}). Faltam ${XP_POR_NIVEL - xpNoNivel} XP para o nível ${nivel + 1}.\n`) +
          `De onde veio: ${blocos.xp} XP de ${blocos.quantidade} blocos lidos, ${xpQuiz} XP de quizzes, ${ex.xp} XP de ${ex.quantidade} exercícios e ${xpBonus} XP de bônus.`,
        [{ rotulo: "Ver minha Jornada", href: "/jornada" }],
      );
    }

    case "conquistas": {
      const feitas = ctx.conquistas.filter((c) => c.conquistada);
      const perto = ctx.conquistas
        .filter((c) => !c.conquistada && c.atual > 0)
        .sort((a, b) => b.atual / b.meta - a.atual / a.meta)
        .slice(0, 2);
      let texto = `Você tem ${feitas.length} de ${ctx.conquistas.length} emblemas.`;
      if (feitas.length > 0) texto += ` Alguns deles: ${lista(feitas.slice(-4).map((c) => c.titulo))}.`;
      if (perto.length > 0) texto += `\nMais perto de sair: ${lista(perto.map((c) => `${c.titulo} (${c.atual}/${c.meta})`))}.`;
      else if (feitas.length === 0) texto += " Um bom começo é concluir o primeiro bloco de uma trilha.";
      return r(texto, [{ rotulo: "Ver meus emblemas", href: "/jornada" }]);
    }

    case "medalhas": {
      const contagem = contarMedalhas(resultadosDosExercicios(ctx.dadosXp.exerciciosUsuario));
      const tem = ORDEM_MEDALHAS.filter((m) => contagem[m] > 0).map(
        (m) => `${contagem[m]} de ${infoMedalha[m].nome.toLowerCase()}`,
      );
      return r(
        tem.length > 0
          ? `Suas medalhas: ${lista(tem)}. Quanto mais rápido você conclui um exercício, melhor a medalha.`
          : "Você ainda não tem medalhas. Elas vêm dos exercícios práticos dos blocos (o quadro amarelo \"Exercício bônus\").",
        [{ rotulo: "Ver minhas medalhas", href: "/jornada" }],
      );
    }

    case "trilhas": {
      const { concluidas, total, atual, emAndamento } = ctx.jornada;
      if (!atual) return r(`Você concluiu todas as ${total} trilhas. Parabéns!`, [{ rotulo: "Ver a Jornada", href: "/jornada" }]);
      return r(
        `Você concluiu ${concluidas} de ${total} trilhas${emAndamento > 0 ? ` e tem ${emAndamento} em andamento` : ""}. ` +
          `A próxima etapa é "${atual.curso.titulo}", com ${atual.percentual}% lido.`,
        [
          { rotulo: atual.percentual > 0 ? "Continuar trilha" : "Começar trilha", href: `/trilhas/${atual.curso.slug}` },
          { rotulo: "Ver a Jornada", href: "/jornada" },
        ],
      );
    }

    case "quiz": {
      const tentativas: ResultadoQuiz[] = ctx.dadosXp.primeirasTentativas;
      if (tentativas.length === 0) return r("Você ainda não fez nenhum quiz. Ele aparece no fim de cada trilha, depois de ler todos os blocos.", [{ rotulo: "Ir para as trilhas", href: "/trilhas" }]);
      const linhas = tentativas.map((t) => {
        const titulo = cursos.find((c) => c.slug === t.cursoSlug)?.titulo ?? t.cursoSlug;
        return `${titulo}: ${t.acertos}/${t.total}`;
      });
      return r(`Seus quizzes (primeira tentativa, a que vale XP): ${lista(linhas)}.`, [{ rotulo: "Ver as trilhas", href: "/trilhas" }]);
    }

    case "gastos":
    case "saldo": {
      const linkFinancas = [{ rotulo: "Abrir o Controle de Gastos", href: "/financas" }];
      if (periodo.tipo !== "mes") {
        const meses = periodo.tipo === "todos" ? mesesComRegistro(ctx).slice(0, 12) : periodo.meses;
        return r(respostaVariosMeses(ctx, meses, pergunta), linkFinancas);
      }
      const g = resumoDoMes(ctx, periodo.mes);
      const quando = nomeDoMes(g.mes);
      if (periodo.mes > mesAtual()) return r("Esse mês ainda não chegou, então não há registros dele.", linkFinancas);

      if (pergunta === "gastos") {
        if (g.quantidade === 0) {
          return r(
            g.mes === mesAtual()
              ? "Você ainda não registrou gastos neste mês. Anotar é o primeiro passo para saber para onde o dinheiro vai."
              : `Não encontrei gastos registrados ${quando}.`,
            [{ rotulo: "Registrar um gasto", href: "/financas" }],
          );
        }
        return r(
          `${quando.charAt(0).toUpperCase() + quando.slice(1)} você registrou ${g.quantidade} ${g.quantidade === 1 ? "gasto" : "gastos"}, somando ${formatarMoeda(g.total)}. ` +
            `Onde mais foi: ${lista(g.top)}.`,
          linkFinancas,
        );
      }

      if (g.renda === null && g.quantidade === 0 && g.mes !== mesAtual()) {
        return r(`Não encontrei renda nem gastos registrados ${quando}.`, linkFinancas);
      }
      if (g.renda === null) {
        return r(
          `Você não definiu a renda ${quando === "neste mês" ? "deste mês" : quando.replace(/^em /, "de ")}. Os gastos ${quando} somam ${formatarMoeda(g.total)}.`,
          [{ rotulo: "Definir a renda", href: "/financas" }],
        );
      }
      const saldo = g.renda - g.total;
      return r(
        `${quando.charAt(0).toUpperCase() + quando.slice(1)}: renda de ${formatarMoeda(g.renda)} e gastos de ${formatarMoeda(g.total)}. ` +
          (saldo >= 0
            ? `Sobraram ${formatarMoeda(saldo)}.`
            : `Os gastos passaram a renda em ${formatarMoeda(-saldo)}; vale revisar os gastos não essenciais.`),
        linkFinancas,
      );
    }

    case "reserva":
      return ctx.metaReserva
        ? r(`Sua meta de reserva de emergência está em ${formatarMoeda(ctx.metaReserva)}. O ideal é juntar de 3 a 6 meses dos seus gastos essenciais.`, [{ rotulo: "Ajustar a meta", href: "/financas" }])
        : r("Você ainda não definiu uma meta de reserva de emergência.", [{ rotulo: "Definir minha reserva", href: "/financas" }]);

    case "metas":
      return ctx.metas.length > 0
        ? r(`Suas metas: ${lista(ctx.metas.slice(0, 5).map((m) => (m.prazo ? `${m.titulo} (${m.prazo})` : m.titulo)))}.`, [{ rotulo: "Ver no Perfil", href: "/perfil" }])
        : r("Você ainda não criou metas. Que tal registrar algo que você quer conquistar?", [{ rotulo: "Criar uma meta", href: "/perfil" }]);

    case "simulacoes": {
      const { juros, cdi, carteira } = ctx.simulacoes;
      const totalSim = juros.length + cdi + carteira;
      if (totalSim === 0) return r("Você ainda não salvou simulações.", [{ rotulo: "Abrir os simuladores", href: "/financas/simulacoes" }]);
      const ultima = [...juros].sort((a, b) => b.data.localeCompare(a.data))[0];
      return r(
        `Você fez ${juros.length} simulações de juros compostos, ${cdi} de CDI e ${carteira} de carteira.` +
          (ultima
            ? ` Na última de juros, ${formatarMoeda(ultima.aporteMensal)} por mês durante ${ultima.meses} meses virariam ${formatarMoeda(ultima.totalFinal)}.`
            : ""),
        [{ rotulo: "Abrir os simuladores", href: "/financas/simulacoes" }],
      );
    }

    case "exercicios": {
      const lista_ = ctx.dadosXp.exerciciosUsuario;
      const concluidos = lista_.filter((e) => e.concluidoEm).length;
      const andamento = lista_.filter((e) => !e.concluidoEm).length;
      return r(
        `Você concluiu ${concluidos} de ${exercicios.length} exercícios práticos` +
          (andamento > 0 ? ` e tem ${andamento} em andamento.` : "."),
        [{ rotulo: "Ver minhas medalhas", href: "/jornada" }],
      );
    }

    case "resumo": {
      const idade = ctx.nascimento ? calcularIdade(ctx.nascimento) : null;
      const g = gastosDoMes(ctx);
      const partes = [
        ctx.logado && ctx.nome ? `Nome: ${ctx.nome}${idade !== null ? `, ${idade} anos` : ""}.` : null,
        `Nível ${ctx.xp.nivel}, com ${ctx.xp.total} XP.`,
        `Trilhas concluídas: ${ctx.jornada.concluidas} de ${ctx.jornada.total}.`,
        `Emblemas: ${ctx.conquistas.filter((c) => c.conquistada).length} de ${ctx.conquistas.length}.`,
        g.quantidade > 0 ? `Gastos do mês: ${formatarMoeda(g.total)}.` : null,
        ctx.metas.length > 0 ? `Metas criadas: ${ctx.metas.length}.` : null,
      ].filter(Boolean);
      return r(`Aqui vai um resumo seu:\n${partes.join("\n")}`, [
        { rotulo: "Ver a Jornada", href: "/jornada" },
        { rotulo: "Abrir o Perfil", href: "/perfil" },
      ]);
    }
  }
}

function sugestoesPessoais(atual: PerguntaPessoal): string[] {
  const opcoes: Record<PerguntaPessoal, string> = {
    resumo: "Me mostre um resumo sobre mim",
    xp: "Qual é o meu nível?",
    trilhas: "Onde parei nas trilhas?",
    gastos: "Quanto gastei no mês passado?",
    conquistas: "Quais são minhas conquistas?",
    medalhas: "Quais são minhas medalhas?",
    saldo: "Quanto sobrou nos últimos 3 meses?",
    metas: "Quais são minhas metas?",
    nome: "Qual é o meu nome?",
    idade: "Quantos anos eu tenho?",
    email: "Qual é o meu e-mail?",
    quiz: "Quanto acertei nos quizzes?",
    reserva: "Qual é minha meta de reserva?",
    simulacoes: "Qual foi minha última simulação?",
    exercicios: "Quantos exercícios eu fiz?",
  };
  return (["resumo", "xp", "trilhas", "gastos", "conquistas", "saldo"] as PerguntaPessoal[])
    .filter((p) => p !== atual)
    .slice(0, 2)
    .map((p) => opcoes[p]);
}

const SINONIMOS: string[][] = [
  ["viagem", "viagens", "viajar", "viajando", "ferias", "passeio", "excursao", "intercambio"],
  ["celular", "telefone", "smartphone", "iphone"],
  ["computador", "notebook", "pc", "laptop"],
  ["curso", "faculdade", "estudo", "estudos", "escola", "vestibular"],
  ["reserva", "emergencia", "imprevisto", "imprevistos"],
  ["carro", "moto", "veiculo", "habilitacao", "cnh"],
  ["show", "festa", "evento", "ingresso", "festival"],
  ["roupa", "roupas", "tenis", "sapato"],
  ["game", "games", "jogo", "jogos", "videogame", "console", "playstation"],
];

const PALAVRAS_VAZIAS = new Set([
  "guardar", "juntar", "economizar", "poupar", "para", "pra", "pro", "comprar", "meu", "minha", "um", "uma",
  "de", "do", "da", "em", "no", "na", "o", "a", "e", "ate", "reais", "real", "meta", "objetivo", "quero",
]);

function assuntos(texto: string): Set<string> {
  const palavras = normalizar(texto)
    .split(" ")
    .filter((p) => p.length >= 3 && !PALAVRAS_VAZIAS.has(p) && !/^\d/.test(p));
  const resultado = new Set<string>();
  palavras.forEach((p) => {
    resultado.add(p);
    SINONIMOS.forEach((grupo) => {
      if (grupo.includes(p)) grupo.forEach((g) => resultado.add(g));
    });
  });
  return resultado;
}

const combinam = (a: Set<string>, b: Set<string>) => [...a].some((p) => b.has(p));

function valorNoTexto(texto: string): number | null {

  texto = texto.replace(/\b\d{1,2}\/\d{2,4}\b|\b[a-zç]{3,9}\/\d{2,4}\b/gi, " ");
  const m = texto.match(/(?:r\$\s?)?(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?)(?:\s?(mil))?/i);
  if (!m) return null;
  let v = Number(m[1].replace(/\./g, "").replace(",", "."));
  if (m[2]) v *= 1000;
  return Number.isFinite(v) && v > 0 ? v : null;
}

const GATILHOS_PROGRESSO = [
  "quanto falta", "chegar na minha meta", "chegar na meta", "chegar no meu objetivo", "atingir", "alcancar",
  "bater a meta", "bater minha meta", "minha meta", "meu objetivo", "como esta minha meta", "como esta meu objetivo",
  "quando consigo", "quando vou conseguir", "vou conseguir",
];

export function pedeProgressoMeta(mensagem: string): boolean {
  const t = ` ${normalizar(mensagem)} `;
  if (/ (minhas metas|quais metas|meus objetivos) /.test(t) && !/ (falta|atingir|chegar|alcancar) /.test(t)) return false;

  if (/ (pagar|devo|divida|dividas|parcela|parcelas) /.test(t)) return false;

  if (/ (trilha|trilhas|modulo|modulos|bloco|blocos|quiz|quizzes|exercicio|exercicios|atividade|atividades|jornada|etapa|etapas) /.test(t)) return false;
  return GATILHOS_PROGRESSO.some((g) => t.includes(` ${g}`));
}

export type ObjetivoLembrado = { texto: string; valor: number | null };

export function responderProgressoMeta(
  mensagem: string,
  ctx: ContextoPessoal,
  objetivosDoChat: ObjetivoLembrado[] = [],
  hoje = new Date(),
): RespostaAssistente {
  const links = [
    { rotulo: "Abrir o Controle de Gastos", href: "/financas" },
    { rotulo: "Ver minhas metas", href: "/perfil" },
  ];

  const candidatas = [
    ...ctx.metas.map((m) => ({
      titulo: m.titulo,
      prazoTexto: m.prazo ?? "",
      valor: valorNoTexto(m.titulo),
      origem: "perfil" as const,
    })),
    ...objetivosDoChat.map((o) => ({ titulo: o.texto, prazoTexto: "", valor: o.valor, origem: "chat" as const })),
  ];
  if (candidatas.length === 0) {
    return {
      texto:
        "Ainda não encontrei nenhuma meta sua. Crie uma no Perfil (ex.: \"Guardar R$ 3.000 para viajar\", prazo \"novembro\") ou me conte aqui (\"quero juntar para uma viagem de R$ 3.000\").",
      temaId: "pessoal:progresso-meta",
      links,
    };
  }

  const assuntoPergunta = assuntos(mensagem);
  const meta =
    candidatas.find((c) => combinam(assuntos(`${c.titulo} ${c.prazoTexto}`), assuntoPergunta)) ??
    (candidatas.length === 1 ? candidatas[0] : null);
  if (!meta) {
    return {
      texto: `Você tem mais de uma meta: ${lista(candidatas.slice(0, 5).map((c) => `"${c.titulo}"`))}. De qual delas você quer saber? Por exemplo: "quanto falta para a meta da viagem?"`,
      temaId: "pessoal:progresso-meta",
      links,
    };
  }

  const assuntoMeta = new Set([...assuntos(meta.titulo), ...assuntoPergunta]);
  const categorias = [...new Set(ctx.gastos.map((g) => g.categoria))].filter((cat) =>
    combinam(assuntos(infoDaCategoria(cat, ctx.mapaCategorias).label), assuntoMeta),
  );
  const separados = ctx.gastos.filter((g) => categorias.includes(g.categoria));
  const guardado = separados.reduce((s, g) => s + g.valor, 0);
  const mesesComDeposito = new Set(separados.map((g) => g.mes)).size;
  const nomesCategorias = categorias.map((c) => infoDaCategoria(c, ctx.mapaCategorias).label);

  const prazo =
    periodoExplicito(meta.prazoTexto, hoje) ?? periodoExplicito(meta.titulo, hoje) ?? periodoExplicito(mensagem, hoje);
  let mesLimite: string | null = prazo?.tipo === "mes" ? prazo.mes : null;

  if (mesLimite && mesLimite < mesAtual(hoje) && !/20\d{2}/.test(`${meta.prazoTexto} ${meta.titulo}`)) {
    const [a, m] = mesLimite.split("-").map(Number);
    mesLimite = chaveMes(a + 1, m);
  }
  const mesesAte = mesLimite
    ? (() => {
        const [a, m] = mesLimite.split("-").map(Number);
        return (a - hoje.getFullYear()) * 12 + (m - (hoje.getMonth() + 1));
      })()
    : null;

  const partes: string[] = [];
  partes.push(
    `Sua meta: "${meta.titulo}"${meta.valor ? ` — ${formatarMoeda(meta.valor)}` : ""}${mesLimite ? `, até ${formatarMesCompleto(mesLimite).toLowerCase()}` : ""}.`,
  );

  if (categorias.length > 0) {
    partes.push(
      `Você já separou ${formatarMoeda(guardado)} na categoria ${lista(nomesCategorias)} do Controle de Gastos` +
        (mesesComDeposito > 1 ? ` (em ${mesesComDeposito} meses, média de ${formatarMoeda(guardado / mesesComDeposito)} por mês).` : "."),
    );
  } else {
    partes.push(
      "Não encontrei uma categoria no Controle de Gastos com o assunto dessa meta. Se você criar uma (ex.: \"Viagem\") e registrar nela o que for separando, eu consigo acompanhar.",
    );
  }

  if (meta.valor) {
    const falta = Math.max(0, meta.valor - guardado);
    if (falta === 0) {
      partes.push("Você já chegou no valor da meta. Parabéns!");
    } else {
      const pct = Math.round((guardado / meta.valor) * 100);
      partes.push(`Faltam ${formatarMoeda(falta)}${categorias.length > 0 ? ` (você está em ${pct}% da meta)` : ""}.`);
      if (mesesAte !== null && mesesAte > 0) {
        partes.push(
          `Até ${formatarMesCompleto(mesLimite!).toLowerCase()} são ${mesesAte} ${mesesAte === 1 ? "mês" : "meses"}: seria preciso separar cerca de ${formatarMoeda(falta / mesesAte)} por mês.`,
        );
        if (mesesComDeposito > 0) {
          const media = guardado / mesesComDeposito;
          const previsto = guardado + media * mesesAte;
          partes.push(
            previsto >= meta.valor
              ? `No ritmo atual (${formatarMoeda(media)} por mês) você chega lá a tempo.`
              : `No ritmo atual (${formatarMoeda(media)} por mês) você chegaria a ${formatarMoeda(previsto)}. Para fechar a meta, aumente o valor mensal ou ajuste o prazo.`,
          );
        }
      } else if (mesesAte !== null && mesesAte <= 0) {
        partes.push("O prazo dessa meta é este mês ou já passou; vale revisar o prazo no Perfil.");
      }
    }
  } else {
    partes.push("A meta não tem um valor que eu consiga ler. Coloque o valor no título (ex.: \"Guardar R$ 3.000 para viajar\") para eu calcular quanto falta.");
  }

  return { texto: partes.join("\n"), temaId: "pessoal:progresso-meta", links };
}

const PALAVRAS_CATEGORIA: Record<string, string[]> = {
  aluguel: ["aluguel", "moradia", "casa", "apartamento", "ape", "condominio", "iptu", "kitnet"],
  mercado: ["mercado", "supermercado", "comida", "alimentacao", "feira", "compras do mes", "comer", "rancho", "hortifruti"],
  transporte: ["transporte", "onibus", "metro", "trem", "uber", "taxi", "gasolina", "combustivel", "passagem", "bilhete unico", "conducao", "moto", "carro", "bicicleta"],
  energia: ["energia", "luz", "conta de luz", "eletricidade", "enel", "cemig", "copel"],
  academia: ["academia", "treino", "musculacao", "gym", "crossfit", "esporte", "natacao"],
  reserva: ["reserva", "reserva de emergencia", "emergencia", "fundo de emergencia", "colchao"],
};

export function categoriasCitadas(mensagem: string, ctx: ContextoPessoal): string[] {
  const t = ` ${normalizar(mensagem)} `;
  const assuntoMsg = assuntos(mensagem);
  const encontradas: string[] = [];
  Object.keys(ctx.mapaCategorias).forEach((chave) => {
    const palavras = PALAVRAS_CATEGORIA[chave];
    const porPalavra = palavras?.some((p) => t.includes(` ${p} `)) ?? false;

    const porNome =
      !palavras &&
      (t.includes(` ${normalizar(infoDaCategoria(chave, ctx.mapaCategorias).label)} `) ||
        combinam(assuntos(infoDaCategoria(chave, ctx.mapaCategorias).label), assuntoMsg));
    if (porPalavra || porNome) encontradas.push(chave);
  });
  return encontradas;
}

export function pedeValorDeCategoria(mensagem: string): boolean {
  const t = ` ${normalizar(mensagem)} `;
  return / (quanto|quantos|gastei|gasto|gastos|gastando|paguei|pago|pagando|separei|guardei|guardado|coloquei|juntei|foi|foram|valor|total|registrei) /.test(t);
}

export function pedeTotalGeral(mensagem: string): boolean {
  return / (no total|ao todo|desde o comeco|desde o inicio|desde que comecei|ate agora|tudo junto) /.test(` ${normalizar(mensagem)} `);
}

export function responderCategoria(
  categorias: string[],
  ctx: ContextoPessoal,
  periodo: Periodo,
  mensagem = "",
): RespostaAssistente {
  const links = [{ rotulo: "Abrir o Controle de Gastos", href: "/financas" }];
  const nome = (c: string) => infoDaCategoria(c, ctx.mapaCategorias).label;
  const verbo = (c: string) => (infoDaCategoria(c, ctx.mapaCategorias).tipo === "reserva" || !PALAVRAS_CATEGORIA[c] ? "separou" : "gastou");
  const soma = (c: string, meses?: string[]) =>
    ctx.gastos.filter((g) => g.categoria === c && (!meses || meses.includes(g.mes))).reduce((s, g) => s + g.valor, 0);

  if (pedeTotalGeral(mensagem) || periodo.tipo !== "mes") {
    const meses = periodo.tipo === "varios" && !pedeTotalGeral(mensagem) ? periodo.meses : undefined;
    const linhas = categorias.map((c) => {
      const regs = ctx.gastos.filter((g) => g.categoria === c && (!meses || meses.includes(g.mes)));
      if (regs.length === 0) return `• ${nome(c)}: nenhum registro${meses ? " nesse período" : ""}.`;
      const porMes = new Map<string, number>();
      regs.forEach((g) => porMes.set(g.mes, (porMes.get(g.mes) ?? 0) + g.valor));
      const detalhe = [...porMes.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([m, v]) => `${formatarMesCompleto(m).split(" ")[0].toLowerCase()} ${formatarMoeda(v)}`);
      return `• ${nome(c)}: ${formatarMoeda(soma(c, meses))} em ${porMes.size} ${porMes.size === 1 ? "mês" : "meses"} (${detalhe.join(", ")}).`;
    });
    return {
      texto: `${meses ? "No período" : "Somando todos os meses"}:\n${linhas.join("\n")}`,
      temaId: "pessoal:categoria",
      links,
    };
  }

  const mes = periodo.mes;
  const quando = nomeDoMes(mes);
  const totalDoMes = ctx.gastos.filter((g) => g.mes === mes).reduce((s, g) => s + g.valor, 0);
  const anterior = mesesAntes(new Date(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)) - 1, 1), 2)[1];

  const linhas = categorias.map((c) => {
    const valor = soma(c, [mes]);
    const qtd = ctx.gastos.filter((g) => g.categoria === c && g.mes === mes).length;
    if (qtd === 0) return `Não encontrei registros em ${nome(c)} ${quando}.`;
    let linha = `Em ${nome(c)} você ${verbo(c)} ${formatarMoeda(valor)} ${quando}${qtd > 1 ? ` (${qtd} registros)` : ""}`;
    if (totalDoMes > 0 && verbo(c) === "gastou") linha += `, ${Math.round((valor / totalDoMes) * 100)}% dos registros do mês`;
    const valorAnterior = soma(c, [anterior]);
    if (valorAnterior > 0) {
      const dif = valor - valorAnterior;
      linha +=
        Math.abs(dif) < 0.01
          ? `. Igual ao mês anterior.`
          : `. No mês anterior foram ${formatarMoeda(valorAnterior)} (${dif > 0 ? "subiu" : "caiu"} ${formatarMoeda(Math.abs(dif))}).`;
    } else {
      linha += ".";
    }
    return linha;
  });

  return { texto: linhas.join("\n"), temaId: "pessoal:categoria", links };
}

const PALAVRAS_TRILHA: Record<string, string[]> = {
  "primeiro-dinheiro": ["primeiro dinheiro", "primeira trilha"],
  "saude-emocional": ["protegendo", "protegendo seu dinheiro", "golpes"],
  "descobrindo-profissoes": ["orcamento", "dominando o orcamento", "dominando"],
  "quem-eu-sou": ["cartao", "credito", "dividas", "divida"],
  "vida-adulta-burocracia": ["guardar", "poupar", "investir", "investimentos"],
  "uso-consciente-tecnologia": ["juros", "juros compostos"],
};

const PALAVRAS_PROGRESSO =
  / (terminei|termino|terminar|conclui|concluir|concluido|concluidos|concluidas|completei|completar|finalizei|finalizar|fiz|feitas|feitos|fazer|falta|faltam|progresso|andamento|parei|proximo|proxima|ja li|li) /;
const PALAVRAS_ATIVIDADE =
  / (trilha|trilhas|atividade|atividades|bloco|blocos|aula|aulas|modulo|modulos|quiz|quizzes|exercicio|exercicios|jornada|etapa|etapas) /;

export type PerguntaProgresso = { tipo: "geral" } | { tipo: "trilha"; slug: string };

export function detectarPerguntaProgresso(mensagem: string): PerguntaProgresso | null {
  const t = ` ${normalizar(mensagem)} `;
  if (!PALAVRAS_ATIVIDADE.test(t)) return null;
  if (!PALAVRAS_PROGRESSO.test(t) && !/ (quantas|quantos|quais|qual) /.test(t)) return null;
  if (/ (trilha|modulo|bloco|quiz|exercicio) /.test(t)) {
    const slug = Object.keys(PALAVRAS_TRILHA).find((s) => PALAVRAS_TRILHA[s].some((p) => t.includes(` ${p} `)));
    if (slug) return { tipo: "trilha", slug };
  }
  return { tipo: "geral" };
}

function resumoTrilha(ctx: ContextoPessoal, slug: string) {
  const curso = cursos.find((c) => c.slug === slug)!;
  const { total, concluidas, concluidasPorId } = calcularProgressoCurso(curso, ctx.overlay);
  const quiz = ctx.dadosXp.primeirasTentativas.find((q) => q.cursoSlug === slug) ?? null;
  const temQuiz = Boolean(quizzesPorTrilha[slug]);
  const exerciciosDaTrilha = exercicios.filter((e) => e.id.startsWith(`${slug}:`));
  const exerciciosFeitos = exerciciosDaTrilha.filter((e) =>
    ctx.dadosXp.exerciciosUsuario.some((u) => u.id === e.id && u.concluidoEm),
  ).length;
  const proximo = curso.modulos.flatMap((m) => m.aulas).find((a) => !concluidasPorId.get(a.id)) ?? null;
  const etapa = ctx.jornada.etapas.find((e) => e.curso.slug === slug);
  return {
    curso,
    total,
    concluidas,
    quiz,
    temQuiz,
    exerciciosTotal: exerciciosDaTrilha.length,
    exerciciosFeitos,
    proximo,
    concluida: etapa?.status === "concluida",
  };
}

export function responderProgresso(pergunta: PerguntaProgresso, ctx: ContextoPessoal): RespostaAssistente {
  const semConta = ctx.logado ? "" : "\n\nVocê está sem conta: estes são os registros guardados neste navegador.";

  if (pergunta.tipo === "trilha") {
    const r = resumoTrilha(ctx, pergunta.slug);
    const partes = [
      r.concluida
        ? `Você já concluiu a trilha "${r.curso.titulo}". 🎉`
        : `Trilha "${r.curso.titulo}": você leu ${r.concluidas} de ${r.total} blocos (${Math.round((r.concluidas / r.total) * 100)}%).`,
    ];
    if (r.temQuiz) {
      partes.push(
        r.quiz
          ? `Quiz: feito, com ${r.quiz.acertos} de ${r.quiz.total} acertos na primeira tentativa.`
          : r.concluidas < r.total
            ? "Quiz: libera quando você terminar todos os blocos."
            : "Quiz: já está liberado, falta fazer!",
      );
    }
    if (r.exerciciosTotal > 0) partes.push(`Exercícios práticos: ${r.exerciciosFeitos} de ${r.exerciciosTotal} concluídos.`);
    if (!r.concluida && r.proximo) partes.push(`Próximo bloco: "${r.proximo.titulo}".`);
    return {
      texto: partes.join("\n") + semConta,
      temaId: "pessoal:progresso-trilha",
      links: [{ rotulo: r.concluida ? "Revisar a trilha" : "Continuar a trilha", href: `/trilhas/${r.curso.slug}` }],
      sugestoes: ["Quantas atividades e trilhas eu já terminei?", "Onde parei nas trilhas?"],
    };
  }

  const resumos = cursos.map((c) => resumoTrilha(ctx, c.slug));
  const concluidas = resumos.filter((r) => r.concluida);
  const emAndamento = resumos.filter((r) => !r.concluida && r.concluidas > 0);
  const blocosLidos = resumos.reduce((s, r) => s + r.concluidas, 0);
  const blocosTotal = resumos.reduce((s, r) => s + r.total, 0);
  const quizzesFeitos = ctx.dadosXp.primeirasTentativas.filter((q) => cursos.some((c) => c.slug === q.cursoSlug));
  const quizzesTotal = cursos.filter((c) => quizzesPorTrilha[c.slug]).length;
  const gabaritados = quizzesFeitos.filter((q) => q.acertos >= q.total).length;
  const exerciciosFeitos = new Set(
    ctx.dadosXp.exerciciosUsuario.filter((e) => e.concluidoEm && exercicios.some((x) => x.id === e.id)).map((e) => e.id),
  ).size;
  const medalhas = contarMedalhas(resultadosDosExercicios(ctx.dadosXp.exerciciosUsuario));
  const listaMedalhas = ORDEM_MEDALHAS.filter((m) => medalhas[m] > 0).map((m) => `${medalhas[m]} de ${infoMedalha[m].nome.toLowerCase()}`);

  const linhas = [
    `Trilhas concluídas: ${concluidas.length} de ${cursos.length}${concluidas.length ? ` (${lista(concluidas.map((r) => r.curso.titulo))})` : ""}.`,
    emAndamento.length
      ? `Em andamento: ${lista(emAndamento.map((r) => `${r.curso.titulo} (${Math.round((r.concluidas / r.total) * 100)}%)`))}.`
      : null,
    `Blocos lidos: ${blocosLidos} de ${blocosTotal}.`,
    `Quizzes feitos: ${quizzesFeitos.length} de ${quizzesTotal}${gabaritados ? `, ${gabaritados} gabaritado${gabaritados > 1 ? "s" : ""}` : ""}.`,
    `Exercícios práticos: ${exerciciosFeitos} de ${exercicios.length}${listaMedalhas.length ? ` (medalhas: ${lista(listaMedalhas)})` : ""}.`,
    ctx.jornada.atual ? `Próxima etapa da jornada: "${ctx.jornada.atual.curso.titulo}".` : "Você concluiu toda a jornada! 🏆",
  ].filter(Boolean);

  return {
    texto: `Seu progresso até agora:\n${linhas.join("\n")}${semConta}`,
    temaId: "pessoal:progresso",
    links: [
      { rotulo: "Ver minha Jornada", href: "/jornada" },
      ...(ctx.jornada.atual ? [{ rotulo: "Continuar de onde parei", href: `/trilhas/${ctx.jornada.atual.curso.slug}` }] : []),
    ],
    sugestoes: ["Qual é o meu nível?", "Quais são minhas conquistas?"],
  };
}

export const FRASES_PESSOAIS_TODAS: string[] = [
  ...Object.values(GATILHOS).flat(),
  ...GATILHOS_PROGRESSO,
  ...Object.values(PALAVRAS_CATEGORIA).flat(),
];
