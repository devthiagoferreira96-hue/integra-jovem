"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { Button, ButtonLink } from "@/components/ui/AppButton";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Passo = {
  pergunta: string;
  ajuda: string;
  opcoes: string[];
  multipla: boolean;
};

const passos: Passo[] = [
  {
    pergunta: "O que mais te trava hoje?",
    ajuda: "Escolha quantas fizerem sentido — dá para mudar depois.",
    opcoes: [
      "Não sei para onde meu dinheiro vai",
      "Dinheiro nunca sobra",
      "Compro por impulso e depois me arrependo",
      "Não sei lidar com burocracia adulta",
      "Tenho medo de cair em golpes",
    ],
    multipla: true,
  },
  {
    pergunta: "Quais áreas te interessam?",
    ajuda: "Isso define as primeiras trilhas sugeridas.",
    opcoes: [
      "Educação Financeira",
      "Carreira e Futuro",
      "Poupança e investimentos",
      "Vida Prática",
      "Bem-Estar Digital",
    ],
    multipla: true,
  },
  {
    pergunta: "Quanto tempo você tem por dia?",
    ajuda: "Sem cobrança: é só para dimensionar os blocos.",
    opcoes: ["Até 5 minutos", "10 a 15 minutos", "Meia hora ou mais", "Varia muito"],
    multipla: false,
  },
  {
    pergunta: "Qual seu objetivo nos próximos 3 meses?",
    ajuda: "Isso vira sua primeira meta pessoal.",
    opcoes: [
      "Guardar dinheiro para algo",
      "Escolher um caminho de carreira",
      "Montar minha reserva de emergência",
      "Organizar meu orçamento do mês",
    ],
    multipla: false,
  },
];

export default function OnboardingPage() {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string[]>>({});
  const finalizado = indice >= passos.length;

  const passo = passos[Math.min(indice, passos.length - 1)]!;
  const selecionadas = respostas[indice] ?? [];

  const alternar = (opcao: string) => {
    setRespostas((prev) => {
      const atual = prev[indice] ?? [];
      if (!passo.multipla) return { ...prev, [indice]: [opcao] };
      return {
        ...prev,
        [indice]: atual.includes(opcao)
          ? atual.filter((o) => o !== opcao)
          : [...atual, opcao],
      };
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar ao início
      </Link>

      {finalizado ? (
        <div className="mt-10 rounded-3xl border border-border bg-surface p-8 text-center sm:p-10">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Check className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold">Jornada montada</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Com base nas suas respostas, sugerimos começar pela trilha Seu primeiro dinheiro. Você pode trocar
            de trilha quando quiser.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/jornada">Ver minha jornada</ButtonLink>
            <ButtonLink href="/trilhas" variant="outline">
              Explorar trilhas
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <p className="eyebrow">
            Passo {indice + 1} de {passos.length}
          </p>
          <ProgressBar className="mt-4" value={(indice / passos.length) * 100} size="md" />

          <h1 className="mt-8 text-2xl font-extrabold leading-tight sm:text-3xl">
            {passo.pergunta}
          </h1>
          <p className="mt-3 text-[13px] text-muted-foreground">{passo.ajuda}</p>

          <div className="mt-7 space-y-3">
            {passo.opcoes.map((opcao) => {
              const ativa = selecionadas.includes(opcao);
              return (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => alternar(opcao)}
                  aria-pressed={ativa}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left text-[14px] transition-all ${
                    ativa
                      ? "border-primary bg-primary-dim text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="min-w-0">{opcao}</span>
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      ativa ? "border-primary bg-primary" : "border-border"
                    }`}
                    aria-hidden="true"
                  >
                    {ativa ? <Check className="h-3 w-3 text-primary-foreground" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-9 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setIndice((i) => Math.max(0, i - 1))}
              disabled={indice === 0}
            >
              Voltar
            </Button>
            <Button
              onClick={() => setIndice((i) => i + 1)}
              disabled={selecionadas.length === 0}
            >
              {indice === passos.length - 1 ? "Finalizar" : "Continuar"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
