"use client";

import { Check } from "lucide-react";

import { AvatarIlustrado } from "@/components/avatar/AvatarIlustrado";
import { avatares, gruposAvatar, type AvatarId } from "@/lib/avatares";

type Props = {
  selecionado: AvatarId | null;
  onEscolher: (id: AvatarId) => void;
  desabilitado?: boolean;
};

export function SeletorAvatar({ selecionado, onEscolher, desabilitado }: Props) {
  return (
    <div role="radiogroup" aria-label="Escolha seu avatar" className="space-y-4">
      {gruposAvatar.map((grupo) => (
        <div key={grupo}>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle-foreground">
            {grupo}
          </p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {avatares
              .filter((a) => a.grupo === grupo)
              .map((a) => {
                const ativo = a.id === selecionado;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={ativo}
                    disabled={desabilitado}
                    onClick={() => onEscolher(a.id)}
                    title={`${a.nome}: ${a.frase}`}
                    className={`group relative rounded-full p-0.5 transition-transform hover:scale-105 disabled:opacity-60 ${
                      ativo ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
                  >
                    <AvatarIlustrado id={a.id} titulo={a.nome} className="block h-auto w-full" />
                    {ativo ? (
                      <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                    ) : null}
                    <span className="sr-only">{a.nome}</span>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
