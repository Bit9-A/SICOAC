import { supabase } from './supabase'
import { CONFIG } from './config'

export async function initializeDbData() {
  if (!isConfigured()) return

  try {
    // 1. Check if estado table is empty
    const { data: checkEstados, error: chkErr } = await supabase
      .from('estado')
      .select('id')
      .limit(1)

    if (chkErr) {
      console.error('Error checking database status:', chkErr)
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
      console.log('Geografía de Venezuela sembrada con éxito.')
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
      console.log('Categorías sembradas con éxito.')
    }

    // 3. Seeding Tipo Movimiento if empty
    const { data: checkTipos } = await supabase.from('tipo_movimiento').select('id').limit(1)
    if (!checkTipos || checkTipos.length === 0) {
      await supabase.from('tipo_movimiento').insert([
        { nombre: 'Entrada' },
        { nombre: 'Salida' }
      ])
      console.log('Tipos de movimiento sembrados con éxito.')
    }
  } catch (error) {
    console.error('Error during database initialization/seeding:', error)
  }
}

export async function getEstados() {
  const { data, error } = await supabase.from('estado').select('id, nombre').order('nombre')
  if (error) throw error
  return data.map((e) => ({ value: e.id, label: e.nombre }))
}

export async function getMunicipios(estadoId) {
  if (!estadoId) return []
  const { data, error } = await supabase
    .from('municipio')
    .select('id, nombre')
    .eq('estado_id', estadoId)
    .order('nombre')
  if (error) throw error
  return data.map((m) => ({ value: m.id, label: m.nombre }))
}

export async function getParroquias(municipioId) {
  if (!municipioId) return []
  const { data, error } = await supabase
    .from('parroquia')
    .select('id, nombre')
    .eq('municipio_id', municipioId)
    .order('nombre')
  if (error) throw error
  return data.map((p) => ({ value: p.id, label: p.nombre }))
}

export async function getInstituciones() {
  const { data, error } = await supabase.from('institucion').select('id, nombre, direccion, parroquia_id').order('nombre')
  if (error) throw error
  return data.map((i) => ({ value: i.id, label: i.nombre, direccion: i.direccion, parroquiaId: i.parroquia_id }))
}

export async function createInstitucion(nombre, direccion, parroquiaId) {
  const { data, error } = await supabase
    .from('institucion')
    .insert([{ nombre, direccion, parroquia_id: parroquiaId }])
    .select()
  if (error) throw error
  return { value: data[0].id, label: data[0].nombre, direccion: data[0].direccion, parroquiaId: data[0].parroquia_id }
}

export async function getCategorias() {
  const { data, error } = await supabase.from('categoria').select('id, nombre').order('nombre')
  if (error) throw error
  return data.map((c) => ({ value: c.id, label: c.nombre }))
}

export async function createCategoria(nombre) {
  const { data, error } = await supabase
    .from('categoria')
    .insert([{ nombre }])
    .select()
  if (error) throw error
  return { value: data[0].id, label: data[0].nombre }
}

export async function findProductByBarcode(barcode) {
  if (!barcode) return null
  const { data, error } = await supabase
    .from('producto_codigo')
    .select('producto_id, producto (id, nombre, descripcion, presentacion, categoria_id)')
    .eq('codigo', barcode.trim())
    .maybeSingle()

  if (error) {
    console.error('Error finding product by barcode:', error)
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
  if (!isConfigured()) {
    throw new Error('Credenciales de Supabase no configuradas. Creá un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY')
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
    // Optionally update name/desc if they changed
    await supabase
      .from('producto')
      .update({
        nombre: record.productName || existingProduct.productName,
        descripcion: record.description || existingProduct.description,
        presentacion: record.presentation || existingProduct.presentation,
        categoria_id: finalCategoryId,
      })
      .eq('id', finalProductId)
  } else {
    // Create new product
    const { data: newProd, error: prodErr } = await supabase
      .from('producto')
      .insert([
        {
          nombre: record.productName,
          descripcion: record.description || '',
          presentacion: record.presentation || '',
          categoria_id: finalCategoryId,
          institucion_id: record.institucionId || null,
        },
      ])
      .select()

    if (prodErr) throw prodErr
    finalProductId = newProd[0].id

    // Insert barcode
    if (record.barcode) {
      const { error: codeErr } = await supabase
        .from('producto_codigo')
        .insert([{ producto_id: finalProductId, codigo: record.barcode.trim() }])
      if (codeErr) throw codeErr
    }
  }

  // 3. Get Movement Type ID
  const { data: tmData, error: tmErr } = await supabase
    .from('tipo_movimiento')
    .select('id')
    .eq('nombre', record.tipoMovimiento)
    .single()

  if (tmErr) throw tmErr
  const tipoMovimientoId = tmData.id

  // 4. Log Movement Transaction
  const movementPayload = {
    producto_id: finalProductId,
    cantidad: Number(record.quantity) || 1,
    unidad: record.presentation || 'unidades',
    institucion_origen_id: record.tipoMovimiento === 'Salida' ? record.institucionId : null,
    institucion_destino_id: record.tipoMovimiento === 'Entrada' ? record.institucionId : null,
    tipo_movimiento_id: tipoMovimientoId,
  }

  const { data: movData, error: movErr } = await supabase
    .from('movimiento')
    .insert([movementPayload])
    .select()

  if (movErr) throw movErr
  return movData[0]
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

export function isConfigured() {
  return Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY)
}
