import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read .env file manually
const envPath = path.resolve('.env')
if (!fs.existsSync(envPath)) {
  console.error('Error: No se encontró el archivo .env en la raíz del proyecto.')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (match) {
    const key = match[1]
    let value = match[2] || ''
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    env[key] = value.trim()
  }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Credenciales faltantes en el .env.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('Iniciando carga completa de geografía de Venezuela en Supabase...')
  console.log('Cargando JSON desde el repositorio público de zokeber...')
  
  try {
    const response = await fetch('https://raw.githubusercontent.com/zokeber/venezuela-json/master/venezuela.json')
    if (!response.ok) {
      throw new Error(`Error al descargar JSON: ${response.statusText}`)
    }
    const data = await response.json()
    console.log(`JSON descargado. Encontrados ${data.length} estados.`)

    // 1. Seed Estados
    console.log('Registrando estados en la base de datos...')
    const estadosToInsert = data.map(e => ({ nombre: e.estado }))
    
    const { data: dbEstados, error: estErr } = await supabase
      .from('estado')
      .upsert(estadosToInsert, { onConflict: 'nombre' })
      .select('id, nombre')

    if (estErr) throw estErr
    console.log(`✅ ${dbEstados.length} estados registrados/verificados.`)

    // Map estado nombre to id
    const estadoMap = {}
    dbEstados.forEach(e => {
      estadoMap[e.nombre] = e.id
    })

    // 2. Seed Municipios
    console.log('Preparando municipios...')
    const municipiosToInsert = []
    data.forEach(e => {
      const estadoId = estadoMap[e.estado]
      if (estadoId) {
        e.municipios.forEach(m => {
          municipiosToInsert.push({
            nombre: m.municipio,
            estado_id: estadoId
          })
        })
      }
    })

    console.log(`Insertando ${municipiosToInsert.length} municipios en la base de datos...`)
    // Insert in batches of 100
    const dbMunicipios = []
    const batchSize = 100
    for (let i = 0; i < municipiosToInsert.length; i += batchSize) {
      const batch = municipiosToInsert.slice(i, i + batchSize)
      const { data: inserted, error: munErr } = await supabase
        .from('municipio')
        .upsert(batch, { onConflict: 'nombre,estado_id' })
        .select('id, nombre, estado_id')
      
      if (munErr) throw munErr
      dbMunicipios.push(...inserted)
    }
    console.log(`✅ ${dbMunicipios.length} municipios registrados/verificados.`)

    // Map (municipio nombre + estado_id) to id
    const municipioMap = {}
    dbMunicipios.forEach(m => {
      municipioMap[`${m.nombre}:${m.estado_id}`] = m.id
    })

    // 3. Seed Parroquias
    console.log('Preparando parroquias...')
    const parroquiasToInsert = []
    data.forEach(e => {
      const estadoId = estadoMap[e.estado]
      if (estadoId) {
        e.municipios.forEach(m => {
          const municipioId = municipioMap[`${m.municipio}:${estadoId}`]
          if (municipioId) {
            m.parroquias.forEach(p => {
              parroquiasToInsert.push({
                nombre: p,
                municipio_id: municipioId
              })
            })
          }
        })
      }
    })

    console.log(`Insertando ${parroquiasToInsert.length} parroquias en la base de datos...`)
    // Insert in batches of 200 to speed up
    let parroquiasCount = 0
    const pBatchSize = 200
    for (let i = 0; i < parroquiasToInsert.length; i += pBatchSize) {
      const batch = parroquiasToInsert.slice(i, i + pBatchSize)
      const { error: parqErr } = await supabase
        .from('parroquia')
        .upsert(batch, { onConflict: 'nombre,municipio_id' })
      
      if (parqErr) throw parqErr
      parroquiasCount += batch.length
    }
    console.log(`✅ ${parroquiasCount} parroquias registradas/verificadas.`)

    // 4. Categories if empty
    console.log('Comprobando categorías...')
    const { data: checkCats } = await supabase.from('categoria').select('id').limit(1)
    if (!checkCats || checkCats.length === 0) {
      await supabase.from('categoria').insert([
        { nombre: 'Nutrición y alimentos' },
        { nombre: 'Salud y Farmacia' },
        { nombre: 'Higiene y sanitarios' },
        { nombre: 'Refugio' },
        { nombre: 'Textil y vestimenta' }
      ])
      console.log('✅ Categorías sembradas exitosamente.')
    }

    // 5. Movement Types if empty
    console.log('Comprobando tipos de movimientos...')
    const { data: checkTipos } = await supabase.from('tipo_movimiento').select('id').limit(1)
    if (!checkTipos || checkTipos.length === 0) {
      await supabase.from('tipo_movimiento').insert([
        { nombre: 'Entrada' },
        { nombre: 'Salida' }
      ])
      console.log('✅ Tipos de movimientos sembrados exitosamente.')
    }

    console.log('🎉 ¡Carga completa de geografía de Venezuela finalizada con éxito!')
  } catch (error) {
    console.error('❌ Error durante la carga de geografía:', error.message || error)
  }
}

seed()
