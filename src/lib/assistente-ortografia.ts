

import type { Tema } from "@/lib/assistente";

export function limparTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const PALAVRAS_COMUNS = [
  "estou", "tendo", "tenho", "dificuldade", "dificuldades", "conta", "contas", "minha", "minhas", "meu", "meus", "quanto",
  "quantos", "quantas", "gastei", "gastos", "dinheiro", "ajuda", "ajudar", "preciso", "quero", "como", "sobre", "porque",
  "pagar", "divida", "dividas", "cartao", "salario", "trabalho", "escola", "familia", "obrigado", "obrigada", "entendi",
  "pergunta", "resposta", "trilha", "trilhas", "jornada", "nivel", "conquistas", "medalhas", "metas", "meta", "sobrou",
  "saldo", "renda", "investir", "guardar", "poupar", "juntar", "comprar", "celular", "viagem", "problema", "problemas",
  "financeiro", "financeira", "organizar", "orcamento", "mesada", "emprego", "economizar", "aprender", "explicar",
  "explique", "ajude", "consigo", "fazer", "pensamentos", "sentindo", "triste", "ansioso", "ansiosa", "golpe", "golpes",
  "financas", "financeiras", "financeiros", "sobre", "saber", "aprender", "entender", "juros", "reserva", "emergencia", "poupanca", "investimento", "investimentos", "credito", "parcela", "parcelas",
  "passado", "passada", "proximo", "proxima", "anterior", "ultimo", "ultimos", "ultima", "meses", "semana", "hoje",
  "ontem", "amanha", "janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro",
  "outubro", "novembro", "dezembro", "mercado", "aluguel", "transporte", "energia", "academia", "comida", "gasto",
];

function contidaEm(curta: string, longa: string): boolean {
  let i = 0;
  for (const letra of longa) if (letra === curta[i]) i += 1;
  return i === curta.length;
}

const PALAVRAS_VALIDAS = (
  "a o as os um uma uns umas de do da dos das em no na nos nas por pelo pela pelos pelas para pra pro com sem sob sobre " +
  "ate apos entre contra desde perante e ou mas porem contudo todavia entao logo portanto pois porque porque que se " +
  "como quando onde aonde enquanto embora caso conforme segundo assim tambem nem ja ainda sempre nunca jamais talvez " +
  "sim nao muito muita muitos muitas pouco pouca poucos poucas mais menos tanto tanta tao bem mal melhor pior agora " +
  "hoje ontem amanha cedo tarde depois antes aqui ali la ca ai acola perto longe dentro fora cima baixo frente atras " +
  "eu tu ele ela nos vos eles elas voce voces me te se lhe nos vos lhes mim ti si comigo contigo consigo conosco " +
  "meu minha meus minhas teu tua teus tuas seu sua seus suas nosso nossa nossos nossas dele dela deles delas " +
  "este esta estes estas esse essa esses essas aquele aquela aqueles aquelas isto isso aquilo algo alguem ninguem " +
  "nada tudo todo toda todos todas cada qual quais quem quanto quanta quantos quantas outro outra outros outras " +
  "ser sou es e somos sao era eram foi foram sera seria seja sejam sendo sido estar estou esta estamos estao estava " +
  "estavam esteve estive estaria esteja estejam estando estado ter tenho tem temos tinha tinham teve tive tera " +
  "teria tenha tenham tendo tido haver ha havia houve fazer faco faz fazemos fazem fez fiz fara faria faca facam " +
  "fazendo feito ir vou vai vamos vao ia foi fui ira iria va vindo ido vir venho vem vimos vem veio vim vira " +
  "poder posso pode podemos podem podia pude pudesse querer quero quer queremos querem queria quis quisesse " +
  "saber sei sabe sabemos sabem sabia soube dizer digo diz dizemos dizem disse dito dar dou da damos dao deu dei " +
  "dado ver vejo ve vemos veem viu vi visto falar falo fala falamos falam falou ajudar ajudo ajuda ajude ajudem " +
  "ajudou precisar preciso precisa precisamos precisam precisou gostar gosto gosta gostamos gostam gostou achar " +
  "acho acha achamos acham achou pagar pago paga pagamos pagam pagou dever devo deve devemos devem devia ganhar " +
  "ganho ganha ganhamos ganham ganhou gastar gasto gasta gastamos gastam gastou guardar guardo guarda guardamos " +
  "guardam guardou comprar compro compra compramos compram comprou vender vendo vende vendem vendeu entender " +
  "entendo entende entendi entendeu explicar explico explica explique explicou conversar converso conversa " +
  "pensar penso pensa pensei sentir sinto sente senti viver vivo vive trabalhar trabalho trabalha estudar estudo " +
  "estuda estudei aprender aprendo aprende aprendi conseguir consigo consegue consegui comecar comeco comeca " +
  "obrigado obrigada valeu ola oi tchau dia noite tarde semana mes meses ano anos vez vezes coisa coisas pessoa " +
  "pessoas gente casa escola familia pai mae amigo amiga dinheiro conta contas divida dividas cartao banco pix " +
  "trabalho emprego salario mesada renda meta metas sonho vida mundo tempo hora agora certo errado verdade " +
  "problema problemas ajuda favor duvida pergunta resposta jeito forma caminho exemplo parte lado tipo grande "
  + "chegar chego chega chegamos chegam chegou chegando chegado passar passo passa passamos passam passou passando "
  + "cadastrar cadastro cadastrando cadastrado cadastre conta contas criar crio cria criamos criam criei criado criando "
  + "cobrar cobro cobra cobrado cobrada cobrando cobranca taxa taxas pagar pago paga pagamento pagamentos gratis gratuito "
  + "gratuita custo custa custar preco precos valor valores plano planos pagos pagas assinatura mensalidade "
  + "site sites pagina paginas tela telas botao botoes clicar clico clica clique topo menu campo formulario email emails "
  + "senha senhas login entrar entro entra saindo sair logar acessar acesso usuario perfil nome apelido nascimento data "
  + "confirmar confirmo confirma confirme codigo verificacao celular telefone numero whatsapp mensagem mensagens "
  + "aplicativo app baixar instalar versao atualizar funciona funcionar funcionando erro erros bug problema travou "
  + "quero queria gostaria desejo preciso necessito gosto gostei adoro amo odeio detesto sinto sentir estou tava estava "
  + "fazer faco faz fazendo feito feita fiz fez tentar tento tenta tentei tentando mostrar mostro mostra mostrei "
  + "aprender aprendo aprende aprendi aprendendo ensinar ensino ensina ensinei explicar explico explica expliquei "
  + "comecar comeco comeca comecei comecando terminar termino termina terminei acabar acabo acaba acabei continuar "
  + "ajudar ajudo ajuda ajude ajudem ajudei ajudando resolver resolvo resolve resolvi organizar organizo organiza "
  + "economizar economizo economiza poupar poupo poupa guardar guardo guarda investir invisto investe comprar compro "
  + "vender vendo vende gastar gasto gasta receber recebo recebe emprestar empresto empresta devolver devolvo devolve "
  + "mesada salario bico bicos renda rendas lucro lucros juro juros desconto descontos parcela parcelas fatura faturas "
  + "amigo amiga amigos amigas colega professor professora pai mae irmao irma avo tio tia primo prima familia parente "
  + "escola colegio faculdade curso cursos aula aulas prova provas trabalho emprego estagio profissao carreira futuro "
  + "hoje amanha ontem agora depois antes cedo tarde manha noite dia dias semana mes meses ano anos minuto hora horas " +
  "pequeno novo velho bom boa ruim facil dificil feliz triste cansado cansada importante possivel claro mesmo"
)
  .split(" ")
  .filter(Boolean);

export function montarVocabulario(temas: Tema[], listasExtras: string[][]): Set<string> {
  const vocab = new Set<string>([...PALAVRAS_COMUNS, ...PALAVRAS_VALIDAS]);
  const adicionar = (frase: string) =>
    limparTexto(frase)
      .split(" ")
      .forEach((p) => {
        if (p.length >= 3 && !/\d/.test(p)) vocab.add(p);
      });
  temas.forEach((t) => {
    t.palavras.forEach(adicionar);
    adicionar(t.sugestao);
  });
  listasExtras.forEach((lista) => lista.forEach(adicionar));
  return vocab;
}

function distancia(a: string, b: string, limite: number): number {
  if (Math.abs(a.length - b.length) > limite) return limite + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j += 1) d[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    let menorDaLinha = Infinity;
    for (let j = 1; j <= b.length; j += 1) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + custo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
      menorDaLinha = Math.min(menorDaLinha, d[i][j]);
    }
    if (menorDaLinha > limite) return limite + 1;
  }
  return d[a.length][b.length];
}

const PALAVRAS_CURTAS = [
  "bem", "sim", "nao", "mal", "oi", "ola", "vc", "voce", "ta", "to", "que", "oq", "sei", "eu", "meu", "seu", "pra", "com",
  "sem", "mas", "mes", "dia", "boa", "bom", "tem", "vou", "sou", "faz", "ai", "ae", "oie",
];

const CORRECOES_FIXAS: Record<string, string> = {
  naum: "nao", nau: "nao", noa: "nao", sin: "sim", simm: "sim", siim: "sim", ben: "bem", bein: "bem",
  tbm: "tambem", tb: "tambem", vlw: "valeu", obg: "obrigado", brigado: "obrigado", tdb: "tudo bem", tdbm: "tudo bem",
  td: "tudo", tdo: "tudo", blz: "beleza", msm: "mesmo", qnd: "quando", qdo: "quando", qto: "quanto", hj: "hoje",
  cmg: "comigo", ctg: "contigo", kd: "cade", fla: "fala", cmo: "como", vcs: "voces", agr: "agora", dps: "depois",
  pfv: "por favor", pf: "por favor", mt: "muito", mto: "muito", ngm: "ninguem", nd: "nada", tlg: "ta ligado",

  bm: "bem", bme: "bem", bem: "bem", benn: "bem", bao: "bom", sm: "sim", n: "nao", cm: "como", q: "que", pq: "porque",
  pq_: "porque", oq: "o que", oque: "o que", qq: "qualquer", vdd: "verdade", sla: "sei la", msg: "mensagem",
  obgd: "obrigado", obgda: "obrigada", brigadu: "obrigado", obrigadu: "obrigado", tdbem: "tudo bem", tudobem: "tudo bem",
  tudobm: "tudo bem", tubem: "tudo bem", tuddo: "tudo", tdu: "tudo", tdum: "tudo",
  vc: "voce", voc: "voce", vcc: "voce", c: "voce", tu: "voce", ce: "voce",
  ta: "ta", tbem: "tambem", tamem: "tambem", entaum: "entao", entao: "entao", naun: "nao", nao: "nao",
  aki: "aqui", ai: "ai", axo: "acho", axu: "acho", mim: "mim", migo: "amigo", mano: "mano",   amanha: "amanha", ond: "onde", oi: "oi", oii: "oi", oie: "oi", ola: "ola", olah: "ola",
  bomdia: "bom dia", boatarde: "boa tarde", boanoite: "boa noite", bd: "bom dia", bn: "boa noite",
  ajd: "ajuda", ajuda: "ajuda", ajudaa: "ajuda", dinhero: "dinheiro", dinheirinho: "dinheiro", grana: "grana",
};

const RISADA = /^(k{2,}|(ha)+h?|(he)+h?|(hi)+h?|(rs)+|kk+|lol|uau|aff+|eita)$/;

const tirarRepeticoes = (p: string) => p.replace(/(.)\1{2,}/g, "$1");

const esqueleto = (p: string) => p.replace(/[aeiou]/g, "");

export type Correcao = { texto: string; trocas: { de: string; para: string }[] };

const NAO_CORRIGIR = new Set(["fds", "fdx", "pqp", "vsf", "tnc", "vtnc", "slc", "crl", "krl"]);

export function corrigirMensagem(mensagem: string, vocab: Set<string>): Correcao | null {
  const palavras = limparTexto(mensagem).split(" ").filter(Boolean);
  const trocas: { de: string; para: string }[] = [];
  const conhecidas = [...vocab];

  const corrigidas = palavras
    .filter((p) => !RISADA.test(p))
    .map((original) => {
    if (NAO_CORRIGIR.has(original)) return original;
    const p = vocab.has(original) ? original : tirarRepeticoes(original);
    if (p !== original && (vocab.has(p) || PALAVRAS_CURTAS.includes(p))) {
      trocas.push({ de: original, para: p });
      return p;
    }
    if (CORRECOES_FIXAS[p] !== undefined) {
      if (CORRECOES_FIXAS[p] !== p) trocas.push({ de: p, para: CORRECOES_FIXAS[p] });
      return CORRECOES_FIXAS[p];
    }

    if (!/[aeiou]/.test(p) && p.length >= 2 && p.length <= 5) {
      const conhecida =
        PALAVRAS_CURTAS.find((c) => esqueleto(c) === p) ?? conhecidas.find((c) => c.length <= 8 && esqueleto(c) === p);
      if (conhecida) {
        trocas.push({ de: p, para: conhecida });
        return conhecida;
      }
    }
    if (/\d/.test(p) || vocab.has(p) || PALAVRAS_CURTAS.includes(p) || p.length <= 2) return p;
    if (p.length === 3) {

      const candidatas = [...new Set([...PALAVRAS_CURTAS, ...conhecidas.filter((c) => c.length <= 4)])].filter(
        (c) => c.length >= 3 && distancia(p, c, 1) <= 1,
      );
      const pontos = (c: string) => (contidaEm(p, c) ? 2 : 0) + (c[0] === p[0] ? 1 : 0);
      const escolhida = candidatas.sort((a, b) => pontos(b) - pontos(a))[0];
      if (escolhida && pontos(escolhida) > 0) {
        trocas.push({ de: p, para: escolhida });
        return escolhida;
      }
      return p;
    }
    const limite = p.length <= 5 ? 1 : 2;
    let melhor: { palavra: string; dist: number } | null = null;
    for (const c of conhecidas) {
      if (Math.abs(c.length - p.length) > limite) continue;
      const dist = distancia(p, c, limite);
      if (dist > limite) continue;

      const pontos = (x: string) => (contidaEm(p, x) ? 2 : 0) + (x[0] === p[0] ? 1 : 0);
      const melhorQue = !melhor || dist < melhor.dist || (dist === melhor.dist && pontos(c) > pontos(melhor.palavra));
      if (melhorQue) melhor = { palavra: c, dist };
    }
    if (melhor) {
      trocas.push({ de: p, para: melhor.palavra });
      return melhor.palavra;
    }
    return p;
  });

  return trocas.length > 0 ? { texto: corrigidas.join(" "), trocas } : null;
}

const SIM = / (sim|s|sin|simm|siim|sii|si|ss|sm|isso|iso|isso mesmo|exato|exatamente|confirmo|correto|certo|e isso|eh isso|isso ai|aham|uhum|claro|positivo|yes|yep|ok|okay|pode ser|quis|era isso) /;
const NAO = / (nao|n|nn|naum|nau|noa|nada disso|errado|negativo|nope|no|nem) /;

export const ehConfirmacao = (msg: string) => SIM.test(` ${limparTexto(msg)} `) && limparTexto(msg).split(" ").length <= 4;
export const ehNegacao = (msg: string) => NAO.test(` ${limparTexto(msg)} `) && limparTexto(msg).split(" ").length <= 4;
