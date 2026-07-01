import { createClient } from 'npm:@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { verifySuperAdmin } from '../_shared/admin-auth.ts'

interface CreateUserPayload {
  username: string
  password: string
  nombre: string
  apellido: string
  rol: 'super_admin' | 'admin' | 'operador'
  institucion_id?: number | null
  telefono?: string
  cedula?: string
  email_confirm?: boolean
}

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    // Verificar que el caller sea super_admin
    const admin = await verifySuperAdmin(req.headers.get('Authorization'))

    const body: CreateUserPayload = await req.json()

    // Validaciones básicas
    if (!body.username || !body.password || !body.nombre || !body.apellido) {
      return jsonResponse({ error: 'Faltan campos requeridos: username, password, nombre, apellido' }, 400)
    }

    if (body.password.length < 6) {
      return jsonResponse({ error: 'La contraseña debe tener al menos 6 caracteres' }, 400)
    }

    const validRoles = ['super_admin', 'admin', 'operador']
    if (body.rol && !validRoles.includes(body.rol)) {
      return jsonResponse({ error: `Rol inválido. Debe ser: ${validRoles.join(', ')}` }, 400)
    }

    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE') || ''
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // 1. Crear usuario en auth.users
    const email = `${body.username.toLowerCase().trim()}@acopio.app`
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: body.password,
      email_confirm: body.email_confirm ?? true,
      user_metadata: {
        username: body.username.toUpperCase().trim(),
        nombre: body.nombre.trim(),
        apellido: body.apellido.trim(),
        rol: body.rol || 'operador',
        telefono: body.telefono || null,
        institucion_id: body.institucion_id || null,
      },
    })

    if (authError) {
      return jsonResponse({ error: `Error al crear usuario: ${authError.message}` }, 400)
    }

    if (!authUser.user) {
      return jsonResponse({ error: 'No se pudo crear el usuario en auth' }, 500)
    }

    // 2. Crear/asegurar perfil en public.usuarios
    const { error: profileError } = await supabaseAdmin
      .from('usuarios')
      .upsert({
        id: authUser.user.id,
        username: body.username.toUpperCase().trim(),
        nombre: body.nombre.trim(),
        apellido: body.apellido.trim(),
        telefono: body.telefono?.trim() || null,
        cedula: body.cedula?.trim() || null,
        rol: body.rol || 'operador',
        institucion_id: body.institucion_id || null,
        activo: true,
      }, { onConflict: 'id' })

    if (profileError) {
      // El usuario de auth se creó pero el perfil falló — log para debug
      console.error('Error al crear perfil:', profileError.message)
    }

    return jsonResponse({
      message: 'Usuario creado exitosamente',
      user: {
        id: authUser.user.id,
        username: body.username.toUpperCase().trim(),
        nombre: body.nombre.trim(),
        apellido: body.apellido.trim(),
        rol: body.rol || 'operador',
      },
    }, 201)
  } catch (err) {
    console.error('admin-create-user error:', err.message)
    return jsonResponse({ error: err.message }, 401)
  }
})
