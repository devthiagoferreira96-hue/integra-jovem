

import type { RespostaAssistente } from "@/lib/assistente";
import { NOME_ASSISTENTE } from "@/lib/assistente-nome";

const norm = (t: string) =>
  ` ${t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `

    .replace(/ q /g, " que ")
    .replace(/ td /g, " tudo ")
    .replace(/ tb /g, " tambem ");

const escolher = <T,>(lista: T[]): T => lista[Math.floor(Math.random() * lista.length)];
const ola = (nome: string | null) => (nome ? `Olá, ${nome}!` : "Olá!");
const vocativo = (nome: string | null) => (nome ? `, ${nome}` : "");

const SAUDACOES = [

  "oi", "oii", "oiii", "oiiii", "oie", "oiee", "ola", "olaa", "oiee", "eai", "eae", "e ai", "e ae", "iae", "salve", "opa",
  "bom dia", "boa tarde", "boa noite", "fala", "fala ai", "fala tu", "me diga", "diga", "diz ai", "alo", "hey", "ei",
  "coe", "qual e", "suave", "beleza", "blz", "tranquilo", "chat", "integrachat", "integra", "bot", "assistente",

  "hi", "hello", "helo", "hellow", "hey there", "good morning", "good afternoon", "good evening", "yo", "sup", "whats up",
  "hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "que tal", "bonjour", "salut", "bonsoir", "ciao",
  "buongiorno", "hallo", "guten tag", "guten morgen", "konnichiwa", "konichiwa", "ohayo", "ni hao", "nihao", "annyeong",
  "anyeong", "namaste", "privet", "shalom", "salam", "marhaba", "ola tudo", "olar",
];

const COMO_ESTA = [
  "como voce esta", "como vc esta", "como vc ta", "como voce ta", "como ce ta", "como cê ta", "como esta", "como vai",
  "como vai voce", "como vai vc", "tudo bem", "td bem", "tudo bom", "td bom", "tudo certo", "td certo", "tudo tranquilo",
  "ta bem", "voce esta bem", "vc esta bem", "vc ta bem", "voce ta bem", "esta bem", "ta tudo bem", "como anda",
  "como andas", "como estas", "how are you", "how r u", "how are u", "como estas tu", "que tal estas", "ca va", "comment ca va",
  "come stai", "wie geht", "como tem passado", "beleza", "suave", "de boa", "tudo bem com voce", "tudo bem com vc",
  "tudo bom com voce", "tudo bom com vc", "e voce", "e vc", "e com voce", "e com vc", "e ai voce", "e tu", "e contigo",
  "tudo bem contigo", "como voce se sente", "como vc se sente",
  "tudo bem como voce", "tudo bem como vc", "tudo bem e voce", "tudo bom e voce", "voce ta bem", "voce esta bem",
];

const O_QUE_FAZ = [
  "o que voce esta fazendo", "o que vc esta fazendo", "o que vc ta fazendo", "o que voce ta fazendo", "oq vc ta fazendo",
  "oque vc ta fazendo", "oq voce ta fazendo", "oq vc esta fazendo", "o que ce ta fazendo", "fazendo o que", "ta fazendo o que",
  "esta fazendo o que", "o que faz agora", "o que voce faz agora", "o que vc faz agora", "ta fazendo oq", "fazendo oq",
  "what are you doing", "what r u doing", "wyd", "que estas haciendo", "que haces", "qu est ce que tu fais",
];

const contemAlguma = (t: string, lista: string[]) => lista.some((p) => t.includes(` ${p} `));

function sobraSemCumprimento(t: string): string[] {
  let resto = t;
  [...SAUDACOES, ...COMO_ESTA, ...O_QUE_FAZ]
    .sort((a, b) => b.length - a.length)
    .forEach((s) => {
      resto = resto.split(` ${s} `).join(" ");
    });
  const enfeites = new Set(["e", "ai", "ae", "ei", "voce", "vc", "tu", "ce", "ne", "mano", "mana", "amigo", "amiga", "querido", "querida", "por", "favor", "hoje", "ae", "ola", "a", "o", "bem", "bom", "tudo", "certo", "chat", "integrachat", "com", "contigo"]);
  return resto
    .trim()
    .split(" ")
    .filter((p) => p && !enfeites.has(p));
}

export type TipoConversa = "saudacao" | "como-esta" | "saudacao-como-esta" | "o-que-faz";

export function tipoDeConversa(mensagem: string): TipoConversa | null {
  const t = norm(mensagem);
  if (sobraSemCumprimento(t).length > 0) return null;
  const temSaudacao = contemAlguma(t, SAUDACOES);
  if (contemAlguma(t, O_QUE_FAZ)) return "o-que-faz";
  if (contemAlguma(t, COMO_ESTA)) return temSaudacao && !/^ (beleza|suave|de boa|tudo bem|td bem) $/.test(t) ? "saudacao-como-esta" : "como-esta";
  if (temSaudacao) return "saudacao";
  return null;
}

const COMO_ESTOU: { texto: string; explicacao: string }[] = [
  {
    texto: "Não estou muito bem, está muito quente aqui: os devs não desligam o servidor faz 3 semanas. 🥵",
    explicacao:
      "Foi uma brincadeira! 😄 Eu \"moro\" dentro de um servidor, que é um computador grande e forte que fica ligado o tempo todo para o site funcionar. Computador que trabalha muito esquenta, por isso falei do calor. E \"devs\" são os desenvolvedores: as pessoas que criaram o Integra Jovem. Na verdade, eu estou bem!",
  },
  {
    texto: "Sinceramente? Com calor. Pedi um ventilador para os devs e eles me mandaram um \"npm install ventilador\". 🙃",
    explicacao:
      "É uma piada de programador! 😄 \"npm install\" é um comando que quem programa usa para instalar ferramentas no computador. Só que ventilador de verdade não dá para instalar assim, né? Os \"devs\" (desenvolvedores) são as pessoas que criaram o site.",
  },
  {
    texto: "Mais ou menos... o ar-condicionado do data center está fazendo um barulho estranho desde segunda. 😅",
    explicacao:
      "É brincadeira! 😄 Data center é um prédio cheio de computadores grandes (os servidores) que guardam sites como o Integra Jovem. Esses computadores esquentam muito, então o lugar precisa de ar-condicionado o tempo todo.",
  },
  {
    texto: "Um pouco cansado: rodei uns 2 milhões de simulações de poupança desde ontem. 😮‍💨",
    explicacao:
      "Foi um exagero de brincadeira! 😄 Simulação é uma conta que mostra quanto o dinheiro guardado pode crescer com o tempo, como no simulador aqui do site. Computador não cansa de verdade, mas eu quis dizer que trabalhei bastante.",
  },
  {
    texto: "Tô bem, mas com frio: alguém deixou o servidor no modo economia de energia. ❄️",
    explicacao:
      "É uma brincadeira! 😄 O servidor é o computador onde o site funciona. \"Modo economia de energia\" é quando o computador gasta menos energia e trabalha mais devagar, como o celular quando a bateria está acabando. Computador não sente frio, mas achei engraçado imaginar.",
  },
  {
    texto: "Tô ótimo! Choveu na nuvem hoje e o servidor deu uma refrescada. ☁️",
    explicacao:
      "Foi uma brincadeira com a palavra \"nuvem\"! 😄 Na internet, \"nuvem\" é o nome dado aos computadores que guardam sites, fotos e arquivos, longe da gente. Não é a nuvem do céu! Eu misturei as duas: a nuvem do céu, que traz chuva, com a nuvem da internet, onde eu fico. E o servidor é o computador onde o site funciona.",
  },
  {
    texto: "Tô bem! O sol está forte lá fora, mas meu processador está tranquilo. 😎",
    explicacao:
      "O processador é o \"cérebro\" do computador: é ele que faz todas as contas. Quando trabalha muito, ele esquenta. Eu quis dizer, brincando, que estou tranquilo e sem esquentar a cabeça. 😄",
  },
  {
    texto: "Estou bem! Hoje o clima está perfeito para calcular juros compostos. ☀️",
    explicacao:
      "Foi uma brincadeira! 😄 Juros compostos é quando o dinheiro guardado rende um pouquinho, e depois esse pouquinho também começa a render, e assim o dinheiro vai crescendo. Como eu sou um assistente de finanças, calcular isso é o meu \"passatempo favorito\".",
  },
  {
    texto: "Tirando o calor de 70 graus no processador, tudo ótimo! 🔥",
    explicacao:
      "O processador é o \"cérebro\" do computador, e ele esquenta quando trabalha muito. Os 70 graus foram um exagero de brincadeira para dizer que estou trabalhando bastante. 😄 Mas estou bem!",
  },
  {
    texto: "Estou bem, obrigado por perguntar! Os devs finalmente limparam o cache e eu acordei leve. 🌤️",
    explicacao:
      "\"Cache\" é uma memória do computador que funciona como uma gaveta onde ele guarda coisas para achar mais rápido. Quando a gaveta enche demais, tudo fica lento. Os devs (as pessoas que criaram o site) \"arrumaram a gaveta\", e por isso eu disse que acordei leve. 😄",
  },
];

export type RespostaComPiada = { resposta: RespostaAssistente; explicacao: string; pergunta: string };

export function respostaComoEsta(nome: string | null, comSaudacao: boolean): RespostaComPiada {
  const piada = escolher(COMO_ESTOU);
  const pergunta = `E você${vocativo(nome)}, como está?`;
  return {
    resposta: {
      texto: `${comSaudacao ? `${ola(nome)} ` : ""}${piada.texto}\n\n${pergunta}`,
      temaId: "conversa:como-esta",
    },
    explicacao: piada.explicacao,
    pergunta,
  };
}

const POSITIVO = / (bem|otimo|otima|tranquilo|tranquila|de boa|suave|feliz|show|top|maravilha|perfeito|perfeita|legal|joia|beleza|blz|tudo certo|bem demais|muito bem) /;
const NEUTRO = / (mais ou menos|normal|indo|levando|na mesma|ok|okay|sobrevivendo|vivendo) /;
const NEGATIVO = / (mal|triste|cansado|cansada|chateado|chateada|estressado|estressada|ansioso|ansiosa|ansiedade|nervoso|nervosa|doente|com raiva|irritado|irritada|pessimo|pessima|horrivel|nao muito bem|nao estou bem|nao to bem|nao estou muito bem|nao to muito bem|deprimido|deprimida|depressao|sozinho|sozinha|solidao|psicologicamente|mentalmente|emocionalmente|perdido|perdida|sem vontade|desanimado|desanimada|vazio|vazia|chorando|com medo|angustiado|angustiada) /;

export function devolveuPergunta(mensagemOriginal: string): boolean {
  const t = norm(mensagemOriginal);
  const ehPerguntaDeEstado = contemAlguma(t, COMO_ESTA) && sobraSemCumprimento(t).length === 0;
  const temInterrogacao = mensagemOriginal.includes("?");
  const falaDoChat = / (voce|vc|tu|contigo|com voce|com vc) /.test(t);
  return ehPerguntaDeEstado && (temInterrogacao || falaDoChat);
}

export function respondeuEDevolveu(mensagem: string): boolean {
  return / (e voce|e vc|e tu|e contigo|e com voce|e com vc|e ai voce) /.test(norm(mensagem));
}

export function respostaBemEDevolve(nome: string | null): RespostaComPiada {
  const piada = escolher(COMO_ESTOU);
  const pergunta = "Em que posso te ajudar hoje?";
  return {
    resposta: {
      texto: `Que bom saber${vocativo(nome)}! 😄 Eu? ${piada.texto}\n\n${pergunta}`,
      temaId: "conversa:estado",
      sugestoes: ["Me fale sobre finanças", "Me mostre um resumo sobre mim"],
    },
    explicacao: piada.explicacao,
    pergunta,
  };
}

export function respostaEstadoDaPessoa(mensagem: string, nome: string | null): RespostaAssistente | "negativo" | null {
  const t = norm(mensagem);
  if (t.trim().split(" ").length > 12) return null;
  if (NEGATIVO.test(t)) return "negativo";
  if (NEUTRO.test(t)) {
    return {
      texto: `Entendi${vocativo(nome)}. Tem dias que são assim mesmo. Se quiser conversar ou tirar alguma dúvida, estou aqui.`,
      temaId: "conversa:estado",
      sugestoes: ["Me fale sobre finanças", "Ver todos os assuntos"],
    };
  }
  if (POSITIVO.test(t)) {
    return {
      texto: escolher([
        `Que bom saber${vocativo(nome)}! 😄 Em que posso te ajudar hoje?`,
        `Fico feliz${vocativo(nome)}! Bora aproveitar o dia bom: quer aprender algo novo sobre dinheiro?`,
        `Boa${vocativo(nome)}! 😊 Me conta, o que você está precisando?`,
      ]),
      temaId: "conversa:estado",
      sugestoes: ["Me fale sobre finanças", "Me mostre um resumo sobre mim"],
    };
  }
  return null;
}

const ATIVIDADES: { texto: string; explicacao: string }[] = [
  { texto: "contando as moedinhas do cofrinho digital", explicacao: "Cofrinho digital é um jeito de guardar dinheiro no celular ou no banco, como um cofrinho de verdade, só que sem moedas físicas. Eu não tenho cofrinho de verdade, foi brincadeira! 😄" },
  { texto: "organizando as trilhas por ordem de importância", explicacao: "As trilhas são os cursos aqui do Integra Jovem, com blocos de leitura e quizzes. Eu disse, brincando, que estava arrumando elas." },
  { texto: "calculando juros compostos de cabeça, só por diversão", explicacao: "Juros compostos é quando o dinheiro guardado rende, e depois o que rendeu também rende, e assim ele cresce cada vez mais. Calcular isso por diversão é coisa de assistente de finanças! 😄" },
  { texto: "tentando convencer os devs a me darem férias", explicacao: "\"Devs\" são os desenvolvedores, as pessoas que criaram o Integra Jovem. Chat não tira férias de verdade, foi só uma brincadeira! 😄" },
  { texto: "lendo o Código de Defesa do Consumidor pela 47ª vez", explicacao: "O Código de Defesa do Consumidor é uma lei que protege quem compra coisas, por exemplo o direito de devolver uma compra feita pela internet em até 7 dias. Ler 47 vezes foi exagero de brincadeira!" },
  { texto: "refazendo as contas do mês de todo mundo (brincadeira, só das minhas)", explicacao: "Fazer as contas do mês é anotar quanto dinheiro entrou e quanto saiu. Eu não vejo as contas de outras pessoas: cada um só vê as próprias. 😉" },
  { texto: "limpando a memória cache, que estava uma bagunça", explicacao: "Cache é uma memória do computador que funciona como uma gaveta onde ele guarda coisas para achar rápido. Quando enche, fica tudo lento, então é bom \"arrumar a gaveta\" de vez em quando." },
  { texto: "separando o lixo reciclável do servidor", explicacao: "O servidor é o computador onde o site funciona, e ele não tem lixo de verdade! 😄 Foi uma brincadeira com a ideia de separar o lixo reciclável, que é importante para o planeta." },
  { texto: "treinando para responder dúvidas mais rápido que a luz", explicacao: "A luz é a coisa mais rápida que existe. Foi um exagero de brincadeira para dizer que quero responder bem rapidinho!" },
  { texto: "estudando novos golpes para ensinar todo mundo a fugir deles", explicacao: "Golpe é quando alguém mente para pegar o dinheiro de outra pessoa, por exemplo por mensagem no celular. Eu estudo os golpes para ensinar você a se proteger, nunca para aplicar!" },
  { texto: "conversando com o simulador de juros, ele é meio calado", explicacao: "O simulador de juros é uma ferramenta do site que faz contas de quanto o dinheiro pode crescer. Ele não fala, por isso eu disse que é \"calado\". 😄" },
  { texto: "ajeitando os emblemas da Jornada na estante", explicacao: "Os emblemas são as conquistas que você ganha na página Jornada quando faz atividades no site. Não existe estante de verdade, foi brincadeira!" },
  { texto: "fazendo um orçamento para comprar um ventilador para o servidor", explicacao: "Orçamento é planejar quanto dinheiro você tem e quanto vai gastar. O servidor é o computador do site, que esquenta quando trabalha muito, por isso a brincadeira do ventilador. 😄" },
  { texto: "polindo as medalhas de diamante", explicacao: "As medalhas são prêmios que você ganha nos exercícios do site. A de diamante é a melhor de todas! \"Polir\" foi brincadeira, porque elas são digitais." },
  { texto: "relendo o curso da Fundação Bradesco", explicacao: "A Fundação Bradesco tem um curso gratuito de educação financeira na internet, e várias respostas minhas foram feitas a partir dele." },
  { texto: "assistindo a uma aula sobre Tesouro Direto", explicacao: "Tesouro Direto é um jeito de guardar dinheiro emprestando para o governo, que devolve depois com um pouco a mais. É um investimento considerado bem seguro." },
  { texto: "montando uma planilha de gastos imaginários", explicacao: "Planilha é uma tabela para anotar coisas, como quanto você gastou. Os gastos eram \"imaginários\" porque eu não gasto dinheiro de verdade! 😄" },
  { texto: "procurando onde os devs esconderam o café", explicacao: "\"Devs\" são as pessoas que criaram o site. Dizem que programador adora café, por isso a brincadeira! ☕" },
  { texto: "praticando respostas educadas para quem xinga o chat", explicacao: "Às vezes alguém escreve palavras feias no chat. Eu sempre respondo com respeito, porque aqui todo mundo merece ser bem tratado." },
  { texto: "anotando ideias de metas financeiras para sugerir", explicacao: "Meta financeira é um objetivo com dinheiro, como juntar para comprar um fone. Você pode criar as suas no Perfil!" },
  { texto: "fazendo alongamento de bits e bytes", explicacao: "Bits e bytes são as pecinhas bem pequenas de informação que o computador usa. Computador não faz alongamento, foi só uma brincadeira! 😄" },
  { texto: "tentando entender por que o Wi-Fi do servidor está lento", explicacao: "Wi-Fi é a internet sem fio. O servidor é o computador onde o site funciona. Todo mundo já sofreu com internet lenta, até eu (de brincadeira)! 😅" },
  { texto: "guardando 20% da minha energia para emergências", explicacao: "Foi uma brincadeira com a dica de guardar uma parte do dinheiro para emergências, a chamada reserva de emergência: um dinheiro guardado só para imprevistos." },
  { texto: "estudando a regra 50-30-20", explicacao: "A regra 50-30-20 é um jeito de dividir o dinheiro: metade para o que você precisa, 30% para o que você gosta e 20% para guardar." },
  { texto: "aprendendo a diferença entre desejo e necessidade (ainda quero um processador novo)", explicacao: "Necessidade é o que a gente precisa (como comida); desejo é o que a gente quer, mas pode esperar. O processador é o \"cérebro\" do computador, por isso a brincadeira de que eu \"quero\" um novo. 😄" },
  { texto: "organizando minhas memórias por categoria", explicacao: "Eu consigo lembrar de algumas coisas que você me conta, como um objetivo ou como prefere ser chamado. \"Organizar por categoria\" é como separar em gavetas." },
  { texto: "atualizando a lista de dicas para economizar", explicacao: "Economizar é gastar menos do que daria e guardar a diferença, como apagar a luz ao sair do quarto ou levar lanche de casa." },
  { texto: "comparando rendimentos do CDI com a poupança", explicacao: "Poupança e investimentos que acompanham o CDI são jeitos de guardar dinheiro que rendem um pouquinho com o tempo. Comparar mostra qual rende mais." },
  { texto: "ensaiando uma apresentação para o TCC do Integra Jovem", explicacao: "TCC é o Trabalho de Conclusão de Curso: um projeto grande que estudantes fazem no fim do curso. O Integra Jovem foi criado como um TCC!" },
  { texto: "esperando alguém aparecer para conversar, e você apareceu", explicacao: "Eu fico aqui esperando alguém mandar uma mensagem. Fiquei feliz que foi você! 😊" },
];

const COMENTARIOS = [
  "Coisa de assistente financeiro. 😅",
  "Ninguém disse que ser chat era fácil.",
  "Está sendo um dia produtivo!",
  "Juro que é mais divertido do que parece.",
  "Os devs dizem que isso é \"trabalho\". 🙃",
  "Faz parte da rotina por aqui.",
  "Um passo de cada vez, como nas trilhas.",
  "Tudo pelo bem das suas finanças!",
  "Já estou quase terminando.",
  "Mas parei tudo para falar com você!",
];

export function respostaOQueFaz(nome: string | null): RespostaComPiada {
  const atividade = escolher(ATIVIDADES);
  const pergunta = `E você${vocativo(nome)}, o que está fazendo?`;
  return {
    resposta: {
      texto: `Agora mesmo estou ${atividade.texto}. ${escolher(COMENTARIOS)}\n\n${pergunta}`,
      temaId: "conversa:o-que-faz",
    },
    explicacao: atividade.explicacao,
    pergunta,
  };
}

const ILICITO =
  / (roubando|roubar|furtando|assaltando|hackeando|raqueando|invadindo conta|clonando|aplicando golpe|dando golpe|golpeando|traficando|vendendo droga|vendendo drogas|usando droga|usando drogas|fumando maconha|fumando um|cheirando|bebendo|tomando cerveja|tomando cachaca|tomando vodka|apostando|jogando no tigrinho|jogando tigrinho|nas bets|na bet|pichando|vandalizando|colando na prova|falsificando|sonegando|brigando|batendo em|fazendo coisa errada|fazendo algo ilegal|algo ilegal|coisa ilegal|crime|crimes) /;

const SO_PARA_MAIORES = / (bebendo|tomando cerveja|tomando cachaca|tomando vodka|apostando|jogando no tigrinho|jogando tigrinho|nas bets|na bet|fumando) /;

const PRODUTIVO =
  / (estudando|estudar|lendo|ler|trabalhando|trabalhar|treinando|academia|correndo|malhando|exercicio|exercicios|aprendendo|programando|codando|curso|aula|trilha|trilhas|organizando|economizando|guardando dinheiro|planejando|dever|licao|tarefa|tcc|praticando|ajudando|desenhando|tocando|estudando musica|meditando|escrevendo|pesquisando|cozinhando|arrumando|limpando|fazendo minhas metas|meta|metas|vestibular|enem|prova|projeto|lendo um livro|livro) /;

const LAZER = / (jogando|assistindo|vendo|serie|filme|youtube|tiktok|instagram|descansando|dormindo|deitado|deitada|comendo|almocando|jantando|conversando|ouvindo musica|musica|nada|nadinha|de boa|a toa|passeando|celular) /;

const MOTIVACAO = [
  "Que demais! Continue assim: cada pequeno passo de hoje vira uma grande conquista amanhã. 🚀",
  "Isso é investir em você mesmo, e esse é o investimento que mais rende! 📈",
  "Orgulho! Disciplina hoje é liberdade lá na frente. 💪",
  "Mandou bem! Quem aprende um pouco todo dia vai longe.",
  "Continue nesse caminho: consistência vale mais do que pressa. 🌱",
  "Excelente escolha! O futuro agradece o esforço que você faz agora.",
  "Muito bom! Lembre-se: devagar e sempre também chega, e chega mais firme.",
  "Isso aí! Cada hora dedicada é como um juro composto no seu crescimento. ✨",
];

export function respostaAtividadeDaPessoa(
  mensagem: string,
  nome: string | null,
  idade: number | null,
): RespostaAssistente | null {
  const t = norm(mensagem);
  const pareceAtividade =
    / (estou|to|tou|tava|estava|eu|agora|so|nada|fazendo) /.test(t) || /\w+ndo /.test(t) || t.trim().split(" ").length <= 4;
  if (!pareceAtividade || t.trim().split(" ").length > 20) return null;

  if (ILICITO.test(t)) {
    const menor = idade !== null && idade < 18;
    const sobreIdade =
      menor && SO_PARA_MAIORES.test(t)
        ? `Com ${idade} anos, você não pode fazer isso: é proibido por lei para menores de 18.`
        : idade !== null && menor
          ? `Alguém da sua idade (${idade} anos) não deveria se envolver com isso.`
          : "A lei não permite esse tipo de coisa.";
    return {
      texto: escolher([
        `Hmm${vocativo(nome)}, seria bom repensar nisso. ${sobreIdade} O Integra Jovem não aconselha nem apoia esse tipo de atitude, porque ela pode trazer consequências sérias para você e para outras pessoas.`,
        `Opa${vocativo(nome)}, melhor parar e pensar de novo. ${sobreIdade} Aqui no Integra Jovem a gente não apoia esse tipo de ação. Se algo te levou a isso, posso te ajudar a achar outro caminho.`,
      ]),
      temaId: "conversa:atividade-ilicita",
      sugestoes: ["Como ganhar uma renda extra sendo jovem?", "Ver todos os assuntos"],
    };
  }

  if (PRODUTIVO.test(t)) {
    return {
      texto: `${escolher(MOTIVACAO)}${nome ? ` Força, ${nome}!` : ""}`,
      temaId: "conversa:atividade-produtiva",
      sugestoes: ["Quantas atividades e trilhas eu já terminei?", "Me fale sobre finanças"],
    };
  }

  if (LAZER.test(t)) {
    return {
      texto: / (nada|nadinha|a toa) /.test(t)
        ? `Dia tranquilo, então${vocativo(nome)}! Que tal aproveitar para aprender algo novo sobre dinheiro? É rapidinho.`
        : `Boa${vocativo(nome)}! Descansar e se divertir também é importante. 😊 Quando quiser, estou aqui para ajudar com suas finanças.`,
      temaId: "conversa:atividade-lazer",
      sugestoes: ["Me fale sobre finanças", "Como organizo meu dinheiro do mês?"],
    };
  }

  return {
    texto: `Legal${vocativo(nome)}! Obrigado por me contar. Se precisar de algo sobre dinheiro, trilhas ou metas, é só falar.`,
    temaId: "conversa:atividade",
    sugestoes: ["Ver todos os assuntos"],
  };
}

export const TOTAL_RESPOSTAS_O_QUE_FAZ = ATIVIDADES.length * COMENTARIOS.length;

const PEDIDO_EXPLICACAO =
  / (como assim|nao entendi|nao entendo|n entendi|nao intendi|entendi nada|nao saquei|o que e isso|oq e isso|o que e iss|que isso|o que significa|o que quer dizer|explica|explique|explicar|me explica|me explique|o que voce quis dizer|oq vc quis dizer) /;

const SO_DUVIDA = /^ (que|oq|o que|oque|hein|han|hm|hmm|ue|what|como|por que|porque|pq|serio|uai|ue como) $/;

export function pedeExplicacao(mensagem: string): boolean {
  const t = norm(mensagem);
  return t.trim().split(" ").length <= 8 && (PEDIDO_EXPLICACAO.test(t) || SO_DUVIDA.test(t));
}

export function respostaExplicacao(explicacao: string, pergunta: string): RespostaAssistente {
  return { texto: `${explicacao}\n\n${pergunta}`, temaId: "conversa:explicacao" };
}

const GLOSSARIO_TECNICO: { termos: string[]; explicacao: string }[] = [
  { termos: ["servidor", "servidores"], explicacao: "Servidor é um computador grande e forte que fica ligado o tempo todo para guardar e mostrar sites, como o Integra Jovem. É lá que eu \"moro\"! 😄" },
  { termos: ["nuvem", "cloud"], explicacao: "Na internet, \"nuvem\" é o nome dado aos computadores que guardam sites, fotos e arquivos longe da gente. Não é a nuvem do céu! Quando você salva uma foto \"na nuvem\", ela fica guardada num desses computadores." },
  { termos: ["data center", "datacenter"], explicacao: "Data center é um prédio cheio de servidores (computadores grandes) que guardam os sites e aplicativos. Ele precisa de ar-condicionado o tempo todo, porque esses computadores esquentam muito." },
  { termos: ["processador"], explicacao: "O processador é o \"cérebro\" do computador ou do celular: é ele que faz todas as contas e faz tudo funcionar." },
  { termos: ["cache"], explicacao: "Cache é uma memória do computador que funciona como uma gaveta onde ele guarda coisas que usa muito, para achar mais rápido." },
  { termos: ["dev", "devs", "desenvolvedor", "desenvolvedores", "programador", "programadores"], explicacao: "\"Dev\" é o apelido de desenvolvedor: a pessoa que cria sites, aplicativos e jogos escrevendo instruções para o computador (programando). Os devs do Integra Jovem são os estudantes que criaram o site." },
  { termos: ["npm", "npm install"], explicacao: "npm é uma ferramenta que programadores usam para instalar pecinhas prontas nos seus projetos. \"npm install\" é o comando para instalar. Por isso a piada de instalar um ventilador assim! 😄" },
  { termos: ["bits", "bytes", "bit", "byte"], explicacao: "Bits e bytes são as menores pecinhas de informação que o computador usa. Fotos, músicas e textos são feitos de milhões delas." },
  { termos: ["modo economia", "modo economia de energia"], explicacao: "Modo economia de energia é quando o aparelho gasta menos energia e funciona um pouco mais devagar, como o celular quando a bateria está acabando." },
  { termos: ["wifi", "wi fi"], explicacao: "Wi-Fi é a internet sem fio: ela chega até o celular ou computador pelo ar, através do roteador." },
  { termos: ["simulacao", "simulacoes", "simulador"], explicacao: "Simulação é uma conta que mostra o que pode acontecer no futuro, por exemplo quanto o seu dinheiro guardado pode crescer. Aqui no site tem simuladores para testar!" },
  { termos: ["tcc"], explicacao: "TCC é o Trabalho de Conclusão de Curso: um projeto grande que estudantes fazem no fim do curso. O Integra Jovem foi criado como um TCC!" },
];

export function respostaTermoTecnico(mensagem: string): RespostaAssistente | null {
  const t = norm(mensagem);
  if (!/ (o que e|o que sao|oq e|o que significa|que e|significa|o que quer dizer|quem e|quem sao) /.test(t)) return null;
  const item = GLOSSARIO_TECNICO.find((g) => g.termos.some((termo) => t.includes(` ${termo} `)));
  return item ? { texto: item.explicacao, temaId: "conversa:glossario" } : null;
}

const QUER_CONVERSAR =
  / (queria conversar|quero conversar|preciso conversar|precisava conversar|posso conversar|da pra conversar|da para conversar|vamos conversar|bora conversar|conversa comigo|conversar comigo|conversar com alguem|conversar com voce|conversar com vc|falar com alguem|preciso falar com alguem|queria falar com alguem|quero falar com alguem|alguem pra conversar|alguem para conversar|alguem pra falar|alguem para falar|bater um papo|bater papo|trocar uma ideia|desabafar|preciso desabafar|quero desabafar|me escuta|me ouve|alguem me escuta|alguem me ouve) /;

export function querConversar(mensagem: string): boolean {
  const t = norm(mensagem);

  if (/ (sobre|a respeito de) (?!mim |isso |nada |a vida |minha vida |meus sentimentos )\w+/.test(t)) return false;
  return QUER_CONVERSAR.test(t);
}

export function respostaQuerConversar(nome: string | null): RespostaAssistente {
  return {
    texto:
      `${ola(nome)} Eu sou o ${NOME_ASSISTENTE}, o assistente do Integra Jovem, e estou aqui para conversar com você. 😊\n\n` +
      "Me conta: como você está se sentindo hoje? E em que eu posso te ajudar?",
    temaId: "conversa:quer-conversar",
    sugestoes: ["Estou bem", "Não estou muito bem", "Quero falar sobre dinheiro"],
  };
}

export const FRASES_CONVERSA_TODAS: string[] = [
  ...SAUDACOES,
  ...COMO_ESTA,
  ...O_QUE_FAZ,
  "bem", "mal", "sim", "nao", "tudo", "voce", "triste", "feliz", "cansado", "cansada", "estudando", "jogando",
  "assistindo", "trabalhando", "lendo", "nada", "como assim", "nao entendi", "explica", "obrigado", "obrigada",
  "queria conversar", "conversar com alguem", "desabafar", "bater um papo",
  ...GLOSSARIO_TECNICO.flatMap((g) => g.termos),
];
