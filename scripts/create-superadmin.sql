-- ============================================================
-- SQL: Crear un usuario super_admin directamente en base de datos
--
-- Ejecutar en el SQL Editor de Supabase.
-- Reemplaza los valores de correo, contraseña, nombre, etc.
-- ============================================================

-- IMPORTANTE: Supabase usa bcrypt para encriptar contraseñas.
-- Usamos extensions.crypt y extensions.gen_salt('bf') para encriptar la clave.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'superadmin@sicoac.com',                                                        -- Correo electrónico
  extensions.crypt('ContraseñaSuperSegura123!', extensions.gen_salt('bf')),        -- Contraseña en texto plano
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"rol":"super_admin","nombre":"Admin","apellido":"General","username":"superadmin","telefono":""}', -- Metadatos del perfil
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- NOTA: El trigger handle_new_user se disparará automáticamente
-- y creará el perfil correspondiente en la tabla public.usuarios con rol 'super_admin'.
