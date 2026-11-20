"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

type EstadoSessao = {
  sessao: Session | null;
  usuario: User | null;

  carregando: boolean;
};

export function useSessao(): EstadoSessao {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      setSessao(null);
      setCarregando(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });

    const { data: assinatura } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao);
    });

    return () => assinatura.subscription.unsubscribe();
  }, []);

  return { sessao, usuario: sessao?.user ?? null, carregando };
}
