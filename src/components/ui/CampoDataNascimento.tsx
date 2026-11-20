"use client";

import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  ajustarDataImpossivel,
  dataParaBR,
  limitesNascimento,
  mascararData,
  parseDataBR,
} from "@/lib/data-nascimento";

type Props = {
  id: string;
  value: string;
  onChange: (valor: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  autoComplete?: string;
};

type Visao = "dias" | "meses" | "anos";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const ANOS_POR_PAGINA = 16;

const fmtMesAno = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const fmtLongo = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const mesmoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function CampoDataNascimento({ id, value, onChange, invalid, disabled, autoComplete }: Props) {
  const [aberto, setAberto] = useState(false);
  const [visao, setVisao] = useState<Visao>("dias");
  const [ajuste, setAjuste] = useState<string | null>(null);
  const caixaRef = useRef<HTMLDivElement>(null);

  const { minima, maxima } = useMemo(() => limitesNascimento(), []);
  const selecionada = parseDataBR(value);

  const [mesVisivel, setMesVisivel] = useState<Date>(() => {
    const base = parseDataBR(value) ?? limitesNascimento().maxima;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [inicioAnos, setInicioAnos] = useState(() => mesVisivel.getFullYear() - (ANOS_POR_PAGINA - 1));

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (caixaRef.current && !caixaRef.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  const abrir = () => {
    const base = selecionada ?? maxima;
    setMesVisivel(new Date(base.getFullYear(), base.getMonth(), 1));
    setInicioAnos(base.getFullYear() - (ANOS_POR_PAGINA - 1));
    setVisao("dias");
    setAberto((v) => !v);
  };

  const digitar = (bruto: string) => {
    const mascarado = mascararData(bruto);
    const { valor, ajuste: aviso } = ajustarDataImpossivel(mascarado);
    setAjuste(aviso);
    onChange(valor);
  };

  const escolherDia = (data: Date) => {
    setAjuste(null);
    onChange(dataParaBR(data));
    setAberto(false);
  };

  const foraDoLimite = (data: Date) => data < minima || data > maxima;
  const anoForaDoLimite = (ano: number) => ano < minima.getFullYear() || ano > maxima.getFullYear();
  const mesForaDoLimite = (ano: number, mes: number) =>
    new Date(ano, mes + 1, 0) < minima || new Date(ano, mes, 1) > maxima;

  const dias = useMemo(() => {
    const primeiro = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth(), 1);
    const inicio = new Date(primeiro);
    inicio.setDate(1 - primeiro.getDay());
    return Array.from({ length: 42 }, (_, i) => new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i));
  }, [mesVisivel]);

  const mover = (passo: number) => {
    if (visao === "dias") setMesVisivel((m) => new Date(m.getFullYear(), m.getMonth() + passo, 1));
    else if (visao === "meses") setMesVisivel((m) => new Date(m.getFullYear() + passo, m.getMonth(), 1));
    else setInicioAnos((a) => a + passo * ANOS_POR_PAGINA);
  };

  const titulo =
    visao === "dias"
      ? fmtMesAno.format(mesVisivel)
      : visao === "meses"
        ? String(mesVisivel.getFullYear())
        : `${inicioAnos} – ${inicioAnos + ANOS_POR_PAGINA - 1}`;

  const hoje = new Date();

  return (
    <div ref={caixaRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/AAAA"
          maxLength={10}
          autoComplete={autoComplete}
          value={value}
          disabled={disabled}
          onChange={(e) => digitar(e.target.value)}
          aria-invalid={invalid}
          className="pr-11"
        />
        <button
          type="button"
          onClick={abrir}
          disabled={disabled}
          aria-label="Abrir calendário"
          aria-expanded={aberto}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-primary disabled:opacity-50"
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {ajuste ? <p className="mt-1 text-[11.5px] text-muted-foreground">{ajuste}</p> : null}

      {aberto ? (
        <div
          role="dialog"
          aria-label="Escolher data de nascimento"
          className="absolute left-0 right-0 z-50 mt-2 max-w-[340px] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl sm:left-auto sm:w-[340px]"
        >

          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <span className="truncate text-[14px] first-letter:uppercase">
              {selecionada ? fmtLongo.format(selecionada) : "Escolha sua data de nascimento"}
            </span>
            <button
              type="button"
              onClick={() => setVisao(visao === "anos" ? "dias" : "anos")}
              aria-label="Escolher o ano"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border hover:bg-surface-hi"
            >
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-between px-4 pb-1 pt-3">
            <button
              type="button"
              onClick={() => setVisao(visao === "dias" ? "meses" : "anos")}
              className="rounded-md px-1 text-[14px] font-bold hover:text-primary"
            >
              {titulo}
            </button>
            <div className="flex gap-1">
              <button type="button" onClick={() => mover(-1)} aria-label="Anterior" className="grid h-7 w-7 place-items-center rounded-md hover:bg-surface-hi">
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => mover(1)} aria-label="Próximo" className="grid h-7 w-7 place-items-center rounded-md hover:bg-surface-hi">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="px-3 pb-3">
            {visao === "dias" ? (
              <>
                <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-muted-foreground">
                  {DIAS_SEMANA.map((d, i) => (
                    <span key={i} className="py-2">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {dias.map((data) => {
                    const doMes = data.getMonth() === mesVisivel.getMonth();
                    const bloqueado = foraDoLimite(data);
                    const ativo = selecionada ? mesmoDia(data, selecionada) : false;
                    return (
                      <button
                        key={data.toISOString()}
                        type="button"
                        disabled={bloqueado}
                        onClick={() => escolherDia(data)}
                        aria-label={fmtLongo.format(data)}
                        aria-pressed={ativo}
                        className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                          ativo
                            ? "bg-primary font-bold text-primary-foreground"
                            : `${doMes ? "text-foreground" : "text-subtle-foreground"} hover:bg-surface-hi ${
                                mesmoDia(data, hoje) ? "ring-1 ring-primary" : ""
                              }`
                        }`}
                      >
                        {data.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}

            {visao === "meses" ? (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {MESES_CURTOS.map((nome, mes) => {
                  const ano = mesVisivel.getFullYear();
                  const ativo = selecionada?.getFullYear() === ano && selecionada.getMonth() === mes;
                  return (
                    <button
                      key={nome}
                      type="button"
                      disabled={mesForaDoLimite(ano, mes)}
                      onClick={() => {
                        setMesVisivel(new Date(ano, mes, 1));
                        setVisao("dias");
                      }}
                      className={`h-12 rounded-xl text-[13px] capitalize disabled:opacity-30 ${
                        ativo ? "bg-primary font-bold text-primary-foreground" : "hover:bg-surface-hi"
                      }`}
                    >
                      {nome}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {visao === "anos" ? (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {Array.from({ length: ANOS_POR_PAGINA }, (_, i) => inicioAnos + i).map((ano) => {
                  const ativo = selecionada?.getFullYear() === ano;
                  return (
                    <button
                      key={ano}
                      type="button"
                      disabled={anoForaDoLimite(ano)}
                      onClick={() => {
                        setMesVisivel(new Date(ano, mesVisivel.getMonth(), 1));
                        setVisao("meses");
                      }}
                      className={`h-12 rounded-xl text-[13px] disabled:opacity-30 ${
                        ativo ? "bg-primary font-bold text-primary-foreground" : "hover:bg-surface-hi"
                      }`}
                    >
                      {ano}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
