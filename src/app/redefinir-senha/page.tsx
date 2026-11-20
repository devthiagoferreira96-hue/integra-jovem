"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button, ButtonLink } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type Estado = "verificando" | "pronto" | "link-invalido" | "concluido";

const TEMPO_LIMITE_MS = 4000;

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("verificando");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setEstado("link-invalido");
      return;
    }

    let resolvido = false;
    const marcarPronto = () => {
      resolvido = true;
      setEstado((atual) => (atual === "verificando" ? "pronto" : atual));
    };

    const { data } = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (evento === "PASSWORD_RECOVERY" || (evento === "SIGNED_IN" && sessao)) marcarPronto();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) marcarPronto();
    });

    const timer = window.setTimeout(() => {
      if (!resolvido) setEstado((atual) => (atual === "verificando" ? "link-invalido" : atual));
    }, TEMPO_LIMITE_MS);

    return () => {
      window.clearTimeout(timer);
      data.subscription.unsubscribe();
    };
  }, []);

  const salvar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);

    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);

    if (error) {
      setErro(
        /different from the old|same_password/i.test(error.message + (error.code ?? ""))
          ? "A senha nova precisa ser diferente da anterior."
          : /weak|pwned/i.test(error.message + (error.code ?? ""))
            ? "Essa senha é fraca ou já apareceu em vazamentos. Escolha outra."
            : /session|expired|jwt/i.test(error.message)
              ? "O link expirou. Peça um novo link de recuperação."
              : "Não foi possível salvar a senha nova. Tente novamente.",
      );
      return;
    }

    setEstado("concluido");
  };

  return (
    <div className="mx-auto max-w-md px-5 py-10 sm:py-16">
      <Link
        href="/entrar"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar para o login
      </Link>

      <div className="mt-10">
        <p className="eyebrow flex items-center gap-2.5">
          <span className="inline-block h-0.5 w-4 bg-primary" aria-hidden="true" />
          Recuperar acesso
        </p>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">Criar senha nova</h1>

        {estado === "verificando" ? (
          <p className="mt-8 text-[13px] text-muted-foreground">Verificando o link…</p>
        ) : null}

        {estado === "link-invalido" ? (
          <div className="mt-8 rounded-3xl border border-border bg-surface p-6 text-center sm:p-7">
            <p className="text-[14px] font-semibold">Link inválido ou expirado</p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              O link de recuperação só pode ser usado uma vez, vale por tempo limitado e precisa ser
              aberto no mesmo navegador em que você pediu. Peça um novo na tela de login.
            </p>
            <ButtonLink href="/entrar" variant="outline" size="sm" className="mt-5">
              Pedir novo link
            </ButtonLink>
          </div>
        ) : null}

        {estado === "concluido" ? (
          <div className="mt-8 rounded-3xl border border-border bg-surface p-6 text-center sm:p-7">
            <KeyRound className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
            <p className="mt-3 text-[14px] font-semibold">Senha alterada!</p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Você já está conectado com a senha nova.
            </p>
            <Button className="mt-5" size="sm" onClick={() => router.push("/financas")}>
              Continuar
            </Button>
          </div>
        ) : null}

        {estado === "pronto" ? (
          <form
            className="mt-8 space-y-5 rounded-3xl border border-border bg-surface p-6 sm:p-7"
            onSubmit={salvar}
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="nova-senha">Senha nova</Label>
              <div className="relative">
                <Input
                  id="nova-senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
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
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmar-senha">Confirmar senha nova</Label>
              <Input
                id="confirmar-senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repita a senha"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
            </div>

            {erro ? (
              <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive"
              >
                {erro}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar senha nova"}
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
