"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HCaptchaWidget, type HCaptchaWidgetHandle } from "@/components/HCaptchaWidget";
import { createClient, supabaseConfigurado } from "@/lib/supabase/client";

const MAX_TENTATIVAS = 5;

export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [recuperacaoEnviada, setRecuperacaoEnviada] = useState(false);
  const [erroRecuperacao, setErroRecuperacao] = useState<string | null>(null);
  const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false);
  const [captchaTokenRecuperacao, setCaptchaTokenRecuperacao] = useState<string | null>(null);
  const captchaRecuperacaoRef = useRef<HCaptchaWidgetHandle>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptchaWidgetHandle>(null);
  const captchaExigido = Boolean(process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY);

  const bloqueado = tentativas >= MAX_TENTATIVAS;

  const entrar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (bloqueado) return;

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    if (captchaExigido && !captchaToken) {
      setErro("Confirme que você não é um robô antes de continuar.");
      return;
    }

    setEnviando(true);

    const supabase = createClient();

    if (!supabase) {

      window.setTimeout(() => {
        setEnviando(false);
        setTentativas((v) => v + 1);
        setErro(
          tentativas + 1 >= MAX_TENTATIVAS
            ? "Muitas tentativas incorretas. Login bloqueado temporariamente."
            : "E-mail ou senha incorretos.",
        );
      }, 500);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
      options: { captchaToken: captchaToken ?? undefined },
    });

    setEnviando(false);

    if (error) {
      setCaptchaToken(null);
      captchaRef.current?.reset();
      setTentativas((v) => v + 1);
      setErro(
        tentativas + 1 >= MAX_TENTATIVAS
          ? "Muitas tentativas incorretas. Login bloqueado temporariamente."
          : "E-mail ou senha incorretos.",
      );
      return;
    }

    router.push("/financas");
  };

  const enviarRecuperacao = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErroRecuperacao(null);

    if (!emailRecuperacao) {
      setErroRecuperacao("Informe o e-mail da sua conta.");
      return;
    }

    if (captchaExigido && !captchaTokenRecuperacao) {
      setErroRecuperacao("Confirme que você não é um robô antes de continuar.");
      return;
    }

    const supabase = createClient();

    if (supabase) {
      setEnviandoRecuperacao(true);
      const { error } = await supabase.auth.resetPasswordForEmail(emailRecuperacao, {

        redirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/redefinir-senha` : undefined,
        captchaToken: captchaTokenRecuperacao ?? undefined,
      });
      setEnviandoRecuperacao(false);
      setCaptchaTokenRecuperacao(null);
      captchaRecuperacaoRef.current?.reset();

      if (error) {
        setErroRecuperacao(
          error.status === 429 || /rate limit/i.test(error.message)
            ? "Muitos pedidos em pouco tempo. Aguarde alguns minutos e tente de novo."
            : /captcha/i.test(error.message)
              ? "A verificação de robô falhou ou expirou. Marque o captcha de novo."
              : "Não foi possível enviar o e-mail agora. Tente novamente em instantes.",
        );
        return;
      }
    }

    setRecuperacaoEnviada(true);
  };

  return (
    <div className="mx-auto max-w-md px-5 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar ao início
      </Link>

      {modoRecuperar ? (
        <div className="mt-10">
          <p className="eyebrow flex items-center gap-2.5">
            <span className="inline-block h-0.5 w-4 bg-primary" aria-hidden="true" />
            Recuperar acesso
          </p>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            Esqueceu sua senha?
          </h1>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Informe o e-mail da sua conta. Se ele existir, enviamos um link para redefinir a
            senha.
          </p>

          {recuperacaoEnviada ? (
            <div className="mt-8 rounded-3xl border border-border bg-surface p-6 text-center sm:p-7">
              <p className="text-[14px] font-semibold">Verifique seu e-mail</p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Se {emailRecuperacao} estiver cadastrado, você vai receber as instruções em
                alguns minutos. Confira também a caixa de spam.
              </p>
              <p className="mt-2 text-[12px] text-subtle-foreground">
                Abra o link neste mesmo navegador: por segurança, ele só funciona onde o pedido
                foi feito.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => {
                  setModoRecuperar(false);
                  setRecuperacaoEnviada(false);
                }}
              >
                Voltar para o login
              </Button>
            </div>
          ) : (
            <form
              className="mt-8 space-y-5 rounded-3xl border border-border bg-surface p-6 sm:p-7"
              onSubmit={enviarRecuperacao}
              noValidate
            >
              <div className="space-y-1.5">
                <Label htmlFor="email-recuperacao">E-mail</Label>
                <Input
                  id="email-recuperacao"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                />
              </div>
              {erroRecuperacao ? (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive"
                >
                  {erroRecuperacao}
                </div>
              ) : null}

              <div className="flex justify-center">
                <HCaptchaWidget
                  ref={captchaRecuperacaoRef}
                  onVerify={setCaptchaTokenRecuperacao}
                  onExpire={() => setCaptchaTokenRecuperacao(null)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={enviandoRecuperacao}>
                {enviandoRecuperacao ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setModoRecuperar(false);
                  setErroRecuperacao(null);
                }}
                className="w-full text-center text-[13px] text-muted-foreground hover:text-primary"
              >
                Voltar para o login
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <p className="eyebrow flex items-center gap-2.5">
            <span className="inline-block h-0.5 w-4 bg-primary" aria-hidden="true" />
            Bem-vindo de volta
          </p>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">Entrar</h1>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Use o e-mail e a senha da sua conta.
          </p>

          <form
            className="mt-8 space-y-6 rounded-4xl border border-border bg-surface p-6 sm:p-5"
            onSubmit={entrar}
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={bloqueado}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>

              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pr-10"
                  disabled={bloqueado}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  disabled={bloqueado}
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setModoRecuperar(true)}
                  className="text-[12px] text-primary hover:text-primary-light"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            {erro ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive"
              >
                {bloqueado ? <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                <p>{erro}</p>
              </div>
            ) : null}

            <div className="flex justify-center">
              <HCaptchaWidget ref={captchaRef} onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
            </div>

            <Button type="submit" className="w-full" disabled={enviando || bloqueado}>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {bloqueado ? "Login bloqueado" : enviando ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-[13px] text-muted-foreground">
              Não tem conta?{" "}
              <Link href="/cadastro" className="font-semibold text-primary hover:text-primary-light">
                Criar conta
              </Link>
            </p>
          </form>

          <p className="mt-4 px-1 text-[11px] leading-relaxed text-subtle-foreground">
            {supabaseConfigurado()
              ? `Login autenticado via Supabase. O bloqueio após ${MAX_TENTATIVAS} tentativas (RF002) é uma trava adicional só nesta tela — o Supabase também aplica seus próprios limites de tentativas do lado do servidor.`
              : `Protótipo de front-end: nenhum projeto Supabase configurado neste ambiente, então este formulário está simulando o comportamento (defina NEXT_PUBLIC_SUPABASE_URL/ANON_KEY em .env.local para ligar a autenticação real). A regra de bloqueio após ${MAX_TENTATIVAS} tentativas (RF002) já está representada na interface.`}
          </p>
        </div>
      )}
    </div>
  );
}
