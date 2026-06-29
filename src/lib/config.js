export const CONFIG = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  BARCODE_FORMATS: [
    'ean_13', 'ean_8', 'code_128', 'code_39', 'code_93',
    'codabar', 'upc_a', 'upc_e', 'itf',
    'qr_code', 'data_matrix', 'pdf417', 'aztec',
  ],
  STORAGE_KEY: 'acopio_queue',
  SESSION_KEY: 'acopio_session_count',
  SCAN_COOLDOWN: 2000,
  SCAN_INTERVAL: 150,
}
