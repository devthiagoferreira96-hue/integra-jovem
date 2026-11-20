"use client";

import { useEffect } from "react";

export function TemaTrilha({ tema }: { tema: string }) {
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.trilha = tema;
    return () => {
      delete raiz.dataset.trilha;
    };
  }, [tema]);

  return null;
}
