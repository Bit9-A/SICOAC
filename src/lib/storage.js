import { CONFIG } from './config'

export function getQueue() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY)
    const queue = raw ? JSON.parse(raw) : []
    return queue
  } catch (err) {
    return []
  }
}

function saveQueue(queue) {
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(queue))
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
    const count = parseInt(localStorage.getItem(CONFIG.SESSION_KEY) || '0', 10)
    return count
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
