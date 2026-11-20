"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
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

export function TurnstileWidget({ onVerify, onExpire }: Props) {
  const containerId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptPronto, setScriptPronto] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!scriptPronto || !siteKey || !containerRef.current || !window.turnstile) return;

    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      callback: onVerify,
      "expired-callback": onExpire,
    });

    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    };

  }, [scriptPronto, siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setScriptPronto(true)}
      />
      <div id={containerId} ref={containerRef} />
    </>
  );
}
