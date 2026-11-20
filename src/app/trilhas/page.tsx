"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CursoCard } from "@/components/cursos/CursoCard";
import { PageHeading } from "@/components/layout/PageHeading";
import { categorias, cursos, type Categoria, type Nivel } from "@/data/content";
import { useSessao } from "@/hooks/useSessao";
import { calcularProgressoCurso, carregarProgresso, type ProgressoOverlay } from "@/lib/progresso";
import { carregarProgressoRemoto } from "@/lib/supabase/progresso-remoto";

const niveis: Nivel[] = ["Iniciante", "Intermediário", "Avançado"];

export default function TrilhasPage() {
  const { usuario, carregando: carregandoSessao } = useSessao();
  const userId = usuario?.id;
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "Todas">("Todas");
  const [nivel, setNivel] = useState<Nivel | "Todos">("Todos");
  const [apenasIniciadas, setApenasIniciadas] = useState(false);
  const [overlay, setOverlay] = useState<ProgressoOverlay>({});

  useEffect(() => {
    if (carregandoSessao) return;
    let cancelado = false;

    async function carregar() {
      const dados = userId ? await carregarProgressoRemoto(userId) : carregarProgresso();
      if (!cancelado) setOverlay(dados);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [userId, carregandoSessao]);

  const filtrados = useMemo(
    () =>
      cursos.filter((c) => {
        const okBusca =
          busca.trim() === "" ||
          `${c.titulo} ${c.descricao} ${c.categoria}`
            .toLowerCase()
            .includes(busca.toLowerCase());
        const okCategoria = categoria === "Todas" || c.categoria === categoria;
        const okNivel = nivel === "Todos" || c.nivel === nivel;

        const okIniciada = !apenasIniciadas || calcularProgressoCurso(c, overlay).percentual > 0;
        return okBusca && okCategoria && okNivel && okIniciada;
      }),
    [busca, categoria, nivel, apenasIniciadas, overlay],
  );

  const chip = (ativo: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
      ativo
        ? "border-primary bg-primary-dim text-primary-light"
        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <PageHeading
        eyebrow="Catálogo de trilhas"
        title="Escolha por onde começar"
        description="Você decide qual trilha iniciar — sem aprovação de ninguém. Conteúdo em fase de curadoria: os textos abaixo são exemplos de protótipo."
      />

      <div className="mt-8 space-y-5">
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Buscar trilha</span>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por tema, título ou categoria"
            className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm placeholder:text-subtle-foreground focus:border-primary focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={chip(categoria === "Todas")}
            onClick={() => setCategoria("Todas")}
          >
            Todas as áreas
          </button>
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              className={chip(categoria === c)}
              onClick={() => setCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle-foreground">
            Nível
          </span>
          <button
            type="button"
            className={chip(nivel === "Todos")}
            onClick={() => setNivel("Todos")}
          >
            Todos
          </button>
          {niveis.map((n) => (
            <button
              key={n}
              type="button"
              className={chip(nivel === n)}
              onClick={() => setNivel(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className={`${chip(apenasIniciadas)} sm:ml-auto`}
            onClick={() => setApenasIniciadas((v) => !v)}
          >
            Só as que eu comecei
          </button>
        </div>
      </div>

      <p className="mt-8 font-mono text-[11px] text-subtle-foreground">
        {filtrados.length} trilha{filtrados.length === 1 ? "" : "s"} encontrada
        {filtrados.length === 1 ? "" : "s"}
      </p>

      {filtrados.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((curso) => (
            <CursoCard key={curso.slug} curso={curso} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma trilha com esses filtros. Tente limpar a busca ou trocar a área.
          </p>
        </div>
      )}
    </div>
  );
}
