-- ============================================================
-- Políticas RLS — Centros de Acopio
-- Usa bloques DO $$ para evitar error si ya existen
-- ============================================================

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
