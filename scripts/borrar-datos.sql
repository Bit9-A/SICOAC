-- ============================================================
-- BORRAR TODOS LOS DATOS del sistema
-- Orden correcto respetando foreign keys
-- ============================================================

-- 1. Desactivar triggers temporalmente para evitar errores de FK
set session_replication_role = replica;

-- 2. Borrar datos (orden inverso al de creación)
delete from movimiento;
delete from inventario;
delete from producto_codigo;
delete from producto;
delete from usuarios;
delete from institucion;
delete from parroquia;
delete from municipio;
delete from estado;
delete from tipo_movimiento;
delete from categoria;

-- 3. Reactivar triggers
set session_replication_role = origin;

-- 4. Resetear secuencias (para que los IDs vuelvan a empezar desde 1)
alter sequence movimiento_id_seq restart with 1;
alter sequence producto_codigo_id_seq restart with 1;
alter sequence producto_id_seq restart with 1;
alter sequence institucion_id_seq restart with 1;
alter sequence parroquia_id_seq restart with 1;
alter sequence municipio_id_seq restart with 1;
alter sequence estado_id_seq restart with 1;
alter sequence tipo_movimiento_id_seq restart with 1;
alter sequence categoria_id_seq restart with 1;
