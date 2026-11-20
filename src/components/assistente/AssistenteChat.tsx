"use client";

import { Bot, Brain, ChevronDown, ChevronUp, ExternalLink, MessageCircle, Send, Trash2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";

import { useSessao } from "@/hooks/useSessao";
import { NOME_ASSISTENTE } from "@/lib/assistente-nome";
import { primeiroNome as primeiroNomeFmt } from "@/lib/nome";
import { ehSaudacao, respostaSaudacao } from "@/lib/assistente-saudacao";
import { classificarSofrimento, FRASES_APOIO_TODAS, respostaDeApoio } from "@/lib/assistente-apoio";
import { corrigirMensagem, ehConfirmacao, ehNegacao, montarVocabulario } from "@/lib/assistente-ortografia";
import {
  respostaAtividadeDaPessoa,
  respostaComoEsta,
  FRASES_CONVERSA_TODAS,
  devolveuPergunta,
  pedeExplicacao,
  respondeuEDevolveu,
  respostaBemEDevolve,
  querConversar,
  respostaQuerConversar,
  respostaEstadoDaPessoa,
  respostaExplicacao,
  respostaOQueFaz,
  respostaTermoTecnico,
  tipoDeConversa,
} from "@/lib/assistente-conversa";
import {
  contextoVazio,
  diversificarSugestoes,
  ehContinuacao,
  enriquecerComContexto,
  registrarNoContexto,
  respostaContinuacao,
  type ContextoConversa,
} from "@/lib/assistente-contexto";
import { classificarSeguranca, FRASES_SEGURANCA_TODAS, respostaSeguranca } from "@/lib/assistente-seguranca";
import {
  contemPalavrao,
  FRASES_RESPEITO_TODAS,
  LIMITE_ADVERTENCIAS,
  respostaModoSilencioso,
  relataProblemaNoSite,
  respostaLixoAmbiguo,
  respostaProblemaNoSite,
  respostaRespeito,
  sentidoDeLixo,
} from "@/lib/assistente-respeito";
import { calcularIdade } from "@/lib/data-nascimento";
import {
  MENSAGEM_INICIAL,
  normalizar,
  responder,
  sugestoesAleatorias,
  temas as temasLocais,
  type RespostaAssistente,
  type Tema,
} from "@/lib/assistente";
import {
  carregarConversa,
  limparConversa,
  salvarMensagens,
} from "@/lib/supabase/assistente-conversa";
import { carregarTemasRemoto } from "@/lib/supabase/assistente-remoto";
import {
  pedeAjudaAmpla,
  pedeAjudaComFinancas,
  pedeAjudaSemDizerQual,
  respostaAjudaComFinancas,
  respostaAjudaNoContexto,
  respostaQualAjuda,
  pedeDetalhesDoPlano,
  respostaAjudaAmpla,
  respostaAjudaDetalhada,
} from "@/lib/assistente-ajuda";
import {
  pedeMenuDeAssuntos,
  pedeVisaoGeralFinancas,
  respostaVisaoGeralFinancas,
  respostaDoTopico,
  respostaMenuDeAssuntos,
  textoEscolhaTopico,
  topicoEscolhido,
  TOPICOS,
} from "@/lib/assistente-topicos";
import {
  carregarContextoPessoal,
  detectarPerguntaPessoal,
  categoriasCitadas,
  detectarPerguntaProgresso,
  extrairPeriodo,
  FRASES_PESSOAIS_TODAS,
  pedeProgressoMeta,
  pedeValorDeCategoria,
  responderCategoria,
  periodoExplicito,
  responderPessoal,
  responderProgresso,
  responderProgressoMeta,
  type ContextoPessoal,
  type PerguntaPessoal,
  type Periodo,
} from "@/lib/assistente-pessoal";
import {
  aplicarMemoria,
  carregarMemoriasLocal,
  detectarComandoMemoria,
  extrairCustoDeObjetivo,
  extrairMemoria,
  respostaEsquecer,
  respostaListar,
  respostaMemoriaSalva,
  respostaObjetivo,
  rotuloTipo,
  salvarMemoriasLocal,
  saudacaoComMemoria,
  type Memoria,
  type NovaMemoria,
  type TipoMemoria,
} from "@/lib/assistente-memoria";
import {
  carregarMemoriasRemoto,
  removerMemoriasRemoto,
  salvarMemoriaRemoto,
} from "@/lib/supabase/assistente-memoria-remoto";
import { formatarMoeda } from "@/lib/financas";

const VALIDADE_CONTEXTO_MS = 60_000;

type Mensagem =
  | { id: number; autor: "usuario"; texto: string }
  | ({ id: number; autor: "assistente" } & RespostaAssistente);

const conversaInicial = (): Mensagem[] => [{ id: 0, autor: "assistente", ...MENSAGEM_INICIAL }];

export function AssistenteChat() {

  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const pathname = usePathname();
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>(conversaInicial);
  const [confirmandoLimpar, setConfirmandoLimpar] = useState(false);
  const historicoDe = useRef<string | null>(null);
  const contextoPessoal = useRef<{ dados: ContextoPessoal; lidoEm: number; de: string } | null>(null);

  const [rolagemNoChat, setRolagemNoChat] = useState(false);
  const painelRef = useRef<HTMLElement>(null);
  const mensagensRef = useRef<HTMLDivElement>(null);
  const [temMaisConteudo, setTemMaisConteudo] = useState(false);

  useEffect(() => {
    if (!aberto) {
      setRolagemNoChat(false);
      return;
    }
    const aoClicar = (e: PointerEvent) => {
      const dentro = painelRef.current?.contains(e.target as Node) ?? false;
      setRolagemNoChat(dentro);
    };
    document.addEventListener("pointerdown", aoClicar);
    return () => document.removeEventListener("pointerdown", aoClicar);
  }, [aberto]);

  useEffect(() => {
    setAberto(false);
    contextoPessoal.current = null;
  }, [pathname]);

  const ultimaRespostaTema = useRef<string | null>(null);

  const sugestoesRecentes = useRef<string[]>([]);

  const contextoConversa = useRef<ContextoConversa>(contextoVazio());

  const aguardandoBatePapo = useRef<"como-esta" | "o-que-faz" | null>(null);

  const [painelRecolhido, setPainelRecolhido] = useState(false);
  const [alturaPainel, setAlturaPainel] = useState(176);
  useEffect(() => {
    try {
      setPainelRecolhido(localStorage.getItem("integra-jovem:chat:sugestoes-recolhidas") === "1");
      const altura = Number(localStorage.getItem("integra-jovem:chat:sugestoes-altura"));
      if (altura >= 64 && altura <= 480) setAlturaPainel(altura);
    } catch {

    }
  }, []);
  const alternarPainel = () => {
    setPainelRecolhido((atual) => {
      try {
        localStorage.setItem("integra-jovem:chat:sugestoes-recolhidas", atual ? "0" : "1");
      } catch {

      }
      return !atual;
    });
  };
  const iniciarArraste = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (painelRecolhido) return;
    e.preventDefault();
    const inicioY = e.clientY;
    const alturaInicial = alturaPainel;
    let ultima = alturaInicial;
    const mover = (ev: PointerEvent) => {

      const maximo = Math.min(480, Math.round(window.innerHeight * 0.6));
      ultima = Math.max(64, Math.min(maximo, alturaInicial + (inicioY - ev.clientY)));
      setAlturaPainel(ultima);
    };
    const soltar = () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      try {
        localStorage.setItem("integra-jovem:chat:sugestoes-altura", String(ultima));
      } catch {

      }
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
  };

  const confirmacaoPendente = useRef<{ texto: string; aguardando: "como-esta" | "o-que-faz" | null } | null>(null);

  const ultimaBrincadeira = useRef<{ explicacao: string; pergunta: string } | null>(null);

  const vezesPalavrao = useRef(0);

  const modoSilencioso = useRef(false);
  const ultimoAssunto = useRef<{ pergunta: PerguntaPessoal; periodo: Periodo; categorias?: string[] } | null>(null);

  const [memorias, setMemorias] = useState<Memoria[]>([]);
  const [verMemorias, setVerMemorias] = useState(false);
  const memoriasDe = useRef<string | null>(null);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const proximoId = useRef(1);
  const fimRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [temas, setTemas] = useState<Tema[]>(temasLocais);

  const vocabulario = useMemo(
    () =>
      montarVocabulario(temas, [
        FRASES_APOIO_TODAS,
        FRASES_SEGURANCA_TODAS,
        FRASES_RESPEITO_TODAS,
        FRASES_PESSOAIS_TODAS,
        FRASES_CONVERSA_TODAS,
        TOPICOS.flatMap((t) => [t.titulo, ...(t.perguntas ?? [])]),
      ]),
    [temas],
  );
  const carregouTemas = useRef(false);

  useEffect(() => {
    if (!aberto || carregouTemas.current) return;
    carregouTemas.current = true;
    carregarTemasRemoto().then((doBanco) => {
      if (doBanco) setTemas(doBanco);
    });
  }, [aberto]);

  useEffect(() => {
    if (carregandoSessao) return;
    if (historicoDe.current !== null && historicoDe.current !== (userId ?? "")) {
      setMensagens(conversaInicial());
      historicoDe.current = null;
    }
  }, [userId, carregandoSessao]);

  useEffect(() => {
    if (!aberto || carregandoSessao || !userId || historicoDe.current === userId) return;
    historicoDe.current = userId;
    carregarConversa(userId).then((salvas) => {
      if (salvas.length === 0) return;
      const recuperadas: Mensagem[] = salvas.map((m) =>
        m.autor === "usuario"
          ? { id: proximoId.current++, autor: "usuario", texto: m.texto }
          : { id: proximoId.current++, autor: "assistente", texto: m.texto, temaId: m.temaId ?? undefined },
      );

      const ultima = recuperadas[recuperadas.length - 1];
      if (ultima?.autor === "assistente") ultima.sugestoes = sugestoesAleatorias(temasLocais, ultima.temaId, 2);
      setMensagens([...conversaInicial(), ...recuperadas]);

      contextoConversa.current = salvas.reduce(
        (ctx, m) => (m.autor === "assistente" && m.temaId ? registrarNoContexto(ctx, m.temaId, temasLocais) : ctx),
        contextoVazio(),
      );
    });
  }, [aberto, carregandoSessao, userId]);

  const temaDe = (m: RespostaAssistente) => (m.temaId ? temas.find((t) => t.id === m.temaId) : undefined);
  const linksDe = (m: RespostaAssistente) => m.links ?? temaDe(m)?.links ?? [];
  const fonteDe = (m: RespostaAssistente) => m.fonte ?? temaDe(m)?.fonte;

  useEffect(() => {
    if (aberto) contextoPessoal.current = null;
  }, [aberto]);

  useEffect(() => {
    if (!aberto || carregandoSessao) return;
    const chave = userId ?? "visitante";
    if (memoriasDe.current === chave) return;
    memoriasDe.current = chave;
    (userId ? carregarMemoriasRemoto(userId) : Promise.resolve(carregarMemoriasLocal())).then((lista) => {
      setMemorias(lista);

      const nome = primeiroNomeFmt(usuario?.user_metadata?.nome as string | undefined) || null;
      const saudacao = saudacaoComMemoria(lista, nome);
      if (saudacao) {
        setMensagens((m) => (m.length === 1 && m[0].id === 0 ? [{ id: 0, autor: "assistente", ...saudacao }] : m));
      }
    });
  }, [aberto, carregandoSessao, userId, usuario]);

  const lerContexto = async (): Promise<ContextoPessoal> => {
    const chave = userId ?? "visitante";
    const cache = contextoPessoal.current;
    const dados =
      cache && cache.de === chave && Date.now() - cache.lidoEm < VALIDADE_CONTEXTO_MS
        ? cache.dados
        : await carregarContextoPessoal(usuario ?? null);
    contextoPessoal.current = { dados, lidoEm: Date.now(), de: chave };
    return dados;
  };

  const guardarMemoria = async (nova: NovaMemoria) => {
    if (userId) {
      const salva = await salvarMemoriaRemoto(userId, nova);
      if (salva) setMemorias((lista) => aplicarMemoria(lista, salva));
      return;
    }
    const salva: Memoria = { ...nova, id: `local-${Date.now()}`, criadoEm: new Date().toISOString() };
    setMemorias((lista) => {
      const nova_ = aplicarMemoria(lista, salva);
      salvarMemoriasLocal(nova_);
      return nova_;
    });
  };

  const apagarMemorias = async (filtro: { id?: string; tipo?: TipoMemoria } = {}): Promise<number> => {
    const alvo = memorias.filter(
      (m) => (!filtro.id || m.id === filtro.id) && (!filtro.tipo || m.tipo === filtro.tipo),
    );
    if (alvo.length === 0) return 0;
    if (userId) {
      const ok = await removerMemoriasRemoto(userId, filtro);
      if (!ok) return 0;
    }
    const idsAlvo = new Set(alvo.map((m) => m.id));
    setMemorias((lista) => {
      const restante = lista.filter((m) => !idsAlvo.has(m.id));
      if (!userId) salvarMemoriasLocal(restante);
      return restante;
    });
    return alvo.length;
  };

  const limpar = async () => {
    vezesPalavrao.current = 0;
    modoSilencioso.current = false;
    aguardandoBatePapo.current = null;
    ultimaBrincadeira.current = null;
    contextoConversa.current = contextoVazio();
    sugestoesRecentes.current = [];
    ultimaRespostaTema.current = null;
    setConfirmandoLimpar(false);
    if (userId) await limparConversa(userId);
    setMensagens(conversaInicial());
  };

  useEffect(() => {
    const el = mensagensRef.current;
    if (el) setTemMaisConteudo(el.scrollHeight > el.clientHeight + 4);
  });

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensagens, digitando]);

  useEffect(() => {
    if (!aberto) return;
    inputRef.current?.focus();
    const fecharComEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [aberto]);

  const montarResposta = async (limpa: string): Promise<RespostaAssistente> => {

    if (modoSilencioso.current && contemPalavrao(limpa)) {
      return respostaModoSilencioso();
    }

    const pendente = confirmacaoPendente.current;
    confirmacaoPendente.current = null;
    if (pendente) {
      if (ehConfirmacao(limpa)) {
        const r = await responderTexto(pendente.texto, pendente.aguardando, false);
        if (r.temaId !== "conversa:explicacao" && !r.temaId?.startsWith("conversa:")) ultimaBrincadeira.current = null;
        if (r.temaId !== "fallback") return r;
        return {
          ...respostaMenuDeAssuntos(
            `Obrigado por confirmar! Ainda não tenho uma resposta pronta sobre "${pendente.texto}". Escolha um assunto abaixo ou me pergunte de outro jeito.`,
          ),
        };
      }
      if (ehNegacao(limpa)) {
        return { texto: "Tudo bem! Pode repetir a mensagem com outras palavras? Assim eu consigo te ajudar melhor.", temaId: "ortografia:repetir" };
      }
    }

    const aguardando = aguardandoBatePapo.current;
    aguardandoBatePapo.current = null;
    const brincadeiraAntes = ultimaBrincadeira.current;
    const bruta = await responderTexto(limpa, aguardando, true);

    const manter = bruta.temaId === "conversa:explicacao" || bruta.temaId === "ortografia:confirmar";
    if (ultimaBrincadeira.current === brincadeiraAntes && !manter) ultimaBrincadeira.current = null;

    const resposta = diversificarSugestoes(bruta, contextoConversa.current, temas, sugestoesRecentes.current);
    sugestoesRecentes.current = [...(resposta.sugestoes ?? []), ...sugestoesRecentes.current].slice(0, 9);
    if (resposta.temaId && resposta.temaId !== "ortografia:confirmar") ultimaRespostaTema.current = resposta.temaId;
    return resposta;
  };

  const responderTexto = async (
    limpa: string,
    aguardando: "como-esta" | "o-que-faz" | null,
    corrigir: boolean,
  ): Promise<RespostaAssistente> => {
    const tentativa = await responderSemCorrecao(limpa, aguardando);
    if (tentativa.temaId !== "fallback" || !corrigir) return tentativa;

    const correcao = corrigirMensagem(limpa, vocabulario);
    if (!correcao) return tentativa;

    const curta = correcao.texto.split(" ").length <= 3;
    if (!curta || aguardando) {
      const corrigida = await responderSemCorrecao(correcao.texto, aguardando);
      if (corrigida.temaId !== "fallback") {

        if (corrigida.temaId === "apoio:risco" || corrigida.temaId === "seguranca:violencia" || aguardando) return corrigida;
        return { ...corrigida, texto: `Entendi como: "${correcao.texto}".\n\n${corrigida.texto}` };
      }
    }

    confirmacaoPendente.current = { texto: correcao.texto, aguardando };
    return {
      texto: curta
        ? `Você quis dizer "${correcao.texto}"? ${contemPalavrao(correcao.texto) ? "😐" : "😊"}`
        : `Não entendi o que você quis dizer. Você quis dizer "${correcao.texto}"? Se sim, confirme por favor; se não, repita a mensagem com outras palavras.`,
      temaId: "ortografia:confirmar",
      sugestoes: ["Sim", "Não"],
    };
  };

  const responderSemCorrecao = async (
    limpa: string,
    aguardando: "como-esta" | "o-que-faz" | null,
  ): Promise<RespostaAssistente> => {

    const sensivel = classificarSofrimento(limpa) || classificarSeguranca(limpa) || contemPalavrao(limpa);
    const nome = nomeParaConversa();

    const piada = ultimaBrincadeira.current;
    if (!sensivel && piada && pedeExplicacao(limpa)) {
      aguardandoBatePapo.current = aguardando;
      return respostaExplicacao(piada.explicacao, piada.pergunta);
    }

    if (aguardando && !sensivel) {

      if (aguardando === "como-esta" && devolveuPergunta(limpa)) {
        const r = respostaComoEsta(nome, false);
        aguardandoBatePapo.current = "como-esta";
        ultimaBrincadeira.current = { explicacao: r.explicacao, pergunta: r.pergunta };
        return r.resposta;
      }
      if (aguardando === "como-esta") {
        const estado = respostaEstadoDaPessoa(limpa, nome);
        if (estado === "negativo") return respostaDeApoio("emocional");

        if (estado && respondeuEDevolveu(limpa)) {
          const r = respostaBemEDevolve(nome);
          ultimaBrincadeira.current = { explicacao: r.explicacao, pergunta: r.pergunta };
          return r.resposta;
        }
        if (estado) return estado;
      } else {
        const atividade = respostaAtividadeDaPessoa(limpa, nome, idadeDoUsuario());
        if (atividade) return atividade;
      }
    }

    if (!sensivel) {

      if (pedeAjudaComFinancas(limpa)) return respostaAjudaComFinancas(nome);

      if (pedeAjudaSemDizerQual(limpa)) {

        const anterior = ultimaRespostaTema.current;
        const noContexto = respostaAjudaNoContexto(anterior, nome);
        if (noContexto) return noContexto;
        if (anterior && temas.some((t) => t.id === anterior)) {
          const continuacao = respostaContinuacao(anterior, temas);
          if (continuacao) return finalizar(continuacao, false);
        }
        return respostaQualAjuda(nome);
      }

      if (querConversar(limpa)) {
        aguardandoBatePapo.current = "como-esta";
        return respostaQuerConversar(nome);
      }
      const tipo = tipoDeConversa(limpa);
      if (tipo === "como-esta" || tipo === "saudacao-como-esta") {
        const r = respostaComoEsta(nome, tipo === "saudacao-como-esta");
        aguardandoBatePapo.current = "como-esta";
        ultimaBrincadeira.current = { explicacao: r.explicacao, pergunta: r.pergunta };
        return r.resposta;
      }
      if (tipo === "o-que-faz") {
        const r = respostaOQueFaz(nome);
        aguardandoBatePapo.current = "o-que-faz";
        ultimaBrincadeira.current = { explicacao: r.explicacao, pergunta: r.pergunta };
        return r.resposta;
      }

      if (ehSaudacao(limpa)) return respostaSaudacao(nome);

      const termo = respostaTermoTecnico(limpa);
      if (termo) return termo;
    }

    const ultimoAssuntoConversa = contextoConversa.current.ultimo;
    if (!sensivel && ultimoAssuntoConversa && ehContinuacao(limpa)) {
      const continuacao = respostaContinuacao(ultimoAssuntoConversa, temas);
      if (continuacao) return finalizar(continuacao, false);
    }

    const resposta = await montarRespostaBase(limpa);
    return resposta.temaId === "fallback" ? resposta : finalizar(resposta);
  };

  const nomeParaConversa = (): string | null => {
    const apelido = memorias.find((m) => m.tipo === "apelido")?.texto;
    if (apelido) return apelido;
    return primeiroNomeFmt(usuario?.user_metadata?.nome as string | undefined) || null;
  };

  const idadeDoUsuario = (): number | null => {
    const nascimento = usuario?.user_metadata?.nascimento as string | undefined;
    return nascimento ? calcularIdade(nascimento) : null;
  };

  const finalizar = (resposta: RespostaAssistente, enriquecer = true): RespostaAssistente => {
    const final = enriquecer ? enriquecerComContexto(resposta, contextoConversa.current, temas) : resposta;
    contextoConversa.current = registrarNoContexto(contextoConversa.current, resposta.temaId, temas);
    return final;
  };

  const montarRespostaBase = async (limpa: string): Promise<RespostaAssistente> => {

    const sofrimento = classificarSofrimento(limpa);
    if (sofrimento === "risco") return respostaDeApoio("risco");

    const seguranca = classificarSeguranca(limpa);
    if (seguranca) return respostaSeguranca(seguranca, limpa);

    if (sofrimento) return respostaDeApoio(sofrimento);

    if (contemPalavrao(limpa)) {
      vezesPalavrao.current += 1;
      if (vezesPalavrao.current >= LIMITE_ADVERTENCIAS) modoSilencioso.current = true;
      const nascimento = usuario?.user_metadata?.nascimento as string | undefined;
      const idade = nascimento ? calcularIdade(nascimento) : null;
      return respostaRespeito(idade, vezesPalavrao.current);
    }

    if (sentidoDeLixo(limpa) === "ambiguo") return respostaLixoAmbiguo();

    if (relataProblemaNoSite(limpa)) return respostaProblemaNoSite();

    const topico = topicoEscolhido(limpa);
    if (topico) return respostaDoTopico(topico, temas);

    if (pedeVisaoGeralFinancas(limpa)) return respostaVisaoGeralFinancas();
    if (pedeMenuDeAssuntos(limpa)) return respostaMenuDeAssuntos();

    if (pedeDetalhesDoPlano(limpa)) return respostaAjudaDetalhada();
    if (pedeAjudaAmpla(limpa)) return respostaAjudaAmpla();

    const comando = detectarComandoMemoria(limpa, memorias.some((m) => m.tipo === "objetivo"));
    if (comando?.tipo === "listar") return respostaListar(memorias);
    if (comando?.tipo === "esquecer") {
      const apagou = await apagarMemorias(comando.alvo === "tudo" ? {} : { tipo: comando.alvo });
      return respostaEsquecer(comando.alvo, apagou);
    }

    if (pedeProgressoMeta(limpa)) {
      const objetivosDoChat = memorias.filter((m) => m.tipo === "objetivo").map((m) => ({ texto: m.texto, valor: m.valor }));
      const ctx = await lerContexto();
      if (ctx.metas.length > 0 || objetivosDoChat.length > 0) {
        return responderProgressoMeta(limpa, ctx, objetivosDoChat);
      }
    }
    if (comando?.tipo === "objetivo") return respostaObjetivo(memorias, await lerContexto());

    const nova = extrairCustoDeObjetivo(limpa, memorias) ?? extrairMemoria(limpa);
    if (nova) {
      await guardarMemoria(nova);
      return respostaMemoriaSalva(nova);
    }

    const texto = ` ${normalizar(limpa)} `;
    const continuacao = /^\s*e\b/i.test(limpa) || limpa.length <= 25;
    const periodoDaMensagem = periodoExplicito(limpa);
    const anterior = ultimoAssunto.current;

    const progresso = detectarPerguntaProgresso(limpa);
    if (progresso) return responderProgresso(progresso, await lerContexto());

    const pedeValor = pedeValorDeCategoria(limpa);
    if (pedeValor || (continuacao && anterior?.categorias)) {
      const ctx = await lerContexto();
      const citadas = categoriasCitadas(limpa, ctx);
      const categorias = citadas.length > 0 ? citadas : continuacao && periodoDaMensagem ? anterior?.categorias : undefined;
      if (categorias && categorias.length > 0 && (pedeValor || continuacao)) {
        const periodo =
          periodoDaMensagem ?? (continuacao && anterior ? anterior.periodo : undefined) ?? extrairPeriodo(limpa);
        ultimoAssunto.current = { pergunta: "gastos", periodo, categorias };
        return responderCategoria(categorias, ctx, periodo, limpa);
      }
    }

    let pessoal = detectarPerguntaPessoal(limpa);
    if (!pessoal && continuacao && anterior) {
      if (/ gast/.test(texto)) pessoal = "gastos";
      else if (/ (sobr|saldo|renda)/.test(texto)) pessoal = "saldo";
      else if (periodoDaMensagem && (anterior.pergunta === "gastos" || anterior.pergunta === "saldo")) {
        pessoal = anterior.pergunta;
      }
    }
    if (pessoal) {
      const periodo =
        periodoDaMensagem ?? (continuacao && anterior ? anterior.periodo : undefined) ?? extrairPeriodo(limpa);
      ultimoAssunto.current = { pergunta: pessoal, periodo };
      const resposta = responderPessoal(pessoal, await lerContexto(), limpa, periodo);

      const mesada = memorias.find((m) => m.tipo === "mesada");
      if (pessoal === "saldo" && mesada?.valor && /não definiu a renda/i.test(resposta.texto)) {
        resposta.texto += ` Você me contou que recebe ${mesada.texto}; se quiser, registre ${formatarMoeda(mesada.valor)} como renda em Finanças.`;
      }
      return resposta;
    }

    ultimoAssunto.current = null;
    return responder(limpa, temas);
  };

  const perguntar = (pergunta: string) => {
    const limpa = pergunta.trim();
    if (!limpa || digitando) return;
    setMensagens((m) => [...m, { id: proximoId.current++, autor: "usuario", texto: limpa }]);
    setTexto("");
    setDigitando(true);
    const inicio = Date.now();
    void (async () => {
      let resposta: RespostaAssistente;
      try {
        resposta = await montarResposta(limpa);
      } catch {
        resposta = { texto: "Não consegui ler seus registros agora. Tente de novo em instantes." };
      }

      const espera = Math.max(0, 450 - (Date.now() - inicio));
      window.setTimeout(() => {
        setMensagens((m) => [...m, { id: proximoId.current++, autor: "assistente", ...resposta }]);
        setDigitando(false);
        if (userId) {
          void salvarMensagens(userId, [
            { autor: "usuario", texto: limpa },
            { autor: "assistente", texto: resposta.texto, temaId: resposta.temaId },
          ]);
        }
      }, espera);
    })();
  };

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    perguntar(texto);
  };

  const ultimaDoAssistente = [...mensagens].reverse().find((m) => m.autor === "assistente");

  if (!montado) return null;

  return createPortal(
    <>

      {!aberto ? (
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label={`Abrir o ${NOME_ASSISTENTE}, assistente de dúvidas`}
          className="fixed right-0 top-1/2 z-[55] flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-2xl border border-r-0 border-primary/50 bg-primary px-2 py-3 text-primary-foreground shadow-lg transition-colors hover:bg-primary-light"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="text-[11px] font-bold [writing-mode:vertical-rl]">{NOME_ASSISTENTE}</span>
        </button>
      ) : null}

      {aberto ? (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <button
            type="button"
            aria-label="Fechar assistente"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-black/40 sm:bg-black/20"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${NOME_ASSISTENTE}, assistente de dúvidas financeiras`}
            ref={painelRef}
            className="relative flex h-full w-full flex-col border-l border-border bg-surface shadow-2xl sm:w-[380px]"
          >
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold">{NOME_ASSISTENTE}</p>
                <p className="text-[11px] text-subtle-foreground">Assistente financeiro do Integra Jovem</p>
              </div>
              <button
                type="button"
                onClick={() => setVerMemorias((v) => !v)}
                aria-expanded={verMemorias}
                aria-label={`O que o ${NOME_ASSISTENTE} lembra sobre mim`}
                title={`O que o ${NOME_ASSISTENTE} lembra sobre mim`}
                className={`rounded-lg p-1.5 hover:text-foreground ${verMemorias ? "text-primary" : "text-subtle-foreground"}`}
              >
                <Brain className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoLimpar((v) => !v)}
                disabled={mensagens.length <= 1}
                aria-label="Limpar conversa"
                title="Limpar conversa"
                className="rounded-lg p-1.5 text-subtle-foreground hover:text-foreground disabled:opacity-40"
              >
                <Trash2 className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar"
                className="rounded-lg p-1.5 text-subtle-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            {verMemorias ? (
              <div className="border-b border-border bg-surface-hi px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold">O que eu lembro sobre você</p>
                  {memorias.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => void apagarMemorias()}
                      className="text-[11px] font-semibold text-destructive hover:underline"
                    >
                      Apagar tudo
                    </button>
                  ) : null}
                </div>
                {memorias.length === 0 ? (
                  <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
                    Nada ainda. Me conte um objetivo (“quero juntar para um fone de R$ 200”), sua mesada ou como
                    prefere ser chamado.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {memorias.map((m) => (
                      <li key={m.id} className="flex items-center gap-2 text-[12px]">
                        <span className="min-w-0 flex-1">
                          <span className="font-semibold">{rotuloTipo[m.tipo]}:</span> {m.texto}
                          {m.tipo === "objetivo" && m.valor ? ` (${formatarMoeda(m.valor)})` : ""}
                        </span>
                        <button
                          type="button"
                          onClick={() => void apagarMemorias({ id: m.id })}
                          aria-label={`Esquecer: ${m.texto}`}
                          className="rounded p-0.5 text-subtle-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-[10.5px] text-subtle-foreground">
                  {userId
                    ? "Fica salvo na sua conta e só você vê. Limpar a conversa não apaga as memórias."
                    : "Fica só neste navegador. Entre na conta para guardar em qualquer aparelho."}
                </p>
              </div>
            ) : null}

            {confirmandoLimpar ? (
              <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-hi px-4 py-2.5 text-[12px]">
                <span className="flex-1 text-muted-foreground">
                  {userId
                    ? "Apagar toda a conversa? Ela também será removida da sua conta (as memórias continuam)."
                    : "Apagar toda a conversa?"}
                </span>
                <button
                  type="button"
                  onClick={() => void limpar()}
                  className="rounded-md border border-destructive/50 px-2 py-0.5 font-semibold text-destructive hover:bg-destructive/10"
                >
                  Sim, limpar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoLimpar(false)}
                  className="rounded-md border border-border px-2 py-0.5 font-semibold text-muted-foreground hover:text-foreground"
                >
                  Não
                </button>
              </div>
            ) : null}

            <div
              ref={mensagensRef}
              className={`chat-scroll min-h-0 flex-1 space-y-3 px-4 py-4 ${
                rolagemNoChat ? "overflow-y-auto" : "overflow-y-hidden"
              }`}
              aria-live="polite"
            >
              {mensagens.map((m) =>
                m.autor === "usuario" ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-[13px] text-primary-foreground">
                      {m.texto}
                    </p>
                  </div>
                ) : (
                  <div key={m.id} className="flex justify-start">

                    <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-surface-hi px-3 py-2">
                      <p className="whitespace-pre-line text-[13px] leading-relaxed">{m.texto}</p>
                      {linksDe(m).length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {linksDe(m).map((l) => (
                            <Link
                              key={l.href + l.rotulo}
                              href={l.href}
                              onClick={() => setAberto(false)}
                              className="rounded-lg border border-primary/40 bg-primary-dim px-2 py-1 text-[11px] font-semibold text-primary-light hover:border-primary"
                            >
                              {l.rotulo} →
                            </Link>
                          ))}
                        </div>
                      ) : null}
                      {fonteDe(m) ? (
                        <a
                          href={fonteDe(m)?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-sky-300 underline underline-offset-2 hover:text-sky-200"
                        >
                          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                          Para se aprofundar: {fonteDe(m)?.rotulo}
                        </a>
                      ) : null}
                      {m.externos && m.externos.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {m.externos.map((e) => (
                            <a
                              key={e.url}
                              href={e.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-1.5 text-[11px] leading-snug text-sky-300 underline underline-offset-2 hover:text-sky-200"
                            >
                              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                              {e.rotulo}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ),
              )}
              {digitando ? (
                <p className="text-[12px] text-subtle-foreground" aria-label="Assistente escrevendo">
                  Escrevendo…
                </p>
              ) : null}
              <div ref={fimRef} />
            </div>

            {!rolagemNoChat && temMaisConteudo ? (
              <p className="border-t border-border px-4 py-1.5 text-center text-[10.5px] text-subtle-foreground">
                Clique na conversa para rolar as mensagens
              </p>
            ) : null}

            {(!digitando && ultimaDoAssistente?.autor === "assistente" && (ultimaDoAssistente.topicos?.length || ultimaDoAssistente.sugestoes?.length)) ? (
              <div className="border-t border-border">
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  aria-label="Arraste para ajustar a altura das sugestões"
                  onPointerDown={iniciarArraste}
                  className={`group flex h-3 items-center justify-center ${painelRecolhido ? "cursor-default" : "cursor-ns-resize"}`}
                >
                  {!painelRecolhido ? (
                    <span className="h-1 w-10 rounded-full bg-border transition-colors group-hover:bg-primary/60" />
                  ) : null}
                </div>
                <div className="flex items-center justify-between px-4 pb-1">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-subtle-foreground">
                    Sugestões
                  </span>
                  <button
                    type="button"
                    onClick={alternarPainel}
                    aria-expanded={!painelRecolhido}
                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-subtle-foreground hover:text-foreground"
                  >
                    {painelRecolhido ? "Mostrar" : "Recolher"}
                    {painelRecolhido ? (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {!painelRecolhido ? (
                  <div
                    style={{ maxHeight: alturaPainel }}
                    className={`chat-scroll ${rolagemNoChat ? "overflow-y-auto" : "overflow-y-hidden"}`}
                  >
            {!digitando && ultimaDoAssistente?.autor === "assistente" && ultimaDoAssistente.topicos?.length ? (
              <div className="grid grid-cols-2 gap-1.5 px-4 pt-1">
                {ultimaDoAssistente.topicos.map((tp) => {
                  const completo = TOPICOS.find((x) => x.id === tp.id);
                  return (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => completo && perguntar(textoEscolhaTopico(completo))}
                      className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary-dim px-2.5 py-2 text-left text-[12px] font-semibold text-foreground hover:border-primary"
                    >
                      <span aria-hidden="true">{tp.emoji}</span>
                      <span className="leading-tight">{tp.titulo}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {!digitando && ultimaDoAssistente?.autor === "assistente" && ultimaDoAssistente.sugestoes?.length ? (
              <div
                className="flex flex-wrap gap-1.5 px-4 pt-2"
              >
                {ultimaDoAssistente.sugestoes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => perguntar(s)}
                    className="rounded-full border border-border bg-surface-hi px-3 py-1 text-[11.5px] text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

                  </div>
                ) : null}
              </div>
            ) : null}

            <form onSubmit={enviar} className="flex items-center gap-2 px-4 py-3">
              <label htmlFor="pergunta-assistente" className="sr-only">
                Sua pergunta
              </label>
              <input
                id="pergunta-assistente"
                ref={inputRef}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                maxLength={200}
                placeholder="Pergunte sobre dinheiro…"
                autoComplete="off"
                className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-[13px] outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!texto.trim() || digitando}
                aria-label="Enviar pergunta"
                className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <p className="px-4 pb-3 text-[10.5px] leading-snug text-subtle-foreground">
              Conteúdo educativo, não é recomendação de investimento. Não escreva dados pessoais, como senhas ou
              números de cartão.{" "}
              {userId
                ? `Para responder sobre você, o ${NOME_ASSISTENTE} consulta só os seus próprios registros. A conversa fica salva na sua conta; use a lixeira para apagar.`
                : "Entre na sua conta para guardar a conversa."}
            </p>
          </aside>
        </div>
      ) : null}
    </>,
    document.body,
  );
}
