"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { primeiroNome as primeiroNomeFmt } from "@/lib/nome";
import { ContadorDias } from "@/components/layout/ContadorDias";
import { SeletorTema } from "@/components/layout/SeletorTema";
import { ButtonLink, Button } from "@/components/ui/AppButton";
import { useSessao } from "@/hooks/useSessao";
import { createClient } from "@/lib/supabase/client";

export const navItems = [
  { to: "/trilhas", label: "Trilhas" },
  { to: "/jornada", label: "Jornada" },
  { to: "/financas", label: "Finanças" },
  { to: "/glossario", label: "Glossário" },
  { to: "/perfil", label: "Perfil" },
] as const;

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const { usuario, carregando } = useSessao();

  const sair = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setOpen(false);
    router.push("/");
  };

  const nomeExibido =
    primeiroNomeFmt(usuario?.user_metadata?.nome as string | undefined) ||
    usuario?.email?.split("@")[0] ||
    "";

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-8xl items-center justify-between gap-2 px-4 py-3.5">
        <Link href="/" className="min-w-5 shrink-0" aria-label="Integra Jovem — início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-4 lg:flex" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`whitespace-nowrap rounded-lg px-8.5 py-3.5 text-sm transition-colors border border-border hover:bg-surface hover:text-foreground ${
                isActive(item.to) ? "bg-surface text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {usuario ? <ContadorDias className="hidden lg:inline-flex" /> : null}
          <SeletorTema />
          {carregando ? null : usuario ? (
            <>
              <span className="hidden text-sm text-muted-foreground lg:inline">
                Olá, {nomeExibido}
              </span>
              <Button size="sm" variant="ghost" className="hidden shrink-0 whitespace-nowrap lg:inline-flex" onClick={sair}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <ButtonLink
                href="/entrar"
                size="sm"
                variant="ghost"
                className="hidden whitespace-nowrap lg:inline-flex"
              >
                Entrar
              </ButtonLink>
              <ButtonLink
                href="/cadastro"
                size="sm"
                className="hidden whitespace-nowrap lg:inline-flex text-primary hover:text-primary/90"
                variant="outline"
              >
                Criar conta
              </ButtonLink>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-surface px-5 py-3 lg:hidden" aria-label="Menu">
          {usuario ? <ContadorDias className="mb-2" /> : null}
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm transition-colors hover:text-foreground ${
                isActive(item.to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            {carregando ? null : usuario ? (
              <Button variant="outline" size="sm" className="flex-1" onClick={sair}>
                Sair ({nomeExibido})
              </Button>
            ) : (
              <>
                <ButtonLink href="/entrar" variant="ghost" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                  Entrar
                </ButtonLink>
                <ButtonLink href="/cadastro" variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                  Criar conta
                </ButtonLink>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
