import { CONFIG } from './config'

export async function sendRecord(record) {
  if (!CONFIG.APPS_SCRIPT_URL) {
    throw new Error('URL de Google Sheets no configurada. Creá un archivo .env con VITE_GS_URL')
  }

  const payload = {
    timestamp: new Date().toISOString(),
    barcode: record.barcode || '',
    productName: record.productName || '',
    category: record.category || '',
    quantity: record.quantity || 1,
    unit: record.unit || 'unidades',
    donor: record.donor || '',
    notes: record.notes || '',
    status: 'recibido',
  }

  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch {
    throw new Error(`Respuesta inesperada: ${text.slice(0, 200)}`)
  }
  if (!data.success) throw new Error(data.error || 'Error del servidor')
  return data
}

export async function sendBatch(records, onProgress) {
  const ok = []
  const fail = []
  for (let i = 0; i < records.length; i++) {
    try {
      await sendRecord(records[i])
      ok.push(records[i])
    } catch (err) {
      fail.push({ record: records[i], error: err.message })
    }
    onProgress?.(i + 1, records.length)
  }
  return { ok, fail }
}

export function isConfigured() {
  return Boolean(CONFIG.APPS_SCRIPT_URL)
}
