import { CONFIG } from './config'

let detector = null
let stream = null
let scanning = false

function initDetector() {
  if (detector) {
    console.log('[Scanner] detector ya inicializado')
    return true
  }
  if (!('BarcodeDetector' in window)) {
    console.warn('[Scanner] BarcodeDetector NO está disponible en este navegador')
    return false
  }
  try {
    detector = new BarcodeDetector({ formats: CONFIG.BARCODE_FORMATS })
    console.log(`[Scanner] detector inicializado con ${CONFIG.BARCODE_FORMATS.length} formatos`)
    return true
  } catch (err) {
    console.error('[Scanner] error al inicializar detector:', err)
    return false
  }
}

export async function startCamera(videoElement) {
  console.log('[Scanner] solicitando acceso a cámara trasera...')
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    })
    videoElement.srcObject = stream
    await videoElement.play()
    console.log(`[Scanner] cámara activa: ${stream.getVideoTracks()[0]?.label || 'desconocida'}`)
  } catch (err) {
    console.error('[Scanner] error al abrir cámara:', err.name, err.message)
    throw err
  }
}

export function stopCamera() {
  console.log('[Scanner] deteniendo cámara...')
  scanning = false
  if (stream) {
    const tracks = stream.getTracks()
    tracks.forEach(t => {
      console.log(`[Scanner] deteniendo track: ${t.kind} (${t.label || 'sin nombre'})`)
      t.stop()
    })
    stream = null
    console.log('[Scanner] cámara detenida')
  }
}

export async function startDetection(videoElement, onDetected) {
  if (!initDetector()) throw new Error('BarcodeDetector no disponible en este navegador.')
  scanning = true
  let lastCode = ''
  let lastTime = 0
  let frameCount = 0

  console.log('[Scanner] bucle de detección iniciado')
  while (scanning) {
    try {
      const barcodes = await detector.detect(videoElement)
      frameCount++
      if (barcodes.length > 0) {
        const code = barcodes[0].rawValue
        const now = Date.now()
        if (code !== lastCode || now - lastTime > CONFIG.SCAN_COOLDOWN) {
          lastCode = code
          lastTime = now
          console.log(`[Scanner] CÓDIGO DETECTADO ✅: "${code}" (frame #${frameCount})`)
          onDetected(code)
        }
      }
    } catch (err) {
      // frame error, skip silently
    }
    await new Promise(r => setTimeout(r, CONFIG.SCAN_INTERVAL))
  }
  console.log(`[Scanner] bucle de detección terminado (${frameCount} frames procesados)`)
}

export function isScannerAvailable() {
  const available = 'BarcodeDetector' in window
  console.log(`[Scanner] isScannerAvailable — ${available ? '✅ sí' : '❌ no'}`)
  return available
}
