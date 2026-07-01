/**
 * Admin API — wrappers para Edge Functions de administración.
 *
 * Estas funciones usan el token JWT del admin logueado y llaman
 * a las Edge Functions que operan con service_role key.
 * Ninguna clave sensible sale del servidor.
 */
import { supabase } from './supabase'
import { CONFIG } from './config'

const FUNCTIONS_BASE = `${CONFIG.SUPABASE_URL}/functions/v1`

async function getAuthToken() {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) throw new Error('No hay sesión activa')
  return token
}

async function callFunction(name, payload) {
  const token = await getAuthToken()
  const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en operación de administración')
  return data
}

/**
 * Crear un usuario (auth + perfil).
 * Solo super_admin.
 */
export async function adminCreateUser({ username, password, nombre, apellido, rol, institucion_id, telefono, cedula }) {
  return callFunction('admin-create-user', {
    username, password, nombre, apellido, rol,
    institucion_id: institucion_id ? Number(institucion_id) : null,
    telefono: telefono || null,
    cedula: cedula || null,
    email_confirm: true,
  })
}

/**
 * Resetear contraseña de un usuario.
 * admin: solo usuarios de su misma institución.
 * super_admin: cualquier usuario.
 */
export async function adminResetPassword(userId, newPassword) {
  return callFunction('admin-reset-password', {
    user_id: userId,
    new_password: newPassword,
  })
}

/**
 * Actualizar perfil/rol/estado de un usuario.
 * admin: solo datos básicos de su institución.
 * super_admin: todo.
 */
export async function adminUpdateUser(userId, updates) {
  return callFunction('admin-update-user', {
    user_id: userId,
    ...updates,
  })
}
