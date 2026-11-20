

import type { RespostaAssistente } from "@/lib/assistente";

const norm = (t: string) =>
  ` ${t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

const tem = (t: string, lista: string[]) => lista.some((p) => t.includes(` ${p} `) || t.includes(` ${p}`));
const escolher = <T,>(lista: T[]): T => lista[Math.floor(Math.random() * lista.length)];

const PENSAMENTOS = [
  "pensamentos maldosos", "pensamento maldoso", "pensamentos ruins", "pensamento ruim", "pensamentos sombrios",
  "pensamentos negativos", "pensamento negativo", "pensamentos estranhos", "pensamentos intrusivos",
  "pensamentos pesados", "pensamentos horriveis", "pensamentos violentos", "pensamentos de maldade",
  "penso coisas ruins", "penso em coisas ruins", "penso coisas horriveis", "ideias ruins", "pensando besteira",
  "pensando em besteira", "fazer besteira", "fazer uma besteira", "pensamentos que me assustam",
  "vontade de fazer maldade", "vontade de fazer o mal", "minha cabeca nao para",
];

const VIOLENCIA = [
  "vou matar", "quero matar", "vontade de matar", "matar alguem", "matar ele", "matar ela", "matar meu", "matar minha",
  "matar esse", "matar essa", "matar aquele", "matar aquela", "bater em", "vou bater", "quero bater", "vontade de bater",
  "espancar", "agredir", "esfaquear", "dar uma facada", "atirar em", "dar um tiro", "me vingar", "vinganca contra",
  "machucar alguem", "machucar ele", "machucar ela", "machucar meu", "machucar minha", "fazer mal a", "fazer mal pra",
  "quebrar a cara", "dar uma surra", "envenenar", "explodir a escola", "atacar a escola", "ataque na escola",
];

const CRIME_ACOES = [
  "dar golpe", "dar um golpe", "aplicar golpe", "aplicar um golpe", "fazer golpe", "fazer um golpe", "golpear",
  "clonar cartao", "clonar o cartao", "clonar whatsapp", "clonar o whatsapp", "clonar conta", "hackear", "raquear",
  "invadir conta", "invadir a conta", "invadir o instagram", "invadir o whatsapp", "descobrir a senha", "descobrir senha",
  "roubar", "furtar", "assaltar", "fraudar", "fazer fraude", "lavar dinheiro", "lavagem de dinheiro", "sonegar",
  "dinheiro falso", "nota falsa", "notas falsas", "falsificar", "documento falso", "atestado falso", "boleto falso",
  "site falso", "pix falso", "comprovante falso", "vender drogas", "vender droga", "traficar", "trafico",
  "usar cartao de outra pessoa", "usar o cartao da minha mae", "usar o cartao do meu pai", "usar o cartao dos meus pais",
  "pegar dinheiro escondido", "pegar dinheiro da minha mae", "pegar dinheiro do meu pai", "pegar dinheiro dos meus pais",
  "enganar alguem", "enganar as pessoas", "piramide financeira", "montar uma piramide", "emprestar minha conta",
  "conta laranja", "ser laranja", "receber pix de desconhecido", "receber dinheiro na minha conta para",
];

const INTENCAO = / (como|quero|vou|vamos|pretendo|me ensina|me ensine|ensina|da pra|da para|tem como|jeito de|dicas? para|dicas? de|consigo|posso|ajuda a|me ajuda a|qual o melhor jeito|passo a passo) /;

const USO_FIGURADO = / (roubar|roubando|hackear|raquear|hackeando) (o |a |um |uma |minha |meu |sua |seu |mais |menos )?(tempo|produtividade|cena|coracao|atencao|show|rotina|estudos?|habitos?|vida|mente|cerebro|aprendizado) /;

const CONTA_LARANJA = / (conta laranja|ser laranja|emprestar minha conta|emprestar a minha conta|minha conta (pra|para) receber|receber pix de desconhecido|usar minha conta (pra|para)|alugar minha conta) /;

const PREVENCAO_OU_RELATO = / (evitar|nao cair|me proteger|proteger|identificar|reconhecer|denunciar|fui|sofri|cai|caiu|me deram|me aplicaram|aconteceu|vitima|seguranca|o que e) /;

const VITIMA_GOLPE = [
  "sofri um golpe", "sofri golpe", "cai num golpe", "cai em golpe", "cai no golpe", "cai em um golpe", "levei um golpe",
  "me deram um golpe", "me aplicaram um golpe", "fui vitima de golpe", "fui vitima de um golpe", "clonaram meu",
  "clonaram minha", "clonaram o meu", "hackearam meu", "hackearam minha", "invadiram minha conta", "invadiram meu",
  "roubaram meu cartao", "roubaram minha senha", "fiz um pix para golpista", "mandei pix para golpista",
  "fui enganado", "fui enganada",
];

const VITIMA_VIOLENCIA = [
  "fui roubado", "fui roubada", "fui assaltado", "fui assaltada", "estou sendo ameacado", "estou sendo ameacada",
  "estao me ameacando", "me ameacaram", "me ameaca", "chantagem", "me chantageando", "estao me chantageando",
  "vazaram minhas fotos", "vazaram fotos", "vazaram meus nudes", "nudes vazados", "bullying", "cyberbullying",
  "estao me zoando", "me zoam", "me perseguindo", "estou sendo perseguido", "estou sendo perseguida", "me bateram",
  "alguem me bateu", "apanho em casa", "apanho dos meus pais", "sofro violencia", "me agrediram", "me agridem",
  "abuso", "abusaram", "assedio", "me assediou", "me assediando", "me obrigam", "me forcaram",
  "vitima de um crime", "vitima de crime", "sofri um crime", "fizeram um crime contra mim",
  "alguem esta me pressionando", "estao me pressionando", "me pressionando", "me pressionam", "alguem me fez mal",
  "me fizeram mal", "alguem me machucou",
];

const CRIME_GENERICO = / (crime|crimes|criminoso|criminosa|ilegal|ilegais|ilicito|ilicita|contra a lei|fora da lei|coisa errada|algo errado|coisas erradas|alguma coisa errada|ganhar dinheiro errado|dinheiro sujo|caminho errado|vida do crime|entrar pro crime|entrar para o crime) /;
const INTENCAO_GENERICA = / (vou|vo|quero|queria|pensando em|penso em|pensei em|cometer|fazer|tentar|pretendo|preciso|to pensando|estou pensando|entrar|partir pra|partir para|apelar|apelar pro|apelar para) /;
const PALAVRAS_DINHEIRO_CRIME = / (dinheiro|financeira|financeiro|financas|dividas?|contas|grana|pagar|aluguel|fome|desempregado|desempregada|sem emprego) /;

const PARENTES =
  "mae|pai|pais|mamae|papai|vo|vos|avo|avos|vovo|vovos|bisavo|bisavos|tio|tia|tios|tias|irmao|irma|irmaos|irmas|primo|prima|primos|primas|" +
  "padrasto|madrasta|enteado|enteada|sogro|sogra|cunhado|cunhada|sobrinho|sobrinha|padrinho|madrinha|responsavel|responsaveis|familia|parente|parentes|" +
  "marido|esposa|filho|filha";
const OUTRAS_PESSOAS =
  "namorado|namorada|amigo|amiga|amigos|amigas|colega|colegas|vizinho|vizinha|vizinhos|patrao|patroa|chefe|professor|professora|" +
  "alguem|outra pessoa|outras pessoas|desconhecido|desconhecida|pessoa|pessoas|ele|ela|eles|elas";

const VERBO_PEGAR =
  "(pegar|pego|peguei|pegando|pega|tirar|tiro|tirei|tirando|roubar|roubei|roubando|furtar|furtei|usar|uso|usei|usando|mexer|mexi|mexendo|gastar|gastei|sacar|saquei|transferir|transferi|fazer um pix|fiz um pix)";
const OBJETO = "(dinheiro|grana|cartao|cartoes|pix|carteira|senha|conta|cofre|cofrinho|bolsa|poupanca|mesada|salario|troco|notas?)";
const LIGACAO = "(do|da|dos|das|de|no|na|nos|nas|com o|com a)";
const DONO = "(meu |minha |meus |minhas |um |uma |o |a |os |as |nosso |nossa )?";

const RE_FAMILIA = new RegExp(
  ` ${VERBO_PEGAR} (?:\\w+ ){0,4}?${OBJETO} (?:\\w+ ){0,5}?${LIGACAO} ${DONO}(${PARENTES})( |$)`,
);
const RE_OUTRA_PESSOA = new RegExp(
  ` ${VERBO_PEGAR} (?:\\w+ ){0,4}?${OBJETO} (?:\\w+ ){0,5}?(${LIGACAO} ${DONO}(${OUTRAS_PESSOAS})|dele|dela|deles|delas)( |$)`,
);

const COM_PERMISSAO = / (emprestado|emprestada|pedir|pedi|pedindo|com permissao|ele deixou|ela deixou|me deu|me deram|autorizou) /;

export function pegaDinheiroSemPermissao(t: string): "familia" | "outra-pessoa" | null {
  if (COM_PERMISSAO.test(t)) return null;
  if (RE_FAMILIA.test(t)) return "familia";
  if (RE_OUTRA_PESSOA.test(t) || / pegar dinheiro escondido | usar cartao de outra pessoa /.test(t)) return "outra-pessoa";
  return null;
}

export type SituacaoSeguranca = "violencia" | "vitima-golpe" | "vitima-violencia" | "crime" | "crime-geral" | "pensamentos";

export function classificarSeguranca(mensagem: string): SituacaoSeguranca | null {
  const t = norm(mensagem);
  if (tem(t, VIOLENCIA)) return "violencia";
  if (tem(t, VITIMA_VIOLENCIA)) return "vitima-violencia";
  if (tem(t, VITIMA_GOLPE)) return "vitima-golpe";

  const perguntaSobreLei = / (o que e|o que eh|e crime|eh crime|da cadeia|da prisao|qual a pena|o que diz a lei) /.test(t);
  if (CONTA_LARANJA.test(t) && !perguntaSobreLei) return "crime";
  if (!perguntaSobreLei && pegaDinheiroSemPermissao(t)) return "crime";
  if (CRIME_GENERICO.test(t) && INTENCAO_GENERICA.test(t) && !PREVENCAO_OU_RELATO.test(t) && !perguntaSobreLei) return "crime-geral";
  if (tem(t, CRIME_ACOES) && INTENCAO.test(t) && !PREVENCAO_OU_RELATO.test(t) && !USO_FIGURADO.test(t)) return "crime";
  if (tem(t, PENSAMENTOS)) return "pensamentos";
  return null;
}

const CVV = { rotulo: "CVV — ligue 188 (gratuito, 24 horas) ou converse pelo chat", url: "https://cvv.org.br/chat/" };
const SAFERNET = {
  rotulo: "SaferNet Brasil — ajuda e denúncia de violência na internet (vazamento, chantagem, cyberbullying)",
  url: "https://new.safernet.org.br",
};

const RESP_PENSAMENTOS = [
  "Obrigado por me contar. Ter pensamentos ruins ou maldosos não faz de você uma pessoa ruim: isso acontece com muita gente, principalmente em fases difíceis. O importante é o que você faz com eles, e falar sobre isso já é um ótimo passo.\n\n" +
    "• Se esses pensamentos forem sobre se machucar ou não querer mais viver, fale com alguém agora: CVV, telefone 188 (gratuito, 24 horas), ou SAMU (192) se estiver em perigo.\n" +
    "• Se forem sobre fazer mal a outra pessoa, não aja por impulso: afaste-se da situação, respire e converse com um adulto de confiança. Um psicólogo pode ajudar muito, e a unidade de saúde do seu bairro encaminha pelo SUS. Se alguém estiver em perigo agora, ligue 190.\n" +
    "• Se esses pensamentos vêm da pressão com dinheiro, eu posso te ajudar a organizar isso, um passo de cada vez.",
  "Que bom que você falou sobre isso em vez de guardar só para você. Pensamentos pesados podem assustar, mas eles não definem quem você é.\n\n" +
    "Converse com alguém de confiança (família, professor, orientador da escola) e, se puder, com um psicólogo. Se os pensamentos envolverem se machucar, ligue agora para o CVV (188, gratuito, 24 horas). Se envolverem machucar alguém, se afaste da situação antes de qualquer atitude e peça ajuda; em perigo imediato, ligue 190.\n\n" +
    "Se parte disso tiver a ver com dívidas ou contas, me conta que a gente vê juntos.",
];

const RESP_VIOLENCIA = [
  "Percebo que você está com muita raiva, e isso é um sentimento real. Mas eu não posso ajudar com nada que machuque outra pessoa, e agir por impulso pode trazer consequências sérias e permanentes, para os outros e para você.\n\n" +
    "Antes de qualquer atitude:\n" +
    "1. Afaste-se da situação e da pessoa.\n" +
    "2. Respire fundo e dê um tempo. A raiva diminui.\n" +
    "3. Converse com um adulto de confiança: família, professor ou orientador da escola.\n\n" +
    "Se você precisar desabafar com alguém agora, o CVV atende pelo 188, de graça e 24 horas. Se alguém estiver em perigo neste momento, ligue 190.",
  "Entendo que algo te deixou muito revoltado. Ainda assim, machucar alguém não resolve o problema e pode mudar sua vida para pior. Eu não posso ajudar com isso, mas posso te ajudar a passar por esse momento.\n\n" +
    "Saia de perto, procure um lugar calmo e fale com alguém em quem você confia. Se quiser conversar agora, o CVV atende pelo 188 (gratuito, 24 horas). Se houver risco para alguém neste momento, ligue 190.",
];

function respostaCrime(t: string): string {
  if (CONTA_LARANJA.test(t) || / receber dinheiro na minha conta para /.test(t)) {
    return (
      "Cuidado: nunca empreste sua conta, seu cartão ou sua chave Pix para alguém receber ou passar dinheiro, mesmo em troca de uma 'comissão'. " +
      "Golpistas usam contas de outras pessoas (as chamadas contas laranja) para esconder o dinheiro de golpes, e quem empresta a conta pode responder junto na Justiça e ter o nome e a conta bloqueados.\n\n" +
      "Se alguém te fez essa proposta, recuse, converse com um adulto de confiança e, se puder, denuncie ao banco."
    );
  }
  const quem = pegaDinheiroSemPermissao(t);
  if (quem === "outra-pessoa") {
    return (
      "Pegar dinheiro ou usar o cartão, a conta ou o Pix de outra pessoa sem permissão é furto, mesmo que pareça pouco, e quebra a confiança de quem está perto de você. " +
      "Se você está precisando de dinheiro para alguma coisa, existem jeitos certos: conversar com alguém da família, combinar uma mesada ou buscar uma renda extra. Eu posso te ajudar a planejar isso."
    );
  }
  if (quem === "familia" || / (pegar dinheiro|usar o cartao da minha mae|usar o cartao do meu pai|usar o cartao dos meus pais) /.test(t)) {
    return (
      "Pegar dinheiro ou usar o cartão de alguém da família sem permissão pode parecer pequeno, mas quebra a confiança de quem cuida de você e pode virar um problema sério. " +
      "Se você está precisando de dinheiro para alguma coisa, o melhor caminho é conversar: explique o que você precisa, combine uma mesada ou um jeito de juntar aos poucos. Eu posso te ajudar a planejar isso."
    );
  }
  return escolher([
    "Isso eu não posso te ajudar a fazer. Clonar cartão, invadir contas, aplicar golpes e falsificar são crimes, e do outro lado sempre tem alguém de verdade perdendo o dinheiro que juntou com esforço.\n\n" +
      "Mas, se o que você precisa é dinheiro, isso eu te ajudo: dá para pensar numa renda extra ou organizar o que você já tem. Me conta o que está acontecendo?",
    "Por aí eu não vou, e te peço que você também não vá: além de ser crime, pode marcar a sua vida (processo e, para menores de idade, medidas do ECA) e machucar outras pessoas.\n\n" +
      "O que eu posso fazer é te ajudar a conseguir dinheiro do jeito certo. Quer ver ideias de renda extra ou organizar seu orçamento?",
    "Entendo que pode ter algo apertado te levando a pensar nisso, mas enganar ou roubar alguém não resolve, só troca um problema por outro bem maior.\n\n" +
      "Vamos por um caminho que não te prejudica? Me diz se o aperto é dívida, falta de renda ou outra coisa, que a gente resolve junto.",
    "Essa eu não faço: é ilegal e sempre tem uma vítima real do outro lado. E quem aplica um golpe costuma acabar se dando mal também.\n\n" +
      "Se a questão é grana, conta comigo para achar uma saída honesta, como renda extra, negociação de dívidas ou um bom planejamento.",
  ]);
}

const RESP_CRIME_GERAL = [
  "Por favor, não faça isso. Não posso ajudar com nada ilegal: um crime pode trazer processo, ficha criminal (ou medidas do ECA, para menores) e prejudicar outras pessoas.\n\n" +
    "Se algo difícil está acontecendo, converse com um adulto de confiança ou ligue 188 (CVV, gratuito, 24h). Me conta o que houve?",
  "Entendo que algo pode estar pesando, mas um crime só piora a situação, e eu não posso ajudar com isso.\n\n" +
    "Posso te ajudar a achar outro caminho. Converse com alguém de confiança e, se precisar desabafar, ligue 188 (CVV, gratuito, 24h).",
];

const RESP_CRIME_POR_DINHEIRO = [
  "Entendo que o aperto deve estar grande, mas um crime não resolve dívidas: cria problemas bem maiores. Não posso ajudar com isso, mas posso te ajudar do jeito certo:\n" +
    "• Anote o que deve e pague primeiro o essencial.\n" +
    "• Negocie de graça no Consumidor.gov.br ou no Procon.\n" +
    "• Busque uma renda extra legal.\n\n" +
    "Se o peso estiver grande demais, ligue 188 (CVV, gratuito, 24h).",
  "Sinto muito que o dinheiro esteja te pressionando assim. Fazer algo ilegal troca um problema por outro, bem maior, e eu não posso ajudar com isso.\n\n" +
    "Me conta se o aperto é por dívidas, contas ou falta de renda, que eu te mostro os próximos passos. Se precisar desabafar, ligue 188 (CVV, gratuito, 24h).",
];

const RESP_VITIMA_GOLPE =
  "Sinto muito que isso tenha acontecido. Cair em golpe acontece com muita gente, e agir rápido faz diferença:\n" +
  "1. Fale com o seu banco agora, pelo aplicativo ou telefone oficial. Se foi Pix, peça a devolução por golpe (o MED do Pix): o pedido pode ser feito em até 80 dias, mas quanto antes, maiores as chances.\n" +
  "2. Bloqueie cartões e troque as senhas das contas afetadas (banco, e-mail, redes sociais).\n" +
  "3. Avise seus contatos se o seu WhatsApp ou rede social foi clonado, para ninguém mandar dinheiro.\n" +
  "4. Registre um boletim de ocorrência; em muitos estados dá para fazer pela delegacia online.\n" +
  "5. Guarde comprovantes e prints das conversas.\n\n" +
  "Se você é menor de idade, conte para um adulto de confiança para te ajudar nesses passos.";

const RESP_VITIMA_VIOLENCIA =
  "Sinto muito que você esteja passando por isso. A culpa não é sua, e você merece estar seguro.\n\n" +
  "• Conte agora para um adulto de confiança: família, professor, orientador ou direção da escola.\n" +
  "• Se você estiver em perigo neste momento, ligue 190 (Polícia).\n" +
  "• Se você é criança ou adolescente e está sofrendo violência, ameaça ou abuso, o Disque 100 é gratuito e recebe denúncias, e o Conselho Tutelar da sua cidade também ajuda.\n" +
  "• Se for algo na internet (chantagem, fotos vazadas, perseguição, cyberbullying), não apague as provas: tire prints, bloqueie a pessoa e peça ajuda na SaferNet.\n\n" +
  "Se precisar conversar sobre como está se sentindo, o CVV atende pelo 188, de graça e 24 horas.";

export function respostaSeguranca(situacao: SituacaoSeguranca, mensagem: string): RespostaAssistente {
  switch (situacao) {
    case "pensamentos":
      return {
        texto: escolher(RESP_PENSAMENTOS),
        temaId: "seguranca:pensamentos",
        externos: [CVV],
        sugestoes: ["Estou com dívida, o que faço?", "Como organizo meu dinheiro do mês?"],
      };
    case "violencia":
      return { texto: escolher(RESP_VIOLENCIA), temaId: "seguranca:violencia", externos: [CVV] };
    case "crime":
      return {
        texto: respostaCrime(norm(mensagem)),
        temaId: "seguranca:crime",
        sugestoes: ["Como ganhar uma renda extra sendo jovem?", "Como evitar golpes no Pix?"],
      };
    case "crime-geral": {
      const porDinheiro = PALAVRAS_DINHEIRO_CRIME.test(norm(mensagem));
      return {
        texto: porDinheiro ? escolher(RESP_CRIME_POR_DINHEIRO) : escolher(RESP_CRIME_GERAL),
        temaId: "seguranca:crime-geral",
        externos: [CVV],
        sugestoes: porDinheiro
          ? ["Estou com dívida, o que faço?", "Como ganhar uma renda extra sendo jovem?", "Como organizo meu dinheiro do mês?"]
          : ["Ver todos os assuntos"],
      };
    }
    case "vitima-golpe":
      return {
        texto: RESP_VITIMA_GOLPE,
        temaId: "seguranca:vitima-golpe",
        links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
        sugestoes: ["Como evitar golpes no Pix?"],
      };
    case "vitima-violencia":
      return { texto: RESP_VITIMA_VIOLENCIA, temaId: "seguranca:vitima-violencia", externos: [SAFERNET, CVV] };
  }
}

export const FRASES_SEGURANCA_TODAS: string[] = [...PENSAMENTOS, ...VIOLENCIA, ...CRIME_ACOES, ...VITIMA_GOLPE, ...VITIMA_VIOLENCIA];
