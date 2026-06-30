/**
 * Auth service — autenticación contra Supabase Auth
 *
 * Usa username como si fuera email: {username}@acopio.app
 * El perfil se crea automáticamente via DB trigger (on_auth_user_created)
 * que lee los metadatos enviados en options.data.
 */
import { supabase } from './supabase'

/**
 * Registro: crea usuario en auth.users
 * El perfil en public.usuarios lo crea el trigger on_auth_user_created
 */
export async function signUp({ username, password, nombre, apellido, telefono, cedula, rol, institucionId, disponibilidadDias, disponibilidadHoraDesde, disponibilidadHoraHasta }) {

  const email = `${username.toLowerCase().trim()}@acopio.app`
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.toUpperCase().trim(),
        nombre,
        apellido,
        cedula: cedula || null,
        telefono: telefono || null,
        rol: rol || 'operador',
        institucion_id: institucionId || null,
        disponibilidad_dias: disponibilidadDias || null,
        disponibilidad_hora_desde: disponibilidadHoraDesde || null,
        disponibilidad_hora_hasta: disponibilidadHoraHasta || null,
      },
    },
  })
  if (authError) {
    throw authError
  }

  if (!authData.user) throw new Error('No se pudo crear el usuario')

  return authData.user
}

/**
 * Inicio de sesión: username + password
 */
export async function signIn({ username, password }) {
  const email = `${username.toLowerCase().trim()}@acopio.app`

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw error
  }

  return data.user
}

/**
 * Cierre de sesión
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

/**
 * Obtener sesión actual
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return null
  }
  return data.session
}

/**
 * Obtener perfil del usuario desde public.usuarios
 */
export async function getProfile(userId) {
  if (!userId) return null
  const { data, error } = await supabase
    .from('usuarios')
    .select('*, institucion:institucion_id (id, nombre, direccion)')
    .eq('id', userId)
    .single()
  if (error) {
    return null
  }
  return data
}

/**
 * Suscribirse a cambios de auth (ej: sesión expirada)
 */
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
