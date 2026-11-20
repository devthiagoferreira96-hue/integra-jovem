"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Map, User, Wallet } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home, exact: true },
  { to: "/trilhas", label: "Trilhas", icon: Compass, exact: false },
  { to: "/jornada", label: "Jornada", icon: Map, exact: false },
  { to: "/financas", label: "Finanças", icon: Wallet, exact: false },
  { to: "/perfil", label: "Perfil", icon: User, exact: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
      aria-label="Navegação inferior"
    >
      <ul className="mx-auto flex w-full max-w-lg items-stretch justify-around gap-1 px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
          return (
            <li key={to} className="min-w-0 flex-1">
              <Link
                href={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-center text-[10px] font-medium leading-tight transition-colors ${
                  active ? "text-primary" : "text-subtle-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
