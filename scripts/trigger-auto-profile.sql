-- ============================================================
-- TRIGGER: Crear perfil automático al registrarse
--
-- Cuando un usuario se crea en auth.users (via signUp),
-- este trigger crea automáticamente el perfil en public.usuarios
-- usando los metadatos enviados desde el cliente.
--
-- Corre con SECURITY DEFINER, lo que bypassea RLS.
--
-- Ejecutar UNA SOLA VEZ en el SQL Editor de Supabase.
-- ============================================================

-- 1. Crear la función que se ejecutará en el trigger
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

-- 2. Vincular la función al evento AFTER INSERT en auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
