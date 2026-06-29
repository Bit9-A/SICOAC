-- Agregar columnas de disponibilidad a usuarios
alter table public.usuarios
  add column if not exists disponibilidad_dias text,
  add column if not exists disponibilidad_hora_desde time,
  add column if not exists disponibilidad_hora_hasta time;

-- Actualizar trigger para que guarde disponibilidad
create or replace function public.handle_new_user()
returns trigger security definer set search_path = public language plpgsql as $$
begin
  insert into public.usuarios (id, username, nombre, apellido, telefono, rol, institucion_id, disponibilidad_dias, disponibilidad_hora_desde, disponibilidad_hora_hasta)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'nombre',
    new.raw_user_meta_data ->> 'apellido',
    new.raw_user_meta_data ->> 'telefono',
    coalesce(new.raw_user_meta_data ->> 'rol', 'operador'),
    (new.raw_user_meta_data ->> 'institucion_id')::bigint,
    new.raw_user_meta_data ->> 'disponibilidad_dias',
    (new.raw_user_meta_data ->> 'disponibilidad_hora_desde')::time,
    (new.raw_user_meta_data ->> 'disponibilidad_hora_hasta')::time
  );
  return new;
end;
$$;
