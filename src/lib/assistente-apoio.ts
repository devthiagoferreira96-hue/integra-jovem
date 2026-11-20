

import type { RespostaAssistente } from "@/lib/assistente";

const norm = (t: string) =>
  ` ${t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

const contem = (t: string, lista: string[]) => lista.some((p) => t.includes(` ${p} `) || t.includes(` ${p}`));

const FRASES_RISCO = [
  "quero morrer", "vontade de morrer", "penso em morrer", "pensando em morrer", "pensamentos de morte",
  "pensamento de morte", "vou me matar", "quero me matar", "me matar", "suicidio", "suicidar", "me suicidar",
  "tirar minha vida", "tirar a minha vida", "tirar a propria vida", "acabar com a minha vida", "acabar com minha vida",
  "acabar com tudo", "nao quero mais viver", "nao quero viver", "nao quero mais estar aqui", "queria sumir para sempre",
  "sumir para sempre", "dormir e nao acordar", "nao acordar mais", "seria melhor sem mim", "melhor sem mim",
  "melhor se eu nao existisse", "queria nao existir", "nao queria existir", "me machucar", "me cortar", "me ferir",
  "me machuco", "me corto", "nao vale a pena viver", "cansei de viver", "desistir da vida", "tirar a vida",
];

const RADICAIS_RISCO = / (suicid\w*|autoles\w*|automutil\w*|autoextermin\w*|me matar|me mato|me matando de vez|morrer logo|quero morrer|vontade de morrer|ideacao suicida) /;

const PALAVRAS_DINHEIRO = [
  "divida", "dividas", "devendo", "conta", "contas", "boleto", "boletos", "fatura", "cartao", "dinheiro", "nome sujo",
  "negativado", "negativada", "emprestimo", "parcela", "parcelas", "aluguel", "salario", "emprego", "desempregado",
  "desempregada", "demitido", "demitida", "vida financeira", "financas", "grana", "juros", "agiota", "aposta", "apostas",
  "bet", "bets",
];

const FRASES_DINHEIRO = [
  "muitas dividas", "muita divida", "cheio de dividas", "cheia de dividas", "afogado em dividas", "afogada em dividas",
  "afundado em dividas", "afundada em dividas", "dividas me ajude", "me ajude com as dividas", "me ajuda com as dividas",
  "contas estao me matando", "contas me matando", "dividas estao me matando", "dividas me matando",
  "dividas acabando comigo", "contas acabando comigo", "nao consigo pagar", "nao sei como pagar", "nao vou conseguir pagar",
  "devendo muito", "devo muito", "perdi o controle", "nao tenho dinheiro para nada", "nao tenho dinheiro pra nada",
  "estresse com dinheiro", "ansiedade por causa de dinheiro", "dinheiro me deixando", "dinheiro esta me deixando",
  "nao durmo por causa", "perdi meu emprego", "perdi o emprego", "fui demitido", "fui demitida", "perdi dinheiro em aposta",
  "perdi tudo", "estou quebrado", "estou quebrada", "to quebrado", "to quebrada", "estou falido", "estou falida",
  "dificuldade com as contas", "dificuldades com as contas", "dificuldade com contas", "dificuldade para pagar",
  "dificuldade pra pagar", "dificuldade financeira", "dificuldades financeiras", "apertado com as contas",
  "aperto financeiro", "contas atrasadas", "atrasei as contas", "nao consigo fechar o mes", "problema com as contas",
  "problemas com as contas", "problemas financeiros", "problema financeiro",
];

const FRASES_EMOCIONAL = [
  "nao estou bem", "nao to bem", "nao tou bem", "nao me sinto bem", "estou mal", "to mal", "tou mal", "me sinto mal",
  "estou triste", "to triste", "muito triste", "tristeza", "deprimido", "deprimida", "depressao", "ansioso", "ansiosa",
  "ansiedade", "crise de ansiedade", "crise de choro", "chorando", "choro todo dia", "angustia", "angustiado", "angustiada",
  "sozinho", "sozinha", "solidao", "sem esperanca", "perdi a esperanca", "nao aguento mais", "nao aguento", "cansado de tudo",
  "cansada de tudo", "esgotado", "esgotada", "desesperado", "desesperada", "desespero", "sem saida", "nao vejo saida",
  "nao tem saida", "sou um fracasso", "sou uma fracassada", "sou um fracassado", "ninguem se importa", "ninguem liga",
  "estou com medo", "to com medo", "com vergonha", "vergonha de mim",
  "sou um idiota", "sou uma idiota", "sou burro", "sou burra", "me sinto burro", "me sinto burra", "me sinto um idiota",
  "me sinto uma idiota", "sou inutil", "me sinto inutil", "sou um lixo", "me sinto um lixo", "me acho burro", "me acho burra",
  "me matando", "acabando comigo", "pesadelo", "estresse", "estressado", "estressada", "panico",
  "infeliz", "infelicidade", "desanimado", "desanimada", "desmotivado", "desmotivada", "pra baixo", "para baixo",
  "sem vontade de nada", "vazio por dentro", "me sinto vazio", "me sinto vazia",
  "me sinto triste", "estou com muita raiva", "to com muita raiva", "muita raiva",
];

export type NivelApoio = "risco" | "dinheiro" | "emocional";

export function classificarSofrimento(mensagem: string): NivelApoio | null {
  const t = norm(mensagem);
  if (contem(t, FRASES_RISCO) || RADICAIS_RISCO.test(t)) return "risco";
  if (contem(t, FRASES_DINHEIRO)) return "dinheiro";
  if (contem(t, FRASES_EMOCIONAL)) return contem(t, PALAVRAS_DINHEIRO) ? "dinheiro" : "emocional";
  return null;
}

const CVV = { rotulo: "CVV — Centro de Valorização da Vida (ligue 188 ou converse pelo chat)", url: "https://cvv.org.br/chat/" };
const CONSUMIDOR_GOV = {
  rotulo: "Consumidor.gov.br — plataforma pública e gratuita para negociar dívidas com empresas",
  url: "https://www.consumidor.gov.br",
};
const REGISTRATO = {
  rotulo: "Registrato (Banco Central) — veja de graça as dívidas no seu CPF (maiores de 18, com gov.br)",
  url: "https://registrato.bcb.gov.br",
};

const BLOCO_AJUDA_IMEDIATA =
  "📞 CVV — ligue 188: é gratuito e funciona 24 horas, todos os dias. Também dá para conversar pelo chat no site cvv.org.br.\n" +
  "🚑 Se você estiver em perigo agora, ligue para o SAMU (192) ou vá ao pronto-socorro mais próximo.";

const escolher = <T,>(lista: T[]): T => lista[Math.floor(Math.random() * lista.length)];

const RESPOSTAS_RISCO = [
  "Obrigado por me contar isso. Pelo que você escreveu, você está passando por algo muito pesado, e você merece ajuda agora, não depois.\n\n" +
    "Se você está pensando em se machucar ou em tirar a própria vida, por favor fale com alguém neste momento:\n" +
    BLOCO_AJUDA_IMEDIATA +
    "\n\nE procure uma pessoa de confiança agora mesmo: alguém da sua família, um amigo, um professor. Você não precisa passar por isso sozinho. Problemas com dinheiro têm saída, e a gente pode ver isso juntos depois, com calma.",
  "Sinto muito que você esteja se sentindo assim. O que você está sentindo importa, e você não precisa carregar isso sozinho.\n\n" +
    "Se esses pensamentos incluem se machucar ou não querer mais viver, converse com alguém agora:\n" +
    BLOCO_AJUDA_IMEDIATA +
    "\n\nTambém vale chamar alguém de confiança para ficar com você: família, amigo, professor ou orientador da escola. Sou um assistente de finanças e não substituo uma pessoa, mas estou aqui quando você quiser organizar a parte do dinheiro.",
];

const RESPOSTAS_DINHEIRO = [
  "Sinto muito que você esteja passando por isso. Dívidas e contas apertadas pesam muito, e é normal se sentir assim. Mas isso não define quem você é, e tem saída.\n\n" +
    "Um primeiro passo pequeno:\n" +
    "1. Respire e anote, num papel ou no Controle de Gastos, todas as dívidas: com quem, quanto e quando vence.\n" +
    "2. Garanta primeiro o essencial: comida, moradia, contas de água e luz.\n" +
    "3. Não faça uma dívida nova para pagar outra.\n" +
    "4. Negocie: o Consumidor.gov.br é público e gratuito, e o Procon da sua cidade também ajuda.\n\n" +
    "Se você é menor de idade, converse com seus pais ou responsáveis. E se o peso estiver grande demais, fale com o CVV pelo 188, a ligação é gratuita e funciona 24 horas.",
  "Obrigado por me contar. Quando as contas apertam, parece que não tem saída, mas tem, e você não precisa resolver tudo hoje.\n\n" +
    "Vamos por partes:\n" +
    "• Liste o que você deve. Ver os números no papel costuma assustar menos do que imaginar.\n" +
    "• Separe o que é urgente (o que garante comida, moradia e luz) do que pode esperar.\n" +
    "• Procure negociar antes de atrasar mais: no Consumidor.gov.br ou no Procon, muitas empresas oferecem desconto e parcelamento.\n" +
    "• Converse com alguém de confiança. Dividir o problema já alivia.\n\n" +
    "E se a ansiedade estiver tomando conta, o CVV atende pelo 188, de graça, 24 horas.",
  "Imagino o quanto isso está te deixando mal. Muita gente passa por aperto financeiro, e pedir ajuda, como você está fazendo, é um passo importante.\n\n" +
    "Hoje, só uma tarefa: descobrir o tamanho real do problema. Anote cada dívida (valor, juros e vencimento). Para quem tem 18 anos ou mais, o Registrato do Banco Central mostra de graça o que está registrado no seu CPF.\n\n" +
    "Depois, a gente escolhe por onde começar, sempre pelas de juros mais altos, como cartão e cheque especial. Se você é menor de idade, envolva um adulto de confiança.\n\n" +
    "Se em algum momento o peso ficar grande demais, ligue 188 (CVV, gratuito e 24 horas).",
];

const RESPOSTAS_EMOCIONAL = [
  "Sinto muito que você não esteja bem. Obrigado por confiar e me contar.\n\n" +
    "Às vezes o que mais ajuda é conversar com alguém: uma pessoa da família, um amigo, um professor ou o orientador da escola. Você não precisa passar por isso sozinho.\n\n" +
    "Se quiser conversar com alguém agora, o CVV atende pelo telefone 188, de graça e 24 horas, ou pelo chat no site cvv.org.br.\n\n" +
    "Se parte do que está pesando for dinheiro, me conta que a gente vê junto, um passo de cada vez.",
  "Que pena que você está passando por um momento difícil. O que você sente é importante.\n\n" +
    "Algumas coisas que podem ajudar agora: falar com alguém em quem você confia, sair um pouco do celular, beber uma água, respirar devagar por alguns minutos.\n\n" +
    "Se a tristeza ou a ansiedade estiverem fortes ou durando muito, procure ajuda: o CVV atende pelo 188 (gratuito, 24 horas), e a unidade de saúde do seu bairro pode te encaminhar para atendimento psicológico pelo SUS.\n\n" +
    "Estou aqui também se quiser falar sobre dinheiro.",
  "Obrigado por compartilhar como você está. Não estar bem acontece com todo mundo, e procurar ajuda é um sinal de força, não de fraqueza.\n\n" +
    "Converse com alguém próximo: família, amigos ou um professor. Se preferir falar com alguém de fora, o CVV atende pelo 188, de graça e a qualquer hora, ou pelo chat em cvv.org.br.\n\n" +
    "Quando você se sentir pronto, posso te ajudar a organizar a parte do dinheiro, se isso também estiver pesando.",
];

export function respostaDeApoio(nivel: NivelApoio): RespostaAssistente {
  if (nivel === "risco") {
    return { texto: escolher(RESPOSTAS_RISCO), temaId: "apoio:risco", externos: [CVV] };
  }
  if (nivel === "dinheiro") {
    return {
      texto: escolher(RESPOSTAS_DINHEIRO),
      temaId: "apoio:dinheiro",
      links: [
        { rotulo: "Anotar minhas dívidas no Controle de Gastos", href: "/financas" },
        { rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" },
      ],
      externos: [CVV, CONSUMIDOR_GOV, REGISTRATO],
      sugestoes: ["Estou com dívida, o que faço?", "Qual a diferença entre endividado e inadimplente?"],
    };
  }
  return {
    texto: escolher(RESPOSTAS_EMOCIONAL),
    temaId: "apoio:emocional",
    externos: [CVV],
    sugestoes: ["Estou com dívida, o que faço?", "Como organizo meu dinheiro do mês?"],
  };
}

export const FRASES_APOIO_TODAS: string[] = [...FRASES_RISCO, ...FRASES_DINHEIRO, ...FRASES_EMOCIONAL, ...PALAVRAS_DINHEIRO];
