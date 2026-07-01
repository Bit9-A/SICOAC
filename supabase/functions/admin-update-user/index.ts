import { createClient } from 'npm:@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { verifyAdmin } from '../_shared/admin-auth.ts'

interface UpdateUserPayload {
  user_id: string
  username?: string
  nombre?: string
  apellido?: string
  telefono?: string
  cedula?: string
  activo?: boolean
  rol?: 'super_admin' | 'admin' | 'operador'
  institucion_id?: number | null
}

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    const admin = await verifyAdmin(req.headers.get('Authorization'))

    const body: UpdateUserPayload = await req.json()

    if (!body.user_id) {
      return jsonResponse({ error: 'Falta campo requerido: user_id' }, 400)
    }

    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE') || ''
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Obtener datos actuales del usuario objetivo
    const { data: targetUser, error: targetError } = await supabaseAdmin
      .from('usuarios')
      .select('id, rol, institucion_id')
      .eq('id', body.user_id)
      .single()

    if (targetError || !targetUser) {
      return jsonResponse({ error: 'Usuario no encontrado' }, 404)
    }

    // Validar permisos según el rol del admin
    if (admin.rol === 'admin') {
      // Admin solo puede modificar usuarios de su misma institución
      if (targetUser.institucion_id !== admin.institucionId) {
        return jsonResponse({ error: 'No puedes modificar usuarios de otras instituciones' }, 403)
      }
      // Admin no puede cambiar roles ni desactivar super_admins
      if (body.rol && body.rol !== 'operador') {
        return jsonResponse({ error: 'Solo super_admin puede asignar roles admin o super_admin' }, 403)
      }
      if (targetUser.rol === 'super_admin') {
        return jsonResponse({ error: 'No puedes modificar un super_admin' }, 403)
      }
    }

    // Solo super_admin puede cambiar a admin/super_admin o modificar super_admins
    if (body.rol && ['super_admin', 'admin'].includes(body.rol) && admin.rol !== 'super_admin') {
      return jsonResponse({ error: 'Solo super_admin puede asignar este rol' }, 403)
    }

    // Si cambia el username, actualizar también el email en Auth
    if (body.username !== undefined) {
      const newEmail = `${body.username.toLowerCase().trim()}@acopio.app`
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        body.user_id,
        { email: newEmail }
      )
      if (authUpdateError) {
        return jsonResponse({ error: `Error al actualizar email en Auth: ${authUpdateError.message}` }, 500)
      }
    }

    // Construir objeto de actualización para public.usuarios
    const profileUpdate: Record<string, unknown> = {}
    if (body.username !== undefined) profileUpdate.username = body.username.toUpperCase().trim()
    if (body.nombre !== undefined) profileUpdate.nombre = body.nombre.trim()
    if (body.apellido !== undefined) profileUpdate.apellido = body.apellido.trim()
    if (body.telefono !== undefined) profileUpdate.telefono = body.telefono.trim()
    if (body.cedula !== undefined) profileUpdate.cedula = body.cedula.trim()
    if (body.activo !== undefined) profileUpdate.activo = body.activo
    if (body.rol !== undefined) profileUpdate.rol = body.rol
    if (body.institucion_id !== undefined) profileUpdate.institucion_id = body.institucion_id

    if (Object.keys(profileUpdate).length === 0) {
      return jsonResponse({ error: 'No hay campos para actualizar' }, 400)
    }

    const { error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update(profileUpdate)
      .eq('id', body.user_id)

    if (updateError) {
      return jsonResponse({ error: `Error al actualizar usuario: ${updateError.message}` }, 500)
    }

    return jsonResponse({
      message: 'Usuario actualizado exitosamente',
      user_id: body.user_id,
      updated_fields: Object.keys(profileUpdate),
    })
  } catch (err) {
    console.error('admin-update-user error:', err.message)
    return jsonResponse({ error: err.message }, 401)
  }
})
