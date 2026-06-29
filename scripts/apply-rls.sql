-- ============================================================
-- Políticas RLS — Centros de Acopio
-- Usa bloques DO $$ para evitar error si ya existen
-- ============================================================

-- 1. Tabla de usuarios (perfil, vinculada a auth.users)
create table if not exists public.usuarios (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  nombre text not null,
  apellido text not null,
  telefono text,
  institucion_id bigint references public.institucion(id) on delete set null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Habilitar RLS en usuarios
alter table public.usuarios enable row level security;

-- 3. Políticas de usuarios: solo lectura/escritura del propio perfil
create policy "Usuarios ven su propio perfil"
  on public.usuarios for select
  using (id = auth.uid());

create policy "Usuarios insertan su propio perfil"
  on public.usuarios for insert
  with check (id = auth.uid());

create policy "Usuarios actualizan su propio perfil"
  on public.usuarios for update
  using (id = auth.uid());

-- 4. Trigger updated_at para usuarios
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_usuarios_updated_at
  before update on public.usuarios
  for each row execute function public.update_updated_at_column();

-- 5. Políticas de inserción pública (para anon key)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'estado' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.estado for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'municipio' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.municipio for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'parroquia' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.parroquia for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'categoria' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.categoria for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'institucion' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.institucion for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tipo_movimiento' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.tipo_movimiento for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'producto' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.producto for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'producto_codigo' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.producto_codigo for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'movimiento' and policyname = 'Allow public insert') then
    create policy "Allow public insert" on public.movimiento for insert with check (true);
  end if;
end $$;
