-- ============================================================
-- TRANSFERENCIAS entre centros de acopio (dos fases)
-- Fase 1: Admin envía → baja stock en origen
-- Fase 2: Destino recibe → sube stock en destino
-- Ejecutar UNA SOLA VEZ en el SQL Editor de Supabase
-- ============================================================

-- 1. Agregar tipo de movimiento "Transferencia"
insert into public.tipo_movimiento (nombre)
values ('Transferencia')
on conflict (nombre) do nothing;

-- 2. Agregar columnas de estado a movimiento
alter table public.movimiento
  add column if not exists estado text not null default 'completado'
    check (estado in ('enviado', 'recibido', 'completado')),
  add column if not exists recibido_en timestamp with time zone,
  add column if not exists recibido_por uuid references auth.users(id) on delete set null;

-- 3. Función que maneja INSERT y UPDATE de inventario
create or replace function public.actualizar_inventario()
returns trigger as $$
declare
  v_stock_actual numeric;
begin
  -- ============================================================
  -- INSERT — creación del movimiento
  -- ============================================================
  if TG_OP = 'INSERT' then

    -- Entrada: incrementa destino
    if new.tipo_movimiento_id = (select id from public.tipo_movimiento where nombre = 'Entrada') then
      insert into public.inventario (producto_id, institucion_id, cantidad)
      values (new.producto_id, new.institucion_destino_id, new.cantidad)
      on conflict (producto_id, institucion_id)
      do update set 
        cantidad = public.inventario.cantidad + new.cantidad,
        updated_at = now();
      return new;
    end if;

    -- Salida: valida stock y decrementa origen
    if new.tipo_movimiento_id = (select id from public.tipo_movimiento where nombre = 'Salida') then
      select coalesce(cantidad, 0) into v_stock_actual
      from public.inventario
      where producto_id = new.producto_id and institucion_id = new.institucion_origen_id;
      if v_stock_actual < new.cantidad then
        raise exception 'Stock insuficiente: disponible %, requerido %', v_stock_actual, new.cantidad;
      end if;
      insert into public.inventario (producto_id, institucion_id, cantidad)
      values (new.producto_id, new.institucion_origen_id, -new.cantidad)
      on conflict (producto_id, institucion_id)
      do update set 
        cantidad = greatest(public.inventario.cantidad - new.cantidad, 0),
        updated_at = now();
      return new;
    end if;

    -- Transferencia (enviado): valida stock y decrementa origen SOLO
    if new.tipo_movimiento_id = (select id from public.tipo_movimiento where nombre = 'Transferencia') then
      select coalesce(cantidad, 0) into v_stock_actual
      from public.inventario
      where producto_id = new.producto_id and institucion_id = new.institucion_origen_id;
      if v_stock_actual < new.cantidad then
        raise exception 'Stock insuficiente en origen: disponible %, requerido %', v_stock_actual, new.cantidad;
      end if;
      -- Solo decrementa origen (destino se incrementa al recibir)
      insert into public.inventario (producto_id, institucion_id, cantidad)
      values (new.producto_id, new.institucion_origen_id, -new.cantidad)
      on conflict (producto_id, institucion_id)
      do update set 
        cantidad = public.inventario.cantidad - new.cantidad,
        updated_at = now();
      return new;
    end if;

  -- ============================================================
  -- UPDATE — cambio de estado (recibir transferencia)
  -- ============================================================
  elsif TG_OP = 'UPDATE' then
    -- Transferencia marcada como recibida: incrementa destino
    if new.estado = 'recibido' and old.estado = 'enviado' then
      insert into public.inventario (producto_id, institucion_id, cantidad)
      values (new.producto_id, new.institucion_destino_id, new.cantidad)
      on conflict (producto_id, institucion_id)
      do update set 
        cantidad = public.inventario.cantidad + new.cantidad,
        updated_at = now();
      new.recibido_en = now();
      return new;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 4. Vincular la función a INSERT y UPDATE
drop trigger if exists trg_actualizar_inventario on public.movimiento;
create trigger trg_actualizar_inventario
  after insert on public.movimiento
  for each row execute function public.actualizar_inventario();

drop trigger if exists trg_recibir_transferencia on public.movimiento;
create trigger trg_recibir_transferencia
  before update on public.movimiento
  for each row when (old.estado = 'enviado' and new.estado = 'recibido')
  execute function public.actualizar_inventario();
