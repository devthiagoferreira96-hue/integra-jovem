// CORS da Edge Function.
//
// Em produção, só o site oficial pode chamar a função. Defina a variável de
// ambiente ORIGENS_PERMITIDAS (Supabase → Edge Functions → Secrets) com os
// endereços separados por vírgula, ex.:
//   https://integra-jovem.vercel.app,https://www.integrajovem.com.br
// Se não houver nada configurado, cai no endereço de desenvolvimento local.

const ORIGENS = (Deno.env.get("ORIGENS_PERMITIDAS") ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

/** Monta os cabeçalhos CORS liberando só a origem do pedido, se for permitida. */
export function corsHeadersPara(origem: string | null): Record<string, string> {
  const permitida = origem && ORIGENS.includes(origem) ? origem : ORIGENS[0];
  return {
    "Access-Control-Allow-Origin": permitida,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

// Compatibilidade: mantém o nome antigo, usando a primeira origem permitida.
export const corsHeaders = corsHeadersPara(null);
