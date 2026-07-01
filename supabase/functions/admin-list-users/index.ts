import { createClient } from 'npm:@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { verifyAdmin } from '../_shared/admin-auth.ts'

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    const admin = await verifyAdmin(req.headers.get('Authorization'))

    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE') || ''
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Parsear query params
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') || '20')))
    const search = url.searchParams.get('search') || ''
    const filtroRol = url.searchParams.get('rol') || ''

    // Construir query
    let query = supabaseAdmin
      .from('usuarios')
      .select('id, username, nombre, apellido, telefono, rol, activo, created_at, institucion:institucion_id (id, nombre)', { count: 'exact' })

    // Filtros de institución: admin solo ve su institución, super_admin ve todo
    if (admin.rol === 'admin' && admin.institucionId) {
      query = query.eq('institucion_id', admin.institucionId)
    }

    if (filtroRol) {
      query = query.eq('rol', filtroRol)
    }

    if (search) {
      const s = search.trim()
      query = query.or(`nombre.ilike.%${s}%,apellido.ilike.%${s}%,username.ilike.%${s}%`)
    }

    // Paginación
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: usuarios, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return jsonResponse({ error: `Error al listar usuarios: ${error.message}` }, 500)
    }

    return jsonResponse({
      usuarios: usuarios || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
    })
  } catch (err) {
    console.error('admin-list-users error:', err.message)
    return jsonResponse({ error: err.message }, 401)
  }
})
