"use client";

import {
  AlertTriangle,
  BookOpen,
  Download,
  KeyRound,
  ListChecks,
  Lock,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { formatarNome } from "@/lib/nome";
import { useEffect, useState, type FormEvent } from "react";

import { PageHeading } from "@/components/layout/PageHeading";
import { StatCard } from "@/components/perfil/StatCard";
import { Button } from "@/components/ui/AppButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CampoDataNascimento } from "@/components/ui/CampoDataNascimento";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import { cursos, usuario as usuarioMock } from "@/data/content";
import { useSessao } from "@/hooks/useSessao";
import { createClient } from "@/lib/supabase/client";
import {
  avisoNascimento,
  brParaISO,
  calcularIdade,
  erroDeBancoNoAuth,
  isoParaBR,
  MENSAGEM_NASCIMENTO_RECUSADO,
  validarNascimento,
} from "@/lib/data-nascimento";
import {
  calcularProgressoCurso,
  carregarProgresso,
  carregarResultadosQuiz,
  trilhaEstaConcluida,
} from "@/lib/progresso";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";
import { carregarResultadosQuizRemoto } from "@/lib/supabase/quiz-remoto";
import {
  carregarMetas,
  carregarReflexoes,
  criarMeta,
  criarReflexao,
  salvarMetas,
  salvarReflexoes,
  type Meta,
  type Reflexao,
} from "@/lib/metas-reflexoes";
import {
  carregarMetasRemoto,
  carregarReflexoesRemoto,
  inserirMetaRemoto,
  inserirReflexaoRemoto,
} from "@/lib/supabase/metas-reflexoes-remoto";

export default function PerfilPage() {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const [overlay, setOverlay] = useState<ReturnType<typeof carregarProgresso>>({});
  const [resultadosQuiz, setResultadosQuiz] = useState<ReturnType<typeof carregarResultadosQuiz>>([]);
  const [editando, setEditando] = useState(false);

  const [mostrarExcluir, setMostrarExcluir] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [erroPerfil, setErroPerfil] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [excluindoDeVerdade, setExcluindoDeVerdade] = useState(false);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);
  const [contaExcluida, setContaExcluida] = useState(false);
  const [perfil, setPerfil] = useState({ nome: "", email: usuarioMock.email, nascimento: "" });
  const [idade, setIdade] = useState<number | null>(null);
  const [rascunho, setRascunho] = useState(perfil);
  const [metasState, setMetasState] = useState<Meta[]>([]);
  const [reflexoesState, setReflexoesState] = useState<Reflexao[]>([]);
  const [criandoMeta, setCriandoMeta] = useState(false);
  const [novaMetaTitulo, setNovaMetaTitulo] = useState("");
  const [novaMetaPrazo, setNovaMetaPrazo] = useState("");
  const [salvandoMeta, setSalvandoMeta] = useState(false);
  const [textoReflexao, setTextoReflexao] = useState("");
  const [salvandoReflexao, setSalvandoReflexao] = useState(false);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const dados = usuario?.id
        ? await carregarProgressoRemoto(usuario.id)
        : carregarProgresso();
      if (!cancelado) setOverlay(dados);
    }

    carregar();

    if (usuario?.id) {
      carregarResultadosQuizRemoto(usuario.id).then((r) => {
        if (!cancelado) setResultadosQuiz(r);
      });
    } else {
      setResultadosQuiz(carregarResultadosQuiz());
    }

    return () => {
      cancelado = true;
    };
  }, [usuario, carregandoSessao]);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregarMetasEReflexoes() {
      const [metasCarregadas, reflexoesCarregadas] = usuario?.id
        ? await Promise.all([carregarMetasRemoto(usuario.id), carregarReflexoesRemoto(usuario.id)])
        : [carregarMetas(), carregarReflexoes()];
      if (cancelado) return;
      setMetasState(metasCarregadas);
      setReflexoesState(reflexoesCarregadas);
    }

    carregarMetasEReflexoes();
    return () => {
      cancelado = true;
    };
  }, [usuario, carregandoSessao]);

  const salvarNovaMeta = async () => {
    if (!novaMetaTitulo.trim()) return;
    setSalvandoMeta(true);
    const meta = criarMeta(novaMetaTitulo, novaMetaPrazo);
    setMetasState((prev) => [meta, ...prev]);

    if (usuario?.id) {
      await inserirMetaRemoto(usuario.id, meta);
    } else {
      salvarMetas([meta, ...carregarMetas()]);
    }

    setSalvandoMeta(false);
    setNovaMetaTitulo("");
    setNovaMetaPrazo("");
    setCriandoMeta(false);
  };

  const salvarNovaReflexao = async () => {
    if (!textoReflexao.trim()) return;
    setSalvandoReflexao(true);
    const reflexao = criarReflexao("O que você aprendeu sobre si hoje?", textoReflexao);
    setReflexoesState((prev) => [reflexao, ...prev]);

    if (usuario?.id) {
      await inserirReflexaoRemoto(usuario.id, reflexao);
    } else {
      salvarReflexoes([reflexao, ...carregarReflexoes()]);
    }

    setSalvandoReflexao(false);
    setTextoReflexao("");
  };

  useEffect(() => {
    if (carregandoSessao || !usuario) return;
    const nome = (usuario.user_metadata?.nome as string | undefined) ?? "";
    const nascimento = (usuario.user_metadata?.nascimento as string | undefined) ?? "";
    setPerfil({ nome, email: usuario.email ?? usuarioMock.email, nascimento });
    setIdade(nascimento ? calcularIdade(nascimento) : null);
  }, [usuario, carregandoSessao]);

  const progressoPorTrilha = cursos.map((c) => ({
    curso: c,
    ...calcularProgressoCurso(c, overlay),
  }));
  const emAndamento = progressoPorTrilha.filter(
    (p) => p.percentual > 0 && !trilhaEstaConcluida(p.curso, overlay, resultadosQuiz),
  );
  const concluidas = cursos.filter((c) =>
    trilhaEstaConcluida(c, overlay, resultadosQuiz),
  ).length;
  const blocosConcluidos = progressoPorTrilha.reduce((acc, p) => acc + p.concluidas, 0);

  const salvarPerfil = async (event: FormEvent) => {
    event.preventDefault();
    setErroPerfil(null);

    const erroNascimento = rascunho.nascimento ? validarNascimento(rascunho.nascimento) : null;
    if (erroNascimento) {

      if (!avisoNascimento(rascunho.nascimento)) setErroPerfil(erroNascimento);
      return;
    }
    const nascimentoISO = rascunho.nascimento ? brParaISO(rascunho.nascimento) ?? "" : "";
    const novoPerfil = { ...rascunho, nascimento: nascimentoISO };

    const supabase = createClient();

    if (!supabase || !usuario) {

      setPerfil(novoPerfil);
      setIdade(nascimentoISO ? calcularIdade(nascimentoISO) : null);
      setEditando(false);
      return;
    }

    setSalvandoPerfil(true);
    const { error } = await supabase.auth.updateUser({
      email: rascunho.email !== perfil.email ? rascunho.email : undefined,
      data: { nome: rascunho.nome, nascimento: nascimentoISO },
    });
    setSalvandoPerfil(false);

    if (error) {
      const nascimentoMudou = nascimentoISO !== perfil.nascimento;
      setErroPerfil(
        erroDeBancoNoAuth(error, nascimentoMudou) ? MENSAGEM_NASCIMENTO_RECUSADO : error.message,
      );
      return;
    }

    setPerfil(novoPerfil);
    setIdade(nascimentoISO ? calcularIdade(nascimentoISO) : null);
    setEditando(false);
  };

  const excluirConta = async () => {
    const supabase = createClient();

    if (!supabase || !usuario) {

      setExcluindo(false);
      setContaExcluida(true);
      return;
    }

    setErroExclusao(null);
    setExcluindoDeVerdade(true);

    const { data, error } = await supabase.functions.invoke("excluir-conta");

    setExcluindoDeVerdade(false);

    if (error || (data && "error" in data && data.error)) {
      setErroExclusao(
        "Não foi possível excluir a conta agora. Verifique se a Edge Function " +
          "\"excluir-conta\" já foi implantada no seu projeto Supabase (veja " +
          "SETUP_SUPABASE.md).",
      );
      return;
    }

    await supabase.auth.signOut();
    setExcluindo(false);
    setContaExcluida(true);
  };

  if (contaExcluida) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Conta excluída</h1>
        <p className="mt-3 text-[13px] text-muted-foreground">
          Sua conta e todos os seus dados (trilhas, metas, gastos, simulações e
          categorias) foram excluídos permanentemente. Obrigado por ter feito
          parte do Integra Jovem — você sempre será bem-vindo de volta. 💚
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <PageHeading
        eyebrow="Meu perfil"
        title={formatarNome(perfil.nome)}
        description={idade !== null ? `${idade} anos • ${perfil.email}` : perfil.email}
        action={
          <Button variant="outline" size="sm" onClick={() => { setRascunho({ ...perfil, nascimento: isoParaBR(perfil.nascimento) }); setMostrarExcluir(false); setEditando(true); }}>
            Editar perfil
          </Button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Trophy} label="Trilhas concluídas" value={`${concluidas}`} />
        <StatCard icon={BookOpen} label="Blocos concluídos" value={`${blocosConcluidos}`} />
        <StatCard icon={ListChecks} label="Trilhas em andamento" value={`${emAndamento.length}`} />
        <StatCard
          icon={Target}
          label="Quizzes respondidos"
          value={`${resultadosQuiz.length}`}
          hint={
            resultadosQuiz[0]
              ? `Último: ${resultadosQuiz[0].acertos}/${resultadosQuiz[0].total} acertos`
              : undefined
          }
        />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold">Trilhas em andamento</h2>
            <div className="mt-4 space-y-3">
              {emAndamento.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border p-5 text-[13px] text-muted-foreground">
                  Nenhuma trilha em andamento ainda. Que tal começar uma?
                </p>
              ) : (
                emAndamento.map(({ curso, percentual }) => (
                  <div key={curso.slug} className="rounded-2xl border border-border bg-surface p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
                      <h3 className="min-w-0 truncate text-[15px] font-bold">{curso.titulo}</h3>
                      <Tag variant="outline">{curso.categoria}</Tag>
                    </div>
                    <ProgressBar className="mt-4" value={percentual} label={`${percentual}% concluído`} />
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold">Minhas metas</h2>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Metas criadas por você, sem validação de ninguém.
            </p>
            <div className="mt-4 space-y-3">
              {metasState.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border p-5 text-[13px] text-muted-foreground">
                  Você ainda não criou nenhuma meta.
                </p>
              ) : (
                metasState.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-border bg-surface p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <h3 className="min-w-0 text-[14px] font-semibold">{m.titulo}</h3>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle-foreground">
                        {m.prazo}
                      </span>
                    </div>
                    <ProgressBar className="mt-4" value={m.progresso} label={`${m.progresso}%`} />
                  </div>
                ))
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setCriandoMeta(true)}
              >
                Criar nova meta
              </Button>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold">Diário de reflexão</h2>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Espaço privado. Ninguém além de você tem acesso ao que escreve aqui.
            </p>
            <div className="mt-4 space-y-3">
              {reflexoesState.map((r) => (
                <article key={r.id} className="rounded-2xl border border-border bg-surface-hi p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-semibold text-foreground">
                      {r.pergunta}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-subtle-foreground">
                      {new Date(r.criadoEm).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                    {r.texto}
                  </p>
                </article>
              ))}
              <div className="rounded-2xl border border-dashed border-border p-5">
                <p className="text-[13px] font-semibold">O que você aprendeu sobre si hoje?</p>
                <textarea
                  rows={3}
                  placeholder="Escreva livremente — só você vai ler."
                  value={textoReflexao}
                  onChange={(e) => setTextoReflexao(e.target.value)}
                  className="mt-3 w-full resize-none rounded-xl border border-border bg-background p-3 text-[13px] placeholder:text-subtle-foreground focus:border-primary focus:outline-none"
                />
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={salvarNovaReflexao}
                  disabled={salvandoReflexao || !textoReflexao.trim()}
                >
                  {salvandoReflexao ? "Salvando..." : "Salvar reflexão"}
                </Button>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-[15px] font-bold">Progresso por trilha</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {progressoPorTrilha.map(({ curso, percentual }) => (
                <li key={curso.slug}>
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate text-muted-foreground">{curso.titulo}</span>
                    <span className="font-mono text-[11px] text-subtle-foreground">
                      {percentual}%
                    </span>
                  </div>
                  <ProgressBar className="mt-1.5" size="sm" value={percentual} />
                </li>
              ))}
            </ul>
          </section>

        </aside>
      </div>

      <Dialog open={editando} onOpenChange={setEditando}>
        <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <form onSubmit={salvarPerfil} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="perfil-nome">Nome</Label>
              <Input
                id="perfil-nome"
                value={rascunho.nome}
                onChange={(e) => setRascunho((p) => ({ ...p, nome: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="perfil-email">E-mail</Label>
              <Input
                id="perfil-email"
                type="email"
                value={rascunho.email}
                onChange={(e) => setRascunho((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="perfil-nascimento">Data de nascimento</Label>
              <CampoDataNascimento
                id="perfil-nascimento"
                value={rascunho.nascimento}
                onChange={(valor) => {
                  setErroPerfil(null);
                  setRascunho((p) => ({ ...p, nascimento: valor }));
                }}
                invalid={Boolean(avisoNascimento(rascunho.nascimento))}
              />
              {avisoNascimento(rascunho.nascimento) ? (
                <p className="text-xs text-destructive">{avisoNascimento(rascunho.nascimento)}</p>
              ) : null}
            </div>
            {erroPerfil ? <p className="text-xs text-destructive">{erroPerfil}</p> : null}
            <p className="text-[11px] text-subtle-foreground">
              {usuario
                ? "Alterar o e-mail exige confirmação: o Supabase manda um link para o endereço novo antes de trocar de vez."
                : "Protótipo de front-end: a alteração fica só nesta sessão até você criar uma conta."}
            </p>
            <Button type="submit" className="w-full" disabled={salvandoPerfil}>
              {salvandoPerfil ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="text-[13px] font-bold">Privacidade e meus dados</h3>
            </div>
            <p className="mt-2 text-[12px] text-muted-foreground">
              Você controla o que fica salvo e pode apagar tudo quando quiser (LGPD).
            </p>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Exportar meus dados (LGPD)
            </Button>

            {!mostrarExcluir ? (
              <button
                type="button"
                onClick={() => setMostrarExcluir(true)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                aria-expanded={false}
              >
                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                Opções avançadas da conta
              </button>
            ) : (
              <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                  <p className="text-[12px] font-semibold text-destructive">Zona de risco</p>
                </div>
                <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                  Excluir a conta apaga para sempre seus dados, trilhas, metas e gastos. Não dá para desfazer.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => { setEditando(false); setExcluindo(true); }}
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  Excluir minha conta
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={excluindo} onOpenChange={setExcluindo}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir sua conta?</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-muted-foreground">
            Isso vai remover permanentemente sua conta e todos os seus dados. Essa ação não
            pode ser desfeita.
          </p>
          {erroExclusao ? (
            <p className="text-xs text-destructive">{erroExclusao}</p>
          ) : null}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setExcluindo(false)}
              disabled={excluindoDeVerdade}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={excluirConta}
              disabled={excluindoDeVerdade}
            >
              {excluindoDeVerdade ? "Excluindo..." : "Excluir conta"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={criandoMeta} onOpenChange={setCriandoMeta}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Criar nova meta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="meta-titulo">O que você quer alcançar?</Label>
              <Input
                id="meta-titulo"
                placeholder="Ex.: Guardar R$ 200 para o curso de inglês"
                value={novaMetaTitulo}
                onChange={(e) => setNovaMetaTitulo(e.target.value)}
                maxLength={80}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meta-prazo">Prazo (opcional)</Label>
              <Input
                id="meta-prazo"
                placeholder="Ex.: até dezembro, em 3 meses..."
                value={novaMetaPrazo}
                onChange={(e) => setNovaMetaPrazo(e.target.value)}
                maxLength={40}
              />
            </div>
            <Button
              className="w-full"
              onClick={salvarNovaMeta}
              disabled={salvandoMeta || !novaMetaTitulo.trim()}
            >
              {salvandoMeta ? "Salvando..." : "Criar meta"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
