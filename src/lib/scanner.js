import { CONFIG } from './config'

let detector = null
let stream = null
let scanning = false

function initDetector() {
  if (detector) {
    return true
  }
  if (!('BarcodeDetector' in window)) {
    return false
  }
  try {
    detector = new BarcodeDetector({ formats: CONFIG.BARCODE_FORMATS })
    return true
  } catch (err) {
    return false
  }
}

export async function startCamera(videoElement) {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    })
    videoElement.srcObject = stream
    await videoElement.play()
  } catch (err) {
    throw err
  }
}

export function stopCamera() {
  scanning = false
  if (stream) {
    const tracks = stream.getTracks()
    tracks.forEach(t => {
      t.stop()
    })
    stream = null
  }
}

export async function startDetection(videoElement, onDetected) {
  if (!initDetector()) throw new Error('BarcodeDetector no disponible en este navegador.')
  scanning = true
  let lastCode = ''
  let lastTime = 0
  let frameCount = 0

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
          onDetected(code)
        }
      }
    } catch (err) {
      // frame error, skip silently
    }
    await new Promise(r => setTimeout(r, CONFIG.SCAN_INTERVAL))
  }
}

export function isScannerAvailable() {
  const available = 'BarcodeDetector' in window
  return available
}
