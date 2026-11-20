import Link from "next/link";

import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo showTagline />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Plataforma de instrução e preparo para a vida adulta. Instrução no lugar de
            vigilância — o progresso é seu, e você decide o que compartilhar.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em] text-subtle-foreground">
          <Link href="/trilhas" className="hover:text-primary">
            Trilhas
          </Link>
          <Link href="/jornada" className="hover:text-primary">
            Jornada
          </Link>
          <Link href="/financas" className="hover:text-primary">
            Finanças
          </Link>
         <Link href="/glossario" className="hover:text-primary">
            Glossário
          </Link>
          <Link href="/onboarding" className="hover:text-primary">
            Onboarding
          </Link>
          <span>TCC 2026 — protótipo</span>
        </div>
      </div>
    </footer>
  );
}
