import type { Metadata, Viewport } from "next";

import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { BarraRetornoTrilha } from "@/components/exercicios/BarraRetornoTrilha";
import { AssistenteChat } from "@/components/assistente/AssistenteChat";
import { scriptTemaInicial } from "@/lib/tema";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LuzCursor } from "@/components/layout/LuzCursor";
import { FundoAmbiente } from "@/components/layout/FundoAmbiente";
import { Providers } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Integra Jovem — preparo para a vida adulta",
  description:
    "Trilhas de educação financeira, carreira, autoconhecimento e bem-estar digital para adolescentes.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    siteName: "Integra Jovem",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0D10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTemaInicial }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
        />
      </head>
      <body>
        <FundoAmbiente />
        <LuzCursor />
        <Providers>
          <div className="relative z-[1] flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1 pb-24 lg:pb-0">{children}</main>
            <SiteFooter />
            <BarraRetornoTrilha />
            <AssistenteChat />
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
