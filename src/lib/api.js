import { supabase } from './supabase'
import { CONFIG } from './config'
import { normalizeText } from './utils'

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
  const { data, error } = await supabase.from('estado').select('id, nombre').order('nombre')
  if (error) {
    throw error
  }
  return data.map((e) => ({ value: e.id, label: e.nombre }))
}

export async function getMunicipios(estadoId) {
  if (!estadoId) {
    return []
  }
  const { data, error } = await supabase
    .from('municipio')
    .select('id, nombre')
    .eq('estado_id', estadoId)
    .order('nombre')
  if (error) {
    throw error
  }
  return data.map((m) => ({ value: m.id, label: m.nombre }))
}

export async function getParroquias(municipioId) {
  if (!municipioId) {
    return []
  }
  const { data, error } = await supabase
    .from('parroquia')
    .select('id, nombre')
    .eq('municipio_id', municipioId)
    .order('nombre')
  if (error) {
    throw error
  }
  return data.map((p) => ({ value: p.id, label: p.nombre }))
}

export async function getInstituciones() {
  const { data, error } = await supabase.from('institucion').select('id, nombre, direccion, parroquia_id').order('nombre')
  if (error) {
    throw error
  }
  return data.map((i) => ({ value: i.id, label: i.nombre, direccion: i.direccion, parroquiaId: i.parroquia_id }))
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
  const { data, error } = await supabase.from('categoria').select('id, nombre').order('nombre')
  if (error) {
    throw error
  }
  return data.map((c) => ({ value: c.id, label: c.nombre }))
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

export async function searchBarcodes(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.trim()
  const { data, error } = await supabase
    .from('producto_codigo')
    .select('codigo, producto_id, producto (id, nombre, descripcion, presentacion, categoria_id)')
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
  }))
}

export async function searchProducts(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.trim()
  const { data, error } = await supabase
    .from('producto')
    .select('id, nombre, descripcion, presentacion, categoria_id, categoria:categoria_id (nombre), producto_codigo (codigo)')
    .ilike('nombre', `%${q}%`)
    .limit(8)

  if (error) {
    return []
  }

  return data.map((item) => {
    const cats = Array.isArray(item.categoria) ? item.categoria[0] : item.categoria
    const codes = Array.isArray(item.producto_codigo) ? item.producto_codigo : []
    const detail = [cats?.nombre, item.presentacion].filter(Boolean).join(' · ')
    return {
      value: String(item.id),
      label: item.nombre,
      detail: detail || null,
      productId: item.id,
      productName: item.nombre,
      description: item.descripcion || '',
      categoryId: item.categoria_id,
      presentation: item.presentacion || '',
      barcode: codes[0]?.codigo || '',
    }
  })
}

export async function findProductByBarcode(barcode) {
  if (!barcode) {
    return null
  }
  const { data, error } = await supabase
    .from('producto_codigo')
    .select('producto_id, producto (id, nombre, descripcion, presentacion, categoria_id)')
    .eq('codigo', barcode.trim())
    .maybeSingle()

  if (error) {
    return null
  }

  if (data && data.producto) {
    return {
      id: data.producto.id,
      productName: data.producto.nombre,
      description: data.producto.descripcion,
      presentation: data.producto.presentacion,
      categoryId: data.producto.categoria_id,
    }
  }
  return null
}

export async function sendRecord(record) {
    producto: record.productName,
    barcode: record.barcode,
    tipo: record.tipoMovimiento,
    cantidad: record.quantity,
    institucion: record.institucionId,
  })

  if (!isConfigured()) {
    throw new Error('Credenciales de Supabase no configuradas. Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY')
  }

  // 1. Resolve Category ID (create on the fly if categoryId is text)
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

  if (existingProduct) {
    finalProductId = existingProduct.id
    const { error: updErr } = await supabase
      .from('producto')
      .update({
        nombre: normalizeText(record.productName) || existingProduct.productName,
        descripcion: normalizeText(record.description) || existingProduct.description,
        categoria_id: finalCategoryId,
      })
      .eq('id', finalProductId)
  } else {
    // Create new product
    const { data: newProd, error: prodErr } = await supabase
      .from('producto')
      .insert([
        {
          nombre: normalizeText(record.productName),
          descripcion: normalizeText(record.description || ''),
          categoria_id: finalCategoryId,
          institucion_id: record.institucionId || null,
        },
      ])
      .select()

    if (prodErr) {
      throw prodErr
    }
    finalProductId = newProd[0].id

    // Insert barcode
    if (record.barcode) {
      const { error: codeErr } = await supabase
        .from('producto_codigo')
        .insert([{ producto_id: finalProductId, codigo: record.barcode.trim() }])
      if (codeErr) {
        throw codeErr
      }
    }
  }

  // 3. Get Movement Type ID
  const { data: tmData, error: tmErr } = await supabase
    .from('tipo_movimiento')
    .select('id')
    .eq('nombre', record.tipoMovimiento)
    .single()

  if (tmErr) {
    throw tmErr
  }
  const tipoMovimientoId = tmData.id

  // 4. Log Movement Transaction
  const isTransferencia = record.tipoMovimiento === 'Transferencia'
  const movementPayload = {
    producto_id: finalProductId,
    cantidad: Number(record.quantity) || 1,
    unidad: record.presentation || 'unidades',
    institucion_origen_id: isTransferencia ? record.institucionOrigenId : (record.tipoMovimiento === 'Salida' ? record.institucionId : null),
    institucion_destino_id: isTransferencia ? record.institucionDestinoId : (record.tipoMovimiento === 'Entrada' ? record.institucionId : null),
    tipo_movimiento_id: tipoMovimientoId,
    estado: isTransferencia ? 'enviado' : 'completado',
  }

  const { data: movData, error: movErr } = await supabase
    .from('movimiento')
    .insert([movementPayload])
    .select()

  if (movErr) {
    throw movErr
  }
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

export function isConfigured() {
  const configured = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY)
  return configured
}
