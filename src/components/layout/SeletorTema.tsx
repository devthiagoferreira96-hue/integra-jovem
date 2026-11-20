"use client";

import { Moon, Palette, SlidersHorizontal, Sun, SunDim } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import * as tema from "@/lib/tema";
import {
  aplicarCores,
  CORES_PADRAO,
  DEGRADE_PADRAO,
  lerCoresSalvas,
  salvarCores,
  TONS_FRIOS,
  TONS_FUNDO,
  TONS_QUENTES,
  type DegradeFundo,
  type PreferenciaCores,
} from "@/lib/tema-cores";

type Tema = "dark" | "light";

const CHAVE_TEMA = tema.CHAVE_TEMA ?? "integra-jovem:tema";
const CHAVE_LUZ = (tema as { CHAVE_LUZ?: string }).CHAVE_LUZ ?? "integra-jovem:luz";
const LUZ_MINIMA = (tema as { LUZ_MINIMA?: number }).LUZ_MINIMA ?? 30;
const LUZ_MAXIMA = (tema as { LUZ_MAXIMA?: number }).LUZ_MAXIMA ?? 100;

const limitarLuz = (valor: unknown): number => {
  const n = Number(valor);
  return Number.isFinite(n) ? Math.min(LUZ_MAXIMA, Math.max(LUZ_MINIMA, Math.round(n))) : LUZ_MAXIMA;
};

export function SeletorTema({ className = "" }: { className?: string }) {
  const [temaAtual, setTemaAtual] = useState<Tema>("dark");
  const [luz, setLuz] = useState<number>(LUZ_MAXIMA);
  const [cores, setCores] = useState<PreferenciaCores>(CORES_PADRAO);
  const [ajusteAberto, setAjusteAberto] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTemaAtual(document.documentElement.dataset.theme === "light" ? "light" : "dark");

    delete document.documentElement.dataset.daltonismo;
    try {
      localStorage.removeItem("integra-jovem:daltonismo");
    } catch {

    }

    const salvas = { ...lerCoresSalvas(), destaque: CORES_PADRAO.destaque };
    setCores(salvas);
    aplicarCores(salvas);
    salvarCores(salvas);
    try {
      const salva = localStorage.getItem(CHAVE_LUZ);
      if (salva !== null) {
        const valor = limitarLuz(salva);
        setLuz(valor);

        document.documentElement.style.setProperty("--luz", String(valor));
      }
    } catch {

    }
  }, []);

  useEffect(() => {
    if (!ajusteAberto) return;
    const fora = (e: MouseEvent) => {
      if (caixaRef.current && !caixaRef.current.contains(e.target as Node)) setAjusteAberto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAjusteAberto(false);
    };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [ajusteAberto]);

  const alternar = () => {
    const novo: Tema = temaAtual === "dark" ? "light" : "dark";
    setTemaAtual(novo);
    if (novo === "light") document.documentElement.dataset.theme = "light";
    else {
      delete document.documentElement.dataset.theme;
      setAjusteAberto(false);
    }
    try {
      localStorage.setItem(CHAVE_TEMA, novo);
    } catch {

    }
  };

  const mudarLuz = (bruto: unknown) => {
    const valor = limitarLuz(bruto);
    setLuz(valor);
    document.documentElement.style.setProperty("--luz", String(valor));
    try {
      localStorage.setItem(CHAVE_LUZ, String(valor));
    } catch {

    }
  };

  const mudarCores = (parcial: Partial<PreferenciaCores>) => {
    const nova = { ...cores, ...parcial };
    setCores(nova);
    aplicarCores(nova);
    salvarCores(nova);
  };

  const degrade: DegradeFundo = cores.degrade ?? DEGRADE_PADRAO;
  const mudarDegrade = (parcial: Partial<DegradeFundo>) => mudarCores({ degrade: { ...degrade, ...parcial } });

  const voltarAoPadrao = () => {
    mudarLuz(LUZ_MAXIMA);
    mudarCores({ ...CORES_PADRAO, degrade: DEGRADE_PADRAO });
  };

  const claro = temaAtual === "light";
  const tomPorId = (id: string) => TONS_FUNDO.find((t) => t.id === id) ?? TONS_FUNDO[0];

  const misturar = (cor: string, escuro: string) => `color-mix(in srgb, ${cor} ${limitarLuz(luz)}%, ${escuro})`;
  const percentual = Math.round(((luz - LUZ_MINIMA) / (LUZ_MAXIMA - LUZ_MINIMA)) * 100);

  return (
    <div ref={caixaRef} className={`relative flex items-center gap-1.5 ${className}`}>
      {claro ? (
        <button
          type="button"
          onClick={() => setAjusteAberto((v) => !v)}
          aria-label="Ajustar a luz e a cor de fundo do tema claro"
          aria-expanded={ajusteAberto}
          title="Luz e cor de fundo"
          className={`grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-surface hover:text-foreground ${
            ajusteAberto ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}

      <button
        type="button"
        onClick={alternar}
        aria-label={claro ? "Mudar para o tema escuro" : "Mudar para o tema claro"}
        title={claro ? "Tema escuro" : "Tema claro"}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
      >
        {claro ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
      </button>

      {claro && ajusteAberto ? (
        <div
          role="dialog"
          aria-label="Aparência do tema claro"
          style={{ maxHeight: "min(75vh, 34rem)" }}
          className="fixed inset-x-3 top-[4.25rem] z-[60] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:w-80"
        >
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-[13px] font-bold">Aparência</p>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="intensidade-luz" className="text-[12px] font-semibold">
              Luz
            </label>
            <span className="font-mono text-[11px] text-muted-foreground">{percentual}%</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <SunDim className="h-4 w-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
            <input
              id="intensidade-luz"
              type="range"
              min={LUZ_MINIMA}
              max={LUZ_MAXIMA}
              step={1}
              value={limitarLuz(luz)}
              onChange={(e) => mudarLuz(e.target.value)}
              aria-label="Intensidade da luz"
              className="w-full accent-[var(--primary)]"
            />
            <Sun className="h-4 w-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-[12px] font-semibold">Cor de fundo</p>
            <div className="flex rounded-lg border border-border p-0.5 text-[10.5px]">
              {[
                { valor: false, rotulo: "Uma cor" },
                { valor: true, rotulo: "Degradê" },
              ].map((op) => (
                <button
                  key={op.rotulo}
                  type="button"
                  onClick={() => mudarDegrade({ ativo: op.valor })}
                  aria-pressed={degrade.ativo === op.valor}
                  className={`rounded-md px-2 py-0.5 ${
                    degrade.ativo === op.valor ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {op.rotulo}
                </button>
              ))}
            </div>
          </div>

          {degrade.ativo ? (
            <>

              <div
                aria-hidden="true"
                className="mt-2.5 h-14 rounded-lg border border-border"
                style={{
                  background: `linear-gradient(180deg, ${misturar(tomPorId(degrade.topo).fundo, "#a9b3ae")}, ${misturar(
                    tomPorId(degrade.final).fundo,
                    "#a9b3ae",
                  )})`,
                }}
              />
              {[
                { rotulo: "Topo da página (frio)", ids: TONS_FRIOS, campo: "topo" as const },
                { rotulo: "Final da página (quente)", ids: TONS_QUENTES, campo: "final" as const },
              ].map((grupo) => (
                <div key={grupo.campo} className="mt-3">
                  <p className="text-[11px] text-muted-foreground">{grupo.rotulo}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {grupo.ids.map((id) => {
                      const t = tomPorId(id);
                      const ativo = degrade[grupo.campo] === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => mudarDegrade({ [grupo.campo]: id })}
                          aria-pressed={ativo}
                          className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10.5px] ${
                            ativo ? "border-2 border-primary font-semibold" : "border-border"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-3 w-3 rounded-full border border-border"
                            style={{ background: t.superficieAlta }}
                          />
                          {t.nome.replace(" (padrão)", "")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="mt-2 h-1.5 rounded-full"
                style={{ background: `linear-gradient(90deg, ${TONS_FUNDO.map((t) => t.superficieAlta).join(", ")})` }}
              />
              <div className="mt-1 flex justify-between text-[10px] text-subtle-foreground">
                <span>frio</span>
                <span>quente</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {TONS_FUNDO.map((t) => {
                  const ativo = t.id === cores.fundo;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => mudarCores({ fundo: t.id })}
                      aria-pressed={ativo}
                      title={t.nome}
                      className="text-center"
                    >
                      <span
                        className={`block overflow-hidden rounded-lg border ${ativo ? "border-2 border-primary" : "border-border"}`}
                      >
                        <span className="block h-2.5" style={{ background: misturar(t.superficieAlta, "#a3ada8") }} />
                        <span className="block h-6" style={{ background: misturar(t.fundo, "#a9b3ae") }} />
                      </span>
                      <span className={`mt-1 block truncate text-[10.5px] ${ativo ? "font-semibold" : "text-muted-foreground"}`}>
                        {t.nome.replace(" (padrão)", "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {luz !== LUZ_MAXIMA || cores.fundo !== CORES_PADRAO.fundo || degrade.ativo ? (
            <button type="button" onClick={voltarAoPadrao} className="mt-4 text-[11px] font-semibold text-primary hover:underline">
              Voltar ao padrão
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
