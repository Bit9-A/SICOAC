import { CONFIG } from './config'

export function getQueue() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveQueue(queue) {
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(queue))
}

export function addToQueue(record) {
  const queue = getQueue()
  queue.push({
    ...record,
    _queuedAt: new Date().toISOString(),
    _id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
  })
  saveQueue(queue)
  return queue.length
}

export function removeFromQueue(id) {
  const queue = getQueue().filter(r => r._id !== id)
  saveQueue(queue)
  return queue
}

export function clearQueue() {
  localStorage.removeItem(CONFIG.STORAGE_KEY)
}

export function getSessionCount() {
  try {
    return parseInt(localStorage.getItem(CONFIG.SESSION_KEY) || '0', 10)
  } catch {
    return 0
  }
}

export function incrementSessionCount() {
  const count = getSessionCount() + 1
  localStorage.setItem(CONFIG.SESSION_KEY, String(count))
  return count
}

export function resetSessionCount() {
  localStorage.removeItem(CONFIG.SESSION_KEY)
}
