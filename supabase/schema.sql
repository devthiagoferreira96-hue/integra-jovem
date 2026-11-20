
create table if not exists public.gastos (
  id           text primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  categoria    text not null,        
  valor        numeric(12, 2) not null check (valor > 0),
  mes          text not null,        
  observacao   text,
  criado_em    timestamptz not null default now()
);

create index if not exists gastos_user_mes_idx on public.gastos (user_id, mes);

alter table public.gastos enable row level security;

drop policy if exists "gastos: usuário vê os próprios" on public.gastos;
create policy "gastos: usuário vê os próprios" on public.gastos
  for select using (auth.uid() = user_id);
drop policy if exists "gastos: usuário insere para si" on public.gastos;
create policy "gastos: usuário insere para si" on public.gastos
  for insert with check (auth.uid() = user_id);
drop policy if exists "gastos: usuário atualiza os próprios" on public.gastos;
create policy "gastos: usuário atualiza os próprios" on public.gastos
  for update using (auth.uid() = user_id);
drop policy if exists "gastos: usuário apaga os próprios" on public.gastos;
create policy "gastos: usuário apaga os próprios" on public.gastos
  for delete using (auth.uid() = user_id);


create table if not exists public.rendas (
  user_id  uuid not null references auth.users(id) on delete cascade,
  mes      text not null,              
  valor    numeric(12, 2) not null check (valor >= 0),
  primary key (user_id, mes)
);

alter table public.rendas enable row level security;

drop policy if exists "rendas: usuário vê as próprias" on public.rendas;
create policy "rendas: usuário vê as próprias" on public.rendas
  for select using (auth.uid() = user_id);
drop policy if exists "rendas: usuário insere para si" on public.rendas;
create policy "rendas: usuário insere para si" on public.rendas
  for insert with check (auth.uid() = user_id);
drop policy if exists "rendas: usuário atualiza as próprias" on public.rendas;
create policy "rendas: usuário atualiza as próprias" on public.rendas
  for update using (auth.uid() = user_id);
drop policy if exists "rendas: usuário apaga as próprias" on public.rendas;
create policy "rendas: usuário apaga as próprias" on public.rendas
  for delete using (auth.uid() = user_id);


create table if not exists public.metas_reserva (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  valor    numeric(12, 2) not null default 600 check (valor > 0)
);

alter table public.metas_reserva enable row level security;

drop policy if exists "metas_reserva: usuário vê a própria" on public.metas_reserva;
create policy "metas_reserva: usuário vê a própria" on public.metas_reserva
  for select using (auth.uid() = user_id);
drop policy if exists "metas_reserva: usuário insere a própria" on public.metas_reserva;
create policy "metas_reserva: usuário insere a própria" on public.metas_reserva
  for insert with check (auth.uid() = user_id);
drop policy if exists "metas_reserva: usuário atualiza a própria" on public.metas_reserva;
create policy "metas_reserva: usuário atualiza a própria" on public.metas_reserva
  for update using (auth.uid() = user_id);


create table if not exists public.categorias_custom (
  id       text not null,           
  user_id  uuid not null references auth.users(id) on delete cascade,
  label    text not null,
  cor      text not null,
  primary key (user_id, id)
);

alter table public.categorias_custom enable row level security;

drop policy if exists "categorias_custom: usuário vê as próprias" on public.categorias_custom;
create policy "categorias_custom: usuário vê as próprias" on public.categorias_custom
  for select using (auth.uid() = user_id);
drop policy if exists "categorias_custom: usuário insere para si" on public.categorias_custom;
create policy "categorias_custom: usuário insere para si" on public.categorias_custom
  for insert with check (auth.uid() = user_id);
drop policy if exists "categorias_custom: usuário atualiza as próprias" on public.categorias_custom;
create policy "categorias_custom: usuário atualiza as próprias" on public.categorias_custom
  for update using (auth.uid() = user_id);
drop policy if exists "categorias_custom: usuário apaga as próprias" on public.categorias_custom;
create policy "categorias_custom: usuário apaga as próprias" on public.categorias_custom
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- HISTÓRICO — JUROS COMPOSTOS
-- ============================================================================
create table if not exists public.simulacoes_juros (
  id             text primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  valor_inicial  numeric(14, 2) not null,
  aporte_mensal  numeric(14, 2) not null,
  taxa_mensal    numeric(8, 4) not null,
  meses          integer not null check (meses > 0),
  total_final    numeric(14, 2) not null,
  juros_ganhos   numeric(14, 2) not null,
  criado_em      timestamptz not null default now()
);

alter table public.simulacoes_juros enable row level security;

drop policy if exists "simulacoes_juros: usuário vê as próprias" on public.simulacoes_juros;
create policy "simulacoes_juros: usuário vê as próprias" on public.simulacoes_juros
  for select using (auth.uid() = user_id);
drop policy if exists "simulacoes_juros: usuário insere para si" on public.simulacoes_juros;
create policy "simulacoes_juros: usuário insere para si" on public.simulacoes_juros
  for insert with check (auth.uid() = user_id);
drop policy if exists "simulacoes_juros: usuário apaga as próprias" on public.simulacoes_juros;
create policy "simulacoes_juros: usuário apaga as próprias" on public.simulacoes_juros
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- HISTÓRICO — JUROS BANCOS CDI/CDB
-- ============================================================================
create table if not exists public.simulacoes_cdi (
  id              text primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  banco_id        text not null,
  banco_nome      text not null,
  tipo            text not null check (tipo in ('cdi', 'cdb')),
  percentual_cdi  numeric(6, 2) not null,
  cdi_anual       numeric(6, 2) not null,
  valor_inicial   numeric(14, 2) not null,
  aporte_mensal   numeric(14, 2) not null,
  meses           integer not null check (meses > 0),
  total_final     numeric(14, 2) not null,
  juros_ganhos    numeric(14, 2) not null,
  criado_em       timestamptz not null default now()
);

alter table public.simulacoes_cdi enable row level security;

drop policy if exists "simulacoes_cdi: usuário vê as próprias" on public.simulacoes_cdi;
create policy "simulacoes_cdi: usuário vê as próprias" on public.simulacoes_cdi
  for select using (auth.uid() = user_id);
drop policy if exists "simulacoes_cdi: usuário insere para si" on public.simulacoes_cdi;
create policy "simulacoes_cdi: usuário insere para si" on public.simulacoes_cdi
  for insert with check (auth.uid() = user_id);
drop policy if exists "simulacoes_cdi: usuário apaga as próprias" on public.simulacoes_cdi;
create policy "simulacoes_cdi: usuário apaga as próprias" on public.simulacoes_cdi
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- HISTÓRICO — CARTEIRA DE INVESTIMENTOS
-- ============================================================================
create table if not exists public.simulacoes_carteira (
  id                   text primary key,
  user_id              uuid not null references auth.users(id) on delete cascade,
  saldo_ficticio       numeric(14, 2) not null,
  percentual_renda_fixa integer not null check (percentual_renda_fixa between 0 and 100),
  meses                integer not null check (meses > 0),
  resultado_esperado   numeric(14, 2) not null,
  criado_em            timestamptz not null default now()
);

alter table public.simulacoes_carteira enable row level security;

drop policy if exists "simulacoes_carteira: usuário vê as próprias" on public.simulacoes_carteira;
create policy "simulacoes_carteira: usuário vê as próprias" on public.simulacoes_carteira
  for select using (auth.uid() = user_id);
drop policy if exists "simulacoes_carteira: usuário insere para si" on public.simulacoes_carteira;
create policy "simulacoes_carteira: usuário insere para si" on public.simulacoes_carteira
  for insert with check (auth.uid() = user_id);
drop policy if exists "simulacoes_carteira: usuário apaga as próprias" on public.simulacoes_carteira;
create policy "simulacoes_carteira: usuário apaga as próprias" on public.simulacoes_carteira
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- PROGRESSO DE AULAS (RF008) — marcação "li esta aula" por trilha
-- ============================================================================
-- Espelha src/lib/progresso.ts (ProgressoOverlay): cursoSlug -> aulaId -> bool.
-- Uma linha por (usuário, trilha, aula); marcar/desmarcar é sempre um upsert.
create table if not exists public.progresso_aulas (
  user_id       uuid not null references auth.users(id) on delete cascade,
  curso_slug    text not null,
  aula_id       text not null,
  concluida     boolean not null default true,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, curso_slug, aula_id)
);

create index if not exists progresso_aulas_user_curso_idx
  on public.progresso_aulas (user_id, curso_slug);

alter table public.progresso_aulas enable row level security;

drop policy if exists "progresso_aulas: usuário vê o próprio" on public.progresso_aulas;
create policy "progresso_aulas: usuário vê o próprio" on public.progresso_aulas
  for select using (auth.uid() = user_id);
drop policy if exists "progresso_aulas: usuário insere para si" on public.progresso_aulas;
create policy "progresso_aulas: usuário insere para si" on public.progresso_aulas
  for insert with check (auth.uid() = user_id);
drop policy if exists "progresso_aulas: usuário atualiza o próprio" on public.progresso_aulas;
create policy "progresso_aulas: usuário atualiza o próprio" on public.progresso_aulas
  for update using (auth.uid() = user_id);
drop policy if exists "progresso_aulas: usuário apaga o próprio" on public.progresso_aulas;
create policy "progresso_aulas: usuário apaga o próprio" on public.progresso_aulas
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- DIÁRIO DE REFLEXÃO — espaço privado, só o próprio usuário lê o que escreve
-- ============================================================================
create table if not exists public.diario_reflexoes (
  id         text not null primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  pergunta   text not null,
  texto      text not null,
  criado_em  timestamptz not null default now()
);

create index if not exists diario_reflexoes_user_idx
  on public.diario_reflexoes (user_id, criado_em desc);

alter table public.diario_reflexoes enable row level security;

drop policy if exists "diario_reflexoes: usuário vê as próprias" on public.diario_reflexoes;
create policy "diario_reflexoes: usuário vê as próprias" on public.diario_reflexoes
  for select using (auth.uid() = user_id);
drop policy if exists "diario_reflexoes: usuário insere para si" on public.diario_reflexoes;
create policy "diario_reflexoes: usuário insere para si" on public.diario_reflexoes
  for insert with check (auth.uid() = user_id);
drop policy if exists "diario_reflexoes: usuário apaga as próprias" on public.diario_reflexoes;
create policy "diario_reflexoes: usuário apaga as próprias" on public.diario_reflexoes
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- METAS PESSOAIS — "Minhas metas" no Perfil
-- ============================================================================
create table if not exists public.metas_pessoais (
  id         text not null primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  titulo     text not null,
  prazo      text,
  progresso  integer not null default 0 check (progresso between 0 and 100),
  criado_em  timestamptz not null default now()
);

create index if not exists metas_pessoais_user_idx
  on public.metas_pessoais (user_id, criado_em desc);

alter table public.metas_pessoais enable row level security;

drop policy if exists "metas_pessoais: usuário vê as próprias" on public.metas_pessoais;
create policy "metas_pessoais: usuário vê as próprias" on public.metas_pessoais
  for select using (auth.uid() = user_id);
drop policy if exists "metas_pessoais: usuário insere para si" on public.metas_pessoais;
create policy "metas_pessoais: usuário insere para si" on public.metas_pessoais
  for insert with check (auth.uid() = user_id);
drop policy if exists "metas_pessoais: usuário atualiza as próprias" on public.metas_pessoais;
create policy "metas_pessoais: usuário atualiza as próprias" on public.metas_pessoais
  for update using (auth.uid() = user_id);
drop policy if exists "metas_pessoais: usuário apaga as próprias" on public.metas_pessoais;
create policy "metas_pessoais: usuário apaga as próprias" on public.metas_pessoais
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- RESULTADOS DE QUIZ (RF014) — usado para liberar a próxima trilha
-- ============================================================================
-- Uma linha por (usuário, trilha): refazer o quiz sempre atualiza a mesma
-- linha (upsert), então o app sempre sabe o resultado mais recente daquela
-- trilha para decidir se libera "Seguir para próxima trilha".
create table if not exists public.resultados_quiz (
  user_id     uuid not null references auth.users(id) on delete cascade,
  curso_slug  text not null,
  acertos     integer not null check (acertos >= 0),
  total       integer not null check (total > 0),
  criado_em   timestamptz not null default now(),
  primary key (user_id, curso_slug)
);

alter table public.resultados_quiz enable row level security;

drop policy if exists "resultados_quiz: usuário vê os próprios" on public.resultados_quiz;
create policy "resultados_quiz: usuário vê os próprios" on public.resultados_quiz
  for select using (auth.uid() = user_id);
drop policy if exists "resultados_quiz: usuário insere para si" on public.resultados_quiz;
create policy "resultados_quiz: usuário insere para si" on public.resultados_quiz
  for insert with check (auth.uid() = user_id);
drop policy if exists "resultados_quiz: usuário atualiza os próprios" on public.resultados_quiz;
create policy "resultados_quiz: usuário atualiza os próprios" on public.resultados_quiz
  for update using (auth.uid() = user_id);

-- ============================================================================
-- DATA DE NASCIMENTO — validação no servidor (idade entre 12 e 100 anos)
-- ============================================================================
-- A data não fica numa tabela própria: o app grava em
-- auth.users.raw_user_meta_data->>'nascimento', no formato "AAAA-MM-DD",
-- tanto no cadastro (auth.signUp) quanto no perfil (auth.updateUser).
--
-- O front já valida, mas qualquer pessoa pode chamar a API do Supabase
-- direto com a anon key. Estes triggers garantem as mesmas regras de
-- src/lib/data-nascimento.ts no banco:
--   * formato AAAA-MM-DD, ano com 4 dígitos, data que exista de verdade;
--   * não pode ser no futuro;
--   * idade entre 12 e 100 anos (inclusive).
--
-- Se mudar IDADE_MINIMA / IDADE_MAXIMA no front, mude aqui também.

create or replace function public.validar_nascimento(valor text)
returns text                              -- mensagem de erro, ou null se válida
language plpgsql
stable
set search_path = ''
as $$
declare
  -- Mesmo "hoje" do usuário brasileiro (o banco roda em UTC).
  hoje        date := (now() at time zone 'America/Sao_Paulo')::date;
  nascimento  date;
  idade       integer;
begin
  if valor is null or valor = '' then
    return 'Informe sua data de nascimento.';
  end if;

  if valor !~ '^\d{4}-\d{2}-\d{2}$' then
    return 'Data de nascimento em formato inválido.';
  end if;

  begin
    nascimento := make_date(
      substr(valor, 1, 4)::integer,
      substr(valor, 6, 2)::integer,
      substr(valor, 9, 2)::integer
    );
  exception when others then              -- ex.: 2023-02-30, mês 13, ano 0000
    return 'Essa data de nascimento não existe.';
  end;

  if nascimento > hoje then
    return 'A data de nascimento não pode estar no futuro.';
  end if;

  idade := extract(year from age(hoje, nascimento))::integer;

  if idade < 12 then
    return 'Idade inapropriada para uso: é preciso ter no mínimo 12 anos.';
  end if;
  if idade > 100 then
    return 'Idade inapropriada para uso: a idade máxima permitida é 100 anos.';
  end if;

  return null;
end;
$$;

-- Função de trigger. "security definer" porque quem grava em auth.users é
-- o papel interno do Auth (supabase_auth_admin), que não precisa ter
-- permissão nas funções do schema public.
create or replace function public.checar_nascimento_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  valor text := new.raw_user_meta_data->>'nascimento';
  erro  text;
begin
  -- No perfil a data é opcional: remover (vazio/null) é permitido.
  -- No cadastro (INSERT) ela é obrigatória.
  if tg_op = 'UPDATE' and coalesce(valor, '') = '' then
    return new;
  end if;

  erro := public.validar_nascimento(valor);
  if erro is not null then
    raise exception using
      errcode = 'check_violation',
      message = 'nascimento_invalido: ' || erro;
  end if;

  return new;
end;
$$;

-- Ninguém de fora precisa chamar essas funções via RPC; o trigger continua
-- funcionando porque roda como o dono (postgres).
revoke all on function public.validar_nascimento(text) from public, anon, authenticated;
revoke all on function public.checar_nascimento_usuario() from public, anon, authenticated;

drop trigger if exists validar_nascimento_ao_cadastrar on auth.users;
create trigger validar_nascimento_ao_cadastrar
  before insert on auth.users
  for each row
  execute function public.checar_nascimento_usuario();

-- Só dispara quando a data muda. O Auth atualiza auth.users em todo login
-- (last_sign_in_at etc.); sem esse WHEN, um usuário antigo com data fora da
-- regra ficaria impedido de entrar.
drop trigger if exists validar_nascimento_ao_atualizar on auth.users;
create trigger validar_nascimento_ao_atualizar
  before update of raw_user_meta_data on auth.users
  for each row
  when (old.raw_user_meta_data->>'nascimento' is distinct from new.raw_user_meta_data->>'nascimento')
  execute function public.checar_nascimento_usuario();

-- Para conferir contas que já existiam antes desta regra (não altera nada):
--   select id, email, raw_user_meta_data->>'nascimento' as nascimento,
--          public.validar_nascimento(raw_user_meta_data->>'nascimento') as problema
--     from auth.users
--    where public.validar_nascimento(raw_user_meta_data->>'nascimento') is not null;

-- ============================================================================
-- GAMIFICAÇÃO — XP calculado a partir das ações registradas
-- ============================================================================
-- O XP NÃO é gravado como um número: o app soma na hora (src/lib/xp.ts) a
-- partir de blocos concluídos (progresso_aulas), da PRIMEIRA tentativa de cada
-- quiz e dos bônus conquistados. As duas tabelas abaixo guardam o que precisa
-- ser "congelado" para a regra valer:
--
--   quiz_primeira_tentativa — o 1º resultado de cada quiz. Refazer o quiz
--     atualiza resultados_quiz, mas NUNCA esta tabela (XP só na 1ª vez).
--   xp_bonus — bônus já conquistados (ex.: primeiro registro de gasto). Fica
--     mesmo que o gasto seja apagado depois.
--
-- As duas são só de leitura para o app: não têm política de insert/update/
-- delete, então nem o navegador nem alguém usando a API direto consegue
-- gravar nelas. Quem grava são os triggers abaixo (security definer).

create table if not exists public.quiz_primeira_tentativa (
  user_id     uuid not null references auth.users(id) on delete cascade,
  curso_slug  text not null,
  acertos     integer not null check (acertos >= 0),
  total       integer not null check (total > 0),
  feito_em    timestamptz not null default now(),
  primary key (user_id, curso_slug)
);

alter table public.quiz_primeira_tentativa enable row level security;

drop policy if exists "quiz_primeira_tentativa: usuário vê as próprias" on public.quiz_primeira_tentativa;
create policy "quiz_primeira_tentativa: usuário vê as próprias" on public.quiz_primeira_tentativa
  for select using (auth.uid() = user_id);

create table if not exists public.xp_bonus (
  user_id         uuid not null references auth.users(id) on delete cascade,
  bonus_id        text not null,
  conquistado_em  timestamptz not null default now(),
  primary key (user_id, bonus_id)
);

alter table public.xp_bonus enable row level security;

drop policy if exists "xp_bonus: usuário vê os próprios" on public.xp_bonus;
create policy "xp_bonus: usuário vê os próprios" on public.xp_bonus
  for select using (auth.uid() = user_id);

-- 1ª tentativa: sempre que um resultado de quiz é salvo, tenta registrar.
-- "on conflict do nothing" garante que só a primeira fica.
create or replace function public.registrar_primeira_tentativa_quiz()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.quiz_primeira_tentativa (user_id, curso_slug, acertos, total, feito_em)
  values (new.user_id, new.curso_slug, new.acertos, new.total, now())
  on conflict (user_id, curso_slug) do nothing;
  return new;
end;
$$;

drop trigger if exists registrar_primeira_tentativa_quiz on public.resultados_quiz;
create trigger registrar_primeira_tentativa_quiz
  after insert or update on public.resultados_quiz
  for each row
  execute function public.registrar_primeira_tentativa_quiz();

-- Bônus do primeiro gasto: concedido no primeiro insert em gastos.
create or replace function public.conceder_bonus_primeiro_gasto()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.xp_bonus (user_id, bonus_id)
  values (new.user_id, 'primeiro-gasto')
  on conflict (user_id, bonus_id) do nothing;
  return new;
end;
$$;

drop trigger if exists conceder_bonus_primeiro_gasto on public.gastos;
create trigger conceder_bonus_primeiro_gasto
  after insert on public.gastos
  for each row
  execute function public.conceder_bonus_primeiro_gasto();

revoke all on function public.registrar_primeira_tentativa_quiz() from public, anon, authenticated;
revoke all on function public.conceder_bonus_primeiro_gasto() from public, anon, authenticated;

-- Quem já usava o site antes da gamificação: aproveita o que já existe.
-- (Para quizzes, o resultado salvo hoje vira a "primeira tentativa" — é o
-- melhor dado disponível.) Pode rodar de novo sem duplicar nada.
insert into public.quiz_primeira_tentativa (user_id, curso_slug, acertos, total, feito_em)
select user_id, curso_slug, acertos, total, criado_em
  from public.resultados_quiz
on conflict (user_id, curso_slug) do nothing;

insert into public.xp_bonus (user_id, bonus_id, conquistado_em)
select user_id, 'primeiro-gasto', min(criado_em)
  from public.gastos
 group by user_id
on conflict (user_id, bonus_id) do nothing;

-- ============================================================================
-- GAMIFICAÇÃO (fase 3) — marcos para os emblemas de conquista
-- ============================================================================
-- Os emblemas são avaliados pelo app (src/lib/conquistas.ts) a partir das
-- ações registradas. Alguns dependem da PRIMEIRA vez que a pessoa usa uma
-- ferramenta (primeira meta, primeira reflexão, primeira simulação). Esses
-- "marcos" ficam gravados aqui para sempre, para o emblema não sumir se a
-- meta ou a simulação for apagada depois.
--
-- Só leitura para o app (sem política de insert/update/delete): quem grava
-- são os triggers abaixo. (O primeiro gasto já é registrado em xp_bonus.)

create table if not exists public.marcos_usuario (
  user_id       uuid not null references auth.users(id) on delete cascade,
  marco_id      text not null,
  alcancado_em  timestamptz not null default now(),
  primary key (user_id, marco_id)
);

alter table public.marcos_usuario enable row level security;

drop policy if exists "marcos_usuario: usuário vê os próprios" on public.marcos_usuario;
create policy "marcos_usuario: usuário vê os próprios" on public.marcos_usuario
  for select using (auth.uid() = user_id);

-- Uma função genérica: o nome do marco vem como argumento do trigger.
create or replace function public.registrar_marco_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.marcos_usuario (user_id, marco_id)
  values (new.user_id, tg_argv[0])
  on conflict (user_id, marco_id) do nothing;
  return new;
end;
$$;

revoke all on function public.registrar_marco_usuario() from public, anon, authenticated;

drop trigger if exists marco_primeira_meta on public.metas_pessoais;
create trigger marco_primeira_meta
  after insert on public.metas_pessoais
  for each row execute function public.registrar_marco_usuario('primeira-meta');

drop trigger if exists marco_primeira_reflexao on public.diario_reflexoes;
create trigger marco_primeira_reflexao
  after insert on public.diario_reflexoes
  for each row execute function public.registrar_marco_usuario('primeira-reflexao');

drop trigger if exists marco_primeira_simulacao_juros on public.simulacoes_juros;
create trigger marco_primeira_simulacao_juros
  after insert on public.simulacoes_juros
  for each row execute function public.registrar_marco_usuario('primeira-simulacao');

drop trigger if exists marco_primeira_simulacao_cdi on public.simulacoes_cdi;
create trigger marco_primeira_simulacao_cdi
  after insert on public.simulacoes_cdi
  for each row execute function public.registrar_marco_usuario('primeira-simulacao');

drop trigger if exists marco_primeira_simulacao_carteira on public.simulacoes_carteira;
create trigger marco_primeira_simulacao_carteira
  after insert on public.simulacoes_carteira
  for each row execute function public.registrar_marco_usuario('primeira-simulacao');

-- Quem já usava as ferramentas antes desta fase ganha os marcos agora.
-- Pode rodar de novo sem duplicar nada.
insert into public.marcos_usuario (user_id, marco_id, alcancado_em)
select user_id, 'primeira-meta', min(criado_em) from public.metas_pessoais group by user_id
on conflict (user_id, marco_id) do nothing;

insert into public.marcos_usuario (user_id, marco_id, alcancado_em)
select user_id, 'primeira-reflexao', min(criado_em) from public.diario_reflexoes group by user_id
on conflict (user_id, marco_id) do nothing;

insert into public.marcos_usuario (user_id, marco_id, alcancado_em)
select user_id, 'primeira-simulacao', min(criado_em)
  from (
    select user_id, criado_em from public.simulacoes_juros
    union all select user_id, criado_em from public.simulacoes_cdi
    union all select user_id, criado_em from public.simulacoes_carteira
  ) s
 group by user_id
on conflict (user_id, marco_id) do nothing;

-- ============================================================================
-- GAMIFICAÇÃO — exercícios práticos das trilhas (+50 XP cada)
-- ============================================================================
-- Blocos que mandam usar o Controle de Gastos ou um simulador têm um
-- exercício (catálogo em src/lib/exercicios.ts). O app registra o INÍCIO
-- (botão "Começar exercício"); a CONCLUSÃO é marcada por trigger quando a
-- pessoa salva a ação pedida. Início e fim ficam gravados — base para os
-- emblemas por tempo da fase 4.
--
-- O app pode inserir (só para si e só sem conclusão), mas não pode atualizar
-- nem apagar: não dá para "se dar" um exercício concluído pela API.

create table if not exists public.exercicios_usuario (
  user_id       uuid not null references auth.users(id) on delete cascade,
  exercicio_id  text not null,
  tipo          text not null check (tipo in (
                  'gasto', 'renda', 'meta_reserva',
                  'simulacao_juros', 'simulacao_cdi', 'simulacao_carteira')),
  iniciado_em   timestamptz not null default now(),
  concluido_em  timestamptz,
  primary key (user_id, exercicio_id)
);

alter table public.exercicios_usuario enable row level security;

drop policy if exists "exercicios_usuario: usuário vê os próprios" on public.exercicios_usuario;
create policy "exercicios_usuario: usuário vê os próprios" on public.exercicios_usuario
  for select using (auth.uid() = user_id);
drop policy if exists "exercicios_usuario: usuário inicia para si" on public.exercicios_usuario;
create policy "exercicios_usuario: usuário inicia para si" on public.exercicios_usuario
  for insert with check (auth.uid() = user_id and concluido_em is null);

-- Garante que o início é sempre "agora" (não dá para mandar uma data inventada).
create or replace function public.exercicio_inicio_agora()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.iniciado_em := now();
  new.concluido_em := null;
  return new;
end;
$$;

drop trigger if exists exercicio_inicio_agora on public.exercicios_usuario;
create trigger exercicio_inicio_agora
  before insert on public.exercicios_usuario
  for each row execute function public.exercicio_inicio_agora();

-- Conclui os exercícios em andamento do tipo da ação que acabou de ser salva.
create or replace function public.concluir_exercicios_por_acao()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.exercicios_usuario
     set concluido_em = now()
   where user_id = new.user_id
     and tipo = tg_argv[0]
     and concluido_em is null;
  return new;
end;
$$;

revoke all on function public.concluir_exercicios_por_acao() from public, anon, authenticated;

drop trigger if exists exercicio_acao_gasto on public.gastos;
create trigger exercicio_acao_gasto
  after insert on public.gastos
  for each row execute function public.concluir_exercicios_por_acao('gasto');

drop trigger if exists exercicio_acao_renda on public.rendas;
create trigger exercicio_acao_renda
  after insert or update on public.rendas
  for each row execute function public.concluir_exercicios_por_acao('renda');

drop trigger if exists exercicio_acao_meta_reserva on public.metas_reserva;
create trigger exercicio_acao_meta_reserva
  after insert or update on public.metas_reserva
  for each row execute function public.concluir_exercicios_por_acao('meta_reserva');

drop trigger if exists exercicio_acao_simulacao_juros on public.simulacoes_juros;
create trigger exercicio_acao_simulacao_juros
  after insert on public.simulacoes_juros
  for each row execute function public.concluir_exercicios_por_acao('simulacao_juros');

drop trigger if exists exercicio_acao_simulacao_cdi on public.simulacoes_cdi;
create trigger exercicio_acao_simulacao_cdi
  after insert on public.simulacoes_cdi
  for each row execute function public.concluir_exercicios_por_acao('simulacao_cdi');

drop trigger if exists exercicio_acao_simulacao_carteira on public.simulacoes_carteira;
create trigger exercicio_acao_simulacao_carteira
  after insert on public.simulacoes_carteira
  for each row execute function public.concluir_exercicios_por_acao('simulacao_carteira');

-- ----------------------------------------------------------------------------
-- Exercícios com DADO ESPECÍFICO (valor, observação, parâmetros da simulação)
-- ----------------------------------------------------------------------------
-- Cada exercício pede dados exatos (ex.: "gasto de R$ 100,00 com a observação
-- 'parcela'"). Assim dois exercícios do mesmo tipo não se concluem com uma
-- ação só. O catálogo abaixo é a fonte da verdade no banco e precisa bater
-- com src/lib/exercicios.ts (mesmos ids, tipos e requisitos).

create table if not exists public.catalogo_exercicios (
  exercicio_id  text primary key,
  tipo          text not null,
  requisito     jsonb not null default '{}'::jsonb
);

alter table public.catalogo_exercicios enable row level security;
-- Sem políticas: o app não lê nem escreve aqui; só as funções do banco usam.

insert into public.catalogo_exercicios (exercicio_id, tipo, requisito) values
  ('primeiro-dinheiro:seu-primeiro-orcamento', 'renda', '{"valor":800}'::jsonb),
  ('primeiro-dinheiro:desafio-do-mes', 'gasto', '{"valor":150,"observacao_contem":"objetivo"}'::jsonb),
  ('primeiro-dinheiro:quanto-preciso-guardar', 'simulacao_juros', '{"valor_inicial":0,"aporte_mensal":50,"meses":24}'::jsonb),
  ('primeiro-dinheiro:imprevistos-acontecem', 'meta_reserva', '{"valor":1800}'::jsonb),
  ('primeiro-dinheiro:seu-primeiro-plano-financeiro', 'gasto', '{"observacao_contem":"plano financeiro"}'::jsonb),
  ('descobrindo-profissoes:quanto-realmente-entra', 'renda', '{"valor":1200}'::jsonb),
  ('descobrindo-profissoes:fixos-x-variaveis', 'gasto', '{"valor":12,"observacao_contem":"variavel"}'::jsonb),
  ('descobrindo-profissoes:seu-orcamento-esta-negativo', 'gasto', '{"valor":300,"observacao_contem":"estourou"}'::jsonb),
  ('descobrindo-profissoes:primeiro-emprego', 'renda', '{"valor":900}'::jsonb),
  ('descobrindo-profissoes:monte-seu-orcamento', 'gasto', '{"valor":50,"observacao_contem":"lazer planejado"}'::jsonb),
  ('quem-eu-sou:parcelamento', 'gasto', '{"valor":100,"observacao_contem":"parcela"}'::jsonb),
  ('quem-eu-sou:juros', 'simulacao_juros', '{"valor_inicial":500,"aporte_mensal":0,"taxa_mensal":12,"meses":12}'::jsonb),
  ('quem-eu-sou:desafio-da-fatura', 'gasto', '{"valor":250,"observacao_contem":"fatura"}'::jsonb),
  ('vida-adulta-burocracia:meta-financeira', 'simulacao_juros', '{"valor_inicial":0,"aporte_mensal":100,"meses":12}'::jsonb),
  ('vida-adulta-burocracia:reserva', 'meta_reserva', '{"valor":3000}'::jsonb),
  ('vida-adulta-burocracia:risco-e-retorno', 'simulacao_carteira', '{"saldo_ficticio":1000,"percentual_renda_fixa":80}'::jsonb),
  ('vida-adulta-burocracia:diversificacao', 'simulacao_carteira', '{"saldo_ficticio":2000,"percentual_renda_fixa":50}'::jsonb),
  ('vida-adulta-burocracia:o-tempo-importa', 'simulacao_juros', '{"aporte_mensal":50,"meses":240}'::jsonb),
  ('vida-adulta-burocracia:aportes-mensais', 'simulacao_juros', '{"aporte_mensal":150,"meses":36}'::jsonb),
  ('vida-adulta-burocracia:monte-sua-carteira-ficticia', 'simulacao_carteira', '{"saldo_ficticio":5000,"meses":60}'::jsonb),
  ('uso-consciente-tecnologia:juros-compostos', 'simulacao_juros', '{"valor_inicial":100,"aporte_mensal":0,"meses":12}'::jsonb),
  ('uso-consciente-tecnologia:juros-sobre-juros', 'simulacao_juros', '{"valor_inicial":100,"aporte_mensal":0,"meses":60}'::jsonb),
  ('uso-consciente-tecnologia:comecar-cedo', 'simulacao_juros', '{"aporte_mensal":30,"meses":180}'::jsonb),
  ('uso-consciente-tecnologia:e-se-eu-aumentar-o-aporte', 'simulacao_juros', '{"aporte_mensal":35,"meses":60}'::jsonb),
  ('uso-consciente-tecnologia:e-se-eu-esperar', 'simulacao_juros', '{"aporte_mensal":35,"meses":36}'::jsonb)
on conflict (exercicio_id) do update
  set tipo = excluded.tipo, requisito = excluded.requisito;

-- Só aceita início de exercícios que existem no catálogo, e com o tipo dele.
delete from public.exercicios_usuario eu
 where not exists (select 1 from public.catalogo_exercicios c where c.exercicio_id = eu.exercicio_id);

update public.exercicios_usuario eu
   set tipo = c.tipo
  from public.catalogo_exercicios c
 where c.exercicio_id = eu.exercicio_id
   and eu.tipo <> c.tipo
   and eu.concluido_em is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'exercicios_usuario_catalogo_fk'
  ) then
    alter table public.exercicios_usuario
      add constraint exercicios_usuario_catalogo_fk
      foreign key (exercicio_id) references public.catalogo_exercicios (exercicio_id);
  end if;
end;
$$;

create or replace function public.exercicio_inicio_agora()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.iniciado_em := now();
  new.concluido_em := null;
  -- O tipo vem do catálogo, não do navegador.
  select c.tipo into new.tipo
    from public.catalogo_exercicios c
   where c.exercicio_id = new.exercicio_id;
  return new;
end;
$$;

revoke all on function public.exercicio_inicio_agora() from public, anon, authenticated;

-- A linha salva (gasto, renda, simulação...) atende ao requisito?
-- Números: iguais (tolerância de centavo). "observacao_contem": trecho na
-- observação, sem diferenciar maiúscula e acento.
create or replace function public.acao_atende_requisito(linha jsonb, requisito jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  chave text;
  esperado jsonb;
  sem_acento_de constant text := 'áàâãäéèêëíìîïóòôõöúùûüç';
  sem_acento_para constant text := 'aaaaaeeeeiiiiooooouuuuc';
begin
  if requisito is null then
    return true;
  end if;

  for chave, esperado in select * from jsonb_each(requisito) loop
    if chave = 'observacao_contem' then
      if position(
           translate(lower(esperado #>> '{}'), sem_acento_de, sem_acento_para)
           in translate(lower(coalesce(linha ->> 'observacao', '')), sem_acento_de, sem_acento_para)
         ) = 0 then
        return false;
      end if;
    else
      if linha ->> chave is null
         or abs((linha ->> chave)::numeric - (esperado #>> '{}')::numeric) >= 0.005 then
        return false;
      end if;
    end if;
  end loop;

  return true;
end;
$$;

-- Agora a conclusão confere o requisito de cada exercício em andamento.
create or replace function public.concluir_exercicios_por_acao()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.exercicios_usuario eu
     set concluido_em = now()
    from public.catalogo_exercicios c
   where eu.user_id = new.user_id
     and eu.concluido_em is null
     and eu.tipo = tg_argv[0]
     and c.exercicio_id = eu.exercicio_id
     and c.tipo = tg_argv[0]
     and public.acao_atende_requisito(to_jsonb(new), c.requisito);
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Exercícios: cancelar um exercício em andamento
-- ----------------------------------------------------------------------------
-- A pessoa pode cancelar (apagar o início) de um exercício que ainda NÃO foi
-- concluído, para começar de novo depois. Exercício concluído não pode ser
-- apagado: o XP dele fica garantido e ninguém consegue mexer.
drop policy if exists "exercicios_usuario: usuário cancela em andamento" on public.exercicios_usuario;
create policy "exercicios_usuario: usuário cancela em andamento" on public.exercicios_usuario
  for delete using (auth.uid() = user_id and concluido_em is null);

-- ============================================================================
-- GAMIFICAÇÃO — estatística das conquistas ("X% dos usuários conquistaram")
-- ============================================================================
-- As conquistas são avaliadas no app; quando alguém conquista um emblema, o
-- app registra aqui. A função estatisticas_conquistas() devolve só números
-- AGREGADOS (quantas pessoas têm cada emblema e o total de usuários) — nunca
-- quem conquistou. Com menos de 5 usuários cadastrados ela não devolve os
-- números, para não dar para deduzir o que uma pessoa específica fez.

create table if not exists public.conquistas_usuario (
  user_id         uuid not null references auth.users(id) on delete cascade,
  conquista_id    text not null check (char_length(conquista_id) between 1 and 64),
  conquistado_em  timestamptz not null default now(),
  primary key (user_id, conquista_id)
);

alter table public.conquistas_usuario enable row level security;

drop policy if exists "conquistas_usuario: usuário vê as próprias" on public.conquistas_usuario;
create policy "conquistas_usuario: usuário vê as próprias" on public.conquistas_usuario
  for select using (auth.uid() = user_id);
drop policy if exists "conquistas_usuario: usuário registra as próprias" on public.conquistas_usuario;
create policy "conquistas_usuario: usuário registra as próprias" on public.conquistas_usuario
  for insert with check (auth.uid() = user_id);

create or replace function public.estatisticas_conquistas()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with total as (
    select count(*)::bigint as n from auth.users
  ),
  por as (
    select conquista_id, count(*)::bigint as qtd
      from public.conquistas_usuario
     group by conquista_id
  )
  select jsonb_build_object(
    'total_usuarios', t.n,
    'minimo', 5,
    'por_conquista',
      case when t.n >= 5
        then coalesce((select jsonb_object_agg(p.conquista_id, p.qtd) from por p), '{}'::jsonb)
        else '{}'::jsonb
      end
  )
  from total t;
$$;

revoke all on function public.estatisticas_conquistas() from public;
grant execute on function public.estatisticas_conquistas() to anon, authenticated;

-- ============================================================================
-- ASSISTENTE DE DÚVIDAS — respostas prontas
-- ============================================================================
-- Perguntas e respostas do assistente da borda direita do site. Ficam no
-- banco para a equipe acrescentar/corrigir temas pelo painel do Supabase
-- (Table Editor), sem mexer no código. O site só LÊ esta tabela.
--
-- Colunas:
--   palavras   lista (JSON) de palavras/trechos, minúsculos e SEM acento, que
--              indicam o tema. Ex.: ["cartao", "fatura", "limite"]
--   links      lista (JSON) de atalhos do site: [{"rotulo": "...", "href": "/financas"}]
--   fonte_*    material externo para se aprofundar (opcional)
--   ativo      false esconde o tema sem apagar
--
-- Os temas com fonte da Escola Virtual da Fundação Bradesco têm textos
-- próprios do Integra Jovem, pensados a partir dos cursos gratuitos dela, e
-- indicam o curso para quem quiser se aprofundar.

create table if not exists public.assistente_temas (
  id            text primary key,
  ordem         integer not null default 100,
  sugestao      text not null,
  palavras      jsonb not null default '[]'::jsonb,
  resposta      text not null,
  links         jsonb not null default '[]'::jsonb,
  fonte_rotulo  text,
  fonte_url     text,
  ativo         boolean not null default true,
  atualizado_em timestamptz not null default now()
);

alter table public.assistente_temas enable row level security;

drop policy if exists "assistente_temas: todos leem os ativos" on public.assistente_temas;
create policy "assistente_temas: todos leem os ativos" on public.assistente_temas
  for select using (ativo);

insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url) values
  ('orcamento', 1, 'Como organizo meu dinheiro do mês?', '["orcamento","organizar","organizo","controle de gastos","planejar o mes","gastar menos","sobrar dinheiro","sobra","mesada"]'::jsonb, 'Comece anotando tudo o que entra (mesada, salário, bicos) e tudo o que sai. Separe os gastos em essenciais (transporte, alimentação) e não essenciais (lanche, streaming). Uma regra simples para começar: 50% para o essencial, 30% para o que você gosta e 20% para guardar. Depois de um mês anotando, você enxerga para onde o dinheiro está indo e decide onde cortar.', '[{"rotulo":"Abrir o Controle de Gastos","href":"/financas"},{"rotulo":"Trilha: Dominando o orçamento","href":"/trilhas/descobrindo-profissoes"}]'::jsonb, null, null),
  ('50-30-20', 2, 'O que é a regra 50-30-20?', '["50 30 20","50-30-20","503020","regra 50","cinquenta trinta vinte"]'::jsonb, 'É um jeito fácil de dividir a renda: 50% para necessidades (contas, transporte, comida), 30% para desejos (lazer, roupas, jogos) e 20% para objetivos (reserva, metas, investir). Não precisa ser exato: é um ponto de partida. Se sua renda é pequena, até guardar 5% ou 10% já cria o hábito.', '[{"rotulo":"Montar meu orçamento","href":"/financas"}]'::jsonb, null, null),
  ('reserva', 3, 'O que é reserva de emergência?', '["reserva","emergencia","imprevisto","guardar para","colchao"]'::jsonb, 'É um dinheiro guardado só para imprevistos: celular quebrado, remédio, uma conta inesperada. O ideal é juntar de 3 a 6 meses dos seus gastos essenciais, aos poucos. Ela deve ficar num lugar seguro e fácil de sacar, que renda pelo menos um pouco (por exemplo, aplicações que acompanham o CDI com liquidez diária). Primeiro a reserva, depois os outros investimentos.', '[{"rotulo":"Definir minha meta de reserva","href":"/financas"},{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, null, null),
  ('juros-compostos', 4, 'Como funcionam os juros compostos?', '["juros compostos","juros sobre juros","rendimento","render","rende"]'::jsonb, 'Nos juros compostos, o rendimento de cada mês passa a render também no mês seguinte: é o famoso ''juros sobre juros''. Por isso o tempo é o maior aliado: começar cedo, mesmo com pouco, costuma valer mais do que começar tarde com muito. O mesmo efeito funciona contra você numa dívida, que cresce rápido quando não é paga.', '[{"rotulo":"Testar no Simulador de Juros Compostos","href":"/financas/simulacoes"},{"rotulo":"Trilha: Juros compostos","href":"/trilhas/uso-consciente-tecnologia"}]'::jsonb, null, null),
  ('cartao', 5, 'Como usar o cartão de crédito sem me enrolar?', '["cartao","credito","fatura","limite","rotativo","pagamento minimo"]'::jsonb, 'O cartão de crédito não é dinheiro a mais: é uma dívida que chega na fatura. Algumas dicas: use só para o que você já pagaria à vista, acompanhe os gastos durante o mês e pague a fatura inteira. Evite pagar só o mínimo: o saldo restante entra no rotativo, que tem alguns dos juros mais altos do mercado.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, null, null),
  ('parcelamento', 6, 'Vale a pena parcelar?', '["parcelar","parcela","parcelamento","prestacao","vezes sem juros","10x"]'::jsonb, 'Parcelar sem juros pode ajudar a organizar o mês, mas cuidado: várias parcelas pequenas juntas viram um valor grande e ocupam sua renda por meses. Antes de parcelar, some todas as parcelas que você já tem. Se houver juros, compare o total a prazo com o preço à vista; muitas vezes vale esperar e juntar o dinheiro.', '[{"rotulo":"Registrar parcelas no Controle de Gastos","href":"/financas"}]'::jsonb, null, null),
  ('dividas', 7, 'Estou com dívida, o que faço?', '["divida","devendo","endividado","negativado","nome sujo","atrasado","atrasada"]'::jsonb, 'Primeiro, respire: dá para sair. 1) Liste todas as dívidas com valor e juros. 2) Pare de fazer dívidas novas. 3) Priorize as de juros mais altos (cartão, cheque especial). 4) Negocie: muitas empresas oferecem desconto para quitar. Se for menor de idade, converse com um adulto de confiança antes de assinar qualquer acordo.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, null, null),
  ('golpes', 8, 'Como evitar golpes no Pix?', '["golpe","pix","fraude","link suspeito","clonado","clonaram","whatsapp","boleto falso"]'::jsonb, 'Desconfie de pressa e de promessas fáceis. Nunca passe códigos que chegam por SMS, não clique em links de ''prêmios'' e confirme por ligação quando alguém pedir dinheiro por mensagem, mesmo que pareça um amigo ou parente. Antes de um Pix, confira o nome de quem vai receber. Se cair num golpe, avise o banco na hora e registre um boletim de ocorrência.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, null, null),
  ('investir', 9, 'Como começar a investir?', '["investir","investimento","aplicar","comecar a investir","tesouro","renda fixa","acoes","bolsa"]'::jsonb, 'Um caminho comum: 1) organize o orçamento, 2) monte a reserva de emergência, 3) defina objetivos com prazo. Para começar, muita gente estuda a renda fixa (como Tesouro Direto e CDBs), que é mais previsível. Renda variável (como ações) oscila mais e combina com prazos longos. Menores de idade precisam de um responsável para abrir conta em corretora. Isto é conteúdo educativo, não recomendação.', '[{"rotulo":"Simular uma carteira","href":"/financas/simulacoes"},{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, null, null),
  ('cdi', 10, 'O que é CDI?', '["cdi","selic","100% do cdi","cdb","poupanca"]'::jsonb, 'O CDI é uma taxa que anda muito perto da Selic (a taxa básica de juros do país) e serve de referência para vários investimentos de renda fixa. Quando um investimento rende ''100% do CDI'', ele acompanha essa taxa. Comparar quanto do CDI cada opção paga ajuda a saber qual rende mais, sempre olhando também o prazo e a segurança.', '[{"rotulo":"Simulador Juros Bancos CDI","href":"/financas/simulacoes"},{"rotulo":"Ver no Glossário","href":"/glossario"}]'::jsonb, null, null),
  ('metas', 11, 'Como juntar dinheiro para algo que eu quero?', '["meta","juntar","objetivo","sonho","economizar","poupar","juntar dinheiro","quanto guardar","guardar pra","guardar dinheiro"]'::jsonb, 'Transforme o desejo em meta: quanto custa e em quantos meses você quer. Divida o valor pelos meses e você tem quanto guardar por mês. Guarde logo que o dinheiro entra (não com o que sobra) e acompanhe o progresso. Se o valor mensal ficar pesado, aumente o prazo ou procure uma versão mais barata.', '[{"rotulo":"Criar uma meta no Perfil","href":"/perfil"},{"rotulo":"Calcular no simulador","href":"/financas/simulacoes"}]'::jsonb, null, null),
  ('primeiro-salario', 12, 'Recebi meu primeiro salário, e agora?', '["salario","primeiro emprego","jovem aprendiz","estagio","holerite","desconto","inss"]'::jsonb, 'Parabéns! Confira o holerite: o valor líquido (que cai na conta) é menor que o bruto por causa de descontos como INSS e vale-transporte. Antes de gastar, separe um valor para guardar, planeje os gastos fixos e só então o lazer. Uma boa ideia é começar a reserva de emergência já no primeiro mês.', '[{"rotulo":"Trilha: Dominando o orçamento","href":"/trilhas/descobrindo-profissoes"}]'::jsonb, null, null),
  ('inflacao', 13, 'O que é inflação?', '["inflacao","ipca","preco subiu","precos subindo","poder de compra"]'::jsonb, 'Inflação é o aumento geral dos preços ao longo do tempo. Com ela, o mesmo dinheiro compra menos no futuro. Por isso deixar o dinheiro parado ''embaixo do colchão'' faz ele perder valor, e vale procurar opções que rendam pelo menos a inflação.', '[{"rotulo":"Ver no Glossário","href":"/glossario"}]'::jsonb, null, null),
  ('xp', 14, 'Como ganho XP e medalhas no site?', '["xp","experiencia","nivel","medalha","conquista","emblema","pontos","avatar"]'::jsonb, 'Você ganha XP lendo blocos das trilhas (+10), fazendo quizzes na primeira tentativa (até +50) e completando os exercícios práticos (+50). Nos exercícios, quanto mais rápido, melhor a medalha: de bronze até diamante. Tudo aparece na página Jornada, junto com seu avatar e os emblemas.', '[{"rotulo":"Ver minha Jornada","href":"/jornada"}]'::jsonb, null, null),
  ('perfil-financeiro', 15, 'Qual é o meu perfil com dinheiro?', '["perfil financeiro","perfil","tipo de pessoa","gastador","gastadora","poupador","poupadora","consumista"]'::jsonb, 'Cada pessoa tem um jeito de lidar com dinheiro. Alguns exemplos comuns: quem gasta por impulso assim que recebe; quem nem sabe quanto tem e para onde foi; quem guarda tudo e tem medo de gastar; e quem planeja antes de decidir. Nenhum perfil é ''errado'', mas reconhecer o seu ajuda a saber o que treinar: anotar gastos, criar metas ou se permitir aproveitar com planejamento.', '[{"rotulo":"Começar a anotar meus gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira'),
  ('mapa-financeiro', 16, 'Como fazer um mapa das minhas finanças?', '["mapa","mapear","mapeamento","diagnostico","analise financeira","raio x","compromissos"]'::jsonb, 'Um mapa financeiro tem três partes: 1) ganhos: tudo o que entra no mês; 2) gastos: fixos (que se repetem) e variáveis (que mudam); 3) compromissos: parcelas e dívidas que já estão marcadas para os próximos meses. Com isso na mão, você vê quanto sobra de verdade e consegue definir um objetivo realista.', '[{"rotulo":"Montar no Controle de Gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Construindo minha Proteção Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/Construindo-minha-Protecao-Financeira'),
  ('impulso', 17, 'Como parar de comprar por impulso?', '["impulso","compulsivo","compulsiva","nao consigo parar","gasto tudo","gastei tudo","ansiedade","promocao","desconto","black friday"]'::jsonb, 'Algumas estratégias que ajudam: espere 24 a 48 horas antes de comprar algo que não estava planejado; saia de listas de promoções e tire o cartão salvo dos apps; vá às compras com lista; e pergunte a si mesmo como está se sentindo. Muita compra por impulso vem de tédio, ansiedade ou vontade de pertencer. Se o dinheiro sai sempre que você está triste ou estressado, vale procurar outras formas de aliviar e conversar com alguém de confiança.', '[{"rotulo":"Escrever no diário de reflexões","href":"/perfil"}]'::jsonb, 'Curso gratuito Construindo minha Proteção Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/Construindo-minha-Protecao-Financeira'),
  ('necessidade-desejo', 18, 'Como saber se é necessidade ou desejo?', '["necessidade","desejo","preciso mesmo","vale a pena comprar","devo comprar","quero comprar"]'::jsonb, 'Necessidade é o que você precisa para viver e cumprir suas obrigações (comida, transporte para a escola, material). Desejo é o que traz prazer, mas pode esperar ou ser substituído. Desejos não são proibidos: o segredo é planejá-los. Um teste rápido: ''se eu não comprar hoje, o que acontece?''. Se a resposta for ''nada'', é desejo, e dá para virar uma meta.', '[{"rotulo":"Transformar em meta","href":"/perfil"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira'),
  ('seguro', 19, 'Para que serve um seguro?', '["seguro","seguros","protecao financeira","proteger","celular roubado","acidente"]'::jsonb, 'Um seguro é um jeito de dividir riscos: você paga um valor combinado e, se acontecer algo previsto no contrato (roubo do celular, acidente, problema de saúde), a seguradora cobre o prejuízo. Ele complementa a reserva de emergência: a reserva cobre imprevistos pequenos, o seguro protege contra perdas grandes. Antes de contratar, leia o que está coberto e o que não está. Menores de idade precisam de um responsável para contratar.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, 'Curso gratuito Construindo minha Proteção Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/Construindo-minha-Protecao-Financeira'),
  ('consumo-consciente', 20, 'O que é consumo consciente?', '["consumo consciente","sustentavel","sustentabilidade","meio ambiente","desperdicio","reutilizar","brecho"]'::jsonb, 'Consumo consciente é pensar no impacto das compras no seu bolso, nas pessoas e no planeta. Na prática: comprar o que realmente vai usar, cuidar para as coisas durarem, consertar antes de trocar, considerar usados e brechós, e evitar desperdício. Além de ajudar o meio ambiente, isso costuma sobrar mais dinheiro para suas metas.', '[{"rotulo":"Ver meus gastos por categoria","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira'),
  ('investimento-sustentavel', 21, 'Existe investimento sustentável?', '["investimento sustentavel","esg","investir sustentavel","empresas sustentaveis","impacto social"]'::jsonb, 'Sim. Investimentos sustentáveis consideram, além do retorno, como as empresas tratam o meio ambiente, as pessoas e a forma como são administradas (a sigla ESG vem daí, em inglês). Vale a mesma regra de qualquer investimento: entender o risco, o prazo e os custos antes de aplicar. Isto é conteúdo educativo, não recomendação.', '[{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira'),
  ('risco-liquidez', 22, 'O que é risco, rentabilidade e liquidez?', '["liquidez","rentabilidade","risco","arriscado","seguranca do investimento","resgatar","sacar"]'::jsonb, 'São três pontos para olhar em qualquer investimento. Rentabilidade: quanto ele rende. Risco: a chance de render menos que o esperado ou até perder dinheiro. Liquidez: a rapidez para você resgatar o dinheiro. Normalmente não dá para ter tudo no máximo: mais rentabilidade costuma vir com mais risco ou menos liquidez. Para a reserva de emergência, a prioridade é segurança e liquidez.', '[{"rotulo":"Simular uma carteira","href":"/financas/simulacoes"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira'),
  ('emprestimo', 23, 'Vale a pena pegar empréstimo?', '["emprestimo","emprestar","financiamento","financiar","consignado","cheque especial","credito pessoal"]'::jsonb, 'Empréstimo é dinheiro de outra pessoa que você devolve com juros, então sempre custa mais do que o valor pego. Ele pode fazer sentido para algo importante e planejado, quando a parcela cabe com folga no orçamento. Para consumo do dia a dia, costuma ser uma armadilha. Compare o Custo Efetivo Total (CET) entre as opções e fuja do cheque especial e do rotativo do cartão, que estão entre os mais caros.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, 'Curso gratuito Construindo minha Proteção Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/Construindo-minha-Protecao-Financeira'),
  ('familia', 24, 'Como conversar sobre dinheiro com minha família?', '["familia","pais","mae","pai","responsavel","conversar sobre dinheiro","contas de casa"]'::jsonb, 'Falar de dinheiro em casa ajuda todo mundo. Escolha um momento calmo, comece perguntando (como vocês organizam as contas? o que pesa mais?) e proponha algo concreto, como anotar os gastos de um mês juntos ou definir uma meta da família. Mostrar o que você está aprendendo aqui também é um bom jeito de puxar o assunto.', '[{"rotulo":"Usar o Controle de Gastos juntos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira'),
  ('renda-extra', 25, 'Como ganhar uma renda extra sendo jovem?', '["renda extra","ganhar dinheiro","bico","trabalhar","vender","freela","freelance","primeiro trabalho"]'::jsonb, 'Algumas ideias: vender algo que você faz (doces, artesanato), oferecer ajuda com tecnologia, aulas de reforço, cuidar de pets ou revender itens que você não usa mais. No Brasil, o trabalho formal é permitido a partir dos 16 anos, e a partir dos 14 como jovem aprendiz. Com qualquer renda, vale a mesma regra: anotar, separar uma parte para guardar e desconfiar de propostas de ''dinheiro fácil'', que costumam ser golpe.', '[{"rotulo":"Trilha: Seu primeiro dinheiro","href":"/trilhas/primeiro-dinheiro"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira')
-- "do nothing": rodar o arquivo de novo NÃO apaga correções feitas pelo painel.
on conflict (id) do nothing;

-- ============================================================================
-- ASSISTENTE DE DÚVIDAS — histórico da conversa
-- ============================================================================
-- Guarda as mensagens do chat de quem está logado, para a conversa continuar
-- em outro dia ou aparelho. Cada pessoa só lê, grava e apaga as PRÓPRIAS
-- mensagens (botão "Limpar conversa" no chat).
--
-- Para não acumular: um trigger mantém só as 100 mensagens mais recentes de
-- cada pessoa. Excluir a conta apaga tudo (on delete cascade).

create table if not exists public.assistente_mensagens (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  autor      text not null check (autor in ('usuario', 'assistente')),
  texto      text not null check (char_length(texto) between 1 and 2000),
  tema_id    text,
  criado_em  timestamptz not null default now()
);

create index if not exists assistente_mensagens_user_idx
  on public.assistente_mensagens (user_id, id desc);

alter table public.assistente_mensagens enable row level security;

drop policy if exists "assistente_mensagens: usuário vê as próprias" on public.assistente_mensagens;
create policy "assistente_mensagens: usuário vê as próprias" on public.assistente_mensagens
  for select using (auth.uid() = user_id);
drop policy if exists "assistente_mensagens: usuário grava as próprias" on public.assistente_mensagens;
create policy "assistente_mensagens: usuário grava as próprias" on public.assistente_mensagens
  for insert with check (auth.uid() = user_id);
drop policy if exists "assistente_mensagens: usuário apaga as próprias" on public.assistente_mensagens;
create policy "assistente_mensagens: usuário apaga as próprias" on public.assistente_mensagens
  for delete using (auth.uid() = user_id);

-- Mantém só as 100 mensagens mais recentes de cada pessoa.
create or replace function public.limitar_historico_assistente()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.assistente_mensagens m
   where m.user_id = new.user_id
     and m.id < (
       select min(r.id) from (
         select id from public.assistente_mensagens
          where user_id = new.user_id
          order by id desc
          limit 100
       ) r
     );
  return new;
end;
$$;

revoke all on function public.limitar_historico_assistente() from public, anon, authenticated;

drop trigger if exists limitar_historico_assistente on public.assistente_mensagens;
create trigger limitar_historico_assistente
  after insert on public.assistente_mensagens
  for each row execute function public.limitar_historico_assistente();

-- ============================================================================
-- ASSISTENTE DE DÚVIDAS — memória (fatos que a pessoa contou no chat)
-- ============================================================================
-- Só guarda o que a pessoa DIZ explicitamente no chat: um objetivo ("quero
-- juntar para um celular de R$ 1.500"), a mesada/renda e como prefere ser
-- chamada. O chat avisa quando anota, e a pessoa vê e apaga tudo pelo botão
-- de memória. Cada pessoa só acessa as próprias memórias; excluir a conta
-- apaga tudo. Limite: 5 objetivos + 1 mesada + 1 apelido por pessoa.

create table if not exists public.assistente_memorias (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  tipo       text not null check (tipo in ('objetivo', 'mesada', 'apelido')),
  texto      text not null check (char_length(texto) between 1 and 120),
  valor      numeric(12, 2) check (valor is null or valor >= 0),
  criado_em  timestamptz not null default now()
);

create index if not exists assistente_memorias_user_idx on public.assistente_memorias (user_id, tipo);

alter table public.assistente_memorias enable row level security;

drop policy if exists "assistente_memorias: usuário vê as próprias" on public.assistente_memorias;
create policy "assistente_memorias: usuário vê as próprias" on public.assistente_memorias
  for select using (auth.uid() = user_id);
drop policy if exists "assistente_memorias: usuário grava as próprias" on public.assistente_memorias;
create policy "assistente_memorias: usuário grava as próprias" on public.assistente_memorias
  for insert with check (auth.uid() = user_id);
drop policy if exists "assistente_memorias: usuário apaga as próprias" on public.assistente_memorias;
create policy "assistente_memorias: usuário apaga as próprias" on public.assistente_memorias
  for delete using (auth.uid() = user_id);

-- Mantém no máximo 5 objetivos por pessoa (apaga os mais antigos).
create or replace function public.limitar_memorias_assistente()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.tipo = 'objetivo' then
    delete from public.assistente_memorias m
     where m.user_id = new.user_id
       and m.tipo = 'objetivo'
       and m.id not in (
         select id from public.assistente_memorias
          where user_id = new.user_id and tipo = 'objetivo'
          order by criado_em desc, id desc
          limit 5
       );
  end if;
  return new;
end;
$$;

revoke all on function public.limitar_memorias_assistente() from public, anon, authenticated;

drop trigger if exists limitar_memorias_assistente on public.assistente_memorias;
create trigger limitar_memorias_assistente
  after insert on public.assistente_memorias
  for each row execute function public.limitar_memorias_assistente();

-- (incluído para instalações novas: temas do chat e texto de XP atualizados)
-- ============================================================================
-- CHAT (IntegraChat) — novos temas do assistente (psicologia financeira, investimentos,
-- organização do ano e crédito). Pode rodar mais de uma vez.
-- ============================================================================

insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url) values
  ('crencas-dinheiro', 26, 'Por que sinto que nunca vou ter dinheiro?', '["nunca vou ter dinheiro","nunca vou ser rico","dinheiro nao e para mim","sorte","azar","crenca","crencas","rico teve sorte","nao nasci rico"]'::jsonb, 'Muita gente carrega frases como ''dinheiro não é pra mim'' ou ''quem tem dinheiro teve sorte''. Essas crenças fazem a gente desistir antes de tentar. Na prática, o que mais pesa no longo prazo são hábitos repetidos: anotar os gastos, guardar um pouco todo mês e evitar dívidas caras. Comece com uma meta pequena e possível. Cada meta cumprida mostra para você mesmo que dá, sim.', '[{"rotulo":"Criar uma meta pequena","href":"/perfil"}]'::jsonb, 'Curso Psicologia financeira: maximizando o potencial financeiro — Alura', 'https://www.alura.com.br/curso-online-psicologia-financeira-maximizando-potencial-financeiro'),
  ('ganhar-mais', 27, 'Ganhar mais resolve meus problemas com dinheiro?', '["ganhar mais","se eu ganhasse mais","aumento","ganho pouco","salario maior","mais dinheiro resolve"]'::jsonb, 'Ajuda, mas não resolve sozinho. É comum que, quando a renda aumenta, os gastos subam junto (mais delivery, mais assinaturas, um celular mais caro) e o aperto continue. O que muda o jogo é o comportamento: quando a renda aumentar, guarde pelo menos parte do aumento antes de ajustar o padrão de vida. Quem organiza pouco dinheiro costuma saber organizar muito.', '[{"rotulo":"Montar meu orçamento","href":"/financas"}]'::jsonb, 'Curso Psicologia financeira: maximizando o potencial financeiro — Alura', 'https://www.alura.com.br/curso-online-psicologia-financeira-maximizando-potencial-financeiro'),
  ('comparacao', 28, 'Por que me comparo com o que os outros compram?', '["comparar","comparo","comparacao","meus amigos tem","todo mundo tem","influencer","influenciador","redes sociais","instagram","tiktok","status"]'::jsonb, 'As redes mostram só a parte bonita: a viagem, o tênis novo, o celular do ano. Você não vê as parcelas, as dívidas ou o que a pessoa deixou de fazer para ter aquilo. Comparar sua vida real com o ''destaque'' dos outros gera vontade de gastar para acompanhar. Uma dica: antes de comprar, pergunte se você quer aquilo para você ou para mostrar para alguém.', '[{"rotulo":"Escrever no diário","href":"/perfil"}]'::jsonb, 'Curso Psicologia financeira: maximizando o potencial financeiro — Alura', 'https://www.alura.com.br/curso-online-psicologia-financeira-maximizando-potencial-financeiro'),
  ('risco-calculado', 29, 'Como correr riscos com dinheiro sem me dar mal?', '["correr risco","risco calculado","arriscar","me dar mal","perder dinheiro","arriscado demais"]'::jsonb, 'Risco calculado é arriscar sabendo o tamanho do tombo. Algumas regras: só use dinheiro que você não vai precisar tão cedo; tenha a reserva de emergência antes; entenda o investimento antes de colocar dinheiro nele; não coloque tudo num lugar só; e desconfie de qualquer promessa de ganho alto e garantido, porque risco e retorno andam juntos.', '[{"rotulo":"Simular uma carteira","href":"/financas/simulacoes"}]'::jsonb, 'Curso Psicologia financeira: maximizando o potencial financeiro — Alura', 'https://www.alura.com.br/curso-online-psicologia-financeira-maximizando-potencial-financeiro'),
  ('armadilhas', 30, 'Quais armadilhas financeiras eu devo evitar?', '["armadilha","armadilhas","bet","bets","aposta","apostas","cassino","tigrinho","ficar rico rapido","dinheiro facil","ganhar dinheiro facil","piramide","renda garantida"]'::jsonb, 'Algumas das mais comuns: promessas de dinheiro fácil ou rendimento garantido muito acima do normal (costuma ser golpe ou pirâmide); apostas online, que são feitas para a casa ganhar no longo prazo e são proibidas para menores de 18 anos; comprar por impulso para aliviar emoções; e acumular parcelas pequenas que viram uma dívida grande. Se algo parece bom demais, pare, pesquise e converse com um adulto de confiança.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, 'Curso Psicologia financeira: maximizando o potencial financeiro — Alura', 'https://www.alura.com.br/curso-online-psicologia-financeira-maximizando-potencial-financeiro'),
  ('perfil-investidor', 31, 'O que é perfil de investidor?', '["perfil de investidor","perfil investidor","conservador","moderado","arrojado","suitability","teste de perfil"]'::jsonb, 'É uma forma de descobrir quanto risco combina com você. Quem é conservador prefere segurança, mesmo rendendo menos; quem é moderado aceita um pouco de oscilação; quem é arrojado topa sobe e desce em troca de um retorno maior no longo prazo. Bancos e corretoras aplicam um questionário antes de você investir. O perfil depende também dos seus objetivos e do prazo: dinheiro para daqui a 3 meses não deve correr o mesmo risco que dinheiro para daqui a 10 anos.', '[{"rotulo":"Simular uma carteira","href":"/financas/simulacoes"}]'::jsonb, null, null),
  ('acoes', 32, 'O que significa comprar ações?', '["acoes","acao","bolsa","bolsa de valores","investir na bolsa","comprar acoes","dividendos","virar socio","b3"]'::jsonb, 'Comprar uma ação é comprar um pedacinho de uma empresa: você vira sócio. Você pode ganhar se a empresa se valorizar ou quando ela divide parte do lucro (os dividendos). Mas o preço sobe e desce todos os dias, e dá para perder dinheiro. Por isso ações combinam com objetivos de longo prazo, com dinheiro que não vai fazer falta, e depois da reserva de emergência. Menores de idade só investem com um responsável.', '[{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, null, null),
  ('fundos', 33, 'O que é um fundo de investimento?', '["fundo de investimento","fundos de investimento","o que e um fundo","taxa de administracao","come cotas","gestor do fundo"]'::jsonb, 'Um fundo junta o dinheiro de muitas pessoas e um gestor profissional decide onde aplicar (renda fixa, ações, vários mercados...). Você compra ''cotas'' do fundo. A vantagem é a praticidade; o custo é a taxa de administração, cobrada todo ano, que diminui o seu ganho. Antes de escolher, compare o tipo do fundo, as taxas, o prazo para resgatar e o risco.', '[{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, null, null),
  ('fundos-imobiliarios', 34, 'O que são fundos imobiliários?', '["fundo imobiliario","fundos imobiliarios","fii","fiis","aluguel sem imovel","investir em imovel"]'::jsonb, 'Fundos imobiliários (FIIs) investem em imóveis, como shoppings, galpões e prédios comerciais, e repassam aos cotistas parte dos aluguéis recebidos. É uma forma de ''receber aluguel'' sem comprar um imóvel inteiro. As cotas são negociadas na bolsa e o preço oscila, então há risco. Como qualquer investimento de renda variável, combina com prazos mais longos.', '[{"rotulo":"Simular uma carteira","href":"/financas/simulacoes"}]'::jsonb, null, null),
  ('previdencia', 35, 'O que é previdência privada?', '["previdencia","previdencia privada","aposentadoria","aposentar","pgbl","vgbl"]'::jsonb, 'Previdência privada é um investimento de longuíssimo prazo, pensado para complementar a renda na aposentadoria. Você contribui ao longo dos anos e o dinheiro é aplicado por uma gestora. Vale observar as taxas cobradas, o tipo de plano e as regras de imposto. Para quem está começando a vida financeira, o caminho costuma ser: orçamento, reserva de emergência e só depois pensar em objetivos tão longos.', '[{"rotulo":"Testar o efeito do tempo no simulador","href":"/financas/simulacoes"}]'::jsonb, null, null),
  ('fgc', 36, 'O que é o FGC?', '["fgc","fundo garantidor","garantia do investimento","banco quebrar","se o banco quebrar"]'::jsonb, 'O FGC (Fundo Garantidor de Créditos) protege parte do seu dinheiro se uma instituição financeira quebrar. Ele cobre, por exemplo, poupança, CDB, LCI e LCA até R$ 250 mil por CPF em cada instituição, respeitando também um limite total em um período de 4 anos. Não cobre tudo: ações, fundos e Tesouro Direto não entram (o Tesouro tem a garantia do governo federal).', '[{"rotulo":"Ver no Glossário","href":"/glossario"}]'::jsonb, null, null),
  ('lci-lca', 37, 'O que são LCI e LCA?', '["lci","lca","letra de credito","carencia","isento de imposto","isenta de imposto"]'::jsonb, 'LCI e LCA são títulos de renda fixa emitidos por bancos para financiar o setor imobiliário (LCI) e o agronegócio (LCA). Para pessoa física, o rendimento é isento de Imposto de Renda e elas contam com a proteção do FGC. O ponto de atenção é a carência: há um prazo mínimo em que o dinheiro fica preso, então não servem para a reserva de emergência.', '[{"rotulo":"Comparar rendimentos no simulador de CDI","href":"/financas/simulacoes"}]'::jsonb, null, null),
  ('imposto-investimentos', 38, 'Investimento paga imposto?', '["imposto","imposto de renda","tabela regressiva","desconto no rendimento","pagar imposto","paga imposto","investimento paga imposto"]'::jsonb, 'Muitos pagam, sobre o rendimento (não sobre o valor investido). Na renda fixa comum, como CDB e Tesouro Direto, a alíquota diminui com o tempo: começa em 22,5% para aplicações de até 6 meses e cai até 15% depois de 2 anos. Alguns investimentos são isentos para pessoa física, como poupança, LCI e LCA. Por isso, na hora de comparar opções, olhe o rendimento depois do imposto.', '[{"rotulo":"Ver no Glossário","href":"/glossario"}]'::jsonb, null, null),
  ('planejamento-anual', 39, 'Como planejar meu dinheiro para o ano inteiro?', '["ano inteiro","planejamento anual","planejar o ano","organizar o ano","comeco de ano","gastos do ano","material escolar","ipva","iptu","decimo terceiro","13o"]'::jsonb, 'Além das contas de todo mês, o ano tem gastos que aparecem só de vez em quando: material escolar, presentes de aniversário e fim de ano, viagens, IPVA e IPTU (se a família tiver). Liste esses gastos, some o total e divida por 12: esse é o valor para separar todo mês, e aí eles não pegam você de surpresa. Se receber algum dinheiro extra, como 13º ou presente, use parte para adiantar esses compromissos.', '[{"rotulo":"Planejar no Controle de Gastos","href":"/financas"}]'::jsonb, 'Vídeo: Como organizar as finanças e usar crédito — Serasa Ensina (YouTube)', 'https://www.youtube.com/watch?v=8RnlxrnOcEY'),
  ('score', 40, 'O que é score de crédito?', '["score","score de credito","meu score","pontuacao de credito","serasa","cadastro positivo","nome limpo","aumentar meu score"]'::jsonb, 'O score é uma pontuação que indica para bancos e lojas a chance de você pagar as contas em dia. Quanto mais alto, mais fácil conseguir crédito com juros menores. Ele sobe com contas pagas em dia, dívidas negociadas e dados atualizados, e cai com atrasos e nome negativado. Quem está começando a vida financeira constrói o score aos poucos, usando crédito com responsabilidade.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, 'Vídeo: Como organizar as finanças e usar crédito — Serasa Ensina (YouTube)', 'https://www.youtube.com/watch?v=8RnlxrnOcEY'),
  ('credito-a-favor', 41, 'Como usar o crédito a meu favor?', '["credito a meu favor","usar credito","credito consciente","quando usar credito","vale usar credito","crediario"]'::jsonb, 'Crédito pode ajudar quando é planejado: para algo importante, com parcela que cabe com folga no orçamento e comparando o custo total (o CET) entre as opções. Vira problema quando cobre gasto do dia a dia ou quando você empilha parcelas. Uma regra prática: se você não conseguiria juntar o dinheiro em alguns meses, pense duas vezes antes de parcelar.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, 'Vídeo: Como organizar as finanças e usar crédito — Serasa Ensina (YouTube)', 'https://www.youtube.com/watch?v=8RnlxrnOcEY')
on conflict (id) do nothing;

-- As palavras "ações" e "bolsa" passaram do tema "investir" para o tema novo "acoes".
update public.assistente_temas
   set palavras = '["investir","investimento","aplicar","comecar a investir","tesouro","renda fixa"]'::jsonb, atualizado_em = now()
 where id = 'investir';

update public.assistente_temas
   set resposta = 'Você ganha XP lendo blocos das trilhas (+10), fazendo quizzes na primeira tentativa (até +100) e completando os exercícios práticos (+70). O nível máximo é o 30, alcançado ao completar tudo com os quizzes gabaritados. Nos exercícios, quanto mais rápido, melhor a medalha: de bronze até diamante. Tudo aparece na página Jornada, junto com seu avatar e os emblemas.',
       atualizado_em = now()
 where id = 'xp';

-- ============================================================================
-- CHAT (IntegraChat) — base de CONHECIMENTO (curso Educação Financeira da Fundação Bradesco)
-- ============================================================================
-- Conteúdos que NÃO aparecem como pergunta pronta (sugerir = false): o chat
-- só responde com eles quando a pessoa pergunta algo relacionado, e junta
-- dois conteúdos numa resposta quando a pergunta toca nos dois.
-- Textos próprios do Integra Jovem, feitos a partir dos módulos do curso
-- (Perfil Financeiro, Análise e Controle, Investimentos e Sustentabilidade).
-- Para acrescentar conteúdo novo: insira uma linha com sugerir = false.

alter table public.assistente_temas add column if not exists sugerir boolean not null default true;

insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('fb-educacao-financeira', 500, 'O que é educação financeira?', '["o que e educacao financeira","educacao financeira","para que serve educacao financeira","por que aprender sobre dinheiro","por que estudar financas"]'::jsonb, 'Educação financeira é aprender a ganhar, gastar e guardar dinheiro com consciência. A gente vive cercado de propaganda, ofertas e crédito fácil, mas o dinheiro que entra tem limite, as contas básicas se repetem todo mês e todo mundo tem planos para o futuro. Com educação financeira você consegue planejar, entender seus hábitos de consumo e decidir quanto poupar e investir.', '[{"rotulo":"Trilha: Seu primeiro dinheiro","href":"/trilhas/primeiro-dinheiro"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-balanca', 501, 'O que é a balança entre ganhos e gastos?', '["receitas e despesas","ganhos e gastos","balanca","saldo positivo","equilibrar ganhos e gastos","receita e despesa"]'::jsonb, 'Pense numa balança: de um lado ficam os ganhos (receitas) do mês e do outro os gastos (despesas). O seu perfil financeiro é o resultado de como você equilibra essa balança. Para conseguir poupar e investir, o lado dos ganhos precisa pesar mais, deixando sempre um saldo positivo.', '[{"rotulo":"Ver meu saldo no Controle de Gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-perfil-endividado', 502, 'Como é o perfil endividado?', '["perfil endividado","o endividado","sou endividado","estou endividado","varios cartoes","sempre devendo","vivo devendo"]'::jsonb, 'O perfil endividado não controla o que ganha e o que gasta, compra por emoção e costuma parcelar tudo, muitas vezes em vários cartões. Como está sempre devendo, paga juros altos, não faz planejamento e não tem objetivos claros; em casos graves, fica com o nome negativado. Além do dinheiro, isso pesa na vida: ansiedade, estresse, insegurança, culpa e até conflitos em casa. O primeiro passo para sair dele é anotar tudo o que entra e sai e parar de fazer dívidas novas.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"},{"rotulo":"Anotar meus gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-perfil-zero-a-zero', 503, 'Como é o perfil zero a zero?', '["zero a zero","empatado","gasto tudo que ganho","tudo que ganho gasto","nao sobra nada","nunca sobra","fim do mes sem dinheiro","dinheiro acaba","acabar antes do fim do mes","dinheiro nao dura","dinheiro some"]'::jsonb, 'O perfil ''zero a zero'' fecha todo mês empatado: tudo o que entra, sai. Ele até consegue pagar as contas e os financiamentos, mas não guarda nada, sente que o dinheiro some rápido e não sabe bem para onde foi. O risco é não ter reserva: quando aparece um imprevisto (um problema de saúde, um conserto, perder o emprego), a saída acaba sendo se endividar. O caminho é descobrir para onde o dinheiro vai e separar um valor para guardar assim que ele entra.', '[{"rotulo":"Definir minha reserva de emergência","href":"/financas"},{"rotulo":"Trilha: Dominando o orçamento","href":"/trilhas/descobrindo-profissoes"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-perfil-poupador', 504, 'Como é o perfil poupador?', '["perfil poupador","o poupador","sou poupador","guardo tudo","so guardo","medo de gastar","mao de vaca","po duro","avarento"]'::jsonb, 'O perfil poupador pensa no futuro, controla bem ganhos e gastos, tem medo de dívidas e economiza em tudo no dia a dia. O ponto fraco é que muitas vezes ele só guarda, sem planejar: deixa tudo na poupança, acaba gastando nas emergências e não faz o dinheiro render. Por isso tem dificuldade de construir patrimônio e chegar à independência financeira. O próximo passo para ele é planejar objetivos e aprender a investir, não só guardar.', '[{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-comprar-a-vista', 505, 'Como juntar para comprar à vista em um ano?', '["comprar a vista","juntar em um ano","poupar para comprar","economizar para comprar","cortar gastos para comprar","planejamento de poupanca","quanto guardar por mes para comprar"]'::jsonb, 'Um bom começo para virar investidor é juntar dinheiro para comprar algo à vista, sem financiamento. Exemplo: um celular de R$ 1.500 em 12 meses pede R$ 125 por mês. Esse valor pode sair de pequenos cortes: R$ 15 em bebidas, R$ 30 em lanches, R$ 40 em roupas, R$ 10 em acessórios e R$ 30 em produtos de beleza, somando exatamente R$ 125 por mês. Guarde num lugar de onde dê para tirar quando precisar, mesmo que renda pouco, e acompanhe mês a mês.', '[{"rotulo":"Criar a meta no Perfil","href":"/perfil"},{"rotulo":"Simular no Simulador de Juros","href":"/financas/simulacoes"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-oniomania', 506, 'O que é oniomania?', '["oniomania","compra compulsiva","compulsao por compras","compulsao","viciado em compras","vicio em compras"]'::jsonb, 'Oniomania é o nome do transtorno de compra compulsiva. A pessoa pensa demais em comprar, perde o controle, compra cada vez mais, tenta parar e não consegue, e usa as compras para aliviar tristeza, ansiedade ou outras emoções ruins. É uma condição reconhecida e tem tratamento: existem serviços especializados, como no Hospital das Clínicas de São Paulo. Se você se identificou, converse com um adulto de confiança e procure ajuda de um profissional de saúde.', '[{"rotulo":"Escrever no diário de reflexões","href":"/perfil"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-desperdicio-dinheiro', 507, 'Onde eu desperdiço dinheiro sem perceber?', '["desperdicio de dinheiro","desperdicar dinheiro","jogando dinheiro fora","onde desperdico","gasto a toa","dinheiro indo embora","onde estou gastando errado","desperdico dinheiro","desperdicando dinheiro"]'::jsonb, 'Alguns jeitos comuns de jogar dinheiro fora: comprar o que não precisa; pagar mais caro só pela marca; comprar parcelado quando daria desconto à vista; pegar empréstimo para coisas não essenciais; trocar celular, roupa ou tênis sem necessidade; comer fora com muita frequência; exagerar nos planos de celular e internet; banhos longos que gastam água e energia; e sustentar vícios, como apostas, álcool ou cigarro.', '[{"rotulo":"Ver meus gastos por categoria","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-habitos-saudaveis', 508, 'Quais hábitos ajudam a equilibrar as contas?', '["habitos financeiros","habitos saudaveis","bons habitos","habitos","equilibrar as contas","antes de comprar","perguntas antes de comprar","lista de compras","dicas para economizar"]'::jsonb, 'Hábitos simples que ajudam muito: antes de comprar, pergunte ''preciso mesmo disso?'', ''preciso comprar hoje?'', ''acho mais barato em outro lugar?'' e ''estou pagando pela marca?''. Evite dívidas, cheque especial e o rotativo do cartão. Desconfie de ofertas milagrosas, corte assinaturas que você não usa, vá ao mercado com lista (e de barriga cheia) e anote todos os seus gastos. Aprender a calcular descontos e acréscimos também evita cair em propaganda enganosa.', '[{"rotulo":"Anotar meus gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-controlar-orcamento', 509, 'Como controlar o orçamento?', '["controlar o orcamento","controlar orcamento","equilibrar o orcamento","diminuir despesas","aumentar receitas","gastar menos ou ganhar mais"]'::jsonb, 'Dá para controlar, sim. Existem só duas alavancas para deixar a balança positiva: diminuir despesas ou aumentar receitas (ou as duas). Com o saldo positivo, sobra dinheiro para poupança e investimentos. E mais importante do que saber quanto você ganha é saber como você gasta: por isso anotar os gastos é o primeiro passo.', '[{"rotulo":"Abrir o Controle de Gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-poupar-investir', 510, 'Qual a diferença entre poupar e investir?', '["diferenca entre poupar e investir","poupar e investir","poupar ou investir","guardar ou investir","guardar e investir"]'::jsonb, 'Poupar é guardar dinheiro: separar uma parte do que entra em vez de gastar. Investir é multiplicar: colocar esse dinheiro guardado para render ao longo do tempo. Primeiro vem o hábito de poupar (e a reserva de emergência); depois, investir faz o dinheiro trabalhar por você. Toda caminhada longa começa com um primeiro passo pequeno.', '[{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-planilha', 511, 'Como usar uma planilha de controle financeiro?', '["planilha","planilha de controle","controle financeiro pessoal","como anotar gastos","onde anotar meus gastos","aplicativo de financas"]'::jsonb, 'Uma planilha de controle financeiro tem três partes: receitas (tudo o que entra), despesas (tudo o que sai) e investimentos. O exercício é preencher a coluna do mês atual com o que você já sabe e ir completando. No Integra Jovem, o Controle de Gastos faz esse papel: registre a renda do mês, os gastos por categoria e acompanhe o saldo e a evolução mensal.', '[{"rotulo":"Abrir o Controle de Gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-porcentagem', 512, 'Como calcular porcentagem?', '["porcentagem","calcular porcentagem","como calcular por cento","calcular desconto","calcular acrescimo","quanto e por cento"]'::jsonb, 'Porcentagem é uma parte de 100. Para calcular 20% de um valor, divida o valor por 100 e multiplique por 20: 20% de 700 = 700 ÷ 100 × 20 = 140. Cuidado com a confusão: 20% sozinho é 0,2 (vinte centésimos); ''20% de 100'' é 20. Saber isso ajuda a conferir descontos, acréscimos e juros.', '[{"rotulo":"Ver no Glossário","href":"/glossario"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-o-que-sao-juros', 513, 'O que são juros?', '["o que sao juros","o que e juros","juros de emprestimo","como calcular juros","juros ao mes"]'::jsonb, 'Juros são uma porcentagem cobrada (ou paga) sobre um valor de dinheiro a cada período. Funciona como o ''preço'' do dinheiro emprestado. Exemplo: se você pega R$ 1.000 emprestados a 4% ao mês, depois de um mês deve R$ 1.000 + 4% = R$ 1.040. Esses R$ 40 são os juros: o que você pagou para usar o dinheiro de outra pessoa. Quando você investe, é o contrário: os juros são o que você recebe.', '[{"rotulo":"Trilha: Juros compostos","href":"/trilhas/uso-consciente-tecnologia"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-juros-compostos-exemplo', 514, 'Como os juros compostos crescem na prática?', '["exemplo de juros compostos","calcular juros compostos","juros compostos na pratica","juros sobre juros exemplo","quanto rende em 40 anos","40 anos","juros compostos crescem","na pratica"]'::jsonb, 'Nos juros compostos, cada mês rende sobre o valor já acumulado. Exemplo: R$ 200 a 2% ao mês viram R$ 204,00 no 1º mês, R$ 208,08 no 2º, R$ 212,24 no 3º e R$ 216,49 no 4º. No longo prazo o efeito é enorme: começando com R$ 200 e depositando R$ 200 por mês durante 40 anos, a 8% ao ano, o total chega perto de R$ 650 mil, sendo que só cerca de R$ 96 mil saíram do seu bolso; o resto são juros. Por isso tempo é dinheiro.', '[{"rotulo":"Testar no Simulador de Juros Compostos","href":"/financas/simulacoes"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-parcelado-juros', 515, 'Compra parcelada tem juros?', '["parcelado tem juros","compra parcelada tem juros","juros escondidos","juros embutidos","sem juros mesmo","parcelamento tem juros"]'::jsonb, 'Muitas vezes, sim: nas compras parceladas costuma existir uma parte de juros embutida no preço, mesmo quando isso não fica claro. A maioria das pessoas não tem o hábito de calcular esses juros. Um teste simples: compare o total parcelado com o preço à vista (e pergunte se há desconto à vista). Se o parcelado sai mais caro, a diferença são os juros.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-onde-investir', 516, 'Em que dá para investir?', '["em que investir","da para investir","investir em que","onde investir","tipos de investimento","ativos reais","renda fixa e renda variavel","rentista","viver de renda"]'::jsonb, 'Há dois grandes caminhos. Ativos reais: imóveis ou abrir um negócio. Aplicações financeiras, que se dividem em renda fixa (como poupança, Tesouro Direto e CDB, com regras de rendimento definidas) e renda variável (como ações, que sobem e descem ao longo do tempo). Quem consegue viver só do rendimento dos investimentos é chamado de rentista. Isto é conteúdo educativo, não recomendação; menores de idade investem com um responsável.', '[{"rotulo":"Simular uma carteira","href":"/financas/simulacoes"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-diversificar', 517, 'Por que diversificar os investimentos?', '["diversificar","diversificacao","ovos na mesma cesta","ovos no mesmo cesto","nao colocar tudo no mesmo lugar","paciencia para investir"]'::jsonb, 'Diversificar é não colocar todos os ovos na mesma cesta: dividir o dinheiro entre tipos diferentes de investimento para que um tombo em um deles não derrube tudo. Junto com a diversificação vem a paciência: investimento dá resultado com tempo, e mexer a toda hora costuma atrapalhar.', '[{"rotulo":"Simular uma carteira diversificada","href":"/financas/simulacoes"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-sustentabilidade', 518, 'O que é sustentabilidade?', '["o que e sustentabilidade","o que significa sustentabilidade","acao sustentavel","acoes sustentaveis","ser sustentavel","sou sustentavel"]'::jsonb, 'Sustentabilidade é conseguir usar o mundo hoje sem estragar os recursos que as próximas gerações vão precisar. Ela envolve questões sociais, de energia, ambientais e políticas, que afetam também a economia. Uma ação é sustentável quando é, ao mesmo tempo, ecologicamente correta (não destrói a natureza), economicamente viável (cabe em custos e prazos reais), socialmente justa (não explora pessoas e gera oportunidades) e culturalmente diversa (respeita os valores de cada comunidade).', '[{"rotulo":"Ver meus gastos com consciência","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-desperdicio-dia-a-dia', 519, 'Como evitar desperdício no dia a dia?', '["evitar desperdicio","desperdicio no dia a dia","torneira aberta","lampada acesa","chuveiro","comida no prato","economizar agua","economizar energia","economizar luz"]'::jsonb, 'Economizar, na maioria das vezes, é só deixar de desperdiçar. Exemplos do dia a dia: torneira aberta enquanto escova os dentes, luz acesa em cômodo vazio, TV ligada sem ninguém assistindo, chuveiro ligado muito antes do banho, comida que sobra no prato ou estraga na geladeira, roupa descartada só porque saiu de moda e celular trocado só por não ser o último modelo. Cada desperdício evitado vira dinheiro e menos impacto no planeta.', '[{"rotulo":"Ver minha conta de energia no Controle de Gastos","href":"/financas"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false),
  ('fb-retrato-brasil', 520, 'Qual é o retrato ambiental e social do Brasil?', '["desigualdade social","concentracao de renda","retrato do brasil","retrato ambiental","desmatamento","agua potavel","falta de agua potavel","lixo no brasil","quanto lixo o brasil","lixoes","dados sobre o lixo","reciclagem no brasil","residuos solidos"]'::jsonb, 'Alguns dados trazidos no curso (de 2019 e 2020) mostram por que sustentabilidade importa: o 1% mais rico do Brasil concentrava 28,3% da renda do país, e os 10% mais ricos, 41,9%. O Brasil tem cerca de 12% da água doce do mundo, mas 35 milhões de pessoas não tinham acesso a água potável. O país produzia perto de 80 milhões de toneladas de lixo por ano, mais da metade ia para lixões, e embora cerca de 30% pudesse ser reaproveitado, só 3% era. Separar o lixo e descartar corretamente já ajuda: ambiente limpo é o que menos se suja.', '[{"rotulo":"Escrever uma reflexão sobre isso","href":"/perfil"}]'::jsonb, 'Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco', 'https://www.ev.org.br/cursos/educacao-financeira', false)
on conflict (id) do nothing;

-- Corrige o conteúdo "Retrato do Brasil" do chat: a palavra "lixo" sozinha
-- fazia QUALQUER mensagem com "lixo" (inclusive ofensas como "site lixo")
-- cair nesse texto. Agora ele só responde a perguntas específicas sobre os
-- dados (ex.: "quanto lixo o Brasil produz?", "lixões", "reciclagem no Brasil").
update public.assistente_temas
   set palavras = '["desigualdade social","concentracao de renda","retrato do brasil","retrato ambiental","desmatamento","agua potavel","falta de agua potavel","lixo no brasil","quanto lixo o brasil","lixoes","dados sobre o lixo","reciclagem no brasil","residuos solidos"]'::jsonb,
       atualizado_em = now()
 where id = 'fb-retrato-brasil';

-- ============================================================================
-- CHAT — "lixo" deixa de puxar o texto do retrato do Brasil
-- ============================================================================
-- 1) Tira a palavra solta "lixo" das palavras-chave de TODOS os temas do banco
--    (o chat agora entende pelo contexto se é reciclagem ou xingamento).
update public.assistente_temas
   set palavras = palavras - 'lixo', atualizado_em = now()
 where palavras ? 'lixo';

-- 2) Palavras-chave do retrato do Brasil: só frases específicas.
update public.assistente_temas
   set palavras = '["desigualdade social","concentracao de renda","retrato do brasil","retrato ambiental","desmatamento","agua potavel","falta de agua potavel","lixo no brasil","quanto lixo o brasil","lixoes","dados sobre o lixo","reciclagem no brasil","residuos solidos"]'::jsonb, atualizado_em = now()
 where id = 'fb-retrato-brasil';

-- 3) Conteúdo novo: como separar o lixo e reciclar (sem pergunta pronta).
insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('separar-lixo-reciclar', 610, 'Como separar o lixo e reciclar?', '["separar o lixo","separar lixo","separacao do lixo","como reciclar","reciclar","reciclagem","lixo reciclavel","coleta seletiva","descartar","descarte","ecoponto","pilhas","lixo eletronico","lixo organico","jogar lixo"]'::jsonb, 'Separar o lixo é simples: deixe de um lado os recicláveis (papel, plástico, metal e vidro), de preferência limpos e secos, e do outro o lixo orgânico (restos de comida) e o que não dá para reciclar. Pilhas, baterias, eletrônicos, remédios vencidos e óleo de cozinha não vão no lixo comum: procure pontos de coleta ou ecopontos na sua cidade. Veja se o seu bairro tem coleta seletiva. Reaproveitar e comprar menos descartáveis também diminui o lixo e, muitas vezes, economiza dinheiro.', '[{"rotulo":"Escrever uma reflexão sobre consumo","href":"/perfil"}]'::jsonb, null, null, false)
on conflict (id) do nothing;

-- ============================================================================
-- CHAT — direitos, deveres e a lei (educação jurídica básica)
-- ============================================================================
-- Respostas educativas sobre crimes e direitos ligados a dinheiro, consumo e
-- dados pessoais (Constituição, Código Penal, CDC, ECA, LGPD, Lei 14.790/2023,
-- Lei 1.521/1951). Sem pergunta pronta (sugerir = false).

insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('lei-nao-pagar-divida', 700, 'É crime não pagar dívida?', '["crime nao pagar divida","e crime nao pagar","nao pagar divida e crime","crime ficar devendo","preso por divida","presa por divida","prisao por divida","vou preso por","vou ser preso","posso ser preso","cadeia por divida","policia por divida","processado por divida","me processar por divida"]'::jsonb, 'Não. Deixar de pagar uma dívida não é crime, e no Brasil ninguém vai preso por dívida: a Constituição só permite prisão civil por pensão alimentícia não paga. Mas não pagar tem consequências: juros e multa, nome negativado (por no máximo 5 anos), cobrança e até ação na Justiça, que pode levar à penhora de alguns bens. Do outro lado, o credor também tem regras: pelo Código de Defesa do Consumidor, a cobrança não pode expor você ao ridículo nem usar ameaça ou constrangimento, e isso pode até ser crime. O melhor caminho é negociar. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, 'Código de Defesa do Consumidor (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm', false),
  ('lei-estelionato', 701, 'O que é crime de estelionato?', '["estelionato","estelionatario","estelionataria","crime de golpe","golpe e crime","fraude eletronica","o que diz a lei sobre golpe","lei do golpe"]'::jsonb, 'Estelionato é o crime de enganar alguém para conseguir uma vantagem, normalmente dinheiro, usando mentira ou truque. Está no artigo 171 do Código Penal, com pena de 1 a 5 anos de prisão e multa. Quando o golpe é feito pela internet, por telefone ou redes sociais (como golpe do Pix, do falso funcionário ou do WhatsApp clonado), a lei prevê a fraude eletrônica, com pena maior: de 4 a 8 anos. Quem foi vítima deve avisar o banco na hora, registrar um boletim de ocorrência e guardar as provas. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, 'Código Penal (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm', false),
  ('lei-pix-errado', 702, 'Recebi um Pix por engano, posso ficar com o dinheiro?', '["pix por engano","pix errado","recebi um pix","dinheiro por engano","transferencia por engano","ficar com o dinheiro","posso ficar com"]'::jsonb, 'Não. Ficar com um dinheiro que caiu na sua conta por engano pode ser crime de apropriação de coisa havida por erro (artigo 169 do Código Penal). O certo é devolver. Mas atenção: existe um golpe em que a pessoa manda um Pix e pede para você devolver para OUTRA conta. Por isso, nunca devolva por transferência nova: use a opção "devolver" no próprio Pix recebido, no aplicativo do banco, ou fale com o banco. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, 'Código Penal (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm', false),
  ('lei-invasao-conta', 703, 'Invadir conta ou clonar cartão é crime?', '["invadir conta e crime","hackear e crime","clonar cartao e crime","clonagem e crime","lei carolina dieckmann","invasao de dispositivo","crime cibernetico","crime virtual","crimes na internet"]'::jsonb, 'Sim. Invadir celular, computador ou contas de outra pessoa sem autorização é crime de invasão de dispositivo informático (artigo 154-A do Código Penal, criado pela Lei Carolina Dieckmann), com pena de 1 a 4 anos de prisão e multa, que aumenta se houver prejuízo. Usar cartão clonado ou dados de outra pessoa para comprar ou transferir dinheiro também é crime, como furto ou fraude eletrônica. Se isso aconteceu com você: troque as senhas, ative a verificação em duas etapas, avise o banco e registre um boletim de ocorrência. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Código Penal (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm', false),
  ('lei-conta-laranja', 704, 'Emprestar a conta para outra pessoa é crime?', '["emprestar conta e crime","emprestar a conta","emprestar conta","emprestar minha conta e crime","conta para outra pessoa","conta laranja e crime","o que e conta laranja","o que e laranja","laranja e crime","emprestar meu pix","lavagem de dinheiro"]'::jsonb, 'Pode ser. Quem empresta a conta, o cartão ou a chave Pix para alguém movimentar dinheiro pode acabar respondendo junto pelo crime que foi cometido com ela, como estelionato ou lavagem de dinheiro (Lei 9.613/1998), mesmo dizendo que não sabia. Além disso, o banco pode bloquear a conta e o seu nome fica ligado à fraude. Por isso: nunca empreste nem ''alugue'' sua conta, mesmo por uma comissão ou para um amigo. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, null, null, false),
  ('lei-piramide', 705, 'Pirâmide financeira é crime?', '["piramide e crime","piramide financeira e crime","esquema de piramide","marketing de piramide","corrente de dinheiro","crime contra a economia popular"]'::jsonb, 'Sim. Pirâmide financeira é crime contra a economia popular (Lei 1.521/1951): é um esquema em que o ''lucro'' de quem entrou antes é pago com o dinheiro de quem entra depois, e não com um produto ou investimento real. Quando param de entrar pessoas novas, o esquema quebra e a maioria perde o dinheiro. Sinais de alerta: rendimento alto e ''garantido'', ganho por trazer novas pessoas e pressa para você entrar. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Lei 1.521/1951 — crimes contra a economia popular (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/leis/l1521.htm', false),
  ('lei-apostas-menores', 706, 'Menor de idade pode apostar em bets?', '["menor pode apostar","menor de idade pode apostar","apostar sendo menor","bet para menor","bets para menores","idade para apostar","apostas sao legais","aposta e legal","lei das bets"]'::jsonb, 'Não. A Lei 14.790/2023 proíbe que menores de 18 anos façam apostas de quota fixa (as chamadas bets), e as empresas autorizadas são obrigadas a impedir o cadastro de menores. Para maiores, só podem operar no Brasil as casas autorizadas pelo Ministério da Fazenda. Mesmo para adultos, apostas não são investimento: são feitas para a casa ganhar no longo prazo e podem viciar. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Lei 14.790/2023 — apostas de quota fixa (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14790.htm', false),
  ('lei-ato-infracional', 707, 'O que acontece se um menor de idade comete um crime?', '["menor comete crime","menor de idade comete crime","menor de idade comete","se um menor","comete um crime","cometer crime sendo menor","menor pode ser preso","ato infracional","medida socioeducativa","medidas socioeducativas","menor responde por crime"]'::jsonb, 'Pela lei, quando um adolescente (de 12 a 17 anos) faz algo que seria crime, isso se chama ato infracional, e ele responde pelo Estatuto da Criança e do Adolescente (ECA). As consequências são medidas socioeducativas, como advertência, obrigação de reparar o dano, prestação de serviços à comunidade, liberdade assistida e, nos casos graves, internação. Ou seja: ser menor não significa ficar sem consequência. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Estatuto da Criança e do Adolescente (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/leis/l8069.htm', false),
  ('lei-furto-roubo', 708, 'Qual a diferença entre furto e roubo?', '["diferenca entre furto e roubo","furto e roubo","o que e furto","o que e roubo","furto ou roubo"]'::jsonb, 'Furto é pegar algo de outra pessoa sem violência, muitas vezes sem a vítima perceber (artigo 155 do Código Penal). Roubo é pegar algo usando violência ou grave ameaça (artigo 157) e tem pena maior. Nos dois casos, a vítima deve registrar um boletim de ocorrência e, se levaram cartão ou celular, bloquear tudo com o banco e a operadora o quanto antes. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Código Penal (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm', false),
  ('lei-cobranca-abusiva', 709, 'O que é cobrança abusiva?', '["cobranca abusiva","cobranca indevida","me cobrando demais","me ameacando por divida","cobrador me ameacou","ligam toda hora cobrando","expor minha divida","constrangimento na cobranca"]'::jsonb, 'Pelo Código de Defesa do Consumidor, quem cobra uma dívida não pode expor você ao ridículo, ameaçar, constranger ou interferir no seu trabalho e no seu descanso; usar ameaça ou constrangimento na cobrança pode até ser crime. E se você pagou algo que não devia, pode ter direito a receber de volta o dobro do que pagou a mais. Guarde provas (mensagens, áudios, prints) e reclame no Procon ou no Consumidor.gov.br. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Código de Defesa do Consumidor (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm', false),
  ('lei-nome-negativado', 710, 'Por quanto tempo o nome fica sujo?', '["quanto tempo nome sujo","quanto tempo o nome fica","nome fica negativado","prazo nome sujo","limpar meu nome","tirar meu nome","paguei e meu nome","nome continua sujo"]'::jsonb, 'Pelo Código de Defesa do Consumidor, uma dívida pode ficar registrada nos cadastros de inadimplentes (como Serasa e SPC) por no máximo 5 anos. Depois disso, o registro deve sair, mesmo que a dívida não tenha sido paga. E quando você paga, o credor tem 5 dias úteis para pedir a retirada do seu nome, segundo o entendimento do Superior Tribunal de Justiça. Se não tirarem, você pode reclamar no Procon. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Código de Defesa do Consumidor (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm', false),
  ('lei-arrependimento', 711, 'Posso desistir de uma compra feita pela internet?', '["direito de arrependimento","desistir da compra","desistir de uma compra","compra feita pela internet","compra pela internet","devolver compra","cancelar compra pela internet","comprei pela internet e quero devolver","7 dias para devolver","sete dias"]'::jsonb, 'Sim. Pelo Código de Defesa do Consumidor, em compras feitas fora da loja física (internet, telefone, aplicativo), você pode desistir em até 7 dias contados da compra ou do recebimento do produto, sem precisar explicar o motivo, e tem direito a receber de volta tudo o que pagou, inclusive o frete. Faça o pedido por escrito e guarde o comprovante. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.', '[]'::jsonb, 'Código de Defesa do Consumidor (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm', false),
  ('lei-lgpd', 712, 'Quais são meus direitos sobre meus dados pessoais?', '["lgpd","lei geral de protecao de dados","protecao de dados","meus dados pessoais","direitos sobre meus dados","apagar meus dados","excluir meus dados","vazamento de dados","vazaram meus dados","o que fazem com meus dados","privacidade dos meus dados"]'::jsonb, 'A LGPD (Lei 13.709/2018) garante que você pode: saber quais dados uma empresa tem sobre você, pedir a correção de dados errados, pedir a exclusão de dados desnecessários, saber com quem eles foram compartilhados e revogar o consentimento. Dados de crianças e adolescentes devem ser tratados sempre no melhor interesse deles. No Integra Jovem, você pode ver e editar seus dados no Perfil e excluir sua conta, o que apaga seus registros. Se seus dados vazaram em algum lugar, troque as senhas, desconfie de mensagens pedindo códigos e pode reclamar na ANPD, a autoridade nacional de proteção de dados. Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública, o Procon ou um advogado.', '[{"rotulo":"Abrir o Perfil","href":"/perfil"}]'::jsonb, 'Lei Geral de Proteção de Dados — LGPD (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm', false)
on conflict (id) do nothing;


insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('lei-roubar-permitido', 713, 'Roubar é permitido?', '["roubar e permitido","e permitido roubar","pode roubar","roubar pode","roubar e crime","roubar e errado","roubar e certo","roubar e legal","roubar e proibido","furtar e permitido","furtar e crime","furtar e errado","furtar e legal","e crime roubar","e crime furtar","roubo e crime","furto e crime","roubar e pecado","pegar sem pedir e crime","roubar pouco","roubar de quem tem muito"]'::jsonb, 'Não. Roubar (pegar algo com violência ou ameaça) e furtar (pegar sem violência) são crimes no Brasil, previstos nos artigos 157 e 155 do Código Penal, com pena de prisão, não importa o valor nem de quem seja. Adolescentes respondem pelo ECA, com medidas socioeducativas. Além disso, sempre prejudica alguém de verdade. Se você está passando por algum aperto, eu posso te ajudar a encontrar saídas legais.', '[]'::jsonb, 'Código Penal (texto oficial — Planalto)', 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm', false)
on conflict (id) do nothing;

update public.assistente_temas set palavras = '["estelionato","estelionatario","estelionataria","crime de golpe","golpe e crime","golpe e permitido","golpe e legal","aplicar golpe e crime","dar golpe e crime","fraude eletronica","o que diz a lei sobre golpe","lei do golpe"]'::jsonb, atualizado_em = now() where id = 'lei-estelionato';
update public.assistente_temas set palavras = '["invadir conta e crime","hackear e crime","hackear e permitido","hackear e legal","invadir e permitido","clonar e permitido","clonar cartao e crime","clonagem e crime","lei carolina dieckmann","invasao de dispositivo","crime cibernetico","crime virtual","crimes na internet"]'::jsonb, atualizado_em = now() where id = 'lei-invasao-conta';



revoke all on all tables in schema public from anon;
grant select on public.assistente_temas to anon;


revoke truncate, trigger, references on all tables in schema public from authenticated;


alter default privileges for role postgres in schema public revoke all on tables from anon;
alter default privileges for role postgres in schema public revoke truncate, trigger, references on tables from authenticated;



revoke insert, update, delete on public.assistente_temas, public.catalogo_exercicios from authenticated;


insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('pix-seguranca', 120, 'Quais são os limites de segurança do Pix?', '["limite do pix","limite pix","pix a noite","pix de noite","pix noturno","limite noturno","seguranca do pix","aumentar limite do pix"]'::jsonb, 'Por segurança, o Banco Central define que, das 20h às 6h, o Pix entre pessoas tem limite de R$ 1.000, somando todas as transferências da noite. Você pode diminuir seus limites quando quiser; para aumentar, o banco leva pelo menos 24 horas. Dica: deixe limites baixos e cadastre só os contatos de confiança para valores maiores.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, 'Pix — Banco Central', 'https://www.bcb.gov.br/estabilidadefinanceira/pix', true),
  ('rotativo-teto', 121, 'A dívida do cartão pode crescer sem limite?', '["divida do cartao cresce","teto do rotativo","limite de juros do cartao","juros do rotativo","lei do rotativo","divida do cartao dobrou","rotativo","divida do cartao","crescer sem limite","pode crescer","cartao pode crescer"]'::jsonb, 'Não pode mais crescer sem fim: desde 2024, pela Lei 14.690/2023, os juros e encargos do rotativo e do parcelamento da fatura não podem passar de 100% do valor original da dívida. Ou seja, ela pode no máximo dobrar. Mesmo assim, é a dívida mais cara que existe: o melhor é pagar a fatura inteira todo mês.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, null, null, true),
  ('cheque-especial', 122, 'O que é cheque especial?', '["cheque especial","limite da conta","saldo negativo","conta no vermelho","conta negativa","ficou no vermelho","no vermelho"]'::jsonb, 'Cheque especial é um empréstimo automático que o banco libera quando sua conta fica negativa. Parece prático, mas os juros são altos: o Banco Central limita a até 8% ao mês. Use só em emergência e por poucos dias. Se ficou no vermelho, cubra o saldo o quanto antes ou troque por um empréstimo mais barato.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, null, null, true),
  ('valores-a-receber', 123, 'Será que tenho dinheiro esquecido no banco?', '["dinheiro esquecido","valores a receber","svr","dinheiro parado no banco","dinheiro perdido no banco"]'::jsonb, 'Dá para conferir! O Banco Central tem o sistema Valores a Receber, que mostra se há dinheiro esquecido em bancos, consórcios ou cooperativas. A consulta é grátis no site oficial valoresareceber.bcb.gov.br, com login gov.br. Atenção: o Banco Central não manda links nem liga. Se você é menor de idade, peça ajuda a um responsável.', '[]'::jsonb, 'Valores a Receber — site oficial do Banco Central', 'https://valoresareceber.bcb.gov.br', true),
  ('debito-credito', 124, 'Qual a diferença entre débito, crédito e pré-pago?', '["debito e credito","debito ou credito","diferenca entre debito","cartao de debito","cartao pre pago","pre pago","cartao pre-pago"]'::jsonb, 'No débito, o dinheiro sai na hora da sua conta: você só gasta o que tem. No crédito, o banco paga agora e você paga depois, na fatura (cuidado para não gastar o que não tem). No pré-pago, você coloca um valor antes e usa até acabar: ótimo para controlar a mesada.', '[{"rotulo":"Trilha: Cartão, crédito e dívidas","href":"/trilhas/quem-eu-sou"}]'::jsonb, null, null, true),
  ('conta-para-menor', 125, 'Menor de idade pode ter conta no banco?', '["menor pode ter conta","conta para menor","conta de menor","abrir conta sendo menor","conta digital para adolescente","conta para adolescente","abrir uma conta","pode ter conta","conta no banco","menor de idade pode ter conta"]'::jsonb, 'Pode, sim! Muitos bancos e contas digitais têm opções para adolescentes, geralmente abertas junto com um responsável, que acompanha o uso. É uma ótima forma de aprender a controlar a mesada. Converse com seus pais ou responsáveis para escolher uma conta sem tarifas e com cartão de débito ou pré-pago.', '[{"rotulo":"Trilha: Seu primeiro dinheiro","href":"/trilhas/primeiro-dinheiro"}]'::jsonb, null, null, true),
  ('poupanca', 126, 'Como funciona a poupança?', '["como funciona a poupanca","rendimento da poupanca","quanto rende a poupanca","poupanca rende","vale a pena a poupanca","caderneta de poupanca"]'::jsonb, 'A poupança é simples e não paga imposto de renda. Quando a Selic está acima de 8,5% ao ano, ela rende 0,5% ao mês mais a TR; quando está igual ou abaixo, rende 70% da Selic mais a TR. O rendimento cai uma vez por mês, no dia do aniversário do depósito. Com a Selic alta, outras opções seguras costumam render mais.', '[{"rotulo":"Comparar no simulador","href":"/financas/simulacoes"}]'::jsonb, null, null, true),
  ('tesouro-direto', 127, 'O que é Tesouro Direto?', '["tesouro direto","tesouro selic","tesouro prefixado","tesouro ipca","titulo publico","titulos publicos"]'::jsonb, 'No Tesouro Direto você empresta dinheiro ao governo e recebe de volta com juros. É considerado um dos investimentos mais seguros do país e dá para começar com pouco. Existem tipos diferentes: o Tesouro Selic é o mais usado para reserva de emergência. Menores de idade investem com a ajuda de um responsável.', '[{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, 'Tesouro Direto — site oficial', 'https://www.tesourodireto.com.br', true),
  ('selic', 128, 'O que é a taxa Selic?', '["o que e selic","taxa selic","selic subiu","selic caiu","copom","taxa basica de juros"]'::jsonb, 'A Selic é a taxa básica de juros do Brasil, definida pelo Copom, do Banco Central, mais ou menos a cada 45 dias. Ela influencia quase tudo: quando sobe, empréstimos ficam mais caros e investimentos de renda fixa rendem mais; quando cai, acontece o contrário. Também é usada para controlar a inflação.', '[{"rotulo":"Trilha: Juros compostos","href":"/trilhas/uso-consciente-tecnologia"}]'::jsonb, null, null, true),
  ('open-finance', 129, 'O que é Open Finance?', '["open finance","open banking","compartilhar meus dados com o banco","compartilhamento de dados"]'::jsonb, 'Open Finance é um sistema regulado pelo Banco Central que permite compartilhar seus dados financeiros entre bancos, só com a sua autorização. Assim, outro banco pode oferecer condições melhores com base no seu histórico. Você escolhe o que compartilhar, por quanto tempo, e pode cancelar quando quiser.', '[]'::jsonb, null, null, true),
  ('jovem-aprendiz', 130, 'Como funciona o Jovem Aprendiz?', '["jovem aprendiz","aprendiz","programa aprendiz","primeiro emprego com 14","trabalhar com 14 anos","trabalhar com 15 anos"]'::jsonb, 'O Jovem Aprendiz é para quem tem de 14 a 24 anos e estuda. Você trabalha com carteira assinada, recebe salário e, ao mesmo tempo, faz um curso de formação profissional. O contrato dura até 2 anos e a jornada é menor, para não atrapalhar a escola. É uma ótima porta para o primeiro emprego.', '[{"rotulo":"Trilha: Seu primeiro dinheiro","href":"/trilhas/primeiro-dinheiro"}]'::jsonb, null, null, true),
  ('direitos-carteira', 131, 'Quais direitos tenho com carteira assinada?', '["carteira assinada","direitos do trabalhador","clt","decimo terceiro","ferias remuneradas","meus direitos no trabalho"]'::jsonb, 'Com carteira assinada (CLT), você tem, entre outros: 13º salário, férias remuneradas com um terço a mais, FGTS depositado pelo empregador, contribuição ao INSS (que conta para a aposentadoria) e descanso semanal. Guarde seus holerites e confira se tudo está sendo pago.', '[{"rotulo":"Trilha: Dominando o orçamento","href":"/trilhas/descobrindo-profissoes"}]'::jsonb, null, null, true),
  ('fgts', 132, 'O que é FGTS?', '["fgts","fundo de garantia","sacar o fgts","saque do fgts"]'::jsonb, 'O FGTS (Fundo de Garantia) é um dinheiro que o empregador deposita todo mês numa conta em seu nome na Caixa, equivalente a 8% do salário, sem descontar do seu pagamento. Ele pode ser sacado em situações como demissão sem justa causa, compra da casa própria ou aposentadoria.', '[]'::jsonb, null, null, true),
  ('cashback', 133, 'Cashback vale a pena?', '["cashback","dinheiro de volta","cash back"]'::jsonb, 'Cashback é quando parte do valor da compra volta para você. Vale a pena se você já ia comprar aquilo e o preço é bom. A armadilha é gastar mais só para "ganhar" o cashback: receber 5% de volta numa compra desnecessária ainda é perder 95%. Compare o preço final em outras lojas.', '[{"rotulo":"Ver meus gastos","href":"/financas"}]'::jsonb, null, null, true),
  ('promocoes', 134, 'Como não cair em armadilhas de promoção?', '["promocao","promocoes","black friday","liquidacao","desconto falso","oferta imperdivel","queima de estoque","armadilhas de promocao","cair em promocao"]'::jsonb, 'Algumas dicas: acompanhe o preço antes da data (sites e apps de comparação ajudam), desconfie de "últimas unidades" e contagens regressivas, compre só em lojas confiáveis e pergunte se você compraria pelo preço cheio. Em compras online, você tem até 7 dias para desistir (direito de arrependimento).', '[{"rotulo":"Ver meus gastos","href":"/financas"}]'::jsonb, null, null, true),
  ('assinaturas', 135, 'Como controlar assinaturas e streamings?', '["assinatura","assinaturas","streaming","streamings","netflix","spotify","mensalidade de app"]'::jsonb, 'Assinaturas pequenas somam muito no fim do mês. Faça uma lista de todas, veja quais você realmente usou no último mês e cancele as outras. Uma ideia é fazer rodízio: assinar um streaming por vez. E cuidado com testes grátis que viram cobrança automática.', '[{"rotulo":"Anotar no Controle de Gastos","href":"/financas"}]'::jsonb, null, null, true),
  ('criptomoedas', 136, 'O que são criptomoedas?', '["criptomoeda","criptomoedas","bitcoin","cripto","ethereum","nft"]'::jsonb, 'Criptomoedas são moedas digitais que não são emitidas por um governo. O preço sobe e desce muito, às vezes num único dia, e há muitos golpes usando o nome delas. Não são indicadas para quem está começando nem para a reserva de emergência. Desconfie de quem promete ganho garantido com cripto.', '[{"rotulo":"Trilha: Protegendo seu dinheiro","href":"/trilhas/saude-emocional"}]'::jsonb, null, null, true),
  ('consorcio', 137, 'O que é consórcio?', '["consorcio","consorcios","carta de credito","contemplado"]'::jsonb, 'Consórcio é um grupo de pessoas que paga parcelas mensais para comprar um bem (carro, moto, imóvel). Todo mês alguém é contemplado por sorteio ou lance. Não tem juros, mas tem taxa de administração, e você pode demorar a ser sorteado. Serve para quem não tem pressa.', '[]'::jsonb, null, null, true),
  ('mesada', 138, 'Como pedir ou negociar uma mesada?', '["mesada","pedir mesada","negociar mesada","aumentar a mesada","semanada"]'::jsonb, 'Converse com seus responsáveis num momento calmo e mostre que você tem um plano: quanto precisa, para quê (lanche, transporte, lazer) e quanto vai guardar. Combine também o que a mesada cobre. Anotar os gastos e mostrar depois ajuda a ganhar confiança e, quem sabe, um aumento!', '[{"rotulo":"Anotar meus gastos","href":"/financas"}]'::jsonb, null, null, true)
on conflict (id) do nothing;


update public.assistente_temas set palavras = '["cartao","credito","fatura","limite","pagamento minimo"]'::jsonb, atualizado_em = now() where id = 'cartao';
update public.assistente_temas set palavras = '["emprestimo","emprestar","financiamento","financiar","consignado","credito pessoal"]'::jsonb, atualizado_em = now() where id = 'emprestimo';
update public.assistente_temas set palavras = '["impulso","compulsivo","compulsiva","nao consigo parar","gasto tudo","gastei tudo","ansiedade"]'::jsonb, atualizado_em = now() where id = 'impulso';
update public.assistente_temas set palavras = '["orcamento","organizar","organizo","controle de gastos","planejar o mes","gastar menos","sobrar dinheiro","sobra"]'::jsonb, atualizado_em = now() where id = 'orcamento';


insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('ser-rico', 140, 'Como faço para ficar rico?', '["ficar rico","ser rico","como ser rico","como ficar rico","ganhar muito dinheiro","enriquecer","fazer fortuna","ficar milionario","ser milionario","quero ser rico","dinheiro rapido","ficar rico rapido"]'::jsonb, 'Não existe fórmula mágica (e quem promete isso quase sempre é golpe). Ficar bem de vida vem de hábitos no longo prazo: estudar e se qualificar para ganhar mais, gastar menos do que recebe, guardar sempre uma parte e deixar os juros compostos trabalharem pelo tempo. É aqui que o Integra Jovem te ajuda: as trilhas e ferramentas foram feitas para você aprender isso desde cedo e se preparar para o futuro.', '[{"rotulo":"Começar pela trilha Seu primeiro dinheiro","href":"/trilhas/primeiro-dinheiro"},{"rotulo":"Trilha: Guardar, poupar e investir","href":"/trilhas/vida-adulta-burocracia"}]'::jsonb, 'Cursos gratuitos de finanças — Banco Central (Cidadania Financeira)', 'https://www.bcb.gov.br/cidadaniafinanceira/cursos', true)
on conflict (id) do nothing;

insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('como-cadastrar', 141, 'Como faço para me cadastrar?', '["como me cadastro","onde me cadastro","como cadastrar","onde cadastrar","como me cadastrar","onde me cadastrar","quero me cadastrar","quero criar conta","criar uma conta","criar conta","fazer cadastro","fazer uma conta","como faco uma conta","como crio uma conta","me cadastrar","cadastro","abrir conta no site","como entro no site","como ter uma conta","quero uma conta"]'::jsonb, 'É rápido e gratuito! Clique em "Criar conta" no topo da página. Você vai precisar de: um nome (ou apelido), um e-mail válido, a sua data de nascimento e uma senha. Depois é só confirmar o e-mail e pronto, sua conta está criada. Aí dá para salvar suas trilhas, metas e gastos.', '[{"rotulo":"Ir para a tela de cadastro","href":"/cadastro"}]'::jsonb, null, null, true),
  ('cadastro-gratis', 142, 'O cadastro é cobrado?', '["cadastro e cobrado","e cobrado","cobra alguma coisa","cobra alguma taxa","tem que pagar","precisa pagar","pago para me cadastrar","pagar para usar","e pago","e gratis","e gratuito","custa alguma coisa","tem custo","preco","quanto custa","tem taxa","cobrado alguma taxa","cobrado para me cadastrar","paga alguma coisa"]'::jsonb, 'Por enquanto o Integra Jovem é totalmente gratuito: você cria a conta e usa tudo sem pagar nada. No futuro, temos planos de transformá-lo num aplicativo com uma versão paga, mas o que existe hoje você aproveita de graça.', '[{"rotulo":"Criar minha conta grátis","href":"/cadastro"}]'::jsonb, null, null, true)
on conflict (id) do nothing;


insert into public.assistente_temas (id, ordem, sugestao, palavras, resposta, links, fonte_rotulo, fonte_url, sugerir) values
  ('como-funciona-site', 143, 'Como funciona o site?', '["como funciona o site","como funciona o integra","como funciona o aplicativo","como usar o site","como usar o integra","o que da para fazer no site","o que tem no site","o que eu faco aqui","para que serve o site","para que serve o integra","como funciona isso","como funciona tudo","me explica o site","o que e o integra jovem","o que e esse site","como esse site funciona","funcionamento do site","o que posso fazer aqui"]'::jsonb, 'O Integra Jovem te ajuda a aprender sobre dinheiro de um jeito prático. Por aqui você pode:
• Fazer as trilhas: cursos curtos com leitura e quizzes.
• Usar o Controle de Gastos: anotar o que entra e sai e ver seu saldo.
• Criar metas e uma reserva no Perfil.
• Testar os simuladores (juros, investimentos).
• Ganhar XP, subir de nível e conquistar medalhas e emblemas conforme avança.
• Falar comigo, o IntegraChat, sempre que tiver uma dúvida.

É grátis: basta criar uma conta para salvar tudo. Por onde quer começar?', '[{"rotulo":"Ver as trilhas","href":"/trilhas"},{"rotulo":"Abrir o Controle de Gastos","href":"/financas"},{"rotulo":"Criar minha conta","href":"/cadastro"}]'::jsonb, null, null, true)
on conflict (id) do nothing;


update public.assistente_temas
   set resposta = 'O Integra Jovem foi criado para ajudar jovens e adolescentes a aprender sobre dinheiro desde cedo e se preparar para o futuro — pensando não só no agora, mas na vida toda. Aqui você:
• Aprende nas trilhas: cursos curtos com leitura e quizzes sobre orçamento, dívidas, golpes e investimentos.
• Controla seus gastos: anota o que entra e sai e acompanha o saldo.
• Cria metas e uma reserva de emergência no Perfil.
• Testa simuladores de juros e investimentos para ver o dinheiro render.
• Ganha XP, sobe de nível e conquista medalhas e emblemas conforme avança.
• Fala comigo, o IntegraChat, sempre que tiver uma dúvida.
Tudo de graça: é só criar uma conta para salvar seu progresso. Por onde quer começar?', atualizado_em = now()
 where id = 'como-funciona-site';


update public.assistente_temas
   set palavras = '["como funciona o site","como funciona o integra","como funciona o aplicativo","como usar o site","como usar o integra","o que da para fazer no site","o que tem no site","o que eu faco aqui","para que serve o site","para que serve o integra","como funciona isso","como funciona tudo","me explica o site","o que e o integra jovem","o que e esse site","como esse site funciona","funcionamento do site","o que posso fazer aqui","funcionalidade do site","funcionalidades do site","qual a funcionalidade","quais as funcionalidades","finalidade do site","finalidade do integra","qual a finalidade","objetivo do site","objetivo do integra","qual o objetivo","proposito do site","proposito do integra","qual o proposito","funcao do site","funcao do integra","qual a funcao","pra que serve","pra que serve o integra","pra que serve o site","por que o site foi criado","por que o integra foi criado","pra que foi criado","para que foi criado","o que o site faz","o que o integra faz","o que esse site faz","sobre o site","sobre o integra jovem","qual o intuito","intuito do site"]'::jsonb, atualizado_em = now()
 where id = 'como-funciona-site';

-- ----------------------------------------------------------------------------
-- Política de leitura do catálogo de exercícios
-- ----------------------------------------------------------------------------
-- catalogo_exercicios guarda a lista fixa de exercícios (não tem dados
-- pessoais). Com RLS ligado e sem política, ninguém lia pelo app; aqui
-- liberamos a LEITURA para todo mundo. A escrita continua bloqueada (só o
-- painel/admin altera).
drop policy if exists "catalogo_exercicios: todos leem" on public.catalogo_exercicios;
create policy "catalogo_exercicios: todos leem" on public.catalogo_exercicios
  for select using (true);

grant select on public.catalogo_exercicios to anon, authenticated;
