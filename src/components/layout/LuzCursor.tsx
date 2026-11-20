"use client";

import { useEffect, useRef } from "react";

const SELETOR_CARDS = [
  ".card-surface",
  "[data-luz]",
  '.bg-surface.border[class*="rounded-2xl"]',
  '.bg-surface.border[class*="rounded-3xl"]',
  '.bg-card.border[class*="rounded-2xl"]',
  '.bg-card.border[class*="rounded-3xl"]',
].join(",");

type Ponto = { x: number; y: number; vida: number; quebra?: boolean };

export function LuzCursor() {
  const telaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const tela = telaRef.current;
    const ctx = tela?.getContext("2d");
    if (!tela || !ctx) return;

    const raiz = document.documentElement;
    raiz.classList.add("luz-cursor");

    let largura = 0;
    let altura = 0;
    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = window.innerWidth;
      altura = window.innerHeight;
      tela.width = largura * dpr;
      tela.height = altura * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();

    const lerCor = () => {
      const estilo = getComputedStyle(raiz);
      return {
        hex: estilo.getPropertyValue("--luz-rastro-cor").trim() || "#34d399",
        forca: parseFloat(estilo.getPropertyValue("--luz-rastro-forca")) || 0.2,
      };
    };
    let cor = lerCor();
    const observador = new MutationObserver(() => {
      cor = lerCor();
    });
    observador.observe(raiz, { attributes: true, attributeFilter: ["data-theme", "data-trilha"] });

    const rastro: Ponto[] = [];
    let x = -999;
    let y = -999;
    let quadro = 0;
    let alvo: HTMLElement | null = null;

    const desenhar = () => {
      quadro = 0;
      raiz.style.setProperty("--mx", `${x}px`);
      raiz.style.setProperty("--my", `${y}px`);
      if (alvo) {
        const r = alvo.getBoundingClientRect();
        alvo.style.setProperty("--lx", `${x - r.left}px`);
        alvo.style.setProperty("--ly", `${y - r.top}px`);
      }

      ctx.clearRect(0, 0, largura, altura);

      for (const p of rastro) p.vida -= 0.04;
      while (rastro.length && rastro[0].vida <= 0) rastro.shift();
      if (rastro.length > 80) rastro.splice(0, rastro.length - 80);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < rastro.length; i++) {
        const a = rastro[i - 1];
        const b = rastro[i];
        if (b.quebra) continue;
        const k = b.vida * cor.forca;
        ctx.strokeStyle = cor.hex;
        ctx.globalAlpha = Math.min(1, k * 0.3);
        ctx.lineWidth = 16 * b.vida;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.globalAlpha = Math.min(1, k);
        ctx.lineWidth = 4 * b.vida;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      if (rastro.length) {
        const ultimo = rastro[rastro.length - 1];
        const g = ctx.createRadialGradient(ultimo.x, ultimo.y, 0, ultimo.x, ultimo.y, 50);
        g.addColorStop(0, cor.hex);
        g.addColorStop(1, cor.hex + "00");
        ctx.globalAlpha = Math.min(1, 0.4 * cor.forca * ultimo.vida);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ultimo.x, ultimo.y, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        quadro = requestAnimationFrame(desenhar);
      }
    };

    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(desenhar);
    };

    let timerToque = 0;

    const posicionar = (cx: number, cy: number, elemento: Element | null, quebra = false) => {
      x = cx;
      y = cy;
      alvo = elemento ? elemento.closest<HTMLElement>(SELETOR_CARDS) : null;
      raiz.classList.add("luz-visivel");
      rastro.push({ x, y, vida: 1, quebra });
      agendar();
    };

    const mover = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      posicionar(e.clientX, e.clientY, e.target instanceof Element ? e.target : null);
    };

    const tocar = (e: TouchEvent) => {
      const toque = e.touches[0];
      if (!toque) return;
      window.clearTimeout(timerToque);
      posicionar(
        toque.clientX,
        toque.clientY,
        document.elementFromPoint(toque.clientX, toque.clientY),
        e.type === "touchstart",
      );
    };

    const sair = () => {
      raiz.classList.remove("luz-visivel");
      agendar();
    };

    const soltar = () => {
      window.clearTimeout(timerToque);
      timerToque = window.setTimeout(sair, 900);
    };

    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("touchstart", tocar, { passive: true });
    window.addEventListener("touchmove", tocar, { passive: true });
    window.addEventListener("touchend", soltar, { passive: true });
    window.addEventListener("touchcancel", soltar, { passive: true });
    window.addEventListener("resize", medir);
    raiz.addEventListener("mouseleave", sair);
    window.addEventListener("blur", sair);

    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("touchstart", tocar);
      window.removeEventListener("touchmove", tocar);
      window.removeEventListener("touchend", soltar);
      window.removeEventListener("touchcancel", soltar);
      window.clearTimeout(timerToque);
      window.removeEventListener("resize", medir);
      raiz.removeEventListener("mouseleave", sair);
      window.removeEventListener("blur", sair);
      observador.disconnect();
      if (quadro) cancelAnimationFrame(quadro);
      raiz.classList.remove("luz-cursor", "luz-visivel");
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="luz-moedas" />
      <canvas ref={telaRef} aria-hidden="true" className="luz-rastro" />
    </>
  );
}
