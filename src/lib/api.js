import { supabase } from './supabase'
import { CONFIG } from './config'
import { normalizeText } from './utils'
import db, { searchLocalProducts, findLocalProductByBarcode } from './local-db'

const isOnline = () => navigator.onLine !== false

export async function initializeDbData() {
  if (!isConfigured()) return

  try {
    // 1. Check if estado table is empty
    const { data: checkEstados, error: chkErr } = await supabase
      .from('estado')
      .select('id')
      .limit(1)

    if (chkErr) {
      return
    }

    if (!checkEstados || checkEstados.length === 0) {
      // Seeding Estados
      const { data: newEsts, error: estErr } = await supabase
        .from('estado')
        .insert([
          { nombre: 'Distrito Capital' },
          { nombre: 'Miranda' },
          { nombre: 'Zulia' }
        ])
        .select()

      if (estErr) throw estErr

      const dc = newEsts.find((e) => e.nombre === 'Distrito Capital')
      const mir = newEsts.find((e) => e.nombre === 'Miranda')
      const zul = newEsts.find((e) => e.nombre === 'Zulia')

      // Seeding Municipios
      const { data: newMuns, error: munErr } = await supabase
        .from('municipio')
        .insert([
          { nombre: 'Libertador', estado_id: dc.id },
          { nombre: 'Chacao', estado_id: mir.id },
          { nombre: 'Maracaibo', estado_id: zul.id }
        ])
        .select()

      if (munErr) throw munErr

      const lib = newMuns.find((m) => m.nombre === 'Libertador')
      const cha = newMuns.find((m) => m.nombre === 'Chacao')
      const mcbo = newMuns.find((m) => m.nombre === 'Maracaibo')

      // Seeding Parroquias
      const { error: parqErr } = await supabase
        .from('parroquia')
        .insert([
          { nombre: 'Catedral', municipio_id: lib.id },
          { nombre: 'Chacao', municipio_id: cha.id },
          { nombre: 'Olegario Villalobos', municipio_id: mcbo.id }
        ])

      if (parqErr) throw parqErr
    }

    // 2. Seeding Categorias if empty
    const { data: checkCats } = await supabase.from('categoria').select('id').limit(1)
    if (!checkCats || checkCats.length === 0) {
      await supabase.from('categoria').insert([
        { nombre: 'Nutrición y alimentos' },
        { nombre: 'Salud y Farmacia' },
        { nombre: 'Higiene y sanitarios' },
        { nombre: 'Refugio' },
        { nombre: 'Textil y vestimenta' }
      ])
    }

    // 3. Seeding Tipo Movimiento if empty
    const { data: checkTipos } = await supabase.from('tipo_movimiento').select('id').limit(1)
    if (!checkTipos || checkTipos.length === 0) {
      await supabase.from('tipo_movimiento').insert([
        { nombre: 'Entrada' },
        { nombre: 'Salida' }
      ])
    }
  } catch (error) {
  }
}

export async function getEstados() {
  const cached = await db.estados.toArray()
  if (cached.length > 0) return cached

  const { data, error } = await supabase.from('estado').select('id, nombre').order('nombre')
  if (error) throw error
  const mapped = data.map((e) => ({ value: e.id, label: e.nombre }))
  await db.estados.bulkPut(mapped)
  return mapped
}

export async function getMunicipios(estadoId) {
  if (!estadoId) return []
  const cached = await db.municipios.where({ estadoId }).toArray()
  if (cached.length > 0) return cached

  const { data, error } = await supabase
    .from('municipio')
    .select('id, nombre')
    .eq('estado_id', estadoId)
    .order('nombre')
  if (error) throw error
  const mapped = data.map((m) => ({ value: m.id, label: m.nombre, estadoId }))
  await db.municipios.bulkPut(mapped)
  return mapped
}

export async function getParroquias(municipioId) {
  if (!municipioId) return []
  const cached = await db.parroquias.where({ municipioId }).toArray()
  if (cached.length > 0) return cached

  const { data, error } = await supabase
    .from('parroquia')
    .select('id, nombre')
    .eq('municipio_id', municipioId)
    .order('nombre')
  if (error) throw error
  const mapped = data.map((p) => ({ value: p.id, label: p.nombre, municipioId }))
  await db.parroquias.bulkPut(mapped)
  return mapped
}

export async function getInstituciones() {
  const cached = await db.instituciones.toArray()
  if (cached.length > 0) return cached

  const { data, error } = await supabase
    .from('institucion')
    .select('id, nombre, direccion, parroquia_id, parroquia:parroquia_id (id, nombre, municipio:municipio_id (id, nombre, estado_id))')
    .order('nombre')
  if (error) throw error
  const mapped = data.map((i) => {
    const p = i.parroquia
    const m = p?.municipio
    return {
      value: i.id,
      label: i.nombre,
      direccion: i.direccion,
      parroquiaId: i.parroquia_id,
      parroquiaNombre: p?.nombre || '',
      municipioId: m?.id || null,
      municipioNombre: m?.nombre || '',
      estadoId: m?.estado_id || null,
    }
  })
  await db.instituciones.bulkPut(mapped)
  return mapped
}

export async function createInstitucion(nombre, direccion, parroquiaId) {
  const { data, error } = await supabase
    .from('institucion')
    .insert([{ nombre: normalizeText(nombre), direccion: normalizeText(direccion), parroquia_id: parroquiaId }])
    .select()
  if (error) {
    throw error
  }
  return { value: data[0].id, label: data[0].nombre, direccion: data[0].direccion, parroquiaId: data[0].parroquia_id }
}

export async function getCategorias() {
  const cached = await db.categorias.toArray()
  if (cached.length > 0) return cached

  const { data, error } = await supabase.from('categoria').select('id, nombre').order('nombre')
  if (error) throw error
  const mapped = data.map((c) => ({ value: c.id, label: c.nombre }))
  await db.categorias.bulkPut(mapped)
  return mapped
}

export async function createCategoria(nombre) {
  const { data, error } = await supabase
    .from('categoria')
    .insert([{ nombre: normalizeText(nombre) }])
    .select()
  if (error) {
    throw error
  }
  return { value: data[0].id, label: data[0].nombre }
}

export async function getSubcategorias() {
  const cached = await db.subcategorias.toArray()
  if (cached.length > 0) return cached

  const { data, error } = await supabase
    .from('subcategoria')
    .select('id, nombre, categoria_id, categoria:categoria_id(nombre)')
    .order('nombre')
  if (error) throw error
  const mapped = data.map((s) => ({ value: s.id, label: s.nombre, categoriaId: s.categoria_id, categoriaNombre: s.categoria?.nombre }))
  await db.subcategorias.bulkPut(mapped)
  return mapped
}

export async function createSubcategoria(nombre, categoriaId) {
  const { data, error } = await supabase
    .from('subcategoria')
    .insert([{ nombre: normalizeText(nombre), categoria_id: categoriaId }])
    .select()
  if (error) throw error
  return { value: data[0].id, label: data[0].nombre, categoriaId: data[0].categoria_id }
}

export async function searchBarcodes(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.trim()
  const { data, error } = await supabase
    .from('producto_codigo')
    .select('codigo, producto_id, producto (id, nombre, descripcion, presentacion, categoria_id, subcategoria_id)')
    .ilike('codigo', `%${q}%`)
    .limit(8)

  if (error) {
    return []
  }

  return data.map((item) => ({
    value: item.codigo,
    label: `${item.producto.nombre} [${item.codigo}]`,
    detail: item.producto.descripcion || item.producto.presentacion || null,
    productId: item.producto_id,
    productName: item.producto.nombre,
    description: item.producto.descripcion || '',
    presentation: item.producto.presentacion || '',
    categoryId: item.producto.categoria_id,
    subcategoriaId: item.producto.subcategoria_id,
  }))
}

export async function searchProducts(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.trim()

  // Buscar local primero
  const localResults = await searchLocalProducts(q)
  if (localResults.length > 0) {
    return localResults.map(formatProduct)
  }

  // Si no hay local, buscar en Supabase y cachear
  const { data, error } = await supabase
    .from('producto')
    .select('id, nombre, descripcion, presentacion, categoria_id, subcategoria_id, categoria:categoria_id (nombre), producto_codigo (codigo)')
    .ilike('nombre', `%${q}%`)
    .limit(8)

  if (error) return []

  const mapped = data.map(mapProductRow)
  await cacheProducts(mapped, data)
  return mapped
}

function formatProduct(p) {
  return {
    value: String(p.value),
    label: p.label,
    detail: p.detail || null,
    productId: p.value,
    productName: p.label,
    description: p.description || '',
    categoryId: p.categoryId,
    subcategoriaId: p.subcategoriaId,
    presentation: p.presentation || '',
    barcode: p.barcode || '',
  }
}

function mapProductRow(item) {
  const cats = Array.isArray(item.categoria) ? item.categoria[0] : item.categoria
  const codes = Array.isArray(item.producto_codigo) ? item.producto_codigo : []
  return {
    value: item.id,
    label: item.nombre,
    detail: [cats?.nombre, item.presentacion].filter(Boolean).join(' · ') || null,
    productId: item.id,
    productName: item.nombre,
    description: item.descripcion || '',
    categoryId: item.categoria_id,
    subcategoriaId: item.subcategoria_id,
    presentation: item.presentacion || '',
    barcode: codes[0]?.codigo || '',
  }
}

async function cacheProducts(mapped, rawRows) {
  const toCache = mapped.map((p) => ({
    value: p.value,
    label: p.label,
    detail: p.detail,
    categoryId: p.categoryId,
    subcategoriaId: p.subcategoriaId,
    presentation: p.presentation,
    description: p.description,
    barcode: p.barcode,
  }))
  await db.productos.bulkPut(toCache)

  for (const p of mapped) {
    if (p.barcode) {
      await db.productoCodigos.put({ value: p.barcode, codigo: p.barcode, productoId: p.value })
    }
  }
}

export async function findProductByBarcode(barcode) {
  if (!barcode) return null
  const code = barcode.trim()

  // Buscar local primero
  const local = await findLocalProductByBarcode(code)
  if (local) {
    return {
      id: local.value,
      productName: local.label,
      description: local.description || '',
      presentation: local.presentation || '',
      categoryId: local.categoryId,
      subcategoriaId: local.subcategoriaId,
    }
  }

  // Buscar en Supabase
  const { data, error } = await supabase
    .from('producto_codigo')
    .select('producto_id, producto (id, nombre, descripcion, presentacion, categoria_id, subcategoria_id)')
    .eq('codigo', code)
    .maybeSingle()

  if (error || !data?.producto) return null

  const prod = {
    id: data.producto.id,
    productName: data.producto.nombre,
    description: data.producto.descripcion,
    presentation: data.producto.presentacion,
    categoryId: data.producto.categoria_id,
    subcategoriaId: data.producto.subcategoria_id,
  }

  // Cachear producto encontrado
  await db.productos.put({
    value: prod.id,
    label: prod.productName,
    description: prod.description,
    presentation: prod.presentation,
    categoryId: prod.categoryId,
    subcategoriaId: prod.subcategoriaId,
    barcode: code,
  })
  await db.productoCodigos.put({ value: code, codigo: code, productoId: prod.id })

  return prod
}

export async function sendRecord(record) {
  // Guardar local primero (offline-first)
  const localEntry = {
    ...record,
    createdAt: new Date().toISOString(),
  }
  const localId = await db.movimientos.add(localEntry)

  // Si no hay conexión, encolar para después
  if (!isOnline() || !isConfigured()) {
    incrementSessionCount()
    return { localId, synced: false }
  }

  // Online: enviar a Supabase
  try {
    return await syncRecordToSupabase(record)
  } catch (err) {
    // Si falla, queda en Dexie + cola offline
    addToQueue(record)
    throw err
  }
}

/**
 * Envía un registro a Supabase (la lógica original).
 * Separada para poder llamarla desde sync offline también.
 */
async function syncRecordToSupabase(record) {
  if (!isConfigured()) {
    throw new Error('Credenciales de Supabase no configuradas')
  }

  // 1. Resolve Category ID
  let finalCategoryId = record.categoryId
  if (isNaN(Number(record.categoryId))) {
    const newCat = await createCategoria(record.categoryId)
    finalCategoryId = newCat.value
  }

  // 2. Find or Create Product
  let finalProductId = null
  let existingProduct = null

  if (record.barcode) {
    existingProduct = await findProductByBarcode(record.barcode)
  }

  if (!existingProduct && record.productName) {
    const { data: prodByName } = await supabase
      .from('producto')
      .select('id, nombre')
      .eq('nombre', normalizeText(record.productName))
      .maybeSingle()

    if (prodByName) {
      existingProduct = { id: prodByName.id, productName: prodByName.nombre }
      if (record.barcode) {
        const { error: codeErr } = await supabase
          .from('producto_codigo')
          .insert([{ producto_id: prodByName.id, codigo: record.barcode.trim() }])
        if (codeErr && !codeErr.message?.includes('duplicate')) throw codeErr
      }
    }
  }

  if (existingProduct) {
    finalProductId = existingProduct.id
    await supabase
      .from('producto')
      .update({
        nombre: normalizeText(record.productName) || existingProduct.productName,
        descripcion: normalizeText(record.description) || existingProduct.description,
        categoria_id: finalCategoryId,
        subcategoria_id: record.subcategoriaId || null,
      })
      .eq('id', finalProductId)
  } else {
    const { data: newProd, error: prodErr } = await supabase
      .from('producto')
      .insert([{
        nombre: normalizeText(record.productName),
        descripcion: normalizeText(record.description || ''),
        categoria_id: finalCategoryId,
        subcategoria_id: record.subcategoriaId || null,
        institucion_id: record.institucionId || null,
      }])
      .select()
    if (prodErr) throw prodErr
    finalProductId = newProd[0].id

    if (record.barcode) {
      const { error: codeErr } = await supabase
        .from('producto_codigo')
        .insert([{ producto_id: finalProductId, codigo: record.barcode.trim() }])
      if (codeErr) throw codeErr
    }
  }

  // 3. Movement Type ID
  const { data: tmData, error: tmErr } = await supabase
    .from('tipo_movimiento')
    .select('id')
    .eq('nombre', record.tipoMovimiento)
    .single()
  if (tmErr) throw tmErr

  // 4. Insert Movement
  const isTransferencia = record.tipoMovimiento === 'Transferencia'
  const { data: movData, error: movErr } = await supabase
    .from('movimiento')
    .insert([{
      producto_id: finalProductId,
      cantidad: Number(record.quantity) || 1,
      unidad: record.presentation || 'unidades',
      peso_unitario: record.peso_unitario || null,
      institucion_origen_id: isTransferencia ? record.institucionOrigenId : (record.tipoMovimiento === 'Salida' ? record.institucionId : null),
      institucion_destino_id: isTransferencia ? record.institucionDestinoId : (record.tipoMovimiento === 'Entrada' ? record.institucionId : null),
      tipo_movimiento_id: tmData.id,
      estado: isTransferencia ? 'enviado' : 'completado',
    }])
    .select()
  if (movErr) throw movErr
  return movData[0]
}

export async function recibirTransferencia(movimientoId) {
  const { data, error } = await supabase
    .from('movimiento')
    .update({ estado: 'recibido', recibido_por: (await supabase.auth.getUser()).data.user?.id })
    .eq('id', movimientoId)
    .eq('estado', 'enviado')
    .select()

  if (error) {
    throw error
  }
  if (!data || data.length === 0) throw new Error('Transferencia no encontrada o ya fue recibida')
  return data[0]
}

export async function sendBatch(records, onProgress) {
  const ok = []
  const fail = []
  for (let i = 0; i < records.length; i++) {
    try {
      await sendRecord(records[i])
      ok.push(records[i])
    } catch (err) {
      fail.push({ record: records[i], error: err.message })
    }
    onProgress?.(i + 1, records.length)
  }
  return { ok, fail }
}

// ============================================================
// DESPACHOS (guías de carga)
// ============================================================

export async function crearDespacho({ institucionOrigenId, institucionDestinoId, transportista, vehiculo, placa, notas, productos }) {

  // 1. Crear cabecera del despacho
  const { data: desp, error: despErr } = await supabase
    .from('despacho')
    .insert({
      institucion_origen_id: institucionOrigenId,
      institucion_destino_id: institucionDestinoId || null,
      transportista,
      vehiculo,
      placa: placa || null,
      notas: notas || null,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
  if (despErr) throw despErr
  const despachoId = desp[0].id

  // 2. Para cada producto, obtener/resolver producto y crear movimiento
  for (const prod of productos) {
    // Buscar producto por nombre
    let productoId = prod.id
    if (!productoId) {
      const { data: found } = await supabase
        .from('producto')
        .select('id')
        .ilike('nombre', prod.nombre.trim())
        .limit(1)
      if (found && found.length > 0) {
        productoId = found[0].id
      } else {
        // Crear producto
        const { data: newProd } = await supabase
          .from('producto')
          .insert({ nombre: normalizeText(prod.nombre), categoria_id: prod.categoryId || 1 })
          .select()
        if (!newProd) continue
        productoId = newProd[0].id
      }
    }

    // Crear movimiento (Salida) vinculado al despacho
    const { error: movErr } = await supabase
      .from('movimiento')
      .insert({
        producto_id: productoId,
        cantidad: Number(prod.cantidad) || 1,
        unidad: prod.unidad || 'unidades',
        institucion_origen_id: institucionOrigenId,
        institucion_destino_id: institucionDestinoId || null,
        tipo_movimiento_id: (await supabase.from('tipo_movimiento').select('id').eq('nombre', 'Salida').single()).data.id,
        despacho_id: despachoId,
        estado: 'completado',
      })
  }

  return desp[0]
}

export async function getDespachos() {
  const { data } = await supabase
    .from('despacho')
    .select('*, institucion_origen:institucion_origen_id (nombre), institucion_destino:institucion_destino_id (nombre)')
    .order('created_at', { ascending: false })
    .limit(50)
  return data || []
}

export async function getDespachoConMovimientos(id) {
  const { data: desp } = await supabase
    .from('despacho')
    .select('*, institucion_origen:institucion_origen_id (nombre), institucion_destino:institucion_destino_id (nombre)')
    .eq('id', id)
    .single()
  if (!desp) throw new Error('Despacho no encontrado')

  const { data: movs } = await supabase
    .from('movimiento')
    .select('*, producto:producto_id (nombre, presentacion)')
    .eq('despacho_id', id)
    .order('id')

  return { ...desp, movimientos: movs || [] }
}

// ============================================================
// VOLUNTARIOS
// ============================================================

export async function createVoluntario({ cedula, nombre, apellido, email, telefono, disponibilidadDias, disponibilidadHoraDesde, disponibilidadHoraHasta, institucionId, fechaNacimiento, genero }) {
  const { data, error } = await supabase.from('voluntarios').insert({
    cedula: cedula.trim(),
    nombre: normalizeText(nombre),
    apellido: normalizeText(apellido),
    email: email.trim().toLowerCase(),
    telefono: telefono?.trim() || null,
    disponibilidad_dias: disponibilidadDias || null,
    disponibilidad_hora_desde: disponibilidadHoraDesde || null,
    disponibilidad_hora_hasta: disponibilidadHoraHasta || null,
    institucion_id: institucionId || null,
    fecha_nacimiento: fechaNacimiento || null,
    genero: genero || null,
  }).select().single()
  if (error) throw error
  return data
}

export async function getVoluntarios({ institucionId, page = 1, pageSize = 20, search = '', filtroInst = '', filtroDia = '' } = {}) {
  let q = supabase.from('voluntarios').select('*, institucion:institucion_id (nombre)', { count: 'exact' })

  if (institucionId) q = q.eq('institucion_id', institucionId)
  if (filtroInst) q = q.eq('institucion_id', filtroInst)

  if (search) {
    const s = normalizeText(search)
    q = q.or(`nombre.ilike.%${s}%,apellido.ilike.%${s}%,cedula.ilike.%${s}%,email.ilike.%${s}%`)
  }

  if (filtroDia) q = q.ilike('disponibilidad_dias', `%${filtroDia}%`)

  q = q.order('created_at', { ascending: false })

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  q = q.range(from, to)

  const { data, count, error } = await q
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export function isConfigured() {
  const configured = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY)
  return configured
}
