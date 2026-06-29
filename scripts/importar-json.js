/**
 * Importar instituciones desde centros.json (solo Venezuela)
 * Ejecutar: node scripts/importar-json.js
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

// Normalizar texto para comparación
function norm(t) {
  if (!t) return ''
  return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ñ/g, 'N').replace(/Ñ/g, 'N').toUpperCase().trim()
}

const RECIBE_DEFAULT = [
  'agua potable', 'alimentos no perecederos', 'medicamentos e insumos médicos',
  'kits de primeros auxilios', 'mantas y cobijas', 'ropa en buen estado',
  'artículos de higiene personal'
]

async function importar() {
  // 1. Leer JSON
  const json = JSON.parse(readFileSync(resolve(__dirname, '..', 'centros.json'), 'utf-8'))
  const estados = json.estados || []
  console.log(`Total estados/países en JSON: ${estados.length}`)

  // 2. Colectar solo estados venezolanos (los que tienen nombre de estado de Venezuela)
  // Para detectar Venezuela vs otros países, usamos una lista de estados venezolanos
  const venStates = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo',
    'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'Lara',
    'La Guaira', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa',
    'Sucre', 'Táchira', 'Trujillo', 'Yaracuy', 'Zulia'
  ]

  // Estados que NO son Venezuela (países/regiones internacionales)
  const nonVen = ['Colombia', 'Estados Unidos', 'España', 'México', 'Argentina', 'Perú',
    'Panamá', 'Ecuador', 'Chile', 'Brasil', 'Guatemala', 'Paraguay', 'Uruguay',
    'República Dominicana', 'Portugal', 'Italia', 'Francia', 'Inglaterra',
    'Escocia', 'Irlanda', 'Emiratos Árabes Unidos']

  const ven = estados.filter(e => venStates.includes(e.nombre) || (!nonVen.includes(e.nombre) && e.ciudades?.length > 0))

  // Si el filtro no es perfecto, usar solo los que tienen ciudades con centros
  const conDatos = ven.filter(e => e.ciudades?.some(c => (c.centros || []).length > 0))
  console.log(`Estados venezolanos con datos: ${conDatos.length}`)

  // 3. Contar total de centros
  let totalCentros = 0
  const geoPairs = []
  for (const estado of conDatos) {
    for (const ciudad of estado.ciudades) {
      const centros = ciudad.centros || []
      if (centros.length > 0) {
        totalCentros += centros.length
        geoPairs.push({ estado: estado.nombre, ciudad: ciudad.nombre })
      }
    }
  }
  console.log(`Total instituciones a importar: ${totalCentros}`)
  console.log(`Estados+Ciudades únicos: ${geoPairs.length}`)

  // 4. Cargar geografía existente
  const { data: estsExist } = await supabase.from('estado').select('id, nombre')
  const estadoMap = Object.fromEntries((estsExist || []).map(e => [norm(e.nombre), e.id]))

  const { data: munsExist } = await supabase.from('municipio').select('id, nombre, estado_id')
  const munMap = Object.fromEntries((munsExist || []).map(m => [`${m.estado_id}|${norm(m.nombre)}`, m.id]))

  const { data: parrsExist } = await supabase.from('parroquia').select('id, nombre, municipio_id')
  const parrMap = Object.fromEntries((parrsExist || []).map(p => [`${p.municipio_id}|${norm(p.nombre)}`, p.id]))

  // 5. Crear estados faltantes
  for (const { estado } of geoPairs) {
    if (!estadoMap[norm(estado)]) {
      const { data } = await supabase.from('estado').insert({ nombre: estado.trim() }).select()
      if (data) {
        estadoMap[norm(estado)] = data[0].id
        console.log(`  ✅ Estado creado: ${estado} → id=${data[0].id}`)
      }
    }
  }

  // 6. Crear municipios y parroquias faltantes
  const ciudadMap = {} // "estado|ciudad" → parroquia_id

  for (const { estado, ciudad } of geoPairs) {
    const estId = estadoMap[norm(estado)]
    if (!estId) { console.error(`  ❌ Sin ID para estado: ${estado}`); continue }
    const key = `${estado}|${ciudad}`
    const lookup = `${estId}|${norm(ciudad)}`

    if (!munMap[lookup]) {
      const { data } = await supabase.from('municipio').insert({ nombre: ciudad.trim(), estado_id: estId }).select()
      if (data) munMap[lookup] = data[0].id
      else { console.error(`  ❌ Error creando municipio: ${ciudad}`); continue }
    }
    const munId = munMap[lookup]

    const parrNombre = `${ciudad} Centro`
    const parrLookup = `${munId}|${norm(parrNombre)}`
    if (!parrMap[parrLookup]) {
      const { data } = await supabase.from('parroquia').insert({ nombre: parrNombre, municipio_id: munId }).select()
      if (data) parrMap[parrLookup] = data[0].id
      else { console.error(`  ❌ Error creando parroquia: ${parrNombre}`); continue }
    }
    ciudadMap[key] = parrMap[parrLookup]
  }
  console.log(`  Geografía lista: ${Object.keys(ciudadMap).length} ciudad(es) mapeada(s)`)

  // 7. Insertar instituciones
  let insertados = 0, errores = 0, duplicados = 0

  for (const estado of conDatos) {
    for (const ciudad of estado.ciudades) {
      for (const c of (ciudad.centros || [])) {
        const parroquiaId = ciudadMap[`${estado.nombre}|${ciudad.nombre}`]
        if (!parroquiaId) { errores++; continue }

        const payload = {
          nombre: c.nombre,
          direccion: c.direccion || '',
          parroquia_id: parroquiaId,
          notas: c.nota || c.fuente || null,
          latitud: c.coords?.[0] || null,
          longitud: c.coords?.[1] || null,
          tipos_ayuda: (c.recibe || []).join('|') || null,
          telefono: c.whatsapp || c.telefono || null,
          horario: c.horario || null,
          activo: true,
        }

        const { error } = await supabase.from('institucion').insert(payload)
        if (error) {
          if (error.code === '23505') { duplicados++; continue }
          console.error(`  ❌ Error: "${c.nombre}" — ${error.message}`)
          errores++
        } else {
          insertados++
        }
      }
    }
  }

  console.log(`\n✅ Insertadas: ${insertados}`)
  console.log(`❌ Errores: ${errores}`)
  console.log(`⏭️  Duplicados: ${duplicados}`)
}

importar().catch(console.error)
