-- ============================================================
-- CREAR SUPER ADMIN
-- Usuario: admin | Contraseña: admin123
--
-- Arregla la tabla usuarios (agrega columnas faltantes),
-- crea el trigger de perfil automático, y crea el superadmin.
-- ============================================================

-- 1. PRIMERO: eliminar cualquier FK sobre la columna rol
-- (hay que hacerlo antes de alterar el tipo, o PostgreSQL falla)
do $$ declare
  r record;
begin
  for r in (
    select con.conname
    from pg_constraint con
    join pg_class cls on cls.oid = con.conrelid
    join pg_attribute att on att.attrelid = con.conrelid
      and att.attnum = any(con.conkey)
    where cls.relname = 'usuarios'
      and att.attname = 'rol'
      and con.contype = 'f'
  ) loop
    execute format('alter table public.usuarios drop constraint if exists %I', r.conname);
  end loop;
end $$;

-- 2. Agregar columnas faltantes si no existen
do $$ begin
  if not exists (select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'usuarios' and column_name = 'rol')
  then
    alter table public.usuarios add column rol text not null default 'operador';
  end if;

  if not exists (select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'usuarios' and column_name = 'activo')
  then
    alter table public.usuarios add column activo boolean not null default true;
  end if;
end $$;

-- 3. Asegurar tipo de columna rol (ahora sin FK, esto funciona)
alter table public.usuarios alter column rol type text using rol::text;
alter table public.usuarios alter column rol set default 'operador';

-- 4. Check constraint
alter table public.usuarios drop constraint if exists usuarios_rol_check;
alter table public.usuarios add constraint usuarios_rol_check
  check (rol in ('super_admin', 'admin', 'operador'));

alter table public.usuarios drop constraint if exists usuarios_rol_check;
alter table public.usuarios add constraint usuarios_rol_check
  check (rol in ('super_admin', 'admin', 'operador'));

-- 4. Asegurar que existe el trigger para crear perfiles automáticos
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.usuarios (id, username, nombre, apellido, telefono, rol, institucion_id)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'nombre',
    new.raw_user_meta_data ->> 'apellido',
    new.raw_user_meta_data ->> 'telefono',
    coalesce(new.raw_user_meta_data ->> 'rol', 'operador'),
    (new.raw_user_meta_data ->> 'institucion_id')::bigint
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Crear el usuario en auth.users
insert into auth.users (
  instance_id, id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@acopio.app',
  extensions.crypt('admin123', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  format('{"username":"%s","nombre":"%s","apellido":"%s","rol":"%s"}',
    'admin', 'Super', 'Admin', 'super_admin')::jsonb,
  now(),
  now(),
  '', '', '', ''
);

-- 6. Crear identities (necesario para login)
insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
select
  id, id,
  format('{"sub":"%s","email":"%s"}', id::text, 'admin@acopio.app')::jsonb,
  'email', 'admin@acopio.app', now(), now(), now()
from auth.users
where email = 'admin@acopio.app'
  and not exists (
    select 1 from auth.identities
    where provider = 'email' and user_id = auth.users.id
  );

-- 7. Insertar perfil en public.usuarios si el trigger no lo hizo
insert into public.usuarios (id, username, nombre, apellido, rol, activo)
select id, 'admin', 'Super', 'Admin', 'super_admin', true
from auth.users
where email = 'admin@acopio.app'
  and not exists (select 1 from public.usuarios where username = 'admin')
on conflict (id) do nothing;
