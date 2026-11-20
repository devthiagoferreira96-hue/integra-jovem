"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { CarteiraInvestimentos } from "@/components/financas/CarteiraInvestimentos";
import { JurosBancosSimulador } from "@/components/financas/JurosBancosSimulador";
import { JurosCompostosSimulador } from "@/components/financas/JurosCompostosSimulador";
import { ButtonLink } from "@/components/ui/AppButton";
import { PageHeading } from "@/components/layout/PageHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SimulacoesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <Link
        href="/financas"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar para Finanças
      </Link>

      <div className="mt-6">
        <PageHeading
          eyebrow="Educação Financeira"
          title="Simuladores"
          description="Três simuladores práticos: juros compostos, juros de bancos ligados ao CDI/CDB e carteira de investimentos. Sempre com valores fictícios ou informados por você — sem conexão com bancos."
          action={
            <ButtonLink href="/financas" variant="outline" size="sm">
              Controle de gastos
            </ButtonLink>
          }
        />
      </div>

      <Tabs defaultValue="juros" className="mt-8">
        <TabsList className="h-auto flex-wrap gap-1 bg-surface p-1">
          <TabsTrigger value="juros">Juros compostos</TabsTrigger>
          <TabsTrigger value="juros-bancos">Juros Bancos CDI</TabsTrigger>
          <TabsTrigger value="carteira">Carteira de investimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="juros" className="mt-6">
          <Suspense
            fallback={<p className="text-[13px] text-muted-foreground">Carregando simulador...</p>}
            >
          <JurosCompostosSimulador />
          </Suspense>
        </TabsContent>

        <TabsContent value="juros-bancos" className="mt-6">
          <JurosBancosSimulador />
        </TabsContent>

        <TabsContent value="carteira" className="mt-6">
          <CarteiraInvestimentos />
        </TabsContent>
      </Tabs>
    </div>
  );
}
