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
 * Si no existe, intenta crearlo desde los metadatos de auth
 */
export async function getProfile(userId) {
  if (!userId) return null

  // maybeSingle evita el 406 cuando no hay fila
  const { data, error } = await supabase
    .from('usuarios')
    .select('*, institucion:institucion_id (id, nombre, direccion)')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error al obtener perfil:', error)
    return null
  }

  // Si ya existe, devolverlo
  if (data) return data

  // No existe perfil — intentar crearlo desde la metadata de auth
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.user_metadata) return null

    const meta = user.user_metadata
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert({
        id: userId,
        username: meta.username,
        nombre: meta.nombre,
        apellido: meta.apellido,
        telefono: meta.telefono || null,
        rol: meta.rol || 'operador',
        institucion_id: meta.institucion_id ? Number(meta.institucion_id) : null,
      })
      .select('*, institucion:institucion_id (id, nombre, direccion)')
      .single()

    if (insertError) {
      console.error('No se pudo crear perfil automático:', insertError)
      return null
    }

    // Re-consultar el perfil recién creado
    const { data: newProfile } = await supabase
      .from('usuarios')
      .select('*, institucion:institucion_id (id, nombre, direccion)')
      .eq('id', userId)
      .maybeSingle()

    return newProfile
  } catch (err) {
    console.error('Error al recuperar perfil:', err)
    return null
  }
}

/**
 * Suscribirse a cambios de auth (ej: sesión expirada)
 */
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
