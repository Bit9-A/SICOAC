const fs = require('fs')

const md = fs.readFileSync('/home/adrianvergel/centros-acopio/estados_municipios_parroquias.md', 'utf8')

const estados = []
let currentEstado = null
let currentMunicipio = null

const lines = md.split('\n')
for (const line of lines) {
  const trimmed = line.trim()
  if (!trimmed) continue

  const estadoMatch = trimmed.match(/^##\s+(.+)/)
  if (estadoMatch) {
    currentEstado = { nombre: estadoMatch[1].trim(), municipios: [] }
    estados.push(currentEstado)
    currentMunicipio = null
    continue
  }

  const municipioMatch = trimmed.match(/^###\s+(.+)/)
  if (municipioMatch && currentEstado) {
    currentMunicipio = { nombre: municipioMatch[1].trim(), parroquias: [] }
    currentEstado.municipios.push(currentMunicipio)
    continue
  }

  // Parroquia: - PQ. NAME, - PQ.NAME, - CM. NAME, - CM.NAME, or plain - NAME
  const parroquiaMatch = trimmed.match(/^-\s+(?:PQ|CM)\.?\s*(.+)/i)
  const plainMatch = trimmed.match(/^-\s+(.+)/)
  if (currentMunicipio && (parroquiaMatch || plainMatch)) {
    const nombre = (parroquiaMatch || plainMatch)[1].trim()
      .replace(/&NTILDE;/gi, 'N')
      .replace(/&ntilde;/gi, 'n')
      .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))
    if (nombre && !nombre.startsWith('#')) {
      currentMunicipio.parroquias.push(nombre)
    }
  }
}

function escapeSql(s) {
  return s.replace(/'/g, "''").replace(/[<>]/g, '').trim()
}

let totalParroquias = 0
const totalEstados = estados.length
const totalMunicipios = estados.reduce((s, e) => s + e.municipios.length, 0)

let sql = '-- Seed: Division Politico-Territorial de Venezuela\n'
sql += '-- ' + totalEstados + ' estados, ' + totalMunicipios + ' municipios\n\n'
sql += '-- Clear existing data (order matters for FK)\n'
sql += 'truncate table public.parroquia cascade;\n'
sql += 'truncate table public.municipio cascade;\n'
sql += 'truncate table public.estado cascade;\n\n'
sql += '-- Reset sequences\n'
sql += 'alter sequence public.estado_id_seq restart with 1;\n'
sql += 'alter sequence public.municipio_id_seq restart with 1;\n'
sql += 'alter sequence public.parroquia_id_seq restart with 1;\n\n'
sql += '-- Insert estados\n'

for (const estado of estados) {
  sql += "insert into public.estado (nombre) values ('" + escapeSql(estado.nombre) + "');\n"
}

sql += '\n-- Insert municipios\n'

for (const estado of estados) {
  for (const municipio of estado.municipios) {
    sql += "insert into public.municipio (nombre, estado_id) values ('" + escapeSql(municipio.nombre) + "', (select id from public.estado where nombre = '" + escapeSql(estado.nombre) + "'));\n"
  }
}

sql += '\n-- Insert parroquias\n'

for (const estado of estados) {
  for (const municipio of estado.municipios) {
    for (const parroquia of municipio.parroquias) {
      sql += "insert into public.parroquia (nombre, municipio_id) values ('" + escapeSql(parroquia) + "', (select id from public.municipio where nombre = '" + escapeSql(municipio.nombre) + "' and estado_id = (select id from public.estado where nombre = '" + escapeSql(estado.nombre) + "')));\n"
      totalParroquias++
    }
  }
}

sql += '\n-- Indexes\n'
sql += 'create index if not exists idx_municipio_estado on public.municipio(estado_id, nombre);\n'
sql += 'create index if not exists idx_parroquia_municipio on public.parroquia(municipio_id, nombre);\n'

sql += '\n-- Helper: full geo chain for an institution\n'
sql += 'create or replace function public.get_institucion_geo(p_institucion_id bigint)\n'
sql += 'returns table (\n'
sql += '  institucion_nombre text,\n'
sql += '  direccion text,\n'
sql += '  parroquia text,\n'
sql += '  municipio text,\n'
sql += '  estado text\n'
sql += ') language plpgsql stable as $$\n'
sql += 'begin\n'
sql += '  return query\n'
sql += '    select i.nombre, i.direccion, p.nombre, m.nombre, e.nombre\n'
sql += '    from public.institucion i\n'
sql += '    join public.parroquia p on p.id = i.parroquia_id\n'
sql += '    join public.municipio m on m.id = p.municipio_id\n'
sql += '    join public.estado e on e.id = m.estado_id\n'
sql += '    where i.id = p_institucion_id;\n'
sql += 'end;\n$$;\n'

fs.writeFileSync('/tmp/geo_seed.sql', sql)
console.log('Stats:', totalEstados + ' estados, ' + totalMunicipios + ' municipios, ' + totalParroquias + ' parroquias')
