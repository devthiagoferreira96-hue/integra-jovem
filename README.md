# 🎓 Integra Jovem — TCC

Plataforma que ajuda jovens que estão terminando a escola a se preparar para a vida adulta, com trilhas curtas sobre **dinheiro, carreira, autoconhecimento e bem-estar digital**. Sem anúncios e sem vigilância: o jovem escolhe o que quer aprender e avança no próprio ritmo.

> Trabalho de Conclusão de Curso — Técnico em Desenvolvimento de Sistemas, Etec Dr. Demétrio Azevedo Jr. (2026).
> Equipe: Thiago Proença, Kauã Felipe e Victória Monike. **Meu papel:** full stack (front-end e back-end).
> Esta é uma cópia de portfólio do repositório da equipe.

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | **Next.js 15** (App Router), **React**, **TypeScript**, **Tailwind CSS**, shadcn/ui (Radix) |
| Back-end | **Supabase**: Auth, PostgreSQL com RLS e Edge Functions (Deno) |
| Proteção contra robôs | hCaptcha / Cloudflare Turnstile |

## Funcionalidades

- **Trilhas** curtas por área e nível, com busca, filtros e progresso salvo.
- **Jornada** com experiência (XP), níveis, conquistas e medalhas dos desafios.
- **Finanças**: controle de gastos por categoria com gráficos, meta de reserva de emergência e simuladores de juros compostos e de juros dos bancos.
- **Glossário** com termos difíceis explicados em linguagem simples.
- **IntegraChat**: assistente que responde dúvidas e acolhe quem demonstra estar passando por um momento difícil.
- **Conta e perfil**: cadastro, login, recuperação de senha, captcha e exclusão da conta pelo próprio usuário (Edge Function `excluir-conta`).

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu projeto Supabase
npm run dev
```

O banco é criado com `supabase/schema.sql` (tabelas, políticas RLS e funções). Abra http://localhost:3000.

## Estrutura

```
src/
  app/            páginas e layouts (App Router): trilhas, jornada, finanças, glossário, perfil, cadastro, entrar
  components/     componentes de UI, layout, trilhas, perfil e captcha
  data/           conteúdo das trilhas
  lib/, hooks/    utilitários e hooks
supabase/
  schema.sql      banco, RLS e funções
  functions/      Edge Functions (Deno)
```

## Histórico

O projeto começou como protótipo (Vite + TanStack Router) e foi migrado para **Next.js 15 (App Router)**, mantendo o visual e o comportamento: as rotas viraram páginas do App Router, os metadados passaram para `metadata`/`generateMetadata` e os componentes interativos ganharam `"use client"`.
