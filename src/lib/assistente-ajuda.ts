
import type { RespostaAssistente } from "@/lib/assistente";
import { respostaMenuDeAssuntos } from "@/lib/assistente-topicos";

const norm = (t: string) =>
  ` ${t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

const SINAIS_DE_SOFRIMENTO = [
  "nao aguento mais", "nao aguento", "quero sumir", "quero morrer", "vou me matar", "me matar", "acabar com tudo",
  "acabar com a minha vida", "sem saida", "nao vejo saida", "nao tem saida", "desesperado", "desesperada",
  "nao quero mais viver", "tirar minha vida", "ninguem se importa", "sou um fracasso", "sou uma fracassada",
  "sou um fracassado", "estou deprimido", "estou deprimida", "to deprimido", "to deprimida",
];

const PEDIDOS_AMPLOS = [
  "resolver minha vida", "resolvo minha vida", "arrumar minha vida", "arrumo minha vida", "organizar minha vida",
  "organizo minha vida", "mudar minha vida", "melhorar minha vida", "minha vida ta uma bagunca",
  "minha vida esta uma bagunca", "vida financeira", "nao sei o que fazer da minha vida", "nao sei o que fazer",
  "estou perdido", "estou perdida", "to perdido", "to perdida", "me sinto perdido", "me sinto perdida",
  "estou mal de dinheiro", "to mal de dinheiro", "estou quebrado",
  "estou quebrada", "to quebrado", "to quebrada", "estou sem dinheiro", "to sem dinheiro", "tudo errado",
];

export function temSinaisDeSofrimento(mensagem: string): boolean {
  const t = norm(mensagem);
  return SINAIS_DE_SOFRIMENTO.some((s) => t.includes(` ${s}`));
}

export function pedeAjudaAmpla(mensagem: string): boolean {
  const t = norm(mensagem);
  return PEDIDOS_AMPLOS.some((s) => t.includes(` ${s}`));
}

const FONTES_OFICIAIS = [
  {
    rotulo: "Cursos gratuitos de finanças pessoais — Banco Central (Cidadania Financeira)",
    url: "https://www.bcb.gov.br/cidadaniafinanceira/cursos",
  },
  {
    rotulo: "Registrato — consulta gratuita de empréstimos e dívidas no seu CPF (Banco Central, maiores de 18 com gov.br)",
    url: "https://registrato.bcb.gov.br",
  },
  {
    rotulo: "Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco",
    url: "https://www.ev.org.br/cursos/educacao-financeira",
  },
];

const LINKS_AJUDA = [
  { rotulo: "Anotar meus gastos", href: "/financas" },
  { rotulo: "Criar uma meta", href: "/perfil" },
  { rotulo: "Ver as trilhas", href: "/trilhas" },
];

export const PEDIDO_DETALHES = "Me explique cada passo";

export function pedeDetalhesDoPlano(mensagem: string): boolean {
  const t = norm(mensagem);
  return [" me explique cada passo", " explique cada passo", " cada passo", " detalhe os passos", " detalhar os passos"].some((g) =>
    t.includes(g),
  );
}

export function respostaAjudaAmpla(): RespostaAssistente {
  const menu = respostaMenuDeAssuntos();
  return {
    texto:
      "Não dá para resolver tudo de uma vez, mas a parte do dinheiro dá para organizar em passos pequenos:\n" +
      "1. Anote por um mês tudo o que entra e sai.\n" +
      "2. Liste suas dívidas e os juros.\n" +
      "3. Monte um orçamento e guarde primeiro.\n" +
      "4. Crie uma reserva e uma meta possível.\n" +
      "5. Continue aprendendo nas trilhas.\n\n" +
      "É para isso que o Integra Jovem existe: ajudar você a se preparar hoje para o futuro.\n\n" +
      "Se não for só dinheiro, converse com alguém de confiança. Por onde quer começar?",
    temaId: "ajuda:ampla",
    links: LINKS_AJUDA,
    externos: FONTES_OFICIAIS,
    sugestoes: [PEDIDO_DETALHES],
    topicos: menu.topicos,
  };
}

export function respostaAjudaDetalhada(): RespostaAssistente {
  const menu = respostaMenuDeAssuntos();
  return {
    texto:
      "Vamos por partes:\n" +
      "1. Descubra onde você está: anote por um mês tudo o que entra e tudo o que sai. Sem esse retrato, qualquer plano é chute.\n" +
      "2. Olhe para as dívidas: liste o que você deve, quanto falta e os juros de cada uma. Para quem tem 18 anos ou mais, o Registrato do Banco Central mostra de graça os empréstimos registrados no seu CPF.\n" +
      "3. Monte um orçamento: separe o essencial, corte desperdícios e decida um valor para guardar assim que o dinheiro entrar, e não com o que sobrar.\n" +
      "4. Crie uma reserva de emergência e uma meta que dê para alcançar em poucos meses. Cada meta cumprida dá confiança para a próxima.\n" +
      "5. Continue aprendendo: o Banco Central oferece cursos gratuitos de finanças pessoais, e as trilhas do Integra Jovem estão aqui para isso.\n\n" +
      "É exatamente para isso que o Integra Jovem existe. A adolescência e o começo da vida adulta são a fase em que surgem o primeiro dinheiro, as primeiras escolhas e as primeiras responsabilidades, e o que você aprende agora vira hábito para a vida toda. Nossa iniciativa não pensa só no agora: ela foi criada para ajudar jovens e adolescentes a se prepararem para o futuro, com trilhas, ferramentas e metas que constroem, passo a passo, uma vida financeira mais tranquila lá na frente.\n\n" +
      "Se o que está pesando não é só o dinheiro, converse com alguém de confiança: família, professor ou orientador da escola.",
    temaId: "ajuda:detalhada",
    links: LINKS_AJUDA,
    externos: FONTES_OFICIAIS,
    topicos: menu.topicos,
  };
}

export function respostaApoio(): RespostaAssistente {
  return {
    texto:
      "Sinto muito que você esteja passando por isso. O que você sente importa, e você não precisa lidar com isso sozinho.\n\n" +
      "Converse agora com alguém de confiança: alguém da sua família, um amigo próximo, um professor ou o orientador da escola.\n\n" +
      "Você também pode falar com o CVV (Centro de Valorização da Vida) pelo telefone 188, a ligação é gratuita e funciona 24 horas, ou pelo chat no site cvv.org.br. Se você estiver em perigo agora, ligue para o SAMU (192).\n\n" +
      "Sou um assistente de finanças e não substituo o cuidado de uma pessoa. Quando você se sentir pronto, posso te ajudar a organizar a parte do dinheiro, um passo de cada vez.",
    temaId: "ajuda:apoio",
    sugestoes: ["Estou com dívida, o que faço?", "Como organizo meu dinheiro do mês?"],
    externos: [{ rotulo: "CVV — Centro de Valorização da Vida (188 ou chat)", url: "https://cvv.org.br" }],
  };
}

const PEDIDO_AJUDA_CURTO =
  /^ (me ajude|me ajuda|me ajudem|ajuda|ajude|ajudar|me ajude por favor|me ajuda por favor|me ajude pf|me ajuda pf|me ajude pfv|me ajuda pfv|ajuda pf|ajuda pfv|ajuda por favor|pf|pfv|por favor|porfavor|plis|pls|please|help|socorro|sos|preciso de ajuda|preciso de uma ajuda|me ajuda ai|me ajuda ae|pode me ajudar|voce pode me ajudar|vc pode me ajudar|consegue me ajudar|tem como me ajudar|me da uma ajuda|me de uma ajuda|ajuda ai) $/;

const COMPLEMENTOS_AJUDA = / (entao|ai|ae|agora|por favor|pf|pfv|mesmo|vai|ne|sim|ok|com isso|nisso|nessa|nisso ai|rapido|urgente|preciso|eu|a|me) /g;

export function pedeAjudaSemDizerQual(mensagem: string): boolean {
  const t = norm(mensagem).replace(/ +/g, " ");
  if (PEDIDO_AJUDA_CURTO.test(t)) return true;

  let base = t;
  for (let i = 0; i < 3; i += 1) base = base.replace(COMPLEMENTOS_AJUDA, " ").replace(/ +/g, " ");
  base = ` ${base.trim()} `;
  return /^ (me ajude|me ajuda|ajuda|ajude|me ajudem|socorro|help|ajuda ai) $/.test(base) || /^ (ajuda|ajude|ajudem) $/.test(base);
}

export function respostaAjudaNoContexto(temaAnterior: string | null, nome: string | null): RespostaAssistente | null {
  if (!temaAnterior) return null;
  const voc = nome ? `, ${nome}` : "";
  const cvv = "Se precisar desabafar agora, o CVV atende pelo 188 (gratuito, 24h).";

  if (/^(seguranca:crime|seguranca:crime-geral|conversa:atividade-ilicita)$/.test(temaAnterior)) {
    return {
      texto: `Claro${voc}, vamos achar um caminho do jeito certo. 💪 O que está acontecendo? Escolha uma opção ou me conte com suas palavras.\n\n${cvv}`,
      temaId: "ajuda:contexto-crime",
      sugestoes: [
        "Estou com dívida, o que faço?",
        "Como ganhar uma renda extra sendo jovem?",
        "Não estou bem",
        "Alguém está me pressionando",
        "Fui vítima de golpe",
      ],
    };
  }
  if (temaAnterior === "seguranca:violencia") {
    return {
      texto: `Estou aqui${voc}. Respira fundo: a raiva passa, e a gente pode pensar junto no que fazer. O que aconteceu?\n\n${cvv} Se alguém estiver em perigo agora, ligue 190.`,
      temaId: "ajuda:contexto-violencia",
      sugestoes: ["Estou com muita raiva", "Alguém me fez mal", "Quero conversar"],
    };
  }
  if (temaAnterior === "seguranca:vitima-golpe") {
    return {
      texto:
        `Vamos por partes${voc}: 1) fale com o banco agora pelo app ou telefone oficial; 2) troque as senhas; 3) registre um boletim de ocorrência. ` +
        "Se você é menor de idade, chame um adulto de confiança para te ajudar nesses passos.",
      temaId: "ajuda:contexto-golpe",
      sugestoes: ["Como evitar golpes no Pix?", "Estou com dívida, o que faço?"],
    };
  }
  if (temaAnterior === "seguranca:vitima-violencia") {
    return {
      texto: `Você não está sozinho${voc}. Conte agora para um adulto de confiança. Em perigo, ligue 190. Crianças e adolescentes também podem ligar para o Disque 100. ${cvv}`,
      temaId: "ajuda:contexto-vitima",
      sugestoes: ["Quero conversar"],
    };
  }
  if (/^(apoio:|seguranca:pensamentos|conversa:estado)/.test(temaAnterior)) {
    return {
      texto: `Estou aqui com você${voc}. Me conta: o que está pesando mais agora?\n\n${cvv}`,
      temaId: "ajuda:contexto-apoio",
      sugestoes: ["Estou com dívida, o que faço?", "Me sinto triste", "Quero conversar"],
    };
  }
  return null;
}

export function respostaQualAjuda(nome: string | null): RespostaAssistente {
  return {
    texto:
      `Claro${nome ? `, ${nome}` : ""}, estou aqui para te ajudar! 😊 Que tipo de ajuda você precisa? Escolha uma opção abaixo ou me conte com as suas palavras.\n\n` +
      "Se for uma emergência, ligue 190 (Polícia) ou 192 (SAMU).",
    temaId: "ajuda:qual",
    sugestoes: [
      "Como organizo meu dinheiro do mês?",
      "Estou com dívida, o que faço?",
      "Não estou bem",
      "Quero aprender sobre finanças",
      "Quero saber sobre Como funciona o site",
      "Ver todos os assuntos",
    ],
  };
}

const AJUDA_FINANCAS =
  / (me ajud\w*|ajud\w*|preciso de ajuda|quero ajuda|uma ajuda|socorro)( a| com| nas| na| no| nos| em| pra| para| sobre)?( as| a| o| os| minha| minhas| meu| meus)? (financas|financa|dinheiro|grana|vida financeira|economia|orcamento|gastos|contas) /;

export function pedeAjudaComFinancas(mensagem: string): boolean {
  return AJUDA_FINANCAS.test(norm(mensagem));
}

const DICAS_RAPIDAS = [
  "Guarde um pouquinho assim que o dinheiro entrar, e não só o que sobrar.",
  "Antes de comprar, espere 24 horas: se ainda quiser, compra com calma.",
  "Anote cada gasto por uma semana: você vai se surpreender.",
  "Separe o que é necessidade do que é desejo antes de gastar.",
  "Desconfie de promessas de dinheiro fácil: quase sempre é golpe.",
];

export function respostaAjudaComFinancas(nome: string | null): RespostaAssistente {
  const dica = DICAS_RAPIDAS[Math.floor(Math.random() * DICAS_RAPIDAS.length)];
  return {
    texto:
      `Bora${nome ? `, ${nome}` : ""}! 💪 Um bom começo:\n` +
      "1. Faça a trilha \"Seu primeiro dinheiro\": é curta e tem quiz.\n" +
      "2. Anote seus gastos no Controle de Gastos.\n" +
      "3. Crie uma meta pequena no Perfil.\n\n" +
      `💡 Dica: ${dica}`,
    temaId: "ajuda:financas",
    links: [
      { rotulo: "Começar a trilha", href: "/trilhas/primeiro-dinheiro" },
      { rotulo: "Controle de Gastos", href: "/financas" },
    ],
    externos: [
      { rotulo: "Cursos grátis de finanças — Banco Central", url: "https://www.bcb.gov.br/cidadaniafinanceira/cursos" },
    ],
    sugestoes: ["Como organizo meu dinheiro do mês?", "Estou com dívida, o que faço?"],
  };
}
