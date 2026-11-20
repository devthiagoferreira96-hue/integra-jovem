

import { normalizar, type RespostaAssistente } from "@/lib/assistente";
import { sobrasRecentes, type ContextoPessoal } from "@/lib/assistente-pessoal";
import { formatarMoeda } from "@/lib/financas";
import { NOME_ASSISTENTE } from "@/lib/assistente-nome";

export type TipoMemoria = "objetivo" | "mesada" | "apelido";

export type Memoria = {
  id: string;
  tipo: TipoMemoria;
  texto: string;
  valor: number | null;
  criadoEm: string;
};

export type NovaMemoria = Omit<Memoria, "id" | "criadoEm">;

export const TIPOS_UNICOS: TipoMemoria[] = ["mesada", "apelido"];
export const MAX_OBJETIVOS = 5;

export const rotuloTipo: Record<TipoMemoria, string> = {
  objetivo: "Objetivo",
  mesada: "Mesada ou renda",
  apelido: "Como te chamar",
};

function extrairValor(mensagem: string): number | null {
  const m = mensagem.match(/(?:r\$\s?)?(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?)(?:\s?(mil|reais|conto))?/i);
  if (!m) return null;
  let valor = Number(m[1].replace(/\./g, "").replace(",", "."));
  if (m[2]?.toLowerCase() === "mil") valor *= 1000;
  return Number.isFinite(valor) && valor > 0 && valor < 10_000_000 ? valor : null;
}

function limparItem(item: string): string {
  let atual = item.replace(/\s+\d.*$/, "").trim();

  for (let i = 0; i < 4; i += 1) {
    const antes = atual;
    atual = atual
      .replace(/\s+(r|reais|mil|conto)$/, "")
      .replace(/\s+(de|por|que custa|custa|com|ate|em|no valor de)$/, "")
      .trim();
    if (atual === antes) break;
  }
  return atual;
}

export function extrairMemoria(mensagem: string): NovaMemoria | null {
  const t = ` ${normalizar(mensagem)} `;

  const apelido = t.match(/ (?:me chama de|me chame de|pode me chamar de|meu apelido e) ([a-z]{2,20}) /);
  if (apelido) {
    const nome = apelido[1];
    return { tipo: "apelido", texto: nome.charAt(0).toUpperCase() + nome.slice(1), valor: null };
  }

  const mesada = t.match(/ (?:recebo|ganho|tenho)(?: uma)? (mesada|semanada|salario|renda)\b/) ??
    t.match(/ (?:minha|meu) (mesada|semanada|salario) e /);
  if (mesada) {
    const valor = extrairValor(mensagem);
    if (valor) {
      const semanal = mesada[1] === "semanada" || / por semana /.test(t);
      return {
        tipo: "mesada",
        texto: semanal ? `semanada de ${formatarMoeda(valor)}` : `${mesada[1] === "salario" ? "salário" : mesada[1]} de ${formatarMoeda(valor)} por mês`,
        valor: semanal ? valor * 4 : valor,
      };
    }
  }

  const objetivo =
    t.match(/ (?:quero|vou|estou|to|tou|preciso) (?:juntar|guardar|economizar|poupar|juntando|guardando|economizando|poupando)(?: dinheiro)? (?:para|pra|pro|p ) ?(?:comprar |ter |fazer )?(?:um |uma |o |a |meu |minha |uns |umas )?([a-z][a-z ]{1,40})/) ??
    t.match(/ meu (?:objetivo|sonho) e (?:comprar |ter |juntar para |juntar pra )?(?:um |uma |o |a |meu |minha )?([a-z][a-z ]{1,40})/);
  if (objetivo) {
    const item = limparItem(objetivo[1]);
    if (item.length >= 2) return { tipo: "objetivo", texto: item, valor: extrairValor(mensagem) };
  }

  return null;
}

export function extrairCustoDeObjetivo(mensagem: string, memorias: Memoria[]): NovaMemoria | null {
  const t = ` ${normalizar(mensagem)} `;
  if (!/ (custa|custaria|sai por|esta|fica|vale) /.test(t)) return null;
  const valor = extrairValor(mensagem);
  if (!valor) return null;
  const objetivo = memorias.find(
    (m) => m.tipo === "objetivo" && t.includes(` ${normalizar(m.texto)} `),
  );
  return objetivo ? { tipo: "objetivo", texto: objetivo.texto, valor } : null;
}

export function saudacaoComMemoria(memorias: Memoria[], nome: string | null): RespostaAssistente | null {
  const apelido = memorias.find((m) => m.tipo === "apelido")?.texto ?? nome?.split(" ")[0] ?? null;
  const objetivo = [...memorias].reverse().find((m) => m.tipo === "objetivo");
  if (!apelido && !objetivo) return null;
  const partes = [
    `Oi${apelido ? `, ${apelido}` : ""}! Aqui é o ${NOME_ASSISTENTE}, que bom te ver de novo.`,
    objetivo
      ? `Da última vez você me contou do objetivo "${objetivo.texto}". Quer ver como está?`
      : "Pode perguntar sobre dinheiro, sobre seus registros ou me contar um objetivo seu.",
  ];
  return {
    texto: partes.join(" "),
    sugestoes: objetivo
      ? ["Como está meu objetivo?", "Quanto sobrou no mês passado?", "Me mostre um resumo sobre mim"]
      : ["Me mostre um resumo sobre mim", "Quanto gastei este mês?", "Como organizo meu dinheiro do mês?"],
  };
}

export type ComandoMemoria =
  | { tipo: "listar" }
  | { tipo: "esquecer"; alvo: TipoMemoria | "tudo" }
  | { tipo: "objetivo" };

export function detectarComandoMemoria(mensagem: string, temObjetivo: boolean): ComandoMemoria | null {
  const t = ` ${normalizar(mensagem)} `;

  if (/ (esqueca|esquece|esqueça|apague|apaga|apagar|delete|remova|remove|nao lembre) /.test(t) &&
      / (memoria|memorias|objetivo|objetivos|mesada|semanada|renda|apelido|tudo|sobre mim|isso) /.test(t)) {
    if (/ objetivos? /.test(t)) return { tipo: "esquecer", alvo: "objetivo" };
    if (/ (mesada|semanada|renda) /.test(t)) return { tipo: "esquecer", alvo: "mesada" };
    if (/ apelido /.test(t)) return { tipo: "esquecer", alvo: "apelido" };
    return { tipo: "esquecer", alvo: "tudo" };
  }

  if (/ (o que voce lembra|voce lembra de mim|voce se lembra|suas memorias|minhas memorias|o que voce anotou|o que voce guardou) /.test(t)) {
    return { tipo: "listar" };
  }

  if (temObjetivo && / (meu objetivo|meus objetivos|quanto falta|quando consigo|quando vou conseguir|como esta minha meta|como vai meu objetivo|consigo comprar) /.test(t)) {
    return { tipo: "objetivo" };
  }

  return null;
}

export function respostaMemoriaSalva(m: NovaMemoria): RespostaAssistente {
  const texto =
    m.tipo === "apelido"
      ? `Combinado, vou te chamar de ${m.texto}!`
      : m.tipo === "mesada"
        ? `Anotei: você recebe ${m.texto}. Posso usar isso para te ajudar a planejar.`
        : `Anotei seu objetivo: ${m.texto}${m.valor ? ` (${formatarMoeda(m.valor)})` : ""}. Quando quiser, pergunte "como está meu objetivo?" que eu calculo com base nos seus registros.`;
  return {
    texto: `${texto}\n\nVocê pode ver ou apagar o que eu lembro no botão de memória, no topo do chat.`,
    temaId: "memoria:salva",
    sugestoes: m.tipo === "objetivo" ? ["Como está meu objetivo?", "O que você lembra sobre mim?"] : ["O que você lembra sobre mim?"],
  };
}

export function respostaListar(memorias: Memoria[]): RespostaAssistente {
  if (memorias.length === 0) {
    return {
      texto:
        "Ainda não anotei nada sobre você. Se quiser, me conte um objetivo (\"quero juntar para um fone de R$ 200\"), sua mesada (\"recebo mesada de R$ 100\") ou como prefere ser chamado (\"pode me chamar de Ju\").",
      temaId: "memoria:listar",
    };
  }
  const linhas = memorias.map(
    (m) => `• ${rotuloTipo[m.tipo]}: ${m.texto}${m.tipo === "objetivo" && m.valor ? ` (${formatarMoeda(m.valor)})` : ""}`,
  );
  return {
    texto: `Isto é o que eu lembro sobre você:\n${linhas.join("\n")}\n\nPara apagar, use o botão de memória no topo do chat ou peça "esqueça meu objetivo".`,
    temaId: "memoria:listar",
  };
}

export function respostaObjetivo(memorias: Memoria[], ctx: ContextoPessoal | null): RespostaAssistente {
  const objetivos = memorias.filter((m) => m.tipo === "objetivo");
  const mesada = memorias.find((m) => m.tipo === "mesada");
  const sobras = ctx ? sobrasRecentes(ctx, 3) : { meses: 0, total: 0, media: 0 };

  const partes = objetivos.map((o) => {
    if (!o.valor) return `• ${o.texto}: me diga quanto custa ("o ${o.texto} custa R$ 500") e eu calculo o prazo.`;
    if (sobras.meses > 0 && sobras.media > 0) {
      const mesesNecessarios = Math.ceil(o.valor / sobras.media);
      return `• ${o.texto} (${formatarMoeda(o.valor)}): no ritmo dos últimos meses (sobrando em média ${formatarMoeda(sobras.media)} por mês), levaria cerca de ${mesesNecessarios} ${mesesNecessarios === 1 ? "mês" : "meses"}.`;
    }
    if (mesada?.valor) {
      const guardar = mesada.valor * 0.2;
      const meses = Math.ceil(o.valor / guardar);
      return `• ${o.texto} (${formatarMoeda(o.valor)}): guardando 20% da sua mesada (${formatarMoeda(guardar)} por mês), levaria cerca de ${meses} meses.`;
    }
    return `• ${o.texto} (${formatarMoeda(o.valor)}): registre sua renda e seus gastos em Finanças que eu calculo em quanto tempo dá para chegar lá.`;
  });

  return {
    texto: `Seus objetivos:\n${partes.join("\n")}`,
    temaId: "memoria:objetivo",
    links: [
      { rotulo: "Registrar renda e gastos", href: "/financas" },
      { rotulo: "Simular com juros", href: "/financas/simulacoes" },
    ],
  };
}

export function respostaEsquecer(alvo: TipoMemoria | "tudo", apagou: number): RespostaAssistente {
  return {
    texto:
      apagou === 0
        ? "Não havia nada anotado sobre isso."
        : alvo === "tudo"
          ? "Pronto, apaguei tudo o que eu lembrava sobre você."
          : `Pronto, esqueci ${alvo === "objetivo" ? "seus objetivos" : alvo === "mesada" ? "sua mesada" : "seu apelido"}.`,
    temaId: "memoria:esquecer",
  };
}

export function aplicarMemoria(lista: Memoria[], nova: Memoria): Memoria[] {
  let resultado = lista;
  if (TIPOS_UNICOS.includes(nova.tipo)) resultado = resultado.filter((m) => m.tipo !== nova.tipo);
  if (nova.tipo === "objetivo") {
    resultado = resultado.filter((m) => !(m.tipo === "objetivo" && normalizar(m.texto) === normalizar(nova.texto)));
    const objetivos = resultado.filter((m) => m.tipo === "objetivo");
    if (objetivos.length >= MAX_OBJETIVOS) {
      const maisAntigo = objetivos.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))[0];
      resultado = resultado.filter((m) => m.id !== maisAntigo.id);
    }
  }
  return [...resultado, nova];
}

const CHAVE_LOCAL = "integra-jovem:assistente:memorias";

export function carregarMemoriasLocal(): Memoria[] {
  if (typeof window === "undefined") return [];
  try {
    const dados: unknown = JSON.parse(window.localStorage.getItem(CHAVE_LOCAL) ?? "[]");
    return Array.isArray(dados) ? (dados as Memoria[]) : [];
  } catch {
    return [];
  }
}

export function salvarMemoriasLocal(lista: Memoria[]): void {
  try {
    window.localStorage.setItem(CHAVE_LOCAL, JSON.stringify(lista));
  } catch {

  }
}
