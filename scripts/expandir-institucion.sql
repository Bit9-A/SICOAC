-- ============================================================
-- Expandir tabla institucion con más campos útiles
-- Ejecutar UNA SOLA VEZ en el SQL Editor de Supabase
-- ============================================================

alter table public.institucion
  add column if not exists organizacion text,
  add column if not exists telefono text,
  add column if not exists horario text,
  add column if not exists tipos_ayuda text,       -- separado por | o ,
  add column if not exists acepta_voluntarios boolean not null default false,
  add column if not exists notas text,
  add column if not exists latitud numeric,
  add column if not exists longitud numeric,
  add column if not exists activo boolean not null default true;
