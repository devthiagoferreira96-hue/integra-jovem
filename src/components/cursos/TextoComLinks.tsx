import Link from "next/link";
import { Fragment } from "react";

const referenciasFerramentas: { rotulo: string; href: string }[] = [
  { rotulo: "Controle de Gastos", href: "/financas" },
  { rotulo: "simulador de Orçamento", href: "/financas" },
  { rotulo: "Simulador de Orçamento", href: "/financas" },
  { rotulo: "Simulador de Juros Compostos", href: "/financas/simulacoes" },
  { rotulo: "simulador de Juros Compostos", href: "/financas/simulacoes" },
  { rotulo: "Juros Bancos CDI", href: "/financas/simulacoes" },
  { rotulo: "Carteira de Investimentos", href: "/financas/simulacoes" },
];

const padrao = new RegExp(
  `(${referenciasFerramentas
    .map((r) => r.rotulo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|")})`,
);

export function TextoComLinks({ texto }: { texto: string }) {
  const partes = texto.split(padrao);

  return (
    <>
      {partes.map((parte, i) => {
        const referencia = referenciasFerramentas.find((r) => r.rotulo === parte);
        if (!referencia) return <Fragment key={i}>{parte}</Fragment>;
        return (
          <Link
            key={i}
            href={referencia.href}
            className="font-semibold text-cyan-300 underline decoration-cyan-300/40 underline-offset-2 hover:text-cyan-200"
          >
            {parte}
          </Link>
        );
      })}
    </>
  );
}
