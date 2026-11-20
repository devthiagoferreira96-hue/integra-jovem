"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, UserPlus } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { Button, ButtonLink } from "@/components/ui/AppButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CampoDataNascimento } from "@/components/ui/CampoDataNascimento";
import { Label } from "@/components/ui/label";
import { HCaptchaWidget, type HCaptchaWidgetHandle } from "@/components/HCaptchaWidget";
import { createClient } from "@/lib/supabase/client";
import {
  avisoNascimento,
  brParaISO,
  erroDeBancoNoAuth,
  mascararData,
  MENSAGEM_NASCIMENTO_RECUSADO,
  validarNascimento,
} from "@/lib/data-nascimento";

type Campo = "nome" | "email" | "nascimento" | "genero" | "senha" | "confirmarSenha" | "termos";

type Genero = "" | "masculino" | "feminino";

type FormState = {
  nome: string;
  email: string;
  nascimento: string;
  genero: Genero;
  senha: string;
  confirmarSenha: string;
  termos: boolean;
};

const estadoInicial: FormState = {
  nome: "",
  email: "",
  nascimento: "",
  genero: "",
  senha: "",
  confirmarSenha: "",
  termos: false,
};

function validar(form: FormState): Partial<Record<Campo, string>> {
  const erros: Partial<Record<Campo, string>> = {};

  if (form.nome.trim().length < 3) {
    erros.nome = "Digite seu nome completo.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    erros.email = "Digite um e-mail válido.";
  }
  if (!form.genero) {
    erros.genero = "Escolha uma opção.";
  }
  const erroNascimento = validarNascimento(form.nascimento);
  if (erroNascimento) {
    erros.nascimento = erroNascimento;
  }
  if (form.senha.length < 8) {
    erros.senha = "A senha precisa ter pelo menos 8 caracteres.";
  }
  if (form.confirmarSenha !== form.senha) {
    erros.confirmarSenha = "As senhas não coincidem.";
  }
  if (!form.termos) {
    erros.termos = "É preciso aceitar os termos para continuar.";
  }

  return erros;
}

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(estadoInicial);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erroSupabase, setErroSupabase] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptchaWidgetHandle>(null);
  const captchaExigido = Boolean(process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY);

  const atualizar = <K extends keyof FormState>(campo: K, valor: FormState[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: undefined }));
  };

  const atualizarNascimento = (valorDigitado: string) => {
    const valor = mascararData(valorDigitado);
    setForm((prev) => ({ ...prev, nascimento: valor }));
    setErros((prev) => ({ ...prev, nascimento: avisoNascimento(valor) ?? undefined }));
  };

  const enviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const proximosErros = validar(form);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    if (captchaExigido && !captchaToken) {
      setErroSupabase("Confirme que você não é um robô antes de continuar.");
      return;
    }

    setEnviando(true);
    setErroSupabase(null);

    const supabase = createClient();

    if (!supabase) {

      setTimeout(() => {
        setEnviando(false);
        setConcluido(true);
      }, 600);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {

        data: { nome: form.nome, nascimento: brParaISO(form.nascimento), genero: form.genero },
        captchaToken: captchaToken ?? undefined,
      },
    });

    setEnviando(false);

    if (error) {
      setCaptchaToken(null);
      captchaRef.current?.reset();
      setErroSupabase(
        error.message === "User already registered"
          ? "Já existe uma conta com este e-mail."
          : erroDeBancoNoAuth(error)
            ? MENSAGEM_NASCIMENTO_RECUSADO
            : error.message,
      );
      return;
    }

    if (data.session) {

      router.push("/onboarding");
      return;
    }

    setConcluido(true);
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

      {concluido ? (
        <div className="mt-10 rounded-3xl border border-border bg-surface p-8 text-center sm:p-10">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Check className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold">Confirme seu e-mail</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            Bem-vindo(a) ao Integra Jovem, {form.nome.split(" ")[0]}. Este projeto exige
            confirmação por e-mail: verifique sua caixa de entrada e clique no link antes
            de entrar. Depois disso, sua conta já libera o login normalmente.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/entrar">Já confirmei, entrar</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Voltar ao início
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <p className="eyebrow flex items-center gap-2.5">
            <span className="inline-block h-0.5 w-4 bg-primary" aria-hidden="true" />
            Novo por aqui
          </p>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            Crie sua conta
          </h1>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Leva menos de um minuto. Você decide o que compartilhar depois.
          </p>

          <form
            className="mt-8 space-y-5 rounded-3xl border border-border bg-surface p-6 sm:p-7"
            onSubmit={enviar}
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                autoComplete="name"
                placeholder="Como podemos te chamar?"
                value={form.nome}
                onChange={(e) => atualizar("nome", e.target.value)}
                aria-invalid={Boolean(erros.nome)}
              />
              {erros.nome ? <p className="text-xs text-destructive">{erros.nome}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={(e) => atualizar("email", e.target.value)}
                aria-invalid={Boolean(erros.email)}
              />
              {erros.email ? <p className="text-xs text-destructive">{erros.email}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nascimento">Data de nascimento</Label>
              <CampoDataNascimento
                id="nascimento"
                autoComplete="bday"
                value={form.nascimento}
                onChange={atualizarNascimento}
                invalid={Boolean(erros.nascimento)}
              />
              {erros.nascimento ? (
                <p className="text-xs text-destructive">{erros.nascimento}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Gênero</Label>
              <div className="flex gap-3">
                {([
                  { valor: "masculino", rotulo: "Masculino" },
                  { valor: "feminino", rotulo: "Feminino" },
                ] as const).map((op) => (
                  <label
                    key={op.valor}
                    className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                      form.genero === op.valor ? "border-primary bg-primary-dim font-semibold" : "border-input hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="genero"
                      value={op.valor}
                      checked={form.genero === op.valor}
                      onChange={() => {
                        setForm((prev) => ({ ...prev, genero: op.valor }));
                        setErros((prev) => ({ ...prev, genero: undefined }));
                      }}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    {op.rotulo}
                  </label>
                ))}
              </div>
              {erros.genero ? <p className="text-xs text-destructive">{erros.genero}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  value={form.senha}
                  onChange={(e) => atualizar("senha", e.target.value)}
                  aria-invalid={Boolean(erros.senha)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {erros.senha ? <p className="text-xs text-destructive">{erros.senha}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <Input
                id="confirmarSenha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repita a senha"
                value={form.confirmarSenha}
                onChange={(e) => atualizar("confirmarSenha", e.target.value)}
                aria-invalid={Boolean(erros.confirmarSenha)}
              />
              {erros.confirmarSenha ? (
                <p className="text-xs text-destructive">{erros.confirmarSenha}</p>
              ) : null}
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                <Checkbox
                  checked={form.termos}
                  onCheckedChange={(v) => atualizar("termos", v === true)}
                  aria-invalid={Boolean(erros.termos)}
                  className="mt-0.5"
                />
                Li e aceito os Termos de Uso e a Política de Privacidade.
              </label>
              {erros.termos ? <p className="text-xs text-destructive">{erros.termos}</p> : null}
            </div>

            {erroSupabase ? (
              <p className="text-xs text-destructive">{erroSupabase}</p>
            ) : null}

            <div className="flex justify-center">
              <HCaptchaWidget ref={captchaRef} onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
            </div>

            <Button type="submit" className="w-full" disabled={enviando}>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              {enviando ? "Criando conta..." : "Criar minha conta"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
