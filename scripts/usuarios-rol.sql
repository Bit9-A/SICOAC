-- ============================================================
-- Agregar columna rol y activo a usuarios
-- Ejecutar UNA SOLA VEZ en el SQL Editor de Supabase
-- ============================================================

-- 1. Agregar columnas (si no existen)
alter table public.usuarios 
  add column if not exists rol text not null default 'operador'
    check (rol in ('super_admin', 'admin', 'operador'));

alter table public.usuarios
  add column if not exists activo boolean not null default true;

-- 2. Actualizar updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 3. Trigger si no existe
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'update_usuarios_updated_at') then
    create trigger update_usuarios_updated_at
      before update on public.usuarios
      for each row execute function public.update_updated_at_column();
  end if;
end $$;

-- 4. Tu super admin por defecto (cambiar usuario y contraseña después)
-- NOTA: Primero crear el usuario en Auth, después asociar acá
-- insert into public.usuarios (id, username, nombre, apellido, rol, activo)
-- values ('REEMPLAZAR_CON_UUID', 'admin', 'Super', 'Admin', 'super_admin', true);
