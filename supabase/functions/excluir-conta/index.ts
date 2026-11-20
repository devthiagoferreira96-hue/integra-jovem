// Edge Function: excluir-conta
//
// Apaga de verdade a conta do usuário que está chamando esta função —
// nunca a de outra pessoa, mesmo que alguém tente passar outro id: quem
// está sendo excluído é sempre descoberto a partir do próprio token de
// quem chamou (nunca de algo enviado no corpo da requisição).
//
// Por que isso precisa ser uma Edge Function e não código no navegador:
// apagar um usuário do Supabase Auth exige a chave "service_role", que dá
// acesso total ao projeto e NUNCA pode rodar no navegador. Uma Edge
// Function roda no servidor do Supabase, então é o único lugar seguro
// pra usar essa chave.
//
// gastos/rendas/metas_reserva/categorias_custom/simulacoes_* têm
// "on delete cascade" no user_id (veja supabase/schema.sql), então apagar
// o usuário aqui já apaga sozinho todos os dados dele nessas tabelas —
// não precisa (nem deve) apagar tabela por tabela aqui.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeadersPara } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  // Libera só a origem do site oficial (configurada em ORIGENS_PERMITIDAS).
  const cors = corsHeadersPara(req.headers.get("Origin"));
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return json({ error: "Método não permitido." }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Não autenticado." }, 401);
  }

  try {
    // Cliente "de quem chamou": usa a anon key + o token de acesso do
    // próprio usuário, só para descobrir com segurança QUEM está pedindo
    // a exclusão.
    const supabaseUsuario = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: erroUsuario,
    } = await supabaseUsuario.auth.getUser();

    if (erroUsuario || !user) {
      return json({ error: "Sessão inválida ou expirada." }, 401);
    }

    // Cliente admin: só existe dentro desta função, nunca chega ao
    // navegador. É o único lugar do projeto com permissão pra apagar
    // contas de verdade.
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: erroExclusao } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (erroExclusao) {
      return json({ error: erroExclusao.message }, 500);
    }

    return json({ ok: true }, 200);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido.";
    return json({ error: mensagem }, 500);
  }

  function json(body: unknown, status: number) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
