"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAvatar } from "@/hooks/useAvatar";
import { carregarDadosXp } from "@/hooks/useXp";
import { useSessao } from "@/hooks/useSessao";
import {
  avaliarConquistas,
  carregarMarcosLocal,
  type ContextoConquistas,
} from "@/lib/conquistas";
import { carregarProgresso } from "@/lib/progresso";
import { carregarMarcosRemoto, registrarConquistasRemoto } from "@/lib/supabase/conquistas-remoto";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";
import { calcularXp } from "@/lib/xp";

export function useConquistas() {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const { avatar } = useAvatar();
  const [contexto, setContexto] = useState<ContextoConquistas>({
    overlay: {},
    primeirasTentativas: [],
    bonusConquistados: [],
    marcos: [],
    nivel: 1,
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const [overlay, dadosXp, marcos] = await Promise.all([
        userId ? carregarProgressoRemoto(userId) : Promise.resolve(carregarProgresso()),
        carregarDadosXp(userId),
        userId ? carregarMarcosRemoto(userId) : Promise.resolve(carregarMarcosLocal()),
      ]);
      if (cancelado) return;
      const { nivel } = calcularXp({ overlay, ...dadosXp });
      setContexto({ overlay, ...dadosXp, marcos, nivel });
      setCarregando(false);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  const lista = useMemo(
    () => avaliarConquistas({ ...contexto, avatarEscolhido: Boolean(avatar) }),
    [contexto, avatar],
  );

  const enviados = useRef<string>("");
  useEffect(() => {
    if (carregando || !userId) return;
    const ids = lista.filter((c) => c.conquistada).map((c) => c.id).sort();
    const chave = `${userId}|${ids.join(",")}`;
    if (ids.length === 0 || chave === enviados.current) return;
    enviados.current = chave;
    void registrarConquistasRemoto(userId, ids);
  }, [lista, carregando, userId]);

  return { conquistas: lista, carregando };
}
