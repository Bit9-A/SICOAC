-- ============================================================
-- CREAR SUPER ADMIN
-- Usuario: admin | Contraseña: admin123
--
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

-- 1. Asegurar que existe el trigger para crear perfiles automáticos
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

-- 2. Crear el usuario en auth.users con contraseña encriptada
-- La contraseña 'admin123' encriptada con bcrypt
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
  'admin@sicoac.com',
  extensions.crypt('admin123', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  format('{"username":"%s","nombre":"%s","apellido":"%s","rol":"%s"}',
    'admin', 'Super', 'Admin', 'super_admin')::jsonb,
  now(),
  now(),
  '', '', '', ''
);

-- 3. Crear identities (necesario para que el usuario pueda iniciar sesión)
insert into auth.identities (
  id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select
  id, id,
  format('{"sub":"%s","email":"%s"}', id::text, 'admin@sicoac.com')::jsonb,
  'email', now(), now(), now()
from auth.users
where email = 'admin@sicoac.com'
  and not exists (
    select 1 from auth.identities where provider = 'email' and user_id = auth.users.id
  );

-- 4. Verificar que el perfil se creó en public.usuarios
-- (el trigger handle_new_user lo crea automáticamente al insertar en auth.users)
-- Si no se creó automáticamente, insertarlo manualmente:
insert into public.usuarios (id, username, nombre, apellido, rol, activo)
select id, 'admin', 'Super', 'Admin', 'super_admin', true
from auth.users
where email = 'admin@sicoac.com'
  and not exists (select 1 from public.usuarios where username = 'admin')
on conflict (id) do nothing;
