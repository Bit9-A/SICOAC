import { CONFIG } from './config'

export function getQueue() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY)
    const queue = raw ? JSON.parse(raw) : []
    console.log(`[Storage] getQueue — ${queue.length} pendiente(s)`)
    return queue
  } catch (err) {
    console.error('[Storage] getQueue — error parseando:', err)
    return []
  }
}

function saveQueue(queue) {
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(queue))
  console.log(`[Storage] saveQueue — guardados ${queue.length} registro(s) en localStorage`)
}

export function addToQueue(record) {
  const queue = getQueue()
  const entry = {
    ...record,
    _queuedAt: new Date().toISOString(),
    _id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
  }
  queue.push(entry)
  saveQueue(queue)
  console.log(`[Storage] addToQueue — agregado "${record.productName || 'sin nombre'}" (id=${entry._id}), cola total: ${queue.length}`)
  return queue.length
}

export function removeFromQueue(id) {
  console.log(`[Storage] removeFromQueue — eliminando id=${id}...`)
  const queue = getQueue().filter(r => r._id !== id)
  saveQueue(queue)
  console.log(`[Storage] removeFromQueue — cola ahora: ${queue.length}`)
  return queue
}

export function clearQueue() {
  console.log('[Storage] clearQueue — limpiando toda la cola offline')
  localStorage.removeItem(CONFIG.STORAGE_KEY)
}

export function getSessionCount() {
  try {
    const count = parseInt(localStorage.getItem(CONFIG.SESSION_KEY) || '0', 10)
    console.log(`[Storage] getSessionCount — ${count} registro(s) en esta sesión`)
    return count
  } catch {
    return 0
  }
}

export function incrementSessionCount() {
  const count = getSessionCount() + 1
  localStorage.setItem(CONFIG.SESSION_KEY, String(count))
  console.log(`[Storage] incrementSessionCount — ahora: ${count}`)
  return count
}

export function resetSessionCount() {
  console.log('[Storage] resetSessionCount — reiniciando contador de sesión')
  localStorage.removeItem(CONFIG.SESSION_KEY)
}
