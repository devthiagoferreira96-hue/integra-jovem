

import type { RespostaAssistente } from "@/lib/assistente";
import { NOME_ASSISTENTE } from "@/lib/assistente-nome";
import { TOPICOS } from "@/lib/assistente-topicos";

function compactar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/(.)\1+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

const SAUDACOES = [

  "oi", "oie", "oiee", "ola", "alo", "e ai", "eai", "eae", "ea", "salve", "opa", "fala", "fala ai", "falae", "bom dia",
  "boa tarde", "boa noite", "tudo bem", "tudo bom", "tudo certo", "como vai", "como voce esta", "como vc esta",
  "beleza", "blz", "suave", "me diga", "me diz", "diga", "diz ai", "oi tudo bem", "ola tudo bem", "hey", "ei",
  "iae", "coe", "qual e", "bao", "bom", "saudacoes",

  "hi", "helo", "hey there", "hiya", "yo", "sup", "whats up", "what s up", "good morning", "good afternoon",
  "good evening", "how are you", "howdy", "greetings",

  "hola", "buenos dias", "buenas tardes", "buenas noches", "que tal", "como estas", "buenas",

  "bonjour", "bonsoir", "salut", "coucou", "ciao", "buongiorno", "buonasera", "halo", "hallo", "guten tag",
  "guten morgen", "servus", "moin",

  "konichiwa", "konnichiwa", "ohayo", "ni hao", "nihao", "anyeong", "anyeonghaseyo", "annyeong", "namaste", "marhaba",
  "salam", "salaam", "shalom", "privet", "zdravstvuyte", "merhaba", "jambo", "aloha", "ola mundo",
].map(compactar);

const COMPLEMENTOS = new Set(
  ["chat", "integrachat", "integra", "robo", "bot", "assistente", "amigo", "amiga", "pessoal", "galera", "ai", "ae", "ola", "oi",
   "tudo", "bem", "bom", "e", "voce", "vc", "td", "ok", "tranquilo", "ai", "mano", "cara", "querido", "querida", "there",
   "you", "como", "esta", "vai", "por", "aqui", "ae", "com", "contigo", "ce", "voces", "vcs", "todos", "todo", "mundo",
   "gente", "turma", "querido", "boa", "dia", "tarde", "noite", "a", "o", "pra", "para", "povo"].map(compactar),
);

export function ehSaudacao(mensagem: string): boolean {
  const t = compactar(mensagem);
  if (!t || t.split(" ").length > 6) return false;
  if (SAUDACOES.includes(t)) return true;

  return SAUDACOES.some((s) => {
    if (t !== s && !t.startsWith(`${s} `)) return false;
    const resto = t.slice(s.length).trim();
    return !resto || resto.split(" ").every((p) => COMPLEMENTOS.has(p) || SAUDACOES.includes(p));
  });
}

export function respostaSaudacao(nome: string | null): RespostaAssistente {
  const primeiroNome = nome?.trim().split(/\s+/)[0] ?? null;
  return {
    texto:
      `Olá${primeiroNome ? `, ${primeiroNome}` : ""}! Eu sou o ${NOME_ASSISTENTE}, o assistente do Integra Jovem, ` +
      "uma plataforma que ajuda jovens e adolescentes a cuidar do dinheiro e a se preparar para o futuro, com trilhas, ferramentas e metas.\n\n" +
      "Posso tirar suas dúvidas sobre finanças, consultar seus registros no site (gastos, trilhas, metas) e te ajudar a planejar.\n\n" +
      "O que você está precisando hoje?",
    temaId: "saudacao",
    sugestoes: ["Me mostre um resumo sobre mim", "Quero saber sobre finanças"],
    topicos: TOPICOS.map((tp) => ({ id: tp.id, titulo: tp.titulo, emoji: tp.emoji })),
  };
}
