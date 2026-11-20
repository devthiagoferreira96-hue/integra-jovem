"use client";

import { useCallback, useEffect, useState } from "react";

import { useSessao } from "@/hooks/useSessao";
import { avatarValido, type AvatarId } from "@/lib/avatares";
import { createClient } from "@/lib/supabase/client";

const CHAVE_AVATAR = "integra-jovem:avatar";

function lerLocal(): AvatarId | null {
  if (typeof window === "undefined") return null;
  try {
    const valor = window.localStorage.getItem(CHAVE_AVATAR);
    return avatarValido(valor) ? valor : null;
  } catch {
    return null;
  }
}

export function useAvatar() {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const doPerfil = usuario?.user_metadata?.avatar as unknown;

  useEffect(() => {
    if (carregandoSessao) return;
    setAvatar(usuario ? (avatarValido(doPerfil) ? doPerfil : null) : lerLocal());
  }, [usuario, doPerfil, carregandoSessao]);

  const escolher = useCallback(
    async (novo: AvatarId) => {
      setErro(null);
      const anterior = avatar;
      setAvatar(novo);

      if (!usuario) {
        try {
          window.localStorage.setItem(CHAVE_AVATAR, novo);
        } catch {

        }
        return;
      }

      const supabase = createClient();
      if (!supabase) return;
      setSalvando(true);

      const { error } = await supabase.auth.updateUser({ data: { avatar: novo } });
      setSalvando(false);
      if (error) {
        setAvatar(anterior);
        setErro("Não foi possível salvar o avatar agora. Tente de novo.");
      }
    },
    [avatar, usuario],
  );

  return { avatar, escolher, salvando, erro, carregando: carregandoSessao };
}
