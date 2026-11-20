"use client";

import { Database, Trash2 } from "lucide-react";
import { useState } from "react";

import { PageHeading } from "@/components/layout/PageHeading";
import { Button, ButtonLink } from "@/components/ui/AppButton";
import { useSessao } from "@/hooks/useSessao";
import { apagarDadosDemo, carregarDadosDemo } from "@/lib/dados-demo";

export default function DemoPage() {
  const { usuario } = useSessao();
  const [status, setStatus] = useState<"" | "carregado" | "apagado">("");

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <PageHeading
        eyebrow="Protótipo · teste"
        title="Dados de demonstração"
        description="Preenche Finanças e o progresso das trilhas com dados fictícios, incluindo valores altos e nomes longos, para conferir como as telas ficam no celular."
      />

      {usuario ? (
        <p className="mt-6 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-4 text-[13px] text-foreground">
          Você está logado. Com login, Finanças mostra os dados da sua conta, não os de demonstração. Para
          ver os dados fictícios, saia da conta. Nada é gravado no banco por esta página.
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <Database className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="mt-3 text-[15px] font-bold">Carregar dados fictícios</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            12 meses de gastos e renda, categorias com nomes longos, um gasto de R$ 98.765,43, renda de
            R$ 123.456,78 no mês atual e progresso parcial nas trilhas. Substitui os dados locais atuais.
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              carregarDadosDemo();
              setStatus("carregado");
            }}
          >
            Carregar dados
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <Trash2 className="h-5 w-5 text-destructive" aria-hidden="true" />
          <h2 className="mt-3 text-[15px] font-bold">Apagar dados locais</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Remove gastos, rendas, categorias, meta da reserva e progresso das trilhas salvos neste
            dispositivo.
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => {
              apagarDadosDemo();
              setStatus("apagado");
            }}
          >
            Apagar dados
          </Button>
        </div>
      </div>

      {status ? (
        <p role="status" className="mt-6 text-[13px] text-muted-foreground">
          {status === "carregado"
            ? "Dados fictícios carregados. Abra as páginas abaixo para conferir."
            : "Dados locais apagados."}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <ButtonLink href="/financas" variant="outline" size="sm">
          Finanças
        </ButtonLink>
        <ButtonLink href="/financas/simulacoes" variant="outline" size="sm">
          Simuladores
        </ButtonLink>
        <ButtonLink href="/trilhas" variant="outline" size="sm">
          Trilhas
        </ButtonLink>
        <ButtonLink href="/jornada" variant="outline" size="sm">
          Jornada
        </ButtonLink>
        <ButtonLink href="/perfil" variant="outline" size="sm">
          Perfil
        </ButtonLink>
      </div>
    </div>
  );
}
