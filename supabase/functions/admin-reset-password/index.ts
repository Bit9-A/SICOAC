import { createClient } from 'npm:@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { verifyAdmin } from '../_shared/admin-auth.ts'

interface ResetPasswordPayload {
  user_id: string
  new_password: string
}

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    // Verificar que el caller sea admin+
    const admin = await verifyAdmin(req.headers.get('Authorization'))

    const body: ResetPasswordPayload = await req.json()

    // Validaciones
    if (!body.user_id || !body.new_password) {
      return jsonResponse({ error: 'Faltan campos requeridos: user_id, new_password' }, 400)
    }

    if (body.new_password.length < 6) {
      return jsonResponse({ error: 'La contraseña debe tener al menos 6 caracteres' }, 400)
    }

    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE') || ''
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Si es admin (no super_admin), verificar que el usuario pertenezca a su misma institución
    if (admin.rol === 'admin') {
      const { data: targetUser, error: targetError } = await supabaseAdmin
        .from('usuarios')
        .select('institucion_id')
        .eq('id', body.user_id)
        .single()

      if (targetError || !targetUser) {
        return jsonResponse({ error: 'Usuario no encontrado' }, 404)
      }

      if (targetUser.institucion_id !== admin.institucionId) {
        return jsonResponse({ error: 'No puedes resetear contraseñas de usuarios de otras instituciones' }, 403)
      }
    }

    // Resetear contraseña usando Auth Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      body.user_id,
      { password: body.new_password }
    )

    if (updateError) {
      return jsonResponse({ error: `Error al actualizar contraseña: ${updateError.message}` }, 400)
    }

    return jsonResponse({
      message: 'Contraseña actualizada exitosamente',
      user_id: body.user_id,
    })
  } catch (err) {
    console.error('admin-reset-password error:', err.message)
    return jsonResponse({ error: err.message }, 401)
  }
})
