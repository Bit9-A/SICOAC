/**
 * Script para importar instituciones desde CSV
 * Ejecutar: node scripts/importar-instituciones.js
 *
 * Lee el CSV, filtra solo Venezuela, crea geografía faltante e inserta instituciones
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Cargar .env
const envPath = resolve(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const [k, ...v] = l.split('=')
    return [k.trim(), v.join('=').trim()]
  })
)

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY)

// Leer CSV
const csvPath = resolve(__dirname, '..', 'centros-acopio-2026-06-29.csv')
const lines = readFileSync(csvPath, 'utf-8').split('\n').filter(l => l.trim())
const headers = lines[0].split(',')

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; continue }
    current += ch
  }
  result.push(current.trim())
  return result
}

const rows = lines.slice(1).map(parseCSVLine)

console.log(`Total filas en CSV: ${rows.length}`)

// Normalizar texto: mayúsculas, sin acentos (mismo formato que en la BD)
function norm(t) {
  if (!t) return ''
  return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ñ/g, 'N').replace(/Ñ/g, 'N').toUpperCase().trim()
}

// Mapear headers a índices
const idx = Object.fromEntries(headers.map((h, i) => [h.trim(), i]))

// Filtrar solo Venezuela y agrupar geografía
const venezuela = rows.filter(r => r[idx.country] === 'Venezuela')
console.log(`Instituciones en Venezuela: ${venezuela.length}`)

// Coleccionar estado + ciudad únicos
const geoSet = new Set()
venezuela.forEach(r => geoSet.add(`${r[idx.state]}|${r[idx.city]}`))
const geoPairs = [...geoSet].map(s => {
  const [estado, ciudad] = s.split('|')
  return { estado, ciudad }
})
console.log(`Estados+Ciudades únicos: ${geoPairs.length}`)

async function hasColumn(colName) {
  // Detecta si una columna existe en la tabla institucion
  const { error } = await supabase.from('institucion').select(colName).limit(1)
  return !error
}

async function main() {
  // Detectar qué columnas existen en la tabla
  const colsExistentes = {
    organizacion: await hasColumn('organizacion'),
    telefono: await hasColumn('telefono'),
    horario: await hasColumn('horario'),
    tipos_ayuda: await hasColumn('tipos_ayuda'),
    acepta_voluntarios: await hasColumn('acepta_voluntarios'),
    notas: await hasColumn('notas'),
    latitud: await hasColumn('latitud'),
    longitud: await hasColumn('longitud'),
    activo: await hasColumn('activo'),
  }
  console.log('Columnas extra disponibles:', Object.entries(colsExistentes).filter(([,v]) => v).map(([k]) => k).join(', ') || 'ninguna')

  // 1. Obtener o crear estados faltantes (usando nombre normalizado)
  const estadosUnicos = [...new Set(geoPairs.map(g => g.estado))]
  const { data: estadosExistentes } = await supabase.from('estado').select('id, nombre')
  // Indexar por nombre normalizado para match case-insensitive
  const estadoMap = Object.fromEntries((estadosExistentes || []).map(e => [norm(e.nombre), e.id]))
  const estadosNuevos = estadosUnicos.filter(n => !estadoMap[norm(n)])

  if (estadosNuevos.length > 0) {
    console.log(`Estados nuevos a crear: ${estadosNuevos.length}`)
    for (const nombre of estadosNuevos) {
      const { data } = await supabase.from('estado').insert({ nombre: nombre.trim() }).select()
      if (data) {
        estadoMap[norm(nombre)] = data[0].id  // clave normalizada para lookup
        console.log(`  ✅ Estado: ${nombre} → id=${data[0].id}`)
      }
    }
  } else {
    console.log('Estados — ya existen todos')
  }

  // 2. Obtener o crear municipios faltantes (match por nombre normalizado)
  const { data: munsExistentes } = await supabase.from('municipio').select('id, nombre, estado_id')
  const munMap = Object.fromEntries((munsExistentes || []).map(m => [`${m.estado_id}|${norm(m.nombre)}`, m.id]))
  const municipioMap = {}

  for (const { estado, ciudad } of geoPairs) {
    const estadoId = estadoMap[norm(estado)]
    if (!estadoId) { console.error(`  ❌ Estado "${estado}" no tiene ID`); continue }
    const key = `${estado}|${ciudad}`
    const lookup = `${estadoId}|${norm(ciudad)}`
    if (munMap[lookup]) {
      municipioMap[key] = munMap[lookup]
    } else {
      const { data } = await supabase.from('municipio').insert({ nombre: ciudad, estado_id: estadoId }).select()
      if (data) municipioMap[key] = data[0].id
      else console.error(`  Error creando municipio "${ciudad}"`)
    }
  }
  console.log(`  Municipios: ${Object.keys(municipioMap).length} listos`)

  // 3. Obtener o crear parroquia por defecto (match por nombre normalizado)
  const { data: parrsExistentes } = await supabase.from('parroquia').select('id, nombre, municipio_id')
  const parrMap = Object.fromEntries((parrsExistentes || []).map(p => [`${p.municipio_id}|${norm(p.nombre)}`, p.id]))
  const parroquiaMap = {}

  for (const { estado, ciudad } of geoPairs) {
    const key = `${estado}|${ciudad}`
    const municipioId = municipioMap[key]
    if (!municipioId) continue
    const parroquiaNombre = `${ciudad} Centro`
    const lookup = `${municipioId}|${norm(parroquiaNombre)}`
    if (parrMap[lookup]) {
      parroquiaMap[key] = parrMap[lookup]
    } else {
      const { data } = await supabase.from('parroquia').insert({ nombre: parroquiaNombre, municipio_id: municipioId }).select()
      if (data) parroquiaMap[key] = data[0].id
    }
  }
  console.log(`  Parroquias: ${Object.keys(parroquiaMap).length} listas`)

  // 4. Insertar instituciones
  let insertados = 0
  let errores = 0

  for (const r of venezuela) {
    const nombre = r[idx.name]
    const direccion = r[idx.address]
    const estado = r[idx.state]
    const ciudad = r[idx.city]
    const key = `${estado}|${ciudad}`
    const parroquiaId = parroquiaMap[key]

    if (!parroquiaId) {
      console.error(`  ❌ Sin parroquia para "${nombre}" (${estado}/${ciudad})`)
      errores++
      continue
    }

    const payload = {
      nombre,
      direccion,
      parroquia_id: parroquiaId,
    }
    if (colsExistentes.organizacion) payload.organizacion = r[idx.organization] || null
    if (colsExistentes.telefono) payload.telefono = r[idx.phone] || null
    if (colsExistentes.horario) payload.horario = r[idx.schedule] || null
    if (colsExistentes.tipos_ayuda) payload.tipos_ayuda = r[idx.supply_types] || null
    if (colsExistentes.acepta_voluntarios) payload.acepta_voluntarios = r[idx.accepts_volunteers] === 'true'
    if (colsExistentes.notas) payload.notas = r[idx.notes] || null
    if (colsExistentes.latitud) payload.latitud = parseFloat(r[idx.latitude]) || null
    if (colsExistentes.longitud) payload.longitud = parseFloat(r[idx.longitude]) || null
    if (colsExistentes.activo) payload.activo = r[idx.is_active] === 'true'

    const { error } = await supabase
      .from('institucion')
      .insert(payload)

    if (error) {
      if (error.code === '23505') {
        // Duplicado — ok, saltar
        continue
      }
      console.error(`  ❌ Error insertando "${nombre}":`, error.message)
      errores++
    } else {
      insertados++
    }
  }

  console.log(`\n✅ Insertadas: ${insertados}`)
  console.log(`❌ Errores: ${errores}`)
  console.log(`⏭️  Duplicados saltados: ${venezuela.length - insertados - errores}`)
}

main().catch(console.error)
