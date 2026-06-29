-- ============================================================
-- LIMPIAR TODO y empezar de nuevo con geografía
-- 1. Borra todas las instituciones, parroquias, municipios, estados
-- 2. Vuelve a sembrar los 3 estados base
-- 3. Después ejecutar el script de importación
-- ============================================================

-- 1. Eliminar instituciones (si hay)
delete from public.institucion;

-- 2. Eliminar movimientos que referencien parroquias... no, movimiento no referencia parroquia
--    Pero hay que borrar en orden por FKs
delete from public.inventario;
delete from public.movimiento;
delete from public.producto_codigo;
delete from public.producto;
delete from public.parroquia;
delete from public.municipio;
delete from public.estado;

-- 3. Re-sembrar estados base (como en schema.sql)
insert into public.estado (nombre) values 
('Distrito Capital'),
('Miranda'),
('Zulia')
on conflict (nombre) do nothing;

-- 4. Re-sembrar municipios base
insert into public.municipio (nombre, estado_id) values
('Libertador', (select id from public.estado where nombre = 'Distrito Capital')),
('Chacao', (select id from public.estado where nombre = 'Miranda')),
('Maracaibo', (select id from public.estado where nombre = 'Zulia'))
on conflict (nombre, estado_id) do nothing;

-- 5. Re-sembrar parroquias base
insert into public.parroquia (nombre, municipio_id) values
('Catedral', (select id from public.municipio where nombre = 'Libertador' and estado_id = (select id from public.estado where nombre = 'Distrito Capital'))),
('Chacao', (select id from public.municipio where nombre = 'Chacao' and estado_id = (select id from public.estado where nombre = 'Miranda'))),
('Olegario Villalobos', (select id from public.municipio where nombre = 'Maracaibo' and estado_id = (select id from public.estado where nombre = 'Zulia')))
on conflict (nombre, municipio_id) do nothing;
