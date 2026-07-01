/**
 * Dexie — Base de datos local IndexedDB
 *
 * Almacena catálogos y movimientos offline. Sin cuentas, sin servidores.
 * Los catálogos se cachean desde Supabase al arrancar.
 * Los movimientos se escriben local + Supabase cuando hay conexión.
 */
import Dexie from 'dexie'

const db = new Dexie('sicoac')

db.version(4).stores({
  // Catálogos — value = Supabase ID
  estados:        '&value, label',
  municipios:     '&value, label, estadoId',
  parroquias:     '&value, label, municipioId',
  instituciones:  '&value, label',
  categorias:     '&value, label',
  subcategorias:  '&value, label, categoriaId',
  tipoMovimiento: '&value, label',

  // Productos
  productos:       '&value, label',
  productoCodigos: '&value, codigo, productoId',

  // Movimientos — localId auto-increment
  movimientos: '++localId, productName, institucionId, createdAt',

  // Metadata
  syncMeta: 'key',
})

export default db

/**
 * Cachea un catálogo desde Supabase si está vacío.
 * @param {string} table - nombre de la tabla Dexie
 * @param {Function} fetchSupabase - función que trae datos de Supabase
 * @param {Function} toLocal - transforma cada item al formato Dexie
 */
export async function cacheCatalog(table, fetchSupabase, toLocal) {
  const count = await db[table].count()
  if (count > 0) return
  try {
    const data = await fetchSupabase()
    if (!data?.length) return
    await db[table].bulkPut(data.map(toLocal))
  } catch { /* silencioso */ }
}

/**
 * Busca productos localmente por nombre (ILIKE).
 */
export async function searchLocalProducts(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.trim().toUpperCase()
  const all = await db.productos.toArray()
  return all.filter((p) => p.nombre?.toUpperCase().includes(q))
}

/**
 * Busca un producto por código de barras.
 */
export async function findLocalProductByBarcode(code) {
  if (!code) return null
  const match = await db.productoCodigos
    .where('codigo')
    .equals(code.trim())
    .first()
  if (!match) return null
  return db.productos.get(match.productoId)
}
