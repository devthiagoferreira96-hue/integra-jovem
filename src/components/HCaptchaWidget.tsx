"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

declare global {
  interface Window {
    hcaptcha?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type Props = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
};

export type HCaptchaWidgetHandle = {

  reset: () => void;
};

const SRC_HCAPTCHA = "https://js.hcaptcha.com/1/api.js?render=explicit";
const ID_SCRIPT = "hcaptcha-api";

const LIMITE_CARREGAMENTO_MS = 12_000;

type Estado = "carregando" | "pronto" | "erro";

export const HCaptchaWidget = forwardRef<HCaptchaWidgetHandle, Props>(function HCaptchaWidget(
  { onVerify, onExpire },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [estado, setEstado] = useState<Estado>("carregando");
  const [tentativa, setTentativa] = useState(0);
  const [emLocalhost, setEmLocalhost] = useState(false);

  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
  });

  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset: () => {
      try {
        if (widgetId.current) window.hcaptcha?.reset(widgetId.current);
      } catch {

      }
    },
  }));

  useEffect(() => {
    setEmLocalhost(["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname));
  }, []);

  useEffect(() => {
    if (!siteKey) return;
    if (window.hcaptcha) {
      setEstado("pronto");
      return;
    }
    setEstado("carregando");

    let script = document.getElementById(ID_SCRIPT) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = ID_SCRIPT;
      script.src = SRC_HCAPTCHA;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    const aoFalhar = () => setEstado("erro");
    script.addEventListener("error", aoFalhar);

    const inicio = Date.now();
    const intervalo = window.setInterval(() => {
      if (window.hcaptcha) {
        window.clearInterval(intervalo);
        setEstado("pronto");
      } else if (Date.now() - inicio > LIMITE_CARREGAMENTO_MS) {
        window.clearInterval(intervalo);
        setEstado("erro");
      }
    }, 100);

    return () => {
      window.clearInterval(intervalo);
      script?.removeEventListener("error", aoFalhar);
    };
  }, [siteKey, tentativa]);

  useEffect(() => {
    const container = containerRef.current;
    if (estado !== "pronto" || !siteKey || !container || !window.hcaptcha) return;

    try {
      container.innerHTML = "";
      widgetId.current = window.hcaptcha.render(container, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        "error-callback": () => onExpireRef.current?.(),
      });
    } catch (e) {
      console.error("[hcaptcha] falha ao desenhar o widget:", e);
      widgetId.current = null;
      setEstado("erro");
      return;
    }

    return () => {
      try {
        if (widgetId.current) window.hcaptcha?.remove(widgetId.current);
      } catch {

      }
      widgetId.current = null;
      container.innerHTML = "";
    };
  }, [estado, siteKey]);

  const tentarDeNovo = useCallback(() => {

    if (!window.hcaptcha) document.getElementById(ID_SCRIPT)?.remove();
    onExpireRef.current?.();
    setEstado("carregando");
    setTentativa((t) => t + 1);
  }, []);

  if (!siteKey) return null;

  return (
    <div className="flex flex-col items-center gap-2">

      <div ref={containerRef} className={estado === "pronto" ? "min-h-[78px]" : "hidden"} />

      {estado === "carregando" ? (
        <div className="grid h-[78px] w-[303px] max-w-full place-items-center rounded-md border border-border bg-surface-hi text-[12px] text-muted-foreground">
          Carregando verificação de segurança…
        </div>
      ) : null}

      {estado === "erro" ? (
        <div
          role="alert"
          className="w-[303px] max-w-full rounded-md border border-destructive/40 bg-destructive/10 p-3 text-center text-[12px] text-destructive"
        >
          <p>
            Não foi possível carregar a verificação de segurança. Confira sua internet e, se usar bloqueador
            de anúncios, libere este site.
          </p>
          <button
            type="button"
            onClick={tentarDeNovo}
            className="mt-2 rounded-md border border-destructive/50 px-3 py-1 font-semibold hover:bg-destructive/10"
          >
            Tentar de novo
          </button>
        </div>
      ) : null}

      {emLocalhost && process.env.NODE_ENV !== "production" ? (
        <p className="max-w-[303px] text-center text-[10.5px] leading-snug text-subtle-foreground">
          Dica de desenvolvimento: o hCaptcha não aceita &ldquo;localhost&rdquo;. Para testar o login no PC,
          acesse pelo endereço configurado no arquivo hosts (veja as instruções do projeto).
        </p>
      ) : null}
    </div>
  );
});
