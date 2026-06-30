/**
 * Genera INSERTs para cargar instituciones desde centros.json
 * mapeando cada centro al estado/municipio/parroquia del seed geográfico.
 *
 * Uso: node scripts/generate_instituciones_sql.cjs
 */
const fs = require('fs')
const path = require('path')

// 1. Cargar el JSON de centros
const centros = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'centros.json'), 'utf8'))

// 2. Parsear el markdown para tener la estructura estado→municipio→parroquia
const md = fs.readFileSync(path.join(__dirname, '..', 'estados_municipios_parroquias.md'), 'utf8')

const estados = []
let currentEstado = null
let currentMunicipio = null

const lines = md.split('\n')
for (const line of lines) {
  const trimmed = line.trim()
  if (!trimmed) continue

  const estadoMatch = trimmed.match(/^##\s+(.+)/)
  if (estadoMatch) {
    currentEstado = { nombre: cleanName(estadoMatch[1]), municipios: [] }
    estados.push(currentEstado)
    currentMunicipio = null
    continue
  }

  const municipioMatch = trimmed.match(/^###\s+(.+)/)
  if (municipioMatch && currentEstado) {
    currentMunicipio = { nombre: cleanName(municipioMatch[1].replace(/&NTILDE;/gi, '\u00D1').replace(/&ntilde;/gi, '\u00F1')), parroquias: [] }
    currentEstado.municipios.push(currentMunicipio)
    continue
  }

  const parroquiaMatch = trimmed.match(/^-\s+(?:PQ|CM)\.?\s*(.+)/i)
  const plainMatch = trimmed.match(/^-\s+(.+)/)
  if (currentMunicipio && (parroquiaMatch || plainMatch)) {
    const nombre = (parroquiaMatch || plainMatch)[1].trim()
      .replace(/&NTILDE;/gi, '\u00D1')
      .replace(/&ntilde;/gi, '\u00F1')
      .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))
    if (nombre && !nombre.startsWith('#')) {
      currentMunicipio.parroquias.push(cleanName(nombre))
    }
  }
}

function cleanName(s) {
  return s.trim().toUpperCase().replace(/\s+/g, ' ')
}

function escapeSql(s) {
  if (!s) return ''
  return s.replace(/'/g, "''").trim()
}

// 3. Build lookup maps
const estadoMap = {}
for (const e of estados) {
  estadoMap[e.nombre] = e
}

// 4. Normalize estado names from centros.json
const estadoAliases = {
  'ANZOÁTEGUI': 'ANZOATEGUI', 'BOLÍVAR': 'BOLIVAR',
  'CARACAS': 'DISTRITO CAPITAL', 'DISTRITO CAPITAL': 'DISTRITO CAPITAL',
  'DISTRITO FEDERAL': 'DISTRITO CAPITAL', 'FALCÓN': 'FALCON',
  'MÉRIDA': 'MERIDA', 'NUEVA ESPARTA': 'NVA.ESPARTA',
  'TÁCHIRA': 'TACHIRA', 'GUÁRICO': 'GUARICO',
  'LA GUAIRA': 'VARGAS', 'VARGAS': 'VARGAS',
}

// Special overrides for estado+ciudad that don't match the geographic hierarchy
const specialOverrides = {
  'LA GUAIRA': {
    'CATIA': { estado: 'DISTRITO CAPITAL', municipio: 'BOLIVARIANO LIBERTADOR', parroquia: 'SUCRE' },
  },
  'VARGAS': {
    'CATIA': { estado: 'DISTRITO CAPITAL', municipio: 'BOLIVARIANO LIBERTADOR', parroquia: 'SUCRE' },
  },
}

// 5. Manual city → municipio mapping (when ciudad name != municipio name)
const cityMunicipioMap = {
  'ANZOATEGUI': {
    'LECHERÍA': 'L/DIEGO BAUTISTA', 'LECHERIA': 'L/DIEGO BAUTISTA',
    'BARCELONA': 'BOLIVAR', 'PUERTO LA CRUZ': 'SOTILLO',
  },
  'ARAGUA': {
    'CAGUA': 'SUCRE', 'MARACAY': 'GIRARDOT', 'LA VICTORIA': 'JOSE FELIX RIVAS',
    'TURMERO': 'SANTIAGO MARI\u00D1O',  /* Ñ */
  },
  'BARINAS': {
    'SANTA B\u00C1RBARA DE BARINAS': 'EZEQUIEL ZAMORA',  /* Á */
    'SANTA BARBARA DE BARINAS': 'EZEQUIEL ZAMORA',
    'BARRANCAS': 'CRUZ PAREDES',
    'BARINAS': 'BARINAS',
  },
  'BOLIVAR': {
    'CARONÍ': 'CARONI', 'CARONI': 'CARONI', 'CIUDAD BOLÍVAR': 'HERES',
    'CIUDAD BOLIVAR': 'HERES', 'HERES': 'HERES',
    'PUERTO ORDAZ': 'CARONI', 'SAN FÉLIX': 'CARONI', 'SAN FELIX': 'CARONI',
  },
  'CARABOBO': {
    'SAN DIEGO': 'SAN DIEGO', 'GUACARA': 'GUACARA', 'VALENCIA': 'VALENCIA',
  },
  'COJEDES': {
    'MANAURE': 'ANZOATEGUI', 'SAN CARLOS': 'EZEQUIEL ZAMORA',
  },
  'DISTRITO CAPITAL': {
    'CARACAS': 'BOLIVARIANO LIBERTADOR',
  },
  'FALCON': {
    'PARAGUANÁ': 'CARIRUBANA', 'PARAGUANA': 'CARIRUBANA',
    'PUNTO FIJO': 'CARIRUBANA', 'CORO': 'MIRANDA',
  },
  'GUARICO': {
    'VALLE DE LA PASCUA': 'INFANTE', 'GUAYABAL': 'SAN GERONIMO DE G',
    'EL SOMBRERO': 'MELLADO', 'CALABOZO': 'MIRANDA',
    'CAMAGUÁN': 'CAMAGUAN', 'CAMAGUAN': 'CAMAGUAN',
    'TUCUPIDO': 'RIBAS', 'ALTAGRACIA DE ORITUCO': 'MONAGAS',
  },
  'LARA': {
    'BARQUISIMETO': 'IRIBARREN', 'QUÍBOR (JIMÉNEZ)': 'JIMENEZ',
    'QUIBOR (JIMENEZ)': 'JIMENEZ', 'QUÍBOR': 'JIMENEZ', 'QUIBOR': 'JIMENEZ',
  },
  'MERIDA': {
    'MÉRIDA': 'LIBERTADOR', 'MERIDA': 'LIBERTADOR',
    'EL VIGÍA': 'ALBERTO ADRIANI', 'EJIDO': 'CAMPO ELIAS',
    'MUCUCHÍES': 'RANGEL', 'MUCUCHIES': 'RANGEL',
  },
  'MIRANDA': {
    'CARACAS': 'SUCRE', 'PETARE': 'SUCRE',
  },
  'MONAGAS': {
    'MATURÍN': 'MATURIN', 'MATURIN': 'MATURIN',
  },
  'NVA.ESPARTA': {
    'PAMPATAR': 'MANEIRO',
  },
  'SUCRE': {
    'CUMANÁ': 'SUCRE', 'CUMANA': 'SUCRE', 'MARIGUITAR': 'BOLIVAR',
  },
  'TACHIRA': {
    'TÁRIBA': 'CARDENAS', 'TARIBA': 'CARDENAS',
  },
  'TRUJILLO': {
    'SABANA DE MENDOZA': 'SUCRE',
  },
  'ZULIA': {
    'CIUDAD OJEDA': 'LAGUNILLAS',
  },
}

// 5. Try to find best matching municipio for a city name
function findMunicipio(estado, ciudadNombre, estadoNombre) {
  if (!estado) return null
  const c = cleanName(ciudadNombre)

  // Manual override first
  const cityMap = cityMunicipioMap[estadoNombre]
  if (cityMap && cityMap[c]) {
    return estado.municipios.find(m => m.nombre === cityMap[c]) || null
  }

  // Exact match
  let match = estado.municipios.find(m => m.nombre === c)
  if (match) return match

  // Contains match
  match = estado.municipios.find(m => m.nombre.includes(c) || c.includes(m.nombre))
  if (match) return match

  // Partial word match (split into words)
  const ciudadWords = c.split(' ')
  for (const m of estado.municipios) {
    const mWords = m.nombre.split(' ')
    const common = ciudadWords.filter(w => w.length > 2 && mWords.includes(w))
    if (common.length > 0) return m
  }

  return null
}

// 6. Get first parroquia of a municipio (or null)
function getFirstParroquia(municipio) {
  if (municipio && municipio.parroquias.length > 0) {
    return municipio.parroquias[0]
  }
  return null
}

// 7. Generate SQL
const recibeDefault = centros.recibe_default || []
const recibeOptions = centros.recibe_options || []

let sql = '-- Generated: instituciones from centros.json\n'
sql += '-- Mapped to estados/municipios/parroquias from seed\n\n'
sql += '-- First, ensure the geo seed is loaded\n'
sql += "-- Run scripts/seed_geo.sql first if you haven't already\n\n"

let total = 0
let unmapped = []
let mappedCentros = []

for (const est of centros.estados) {
  const estadoNombre = cleanName(est.nombre)
  const normalizedEstado = estadoAliases[estadoNombre] || estadoNombre
  const estado = estadoMap[normalizedEstado]

  if (!estado) {
    console.error('Estado no encontrado:', est.nombre, '(normalized:', normalizedEstado + ')')
    continue
  }

  for (const ciudad of est.ciudades) {
    // Check for special overrides (estado+ciudad that cross state boundaries)
    const override = specialOverrides[normalizedEstado]?.[cleanName(ciudad.nombre)]
    let overrideEstado = null
    let overrideMunicipio = null
    let overrideParroquia = null
    if (override) {
      overrideEstado = estadoMap[override.estado]
      overrideMunicipio = overrideEstado?.municipios.find(m => m.nombre === override.municipio) || null
      overrideParroquia = override.parroquia || null
    }

    const lookupEstado = overrideEstado || estado
    const municipio = findMunicipio(lookupEstado, ciudad.nombre, normalizedEstado)
    const parroquiaNombre = getFirstParroquia(municipio)

    if (!municipio) {
      console.error('  Municipio no encontrado para ciudad:', ciudad.nombre, 'en', est.nombre)
    }

    for (const centro of ciudad.centros) {
      const nombre = centro.nombre || ''
      const direccion = centro.direccion || ''
      const recibe = centro.recibe || recibeDefault
      const tiposAyuda = recibe.join(' | ')
      const telefono = centro.contacto || centro.whatsapp || ''
      const horario = centro.horario || ''
      const notas = centro.nota || ''
      const instagram = centro.instagram || ''
      const instagramUrl = centro.instagram_url || ''
      const fuente = centro.fuente || ''
      const coords = centro.coords || []
      const latitud = coords[0] || null
      const longitud = coords[1] || null
      const maps = centro.maps || ''

      // Use override municipio/parroquia if available
      const finalMunicipio = overrideMunicipio || municipio
      const finalParroquia = overrideParroquia || getFirstParroquia(finalMunicipio)

      // Build detailed notes
      const notasParts = []
      if (notas) notasParts.push(notas)
      if (fuente) notasParts.push('Fuente: ' + fuente)
      if (maps) notasParts.push('Maps: ' + maps)

      const notasFinal = notasParts.join(' | ') || null
      const instagramFinal = instagram || instagramUrl || null

      mappedCentros.push({
        estado: overrideEstado ? overrideEstado.nombre : (estado ? estado.nombre : '???'),
        estadoKey: overrideEstado ? override.estado : (estado ? estado.nombre : '???'),
        municipio: finalMunicipio ? finalMunicipio.nombre : '???',
        parroquia: finalParroquia || '???',
        nombre,
        direccion,
        tiposAyuda,
        telefono,
        horario,
        notas: notasFinal,
        latitud,
        longitud,
        instagram: instagramFinal,
      })

      if (!municipio) {
        unmapped.push({ estado: est.nombre, ciudad: ciudad.nombre, nombre })
      }

      total++
    }
  }
}

// Generate INSERT statements
sql += '-- Total: ' + total + ' instituciones\n'
sql += '-- ' + unmapped.length + ' sin municipio\n\n'

sql += 'do $$ \n'
sql += 'begin\n\n'

for (const c of mappedCentros) {
  if (c.parroquia === '???') {
    sql += '  -- SKIPPED (no parroquia): ' + escapeSql(c.nombre) + '\n'
    continue
  }

  const estadoEscaped = escapeSql(c.estadoKey)
  const municipioEscaped = escapeSql(c.municipio)
  const parroquiaEscaped = escapeSql(c.parroquia)
  const nombreEscaped = escapeSql(c.nombre)
  const direccionEscaped = escapeSql(c.direccion)
  const tiposEscaped = escapeSql(c.tiposAyuda)
  const telefonoEscaped = escapeSql(c.telefono)
  const horarioEscaped = escapeSql(c.horario)
  const notasEscaped = escapeSql(c.notas)
  const instagramEscaped = escapeSql(c.instagram)
  const lat = c.latitud !== null ? c.latitud : 'null'
  const lng = c.longitud !== null ? c.longitud : 'null'

  sql += '  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)\n'
  sql += "  values ('" + nombreEscaped + "', '" + direccionEscaped + "',\n"
  sql += "    (select id from public.parroquia where nombre = '" + parroquiaEscaped + "'\n"
  sql += "      and municipio_id = (select id from public.municipio where nombre = '" + municipioEscaped + "'\n"
  sql += "        and estado_id = (select id from public.estado where nombre = '" + estadoEscaped + "'))),\n"
  sql += "    '" + tiposEscaped + "', '" + telefonoEscaped + "', '" + horarioEscaped + "',\n"
  sql += "    " + (notasEscaped ? "'" + notasEscaped + "'" : 'null') + ",\n"
  sql += "    " + lat + ", " + lng + ",\n"
  sql += "    " + (instagramEscaped ? "'" + instagramEscaped + "'" : 'null') + ");\n"
}

sql += '\nend; $$;\n'

sql += '\n-- Stats\n'
sql += '-- Total instituciones: ' + total + '\n'
sql += '-- Insertadas: ' + mappedCentros.filter(c => c.parroquia !== '???').length + '\n'
sql += '-- Sin mapeo: ' + unmapped.length + '\n'

if (unmapped.length > 0) {
  sql += '--\n-- Sin mapeo:\n'
  for (const u of unmapped) {
    sql += '--   ' + u.estado + ' / ' + u.ciudad + ' → ' + u.nombre + '\n'
  }
}

fs.writeFileSync('/tmp/seed_instituciones.sql', sql)
console.log('Total centros:', total)
console.log('Insertados:', mappedCentros.filter(c => c.parroquia !== '???').length)
console.log('Sin mapeo:', unmapped.length)
console.log('SQL generado en: /tmp/seed_instituciones.sql')
