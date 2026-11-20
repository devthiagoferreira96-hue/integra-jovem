
create table if not exists public.acessos_usuario (
  user_id  uuid not null references auth.users(id) on delete cascade,
  dia      date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  primary key (user_id, dia)
);

alter table public.acessos_usuario enable row level security;

drop policy if exists "acessos_usuario: usuário vê os próprios" on public.acessos_usuario;
create policy "acessos_usuario: usuário vê os próprios" on public.acessos_usuario
  for select using (auth.uid() = user_id);
drop policy if exists "acessos_usuario: usuário registra o próprio dia" on public.acessos_usuario;
create policy "acessos_usuario: usuário registra o próprio dia" on public.acessos_usuario
  for insert with check (auth.uid() = user_id);

-- Força o dia de hoje (ignora qualquer data enviada pelo navegador).
create or replace function public.acesso_dia_de_hoje()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.dia := (now() at time zone 'America/Sao_Paulo')::date;
  return new;
end;
$$;

drop trigger if exists acesso_dia_de_hoje on public.acessos_usuario;
create trigger acesso_dia_de_hoje
  before insert on public.acessos_usuario
  for each row execute function public.acesso_dia_de_hoje();

-- ----------------------------------------------------------------------------
-- Contador de dias: registro e contagem feitos NO BANCO, numa chamada só
-- ----------------------------------------------------------------------------
-- registrar_acesso() marca o dia de hoje (horário de Brasília) para quem está
-- logado — no máximo uma vez por dia — e devolve o total de dias e a
-- sequência de dias seguidos até hoje. Assim, no primeiro acesso de cada dia
-- novo o total sobe +1, e acessos repetidos no mesmo dia não contam de novo.

alter table public.acessos_usuario
  add column if not exists acessado_em timestamptz not null default now();

create or replace function public.registrar_acesso()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid   uuid := auth.uid();
  hoje  date := (now() at time zone 'America/Sao_Paulo')::date;
  total integer;
  seq   integer;
begin
  if uid is null then
    return null;
  end if;

  insert into public.acessos_usuario (user_id, dia)
  values (uid, hoje)
  on conflict (user_id, dia) do nothing;

  select count(*) into total from public.acessos_usuario where user_id = uid;

  -- Sequência: dias consecutivos terminando hoje. Ordenando do mais recente,
  -- o n-ésimo dia da sequência está exatamente n dias antes de hoje.
  with d as (
    select hoje - a.dia as distancia,
           row_number() over (order by a.dia desc) - 1 as posicao
      from public.acessos_usuario a
     where a.user_id = uid
  )
  select count(*) into seq from d where distancia = posicao;

  return jsonb_build_object('total', total, 'sequencia', seq, 'hoje', hoje);
end;
$$;

revoke all on function public.registrar_acesso() from public, anon;
grant execute on function public.registrar_acesso() to authenticated;
