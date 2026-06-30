import { createClient } from 'npm:@supabase/supabase-js@2'

interface AuthUser {
  id: string
  userId: string
  username: string
  nombre: string
  apellido: string
  rol: 'super_admin' | 'admin' | 'operador'
  institucionId: number | null
}

/**
 * Verifica que el caller sea admin/super_admin.
 * Lee el JWT del header Authorization, lo decodifica, busca el perfil en public.usuarios
 * y retorna los datos del usuario admin.
 *
 * @param authHeader - El contenido del header Authorization (Bearer <token>)
 * @returns AuthUser si el usuario existe y tiene rol admin/super_admin
 * @throws Error si no está autenticado o no tiene permisos
 */
export async function verifyAdmin(authHeader: string | null): Promise<AuthUser> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Se requiere autenticación')
  }

  const jwt = authHeader.replace('Bearer ', '').trim()
  const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL') || ''
  const serviceRoleKey = Deno.env.get('SERVICE_ROLE') || ''

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuración de Supabase no encontrada en variables de entorno')
  }

  // Cliente admin (service_role) para consultar la DB
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  // Decodificar el JWT para obtener el user_id del caller
  // El JWT de Supabase tiene el payload en base64
  let userId: string
  try {
    const payload = jwt.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    userId = decoded.sub
    if (!userId) throw new Error('Token inválido: no se encontró sub')
  } catch {
    throw new Error('Token de autenticación inválido')
  }

  // Buscar el perfil del usuario en public.usuarios
  const { data: usuario, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, username, nombre, apellido, rol, institucion_id')
    .eq('id', userId)
    .eq('activo', true)
    .single()

  if (error || !usuario) {
    throw new Error('Usuario no encontrado o inactivo')
  }

  if (usuario.rol !== 'admin' && usuario.rol !== 'super_admin') {
    throw new Error('No tienes permisos de administrador')
  }

  return {
    id: usuario.id,
    userId: usuario.id,
    username: usuario.username,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    rol: usuario.rol,
    institucionId: usuario.institucion_id,
  }
}

/**
 * Verifica que el caller sea super_admin.
 */
export async function verifySuperAdmin(authHeader: string | null): Promise<AuthUser> {
  const user = await verifyAdmin(authHeader)
  if (user.rol !== 'super_admin') {
    throw new Error('Solo super_admin puede realizar esta operación')
  }
  return user
}
