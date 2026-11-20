import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Lock,
  Map,
  ShieldCheck,
} from "lucide-react";

import { CursoCard } from "@/components/cursos/CursoCard";
import { CurvaCrescimento } from "@/components/layout/CurvaCrescimento";
import { ButtonLink } from "@/components/ui/AppButton";
import { ContinuarDeOndeParou, JornadaTeaserEtapas } from "@/components/jornada/HomeProgresso";
import { cursos } from "@/data/content";

export const metadata: Metadata = {
  title: "Integra Jovem — preparo para a vida adulta, no seu ritmo",
  description:
    "Trilhas curtas de educação financeira, carreira, autoconhecimento e bem-estar digital para adolescentes de 12 a 17 anos. Instrução no lugar de vigilância.",
  openGraph: {
    title: "Integra Jovem — preparo para a vida adulta",
    description:
      "Jornada gamificada com trilhas curtas sobre dinheiro, carreira, autoconhecimento e bem-estar digital.",
  },
};

const pilares = [
  {
    icon: BookOpen,
    titulo: "Microlearning de verdade",
    texto:
      "Blocos de 3 a 10 minutos, cada um terminando em uma atividade prática ou pergunta.",
  },
  {
    icon: Map,
    titulo: "Jornada visível",
    texto: "Uma trilha de evolução mostra onde você está, o que já fez e o próximo passo.",
  },
  {
    icon: Lock,
    titulo: "Diário privado",
    texto: "Suas reflexões são só suas. Nem responsável nem equipe têm acesso ao conteúdo.",
  },
  {
    icon: ShieldCheck,
    titulo: "Sem vigilância",
    texto:
      "Responsáveis acompanham progresso geral — nunca respostas individuais ou bloqueios.",
  },
];

export default function Home() {
  const destaques = cursos.filter((c) => c.destaque);

  return (
    <div>

      <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:pt-20">
        <span className="glow-blob -right-24 -top-24 h-72 w-72" aria-hidden="true" />
        <span
          className="glow-blob left-1/4 top-40 h-56 w-56 opacity-[0.07]"
          aria-hidden="true"
        />
        <CurvaCrescimento />

        <div className="relative mx-auto max-w-6xl">
          <p className="eyebrow flex items-center gap-2.5">
            <span className="inline-block h-0.5 w-4 bg-primary" aria-hidden="true" />
            Instrução, não vigilância
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Terminou a escola e não sabe o próximo passo?{" "}
            <span className="text-primary">A gente organiza a confusão com você.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            O Integra Jovem transforma o &ldquo;o que eu faço da minha vida&rdquo; em trilhas
            curtas sobre dinheiro, carreira, autoconhecimento e bem-estar digital. Você
            escolhe, você avança, você decide o que compartilhar.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/trilhas" size="lg">
              Ver trilhas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/onboarding" variant="outline" size="lg">
              Personalizar minha jornada
            </ButtonLink>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
            {[
              { valor: "5", label: "áreas de trilha" },
              { valor: "60+", label: "blocos curtos" },
              { valor: "12–17", label: "faixa de idade" },
              { valor: "0", label: "anúncios ou vigilância" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="font-display text-2xl font-extrabold sm:text-3xl">
                  {item.valor}
                </dt>
                <dd className="mt-1 text-[13px] text-muted-foreground">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-5 py-6">
        <div className="mx-auto max-w-6xl">
          <ContinuarDeOndeParou />
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Como funciona</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-extrabold sm:text-3xl">
            Uma plataforma feita para autonomia, não para controle
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pilares.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="card-surface p-6">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-[15px] font-bold">{titulo}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Catálogo</p>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Trilhas em destaque
              </h2>
            </div>
            <Link
              href="/trilhas"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((curso) => (
              <CursoCard key={curso.slug} curso={curso} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow">Trilha de evolução</p>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Seu progresso vira um caminho, não uma cobrança
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Cada etapa concluída libera a próxima e soma XP. Sem culpa por sequência
                perdida, sem notificação insistente — só a visão clara de onde você está.
              </p>
              <ButtonLink href="/jornada" className="mt-7">
                Continuar jornada
              </ButtonLink>
            </div>

            <JornadaTeaserEtapas />
          </div>
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center sm:p-14">
          <span className="glow-blob -top-20 left-1/2 h-64 w-64 -translate-x-1/2" aria-hidden="true" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-2xl font-extrabold sm:text-4xl">
              Comece pela pergunta que mais te trava hoje
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              Responda cinco perguntas rápidas e a gente monta uma jornada inicial com as
              trilhas que fazem sentido para o seu momento.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/onboarding" size="lg">
                Começar agora
              </ButtonLink>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
