

import type { RespostaAssistente, Tema } from "@/lib/assistente";
import { TOPICOS } from "@/lib/assistente-topicos";

const norm = (t: string) =>
  ` ${t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

export type ContextoConversa = {

  ultimo: string | null;

  respondidos: string[];
};

export const contextoVazio = (): ContextoConversa => ({ ultimo: null, respondidos: [] });

const REFERENCIAS =
  / (ela|ele|elas|eles|isso|isto|disso|nisso|dela|dele|delas|deles|nela|nele|esse assunto|esse tema|essa parte|esse|essa|este|esta|sobre isso|mais sobre|me explica melhor|me explique melhor|explica melhor|explique melhor|explica mais|explique mais|me explica mais|continua|continue|continuando|e depois|e agora|como assim|nao entendi|pode explicar|exemplo|exemplos|mais detalhes|detalha|detalhe|aprofundar|aprender mais|saber mais|entender melhor|como faco isso|como fazer isso|onde estudo|onde aprendo|onde aprender) /;

const VAZIAS = new Set(
  "como aprender mais sobre ela ele elas eles isso e hoje ainda ok entao isto disso nisso dela dele delas deles nela nele esse essa este esta assunto tema parte me explica explique explicar melhor continua continue continuando e depois agora assim nao entendi pode exemplo exemplos detalhes detalha detalhe aprofundar saber entender faco fazer onde estudo aprendo o a os as um uma de do da que eu voce vc por favor pf quero queria gostaria mais tem algum alguma da para pra"
    .split(" "),
);

export function ehContinuacao(mensagem: string): boolean {
  const t = norm(mensagem);
  if (!REFERENCIAS.test(t)) return false;
  const sobra = t
    .trim()
    .split(" ")
    .filter((p) => p && !VAZIAS.has(p));

  return sobra.length === 0;
}

function grupoDoTema(id: string): string | null {
  return TOPICOS.find((tp) => tp.temas?.includes(id))?.id ?? null;
}

export function temasRelacionados(id: string, temas: Tema[], limite = 3): Tema[] {
  const tema = temas.find((t) => t.id === id);
  if (!tema) return [];
  const grupo = grupoDoTema(id);
  const hrefs = new Set((tema.links ?? []).map((l) => l.href));
  return temas
    .filter((t) => t.id !== id && t.sugerir !== false)
    .map((t) => ({
      t,
      pontos: (grupo && grupoDoTema(t.id) === grupo ? 2 : 0) + ((t.links ?? []).some((l) => hrefs.has(l.href)) ? 1 : 0),
    }))
    .filter((x) => x.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite)
    .map((x) => x.t);
}

const primeiraFrase = (texto: string) => texto.split(/(?<=[.!?])\s/)[0];
const semInterrogacao = (texto: string) => texto.replace(/\?$/, "");

export function respostaContinuacao(ultimo: string, temas: Tema[]): RespostaAssistente | null {
  if (ultimo === "visao-geral:financas" || ultimo === "menu:assuntos") {
    return {
      texto:
        "Para aprender mais sobre finanças, um bom caminho é:\n" +
        "1. Fazer as trilhas do Integra Jovem, começando por \"Seu primeiro dinheiro\".\n" +
        "2. Praticar com as ferramentas: o Controle de Gastos e os simuladores.\n" +
        "3. Fazer um curso gratuito, como os da Fundação Bradesco e do Banco Central.\n\n" +
        "E pode me perguntar qualquer coisa no caminho!",
      temaId: "contexto:aprender-financas",
      links: [
        { rotulo: "Trilha: Seu primeiro dinheiro", href: "/trilhas/primeiro-dinheiro" },
        { rotulo: "Abrir o Controle de Gastos", href: "/financas" },
      ],
      externos: [
        { rotulo: "Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco", url: "https://www.ev.org.br/cursos/educacao-financeira" },
        { rotulo: "Cursos gratuitos de finanças pessoais — Banco Central (Cidadania Financeira)", url: "https://www.bcb.gov.br/cidadaniafinanceira/cursos" },
      ],
      sugestoes: ["Como organizo meu dinheiro do mês?", "O que é reserva de emergência?"],
    };
  }

  const tema = temas.find((t) => t.id === ultimo);
  if (!tema) return null;
  const relacionados = temasRelacionados(tema.id, temas);
  const partes = [`Continuando sobre "${semInterrogacao(tema.sugestao)}": ${primeiraFrase(tema.resposta)}`];
  if (tema.links?.length) partes.push(`Para praticar aqui no site, use os atalhos abaixo.`);
  if (tema.fonte) partes.push(`Para se aprofundar, vale o material indicado logo abaixo.`);
  if (relacionados.length) partes.push(`Esses assuntos também têm tudo a ver com isso:`);

  return {
    texto: partes.join("\n\n"),
    temaId: tema.id,
    links: tema.links,
    fonte: tema.fonte,
    sugestoes: relacionados.map((r) => r.sugestao),
  };
}

export function ehAssuntoDaConversa(temaId: string | undefined, temas: Tema[]): boolean {
  if (!temaId) return false;
  return temaId === "visao-geral:financas" || temaId === "menu:assuntos" || temas.some((t) => t.id === temaId);
}

export function enriquecerComContexto(
  resposta: RespostaAssistente,
  contexto: ContextoConversa,
  temas: Tema[],
): RespostaAssistente {
  const id = resposta.temaId;
  if (!id || !temas.some((t) => t.id === id)) return resposta;

  if (contexto.respondidos.includes(id) && contexto.ultimo !== id) {
    const relacionados = temasRelacionados(id, temas, 2);
    return {
      ...resposta,
      texto:
        `Já conversamos sobre isso há pouco, mas vale relembrar: ${resposta.texto}` +
        (relacionados.length ? `\n\nQuer ir além? Veja também os assuntos abaixo.` : ""),
      sugestoes: relacionados.length ? relacionados.map((r) => r.sugestao) : resposta.sugestoes,
    };
  }
  if (contexto.respondidos.includes(id) && contexto.ultimo === id) {
    return { ...resposta, texto: `Como eu disse agora há pouco: ${resposta.texto}` };
  }

  const anterior = contexto.ultimo ? temas.find((t) => t.id === contexto.ultimo) : null;
  if (anterior && temasRelacionados(anterior.id, temas, 50).some((t) => t.id === id)) {
    return {
      ...resposta,
      texto: `${resposta.texto}\n\nIsso conversa com o que vimos sobre "${semInterrogacao(anterior.sugestao)}".`,
    };
  }
  return resposta;
}

export function registrarNoContexto(
  contexto: ContextoConversa,
  temaId: string | undefined,
  temas: Tema[],
): ContextoConversa {
  if (!ehAssuntoDaConversa(temaId, temas)) return contexto;
  const id = temaId as string;
  return {
    ultimo: id,
    respondidos: contexto.respondidos.includes(id) ? contexto.respondidos : [...contexto.respondidos, id].slice(-50),
  };
}

const SUGESTOES_FIXAS = /^(ortografia:|menu:|ajuda:qual|ajuda:contexto|conversa:quer-conversar|apoio:|seguranca:)/;

export function diversificarSugestoes(
  resposta: RespostaAssistente,
  contexto: ContextoConversa,
  temas: Tema[],
  recentes: string[],
  quantidade = 3,
): RespostaAssistente {
  if (!resposta.sugestoes?.length || SUGESTOES_FIXAS.test(resposta.temaId ?? "")) return resposta;

  const idDaSugestao = (texto: string) => temas.find((t) => t.sugestao === texto)?.id;
  const jaVisto = (texto: string) => {
    const id = idDaSugestao(texto);
    return recentes.includes(texto) || (id !== undefined && (contexto.respondidos.includes(id) || id === resposta.temaId));
  };

  const escolhidas = resposta.sugestoes.filter((s) => !idDaSugestao(s) || !jaVisto(s));
  const candidatas = [
    ...(resposta.temaId ? temasRelacionados(resposta.temaId, temas, 12) : []),
    ...temas.filter((t) => t.sugerir !== false).sort(() => Math.random() - 0.5),
  ];
  for (const t of candidatas) {
    if (escolhidas.length >= quantidade) break;
    if (!escolhidas.includes(t.sugestao) && !jaVisto(t.sugestao) && t.sugerir !== false) escolhidas.push(t.sugestao);
  }
  return { ...resposta, sugestoes: escolhidas.slice(0, Math.max(quantidade, resposta.sugestoes.length)) };
}
