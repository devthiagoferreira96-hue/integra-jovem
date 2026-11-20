

import type { RespostaAssistente, Tema } from "@/lib/assistente";

export type Topico = {
  id: string;
  titulo: string;
  emoji: string;

  temas?: string[];

  perguntas?: string[];
};

export const TOPICOS: Topico[] = [
  {
    id: "organizar",
    titulo: "Organizar o dinheiro",
    emoji: "🗂️",
    temas: ["orcamento", "50-30-20", "mapa-financeiro", "planejamento-anual", "necessidade-desejo", "metas", "mesada", "assinaturas", "promocoes", "cashback", "conta-para-menor", "primeiro-salario"],
  },
  {
    id: "guardar-investir",
    titulo: "Guardar e investir",
    emoji: "🌱",
    temas: [
      "reserva", "investir", "perfil-investidor", "risco-liquidez", "juros-compostos", "cdi", "inflacao",
      "acoes", "fundos", "fundos-imobiliarios", "lci-lca", "imposto-investimentos", "fgc", "previdencia", "investimento-sustentavel",
      "poupanca", "tesouro-direto", "selic", "criptomoedas", "consorcio", "valores-a-receber",
    ],
  },
  {
    id: "credito-dividas",
    titulo: "Cartão, crédito e dívidas",
    emoji: "💳",
    temas: ["cartao", "debito-credito", "rotativo-teto", "cheque-especial", "parcelamento", "dividas", "emprestimo", "credito-a-favor", "score"],
  },
  {
    id: "protecao",
    titulo: "Golpes e proteção",
    emoji: "🛡️",
    temas: ["golpes", "pix-seguranca", "armadilhas", "seguro", "open-finance"],
  },
  {
    id: "comportamento",
    titulo: "Comportamento e emoções",
    emoji: "🧠",
    temas: ["perfil-financeiro", "impulso", "crencas-dinheiro", "comparacao", "ganhar-mais", "risco-calculado", "consumo-consciente", "familia"],
  },
  {
    id: "renda",
    titulo: "Renda e trabalho",
    emoji: "💼",
    temas: ["renda-extra", "ser-rico", "jovem-aprendiz", "primeiro-salario", "direitos-carteira", "fgts"],
  },
  {
    id: "meus-dados",
    titulo: "Meus dados no site",
    emoji: "📊",
    perguntas: [
      "Me mostre um resumo sobre mim",
      "Quanto gastei este mês?",
      "Quanto sobrou nos últimos 3 meses?",
      "Quanto falta para chegar na minha meta?",
      "Onde parei nas trilhas?",
      "Quantas atividades e trilhas eu já terminei?",
      "Qual é o meu nível?",
      "Quais são minhas conquistas?",
      "Quais são minhas medalhas?",
      "O que você lembra sobre mim?",
    ],
  },
  {
    id: "site",
    titulo: "Como funciona o site",
    emoji: "🎮",
    temas: ["como-funciona-site", "xp", "como-cadastrar", "cadastro-gratis"],
    perguntas: ["O que você lembra sobre mim?"],
  },
];

const norm = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function pedeMenuDeAssuntos(mensagem: string): boolean {
  const t = ` ${norm(mensagem)} `;
  return [
    " tudo o que voce sabe", " tudo que voce sabe", " o que voce sabe sobre financas", " o que voce sabe fazer",
    " o que voce pode", " o que voce faz", " quais assuntos", " quais temas", " quais topicos", " sobre o que voce",
    " me explique tudo", " me explica tudo", " me ensina tudo", " me ensine tudo", " me ensina sobre financas",
    " me ensine sobre financas", " me fala sobre financas", " tudo sobre financas", " tudo sobre dinheiro",
    " por onde comeco", " por onde eu comeco", " nao sei o que perguntar", " ver todos os assuntos",
    " quais os assuntos", " lista de assuntos", " o que da para perguntar", " o que posso perguntar",
  ].some((g) => t.includes(g)) && !/ (sobre mim|de mim|meu|minha|meus|minhas) /.test(t)
    || /^ (financas|dinheiro|assuntos|topicos|menu|ajuda|help|temas) $/.test(t);
}

export function topicoEscolhido(mensagem: string): Topico | null {
  const t = norm(mensagem).replace(/^(quero saber sobre|me fale sobre|assunto)\s+/, "");
  return TOPICOS.find((tp) => norm(tp.titulo) === t) ?? null;
}

export const textoEscolhaTopico = (tp: Topico) => `Quero saber sobre ${tp.titulo}`;

export function respostaMenuDeAssuntos(introducao?: string): RespostaAssistente {
  return {
    texto:
      introducao ??
      "Sei bastante coisa sobre dinheiro! Para ficar mais fácil, escolha um assunto abaixo e eu mostro as perguntas que sei responder. Você também pode escrever a sua dúvida com as suas palavras.",
    temaId: "menu:assuntos",
    topicos: TOPICOS.map((tp) => ({ id: tp.id, titulo: tp.titulo, emoji: tp.emoji })),
  };
}

export function respostaDoTopico(tp: Topico, temas: Tema[]): RespostaAssistente {
  const doTema = (tp.temas ?? [])
    .map((id) => temas.find((t) => t.id === id && t.sugerir !== false)?.sugestao)
    .filter((s): s is string => Boolean(s));
  const perguntas = [...new Set([...doTema, ...(tp.perguntas ?? [])])];
  return {
    texto: `${tp.emoji} ${tp.titulo}: escolha uma pergunta abaixo, ou escreva a sua sobre esse assunto.`,
    temaId: `menu:${tp.id}`,
    sugestoes: [...perguntas, "Ver todos os assuntos"],
  };
}

const GATILHOS_VISAO_GERAL = [
  "saber sobre financas", "saber mais sobre financas", "aprender sobre financas", "aprender financas", "entender financas",
  "entender sobre financas", "o que sao financas", "o que e financas", "o que significa financas", "financas pessoais",
  "me fala sobre financas", "me fale sobre financas", "me conta sobre financas", "me explica financas",
  "me explique financas", "falar sobre financas", "saber sobre dinheiro", "aprender sobre dinheiro",
  "entender sobre dinheiro", "aprender a lidar com dinheiro", "lidar com dinheiro", "cuidar do meu dinheiro",
  "cuidar do dinheiro", "comecar a aprender", "por onde comecar a aprender",
];

const TEMA_FINANCAS = "(financas|financa|financas pessoais|educacao financeira|dinheiro|economia pessoal)";
const PEDIDOS_VISAO_GERAL = [
  new RegExp(` (saber|aprender|entender|estudar|conhecer|falar|conversar)( mais)?( um pouco)? (sobre |de |a respeito de )?(as |a |o )?${TEMA_FINANCAS} `),
  new RegExp(` me (fala|fale|explica|explique|ensina|ensine|conta|conte)( mais| um pouco)? (sobre |de )?(as |a |o )?${TEMA_FINANCAS} `),
  new RegExp(` (comecar|iniciar) (a |em |com )?(aprender |entender )?(sobre )?${TEMA_FINANCAS} `),
];

export function pedeVisaoGeralFinancas(mensagem: string): boolean {
  const t = ` ${norm(mensagem)} `;

  if (/ (minha|minhas|meu|meus) (financas|dinheiro|vida financeira) /.test(t)) return false;
  return (
    GATILHOS_VISAO_GERAL.some((g) => t.includes(` ${g} `)) ||
    PEDIDOS_VISAO_GERAL.some((r) => r.test(t)) ||
    /^ (financas|financa|financas pessoais) $/.test(t)
  );
}

export function respostaVisaoGeralFinancas(): RespostaAssistente {
  return {
    texto:
      "Finanças pessoais é aprender a ganhar, gastar, guardar e investir o seu dinheiro com consciência, para ter tranquilidade hoje e realizar planos no futuro. Os grandes temas são:\n" +
      "🗂️ Organizar: anotar o que entra e sai e montar um orçamento.\n" +
      "🌱 Guardar e investir: reserva de emergência primeiro, depois fazer o dinheiro render com juros compostos.\n" +
      "💳 Crédito e dívidas: usar cartão e empréstimo sem se enrolar.\n" +
      "🛡️ Proteção: evitar golpes e armadilhas.\n" +
      "🧠 Comportamento: entender suas emoções na hora de gastar.\n\n" +
      "Escolha um assunto abaixo para começar:",
    temaId: "visao-geral:financas",
    links: [{ rotulo: "Começar pela trilha Seu primeiro dinheiro", href: "/trilhas/primeiro-dinheiro" }],
    externos: [
      { rotulo: "Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco", url: "https://www.ev.org.br/cursos/educacao-financeira" },
      { rotulo: "Cursos gratuitos de finanças pessoais — Banco Central (Cidadania Financeira)", url: "https://www.bcb.gov.br/cidadaniafinanceira/cursos" },
    ],
    topicos: TOPICOS.map((tp) => ({ id: tp.id, titulo: tp.titulo, emoji: tp.emoji })),
  };
}

