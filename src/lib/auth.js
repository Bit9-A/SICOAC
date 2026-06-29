/**
 * Auth service — autenticación contra Supabase Auth
 *
 * Usa username como si fuera email: {username}@acopio.app
 * El perfil se guarda en la tabla public.usuarios vinculada a auth.users
 */
import { supabase } from './supabase'

/**
 * Registro: crea usuario en auth.users + perfil en usuarios
 */
export async function signUp({ username, password, nombre, apellido, telefono, institucionId }) {
  console.log('[Auth] signUp — registrando usuario:', username)

  // 1. Crear usuario en Supabase Auth (email = username + dominio)
  const email = `${username.toLowerCase().trim()}@acopio.app`
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, nombre, apellido } },
  })
  if (authError) {
    console.error('[Auth] signUp ERROR:', authError.message)
    throw authError
  }

  if (!authData.user) throw new Error('No se pudo crear el usuario')

  // 2. Crear perfil en public.usuarios
  const { error: profileError } = await supabase.from('usuarios').insert({
    id: authData.user.id,
    username: username.toLowerCase().trim(),
    nombre,
    apellido,
    telefono: telefono || null,
    institucion_id: institucionId || null,
  })
  if (profileError) {
    console.error('[Auth] signUp — error creando perfil:', profileError.message)
    // Intenta limpiar el auth user si falló el perfil
    await supabase.auth.admin?.deleteUser?.(authData.user.id)
    throw profileError
  }

  console.log('[Auth] signUp OK — usuario creado:', authData.user.id)
  return authData.user
}

/**
 * Inicio de sesión: username + password
 */
export async function signIn({ username, password }) {
  console.log('[Auth] signIn — iniciando sesión:', username)
  const email = `${username.toLowerCase().trim()}@acopio.app`

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error('[Auth] signIn ERROR:', error.message)
    throw error
  }

  console.log('[Auth] signIn OK — usuario:', data.user.id)
  return data.user
}

/**
 * Cierre de sesión
 */
export async function signOut() {
  console.log('[Auth] signOut')
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('[Auth] signOut ERROR:', error.message)
    throw error
  }
}

/**
 * Obtener sesión actual
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('[Auth] getSession ERROR:', error.message)
    return null
  }
  console.log('[Auth] getSession —', data.session ? `activa (${data.session.user.id})` : 'inactiva')
  return data.session
}

/**
 * Obtener perfil del usuario desde public.usuarios
 */
export async function getProfile(userId) {
  if (!userId) return null
  console.log('[Auth] getProfile — consultando perfil de:', userId)
  const { data, error } = await supabase
    .from('usuarios')
    .select('*, institucion:institucion_id (id, nombre, direccion)')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('[Auth] getProfile ERROR:', error.message)
    return null
  }
  console.log('[Auth] getProfile OK —', data.username)
  return data
}

/**
 * Suscribirse a cambios de auth (ej: sesión expirada)
 */
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('[Auth] onAuthStateChange — evento:', event, session ? `user=${session.user.id}` : 'sin sesión')
    callback(event, session)
  })
}
