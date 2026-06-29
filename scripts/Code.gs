/**
 * Centros de Acopio — Google Apps Script
 *
 * INSTRUCCIONES:
 * 1. Creá un Google Sheet en https://sheets.new
 * 2. Extensiones → Apps Script → pegá este código
 * 3. Ejecutá setupSheet() una vez
 * 4. Implementar → Nueva impl. → Web app
 *    - Ejecutar como: "Yo"
 *    - Acceso: "Cualquiera"
 * 5. Copiá la URL en .env como VITE_GS_URL
 */

const SHEET_NAME = 'Registros';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.barcode || '',
      data.productName || '',
      data.category || '',
      Number(data.quantity) || 1,
      data.unit || 'unidades',
      data.donor || '',
      data.notes || '',
      data.status || 'recibido',
    ]);
    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter._test === '1') {
    return HtmlService.createHtmlOutput(
      '<h1>Centros de Acopio API — activa ✓</h1>'
    ).setTitle('Centros de Acopio');
  }
  return jsonResponse({
    status: 'ok',
    message: 'Centros de Acopio API activa',
    records: getOrCreateSheet().getLastRow() - 1,
  });
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Código de barras', 'Producto', 'Categoría',
      'Cantidad', 'Unidad', 'Donante / Procedencia', 'Notas', 'Estado',
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange('1:1').setFontWeight('bold');
    sheet.autoResizeColumns(1, 9);
  }
  return sheet;
}

function setupSheet() {
  getOrCreateSheet();
  SpreadsheetApp.getUi().alert('Hoja configurada ✓');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
