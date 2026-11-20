"use client";

import { BookOpen, Gift, Pencil, Sparkles, Trophy, UserRound } from "lucide-react";
import { useState } from "react";

import { AvatarIlustrado } from "@/components/avatar/AvatarIlustrado";
import { SeletorAvatar } from "@/components/avatar/SeletorAvatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAvatar } from "@/hooks/useAvatar";
import { useXp } from "@/hooks/useXp";
import { getAvatar } from "@/lib/avatares";
import { XP_POR_EXERCICIO } from "@/lib/exercicios";
import {
  bonusCatalogo,
  XP_POR_BLOCO,
  NIVEL_MAXIMO,
  XP_POR_NIVEL,
  XP_QUIZ_TUDO_CERTO,
  XP_QUIZ_UM_ERRO,
} from "@/lib/xp";

export function CartaoXp({ className = "mt-4" }: { className?: string }) {
  const { total, nivel, xpNoNivel, blocos, quizzes, bonus, exercicios, carregando } = useXp();
  const { avatar, escolher, salvando, erro: erroAvatar, carregando: carregandoAvatar } = useAvatar();
  const [escolhendo, setEscolhendo] = useState(false);
  const infoAvatar = getAvatar(avatar);

  const xpQuizzes = quizzes.reduce((s, q) => s + q.xp, 0);
  const xpBonus = bonus.reduce((s, b) => s + b.xp, 0) + exercicios.xp;
  const faltam = XP_POR_NIVEL - xpNoNivel;

  return (
    <section
      aria-label="Sua experiência"
      className={`rounded-2xl border border-primary/30 bg-primary-dim p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => setEscolhendo((v) => !v)}
            aria-expanded={escolhendo}
            aria-label={avatar ? "Trocar avatar" : "Escolher avatar"}
            className="group relative shrink-0"
          >
            {avatar ? (
              <AvatarIlustrado
                id={avatar}
                titulo={infoAvatar?.nome}
                className="h-20 w-20 rounded-full ring-2 ring-primary/60 sm:h-24 sm:w-24"
              />
            ) : (
              <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-primary/60 bg-surface text-primary sm:h-24 sm:w-24">
                <UserRound className="h-8 w-8" aria-hidden="true" />
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">
              {carregandoAvatar
                ? "…"
                : infoAvatar
                  ? infoAvatar.nome
                  : "Escolha seu avatar"}
            </p>
            <p className="truncate text-[12px] text-muted-foreground">
              {infoAvatar ? infoAvatar.frase : "Toque no círculo para escolher"}
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Experiência
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold">
            {carregando ? "–" : total} <span className="text-lg text-primary">XP</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle-foreground">
            Nível
          </p>
          <p className="font-display text-3xl font-extrabold">{carregando ? "–" : nivel}</p>
        </div>
      </div>

      {escolhendo ? (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-[12px] font-semibold text-muted-foreground">
            Escolha quem vai te representar na jornada
          </p>
          <SeletorAvatar
            selecionado={avatar}
            desabilitado={salvando}
            onEscolher={(id) => {
              void escolher(id);
              setEscolhendo(false);
            }}
          />
          {erroAvatar ? <p className="mt-3 text-[12px] text-destructive">{erroAvatar}</p> : null}
        </div>
      ) : null}

      <ProgressBar
        className="mt-4"
        size="md"
        value={carregando ? 0 : Math.round((xpNoNivel / XP_POR_NIVEL) * 100)}
        label={
          carregando
            ? "Carregando sua experiência…"
            : nivel >= NIVEL_MAXIMO
              ? `Nível máximo! Você completou toda a jornada 🏆`
              : `${xpNoNivel} / ${XP_POR_NIVEL} XP • faltam ${faltam} XP para o nível ${nivel + 1} (máximo: ${NIVEL_MAXIMO})`
        }
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
          <p className="mt-2 font-display text-lg font-extrabold">{carregando ? "–" : blocos.xp} XP</p>
          <p className="text-[12px] text-muted-foreground">
            {blocos.quantidade} {blocos.quantidade === 1 ? "bloco lido" : "blocos lidos"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />
          <p className="mt-2 font-display text-lg font-extrabold">{carregando ? "–" : xpQuizzes} XP</p>
          <p className="text-[12px] text-muted-foreground">
            {quizzes.length} {quizzes.length === 1 ? "quiz feito" : "quizzes feitos"} (1ª tentativa)
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <Gift className="h-4 w-4 text-primary" aria-hidden="true" />
          <p className="mt-2 font-display text-lg font-extrabold">{carregando ? "–" : xpBonus} XP</p>
          <p className="text-[12px] text-muted-foreground">
            {exercicios.quantidade} {exercicios.quantidade === 1 ? "exercício" : "exercícios"} +{" "}
            {bonus.length} {bonus.length === 1 ? "bônus" : "bônus"}
          </p>
        </div>
      </div>

      <details className="mt-4 text-[12px] text-muted-foreground">
        <summary className="cursor-pointer font-semibold text-primary-light">Como ganhar XP</summary>
        <ul className="mt-2 space-y-1 pl-4">
          <li>• Cada bloco de trilha concluído: +{XP_POR_BLOCO} XP</li>
          <li>
            • Quiz, na primeira tentativa: acertando todas +{XP_QUIZ_TUDO_CERTO} XP, errando só uma +
            {XP_QUIZ_UM_ERRO} XP
          </li>
          <li>
            • Exercício prático de um bloco (Controle de Gastos ou simuladores): +{XP_POR_EXERCICIO}{" "}
            XP cada
          </li>
          {Object.values(bonusCatalogo).map((b) => (
            <li key={b.id}>
              • Bônus “{b.titulo}”: +{b.xp} XP
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
