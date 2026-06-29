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
  console.log('[API] getEstados — consultando estados...')
  const { data, error } = await supabase.from('estado').select('id, nombre').order('nombre')
  if (error) {
    console.error('[API] getEstados ERROR:', error.message)
    throw error
  }
  console.log(`[API] getEstados OK — ${data.length} estados obtenidos`)
  return data.map((e) => ({ value: e.id, label: e.nombre }))
}

export async function getMunicipios(estadoId) {
  if (!estadoId) {
    console.log('[API] getMunicipios — skip: sin estado_id')
    return []
  }
  console.log(`[API] getMunicipios — consultando para estado_id=${estadoId}...`)
  const { data, error } = await supabase
    .from('municipio')
    .select('id, nombre')
    .eq('estado_id', estadoId)
    .order('nombre')
  if (error) {
    console.error(`[API] getMunicipios ERROR (estado_id=${estadoId}):`, error.message)
    throw error
  }
  console.log(`[API] getMunicipios OK — ${data.length} municipios`)
  return data.map((m) => ({ value: m.id, label: m.nombre }))
}

export async function getParroquias(municipioId) {
  if (!municipioId) {
    console.log('[API] getParroquias — skip: sin municipio_id')
    return []
  }
  console.log(`[API] getParroquias — consultando para municipio_id=${municipioId}...`)
  const { data, error } = await supabase
    .from('parroquia')
    .select('id, nombre')
    .eq('municipio_id', municipioId)
    .order('nombre')
  if (error) {
    console.error(`[API] getParroquias ERROR (municipio_id=${municipioId}):`, error.message)
    throw error
  }
  console.log(`[API] getParroquias OK — ${data.length} parroquias`)
  return data.map((p) => ({ value: p.id, label: p.nombre }))
}

export async function getInstituciones() {
  console.log('[API] getInstituciones — consultando...')
  const { data, error } = await supabase.from('institucion').select('id, nombre, direccion, parroquia_id').order('nombre')
  if (error) {
    console.error('[API] getInstituciones ERROR:', error.message)
    throw error
  }
  console.log(`[API] getInstituciones OK — ${data.length} instituciones`)
  return data.map((i) => ({ value: i.id, label: i.nombre, direccion: i.direccion, parroquiaId: i.parroquia_id }))
}

export async function createInstitucion(nombre, direccion, parroquiaId) {
  console.log(`[API] createInstitucion — creando "${nombre}", parroquia_id=${parroquiaId}...`)
  const { data, error } = await supabase
    .from('institucion')
    .insert([{ nombre, direccion, parroquia_id: parroquiaId }])
    .select()
  if (error) {
    console.error('[API] createInstitucion ERROR:', error.message, { nombre, direccion, parroquiaId })
    throw error
  }
  console.log(`[API] createInstitucion OK — id=${data[0].id}, "${data[0].nombre}"`)
  return { value: data[0].id, label: data[0].nombre, direccion: data[0].direccion, parroquiaId: data[0].parroquia_id }
}

export async function getCategorias() {
  console.log('[API] getCategorias — consultando...')
  const { data, error } = await supabase.from('categoria').select('id, nombre').order('nombre')
  if (error) {
    console.error('[API] getCategorias ERROR:', error.message)
    throw error
  }
  console.log(`[API] getCategorias OK — ${data.length} categorías`)
  return data.map((c) => ({ value: c.id, label: c.nombre }))
}

export async function createCategoria(nombre) {
  console.log(`[API] createCategoria — creando "${nombre}"...`)
  const { data, error } = await supabase
    .from('categoria')
    .insert([{ nombre }])
    .select()
  if (error) {
    console.error('[API] createCategoria ERROR:', error.message, { nombre })
    throw error
  }
  console.log(`[API] createCategoria OK — id=${data[0].id}, "${data[0].nombre}"`)
  return { value: data[0].id, label: data[0].nombre }
}

export async function findProductByBarcode(barcode) {
  if (!barcode) {
    console.log('[API] findProductByBarcode — skip: sin código')
    return null
  }
  console.log(`[API] findProductByBarcode — buscando código "${barcode}"...`)
  const { data, error } = await supabase
    .from('producto_codigo')
    .select('producto_id, producto (id, nombre, descripcion, presentacion, categoria_id)')
    .eq('codigo', barcode.trim())
    .maybeSingle()

  if (error) {
    console.error('[API] findProductByBarcode ERROR:', error.message, { barcode })
    return null
  }

  if (data && data.producto) {
    console.log(`[API] findProductByBarcode OK — encontrado: "${data.producto.nombre}" (id=${data.producto.id})`)
    return {
      id: data.producto.id,
      productName: data.producto.nombre,
      description: data.producto.descripcion,
      presentation: data.producto.presentacion,
      categoryId: data.producto.categoria_id,
    }
  }
  console.log(`[API] findProductByBarcode — no encontrado para código "${barcode}"`)
  return null
}

export async function sendRecord(record) {
  console.log('[API] sendRecord — iniciando guardado...', {
    producto: record.productName,
    barcode: record.barcode,
    tipo: record.tipoMovimiento,
    cantidad: record.quantity,
    institucion: record.institucionId,
  })

  if (!isConfigured()) {
    throw new Error('Credenciales de Supabase no configuradas. Creá un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY')
  }

  // 1. Resolve Category ID (create on the fly if categoryId is text)
  let finalCategoryId = record.categoryId
  if (isNaN(Number(record.categoryId))) {
    console.log(`[API] sendRecord — categoría "${record.categoryId}" no es numérica, creando...`)
    const newCat = await createCategoria(record.categoryId)
    finalCategoryId = newCat.value
    console.log(`[API] sendRecord — categoría resuelta a id=${finalCategoryId}`)
  }

  // 2. Find or Create Product
  let finalProductId = null
  let existingProduct = null

  if (record.barcode) {
    existingProduct = await findProductByBarcode(record.barcode)
  }

  if (existingProduct) {
    finalProductId = existingProduct.id
    console.log(`[API] sendRecord — producto existente id=${finalProductId}, actualizando datos...`)
    const { error: updErr } = await supabase
      .from('producto')
      .update({
        nombre: record.productName || existingProduct.productName,
        descripcion: record.description || existingProduct.description,
        presentacion: record.presentation || existingProduct.presentation,
        categoria_id: finalCategoryId,
      })
      .eq('id', finalProductId)
    if (updErr) console.error('[API] sendRecord — error actualizando producto:', updErr.message)
    else console.log('[API] sendRecord — producto actualizado ok')
  } else {
    // Create new product
    console.log('[API] sendRecord — creando nuevo producto...')
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

    if (prodErr) {
      console.error('[API] sendRecord — ERROR creando producto:', prodErr.message)
      throw prodErr
    }
    finalProductId = newProd[0].id
    console.log(`[API] sendRecord — producto creado con id=${finalProductId}`)

    // Insert barcode
    if (record.barcode) {
      console.log(`[API] sendRecord — asociando código "${record.barcode}" al producto ${finalProductId}...`)
      const { error: codeErr } = await supabase
        .from('producto_codigo')
        .insert([{ producto_id: finalProductId, codigo: record.barcode.trim() }])
      if (codeErr) {
        console.error('[API] sendRecord — ERROR asociando código:', codeErr.message)
        throw codeErr
      }
      console.log('[API] sendRecord — código asociado ok')
    }
  }

  // 3. Get Movement Type ID
  console.log(`[API] sendRecord — buscando tipo_movimiento "${record.tipoMovimiento}"...`)
  const { data: tmData, error: tmErr } = await supabase
    .from('tipo_movimiento')
    .select('id')
    .eq('nombre', record.tipoMovimiento)
    .single()

  if (tmErr) {
    console.error('[API] sendRecord — ERROR obteniendo tipo_movimiento:', tmErr.message)
    throw tmErr
  }
  const tipoMovimientoId = tmData.id
  console.log(`[API] sendRecord — tipo_movimiento id=${tipoMovimientoId}`)

  // 4. Log Movement Transaction
  const movementPayload = {
    producto_id: finalProductId,
    cantidad: Number(record.quantity) || 1,
    unidad: record.presentation || 'unidades',
    institucion_origen_id: record.tipoMovimiento === 'Salida' ? record.institucionId : null,
    institucion_destino_id: record.tipoMovimiento === 'Entrada' ? record.institucionId : null,
    tipo_movimiento_id: tipoMovimientoId,
  }

  console.log('[API] sendRecord — insertando movimiento:', movementPayload)
  const { data: movData, error: movErr } = await supabase
    .from('movimiento')
    .insert([movementPayload])
    .select()

  if (movErr) {
    console.error('[API] sendRecord — ERROR insertando movimiento:', movErr.message)
    throw movErr
  }
  console.log(`[API] sendRecord — MOVIMIENTO REGISTRADO EXITOSAMENTE ✅ id=${movData[0].id}`)
  return movData[0]
}

export async function sendBatch(records, onProgress) {
  console.log(`[API] sendBatch — iniciando sincronización de ${records.length} registro(s)...`)
  const ok = []
  const fail = []
  for (let i = 0; i < records.length; i++) {
    try {
      await sendRecord(records[i])
      ok.push(records[i])
      console.log(`[API] sendBatch — [${i + 1}/${records.length}] OK: "${records[i].productName}"`)
    } catch (err) {
      console.error(`[API] sendBatch — [${i + 1}/${records.length}] ERROR: "${records[i].productName}" — ${err.message}`)
      fail.push({ record: records[i], error: err.message })
    }
    onProgress?.(i + 1, records.length)
  }
  console.log(`[API] sendBatch — completo: ${ok.length} OK, ${fail.length} FAIL`)
  return { ok, fail }
}

export function isConfigured() {
  const configured = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY)
  console.log(`[API] isConfigured — ${configured ? '✅ sí' : '❌ no'} (URL: ${CONFIG.SUPABASE_URL ? '✓' : '✗'}, Key: ${CONFIG.SUPABASE_ANON_KEY ? '✓' : '✗'})`)
  return configured
}
