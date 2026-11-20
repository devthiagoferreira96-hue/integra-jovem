"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

function normalizarUrl(bruta: string | undefined): string | undefined {
  if (!bruta) return bruta;
  return bruta
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/(rest|auth|storage|functions)\/v1$/, "")
    .replace(/\/+$/, "");
}

export function createClient(): SupabaseClient | null {
  const url = normalizarUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return createBrowserClient(url, anonKey);
}

export function supabaseConfigurado(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
