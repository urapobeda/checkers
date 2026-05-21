create extension if not exists "pgcrypto";

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_id uuid references auth.users(id) on delete set null,
  guest_id uuid references auth.users(id) on delete set null,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'finished')),
  current_turn text not null default 'light' check (current_turn in ('light', 'dark')),
  board jsonb not null default '[]'::jsonb,
  moves jsonb not null default '[]'::jsonb,
  time_control text not null default '10+0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rooms add column if not exists host_id uuid references auth.users(id) on delete set null;
alter table public.rooms add column if not exists guest_id uuid references auth.users(id) on delete set null;
alter table public.rooms add column if not exists status text not null default 'waiting';
alter table public.rooms add column if not exists current_turn text not null default 'light';
alter table public.rooms add column if not exists board jsonb not null default '[]'::jsonb;
alter table public.rooms add column if not exists moves jsonb not null default '[]'::jsonb;
alter table public.rooms add column if not exists time_control text not null default '10+0';
alter table public.rooms add column if not exists created_at timestamptz not null default now();
alter table public.rooms add column if not exists updated_at timestamptz not null default now();

create index if not exists rooms_code_idx on public.rooms (code);
create index if not exists rooms_updated_at_idx on public.rooms (updated_at desc);

alter table public.rooms enable row level security;

drop policy if exists "rooms_select_all" on public.rooms;
create policy "rooms_select_all"
on public.rooms for select
using (true);

drop policy if exists "rooms_insert_all" on public.rooms;
create policy "rooms_insert_all"
on public.rooms for insert
with check (true);

drop policy if exists "rooms_update_all" on public.rooms;
create policy "rooms_update_all"
on public.rooms for update
using (true)
with check (true);

grant select, insert, update on public.rooms to anon, authenticated;

create or replace function public.touch_rooms_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_rooms_updated_at on public.rooms;
create trigger touch_rooms_updated_at
before update on public.rooms
for each row execute function public.touch_rooms_updated_at();

alter table public.rooms replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.rooms;
exception
  when duplicate_object then null;
end;
$$;
