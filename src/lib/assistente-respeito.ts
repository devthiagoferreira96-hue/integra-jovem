

import type { RespostaAssistente } from "@/lib/assistente";

const norm = (t: string) =>
  ` ${t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

const PALAVRAS = new Set([
  "porra", "poha", "caralho", "krl", "crl", "caraio", "merda", "bosta", "puta", "puto", "putaria", "fdp", "pqp", "vsf",
  "tnc", "vtnc", "foder", "fuder", "fodase", "fudase", "foda", "fodido", "fudido", "cu", "arrombado", "arrombada",
  "otario", "otaria", "idiota", "imbecil", "babaca", "escroto", "escrota", "cacete", "desgraca", "desgracado",
  "desgracada", "vagabundo", "vagabunda", "viado", "retardado", "retardada", "cuzao", "corno", "piranha", "nojento",
  "nojenta", "estupido", "estupida", "buceta", "pau no cu", "lixoso",
]);

const EXPRESSOES = [
  "filho da puta", "filha da puta", "vai se foder", "vai se fuder", "vai tomar no", "foda se", "se foder", "se fuder",
  "chat burro", "site burro", "voce e burro", "vc e burro", "seu burro", "chat inutil", "site inutil", "voce e inutil",
  "vc e inutil", "chat idiota", "seu idiota", "cala a boca", "cala boca",
  "vai se lascar", "vai te lascar", "vai se lascas", "se lascar", "se lasca", "vai se ferrar", "vai te ferrar", "se ferrar",
  "se ferra", "vai a merda", "vai pra merda", "vai para a merda", "vai pro inferno", "vai para o inferno",
  "vai catar coquinho", "vai pastar", "vai encher o saco", "encher o saco", "enche o saco", "enchendo o saco", "para de encher", "nao enche",
  "vai te catar", "vai se catar", "vai a pqp", "vai pra pqp", "seu chato", "chato pra caramba", "inferno de chat",
];

const ABREVIACOES_AMBIGUAS: {
  termo: RegExp;
  ofensa: RegExp;
  neutro: RegExp;
  ehOfensaPorPadrao: boolean;
}[] = [
  {

    termo: /\b(fds|fdx|fodase|foda se|foda-se|fodas)\b/,

    ofensa: / (fds|fdx) (essa|esse|essa merda|voce|vc|voces|vcs|tu|seu|sua|isso|isto|tudo|ai|ne|vida|mundo|de novo) |foda-?se|fodas(e| )| se foder |essa merda| fds$| (fds|fdx) (de |do |da )?(site|chat|app|aplicativo|bot|robo|integra|lixo|merda|porcaria)/,
    neutro: /(fim de semana|final de semana|fazer|faz|fazem|fez|vao fazer|role|festa|praia|sabado|domingo|folga|plano|programa|sair|viajar|descansar|otimo|bom|boa|otima|feliz|legal|massa|top|maravilhoso|tranquilo|descanso|aproveitar|curtir|chegando|chegar|ta chegando|que vem|passado|foi otimo|foi bom|vai ser|sera|que fds bom|que fds otimo|que fds massa|que fds legal|que fds maravilhoso|que fds tranquilo|bom fds|otimo fds|no fds|esse fds|meu fds|seu fds|do fds|nesse fds|neste fds|pra vcs|para voces|pra voces)/,
    ehOfensaPorPadrao: true,
  },
  {

    termo: /\bpqp\b/,
    ofensa: /(.*)/,
    neutro: /(nao existe nenhum contexto neutro aqui)/,
    ehOfensaPorPadrao: true,
  },
];

function abreviacaoAmbiguaEhOfensa(t: string): boolean | null {
  for (const a of ABREVIACOES_AMBIGUAS) {
    if (!a.termo.test(t)) continue;
    if (a.neutro.test(t)) return false;
    if (a.ofensa.test(t)) return true;
    return a.ehOfensaPorPadrao;
  }
  return null;
}

export function contemPalavrao(mensagem: string): boolean {
  const t = norm(mensagem);

  const ambigua = abreviacaoAmbiguaEhOfensa(t);
  if (ambigua === true) return true;

  if (/ (sou|me sinto|me acho) (um |uma |muito |tao )?(idiota|burro|burra|imbecil|estupido|estupida|otario|otaria|lixo|inutil) /.test(t)) {
    return false;
  }
  if (EXPRESSOES.some((e) => t.includes(` ${e} `))) return true;

  if (sentidoDeLixo(mensagem) === "ofensa") return true;

  if (/^ (que porcaria|porcaria|horrivel|ridiculo|ridicula) $/.test(t)) return true;
  return t
    .trim()
    .split(" ")
    .some((palavra) => PALAVRAS.has(palavra));
}

const escolher = <T,>(lista: T[]): T => lista[Math.floor(Math.random() * lista.length)];

function fraseIdade(idade: number | null): string {
  if (idade === null) return "";
  if (idade < 18) {
    return escolher([
      `Você tem ${idade} anos, e alguém da sua idade não precisa falar desse jeito: dá para mostrar o que sente sem ofender ninguém.`,
      `Com ${idade} anos, você já sabe se expressar muito bem sem usar esse tipo de palavra, e é assim que a gente conversa aqui.`,
      `Na sua idade (${idade} anos), está se construindo a forma como você se comunica, e falar com respeito faz diferença na escola, no trabalho e em tudo.`,
    ]);
  }
  return escolher([
    `Com ${idade} anos, você sabe que dá para discordar ou reclamar sem usar palavras ofensivas.`,
    `Você tem ${idade} anos, e aqui esperamos que todo mundo, de qualquer idade, converse com respeito.`,
  ]);
}

export const LIMITE_ADVERTENCIAS = 4;

export function respostaRespeito(idade: number | null, vezes: number): RespostaAssistente {
  const idadeTexto = fraseIdade(idade);

  if (vezes >= LIMITE_ADVERTENCIAS) {
    return {
      texto:
        "Essa é a última vez que eu aviso. 🛑 O Integra Jovem é um espaço de respeito, e falar assim com os outros não é certo, ainda mais numa idade em que você está crescendo e aprendendo a se comunicar. " +
        (idadeTexto ? `${idadeTexto} ` : "") +
        "A partir de agora, vou responder só quando a mensagem não tiver palavrões nem ofensas. Quando quiser conversar com respeito, estarei aqui.",
      temaId: "respeito:limite",
      sugestoes: ["Ver todos os assuntos"],
    };
  }

  if (vezes === 3) {
    return {
      texto:
        "Opa, já é a terceira vez. Eu entendo a frustração, mas não dá para falar assim. " +
        (idadeTexto ? `${idadeTexto} ` : "") +
        "Se continuar, vou passar a responder só as mensagens respeitosas. Bora recomeçar com calma?",
      temaId: "respeito:firme",
      sugestoes: ["Ver todos os assuntos"],
    };
  }

  const abertura = escolher([
    "Entendo que algo pode ter te deixado chateado, mas o Integra Jovem não compactua com esse tipo de palavreado.",
    "Percebi palavras ofensivas na sua mensagem. Aqui no Integra Jovem a gente conversa com respeito, e não compactuamos com esse tipo de linguagem.",
    "Opa, vamos manter o respeito? O Integra Jovem é um espaço seguro para todos, e não compactuamos com palavrões ou ofensas.",
  ]);
  const fechamento = escolher([
    "Se alguma coisa não funcionou ou você não encontrou o que procurava, me conte com outras palavras que eu vou tentar ajudar.",
    "Se estiver frustrado com o site ou com alguma resposta minha, me explique o que aconteceu que eu tento resolver.",
    "Quer tentar de novo? Escreva sua dúvida ou escolha um assunto, e eu te ajudo com prazer.",
  ]);

  return {
    texto: [abertura, idadeTexto, fechamento].filter(Boolean).join(" "),
    temaId: "respeito",
    sugestoes: ["Ver todos os assuntos"],
  };
}

const CONTEXTO_AMBIENTAL =
  / (recicl\w*|separ\w*|coleta|seletiva|descart\w*|organico|organicos|residuo\w*|lixao|lixoes|lixeira\w*|meio ambiente|sustentab\w*|natureza|plastico\w*|reaproveit\w*|compost\w*|poluic\w*|oceano\w*|rua|ruas|jogar|joga|jogo|toneladas?|ecoponto\w*|pilhas?|eletronico\w*|garrafa\w*|brasil|cidade|mundo|planeta) /;

const ALVOS = "(site|chat|app|aplicativo|plataforma|projeto|sistema|bot|robo|integra|integrachat|voce|vc|voces|vcs|isso|isto|esse|essa|este|esta|tu|ele|ela|resposta|respostas|curso|trilha|trilhas)";

export function sentidoDeLixo(mensagem: string): "ambiente" | "ofensa" | "ambiguo" | null {
  const t = norm(mensagem);
  if (!/ lixo(s)? /.test(t)) return null;
  if (CONTEXTO_AMBIENTAL.test(t)) return "ambiente";
  const ofensa = [
    / (e|eh|sao|ta|esta|virou|parece|fica|ficou) (um |uma |mo |muito |puro |so )?lixo /,
    / que lixo /,
    / (seu|sua|seus|suas) lixo/,
    new RegExp(` lixo (de |do |da )?${ALVOS} `),
    new RegExp(` ${ALVOS} (e |eh |sao |ta |)?(um |uma |mo |muito )?lixo `),
  ];
  if (ofensa.some((r) => r.test(t))) return "ofensa";
  return "ambiguo";
}

export function respostaLixoAmbiguo(): RespostaAssistente {
  return {
    texto:
      "Não entendi bem o que você quis dizer. Você quer saber sobre lixo e reciclagem, ou alguma coisa no site não saiu como você esperava? Me conta um pouco mais que eu te ajudo.",
    temaId: "lixo:ambiguo",
    sugestoes: ["Como separar o lixo e reciclar?", "Algo no site não funcionou"],
  };
}

export function relataProblemaNoSite(mensagem: string): boolean {
  const t = norm(mensagem);
  if (t.includes(" algo no site nao funcionou ")) return true;
  const problema = / (nao funciona|nao funcionou|deu erro|da erro|dando erro|bug|bugou|travou|trava|nao carrega|nao abre|nao salva|nao salvou|sumiu|problema) /;
  const lugar = / (site|chat|app|aplicativo|pagina|tela|botao|login|entrar|cadastro|trilha|quiz|jornada|financas|controle de gastos|simulador|perfil|integra|integrachat) /;
  return problema.test(t) && lugar.test(t);
}

export function respostaProblemaNoSite(): RespostaAssistente {
  return {
    texto:
      "Poxa, sinto muito que algo não funcionou! Algumas coisas que costumam resolver:\n" +
      "1. Recarregue a página (no computador, Ctrl+F5).\n" +
      "2. Confira sua conexão com a internet.\n" +
      "3. Se o problema for no login, saia da conta e entre de novo.\n\n" +
      "Se continuar, me conte em qual página você estava e o que tentou fazer, ou avise a equipe do Integra Jovem para a gente corrigir.",
    temaId: "suporte:site",
    sugestoes: ["Ver todos os assuntos"],
  };
}

export const FRASES_RESPEITO_TODAS: string[] = [...PALAVRAS, ...EXPRESSOES];

export function respostaModoSilencioso(): RespostaAssistente {
  return {
    texto:
      escolher([
        "Vou aguardar uma mensagem sem ofensas para poder te ajudar. 🙂",
        "Quando você escrever sem palavrões, eu respondo na hora. Estou aqui.",
        "Sigo por aqui, pronto para ajudar assim que a conversa for respeitosa.",
      ]),
    temaId: "respeito:silencio",
  };
}
