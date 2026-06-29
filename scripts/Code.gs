/**
 * Centros de Acopio — Google Apps Script
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Creá un Google Sheet en https://sheets.new
 * 2. Andá a Extensiones → Apps Script
 * 3. Pegá este código y guardalo (Ctrl+S)
 * 4. Nombrá el proyecto "Centros de Acopio"
 * 5. Ejecutá la función `setupSheet()` una vez para crear los encabezados
 * 6. Desplegá: Implementar → Nueva implementación → Web app
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Acceso: "Cualquiera" (incluso anónimo)
 * 7. Copiá la URL del web app y pegala en src/config.js como APPS_SCRIPT_URL
 */

// ============================================================
// CONFIGURACIÓN
// ============================================================

const SHEET_NAME = 'Registros';  // Nombre de la pestaña

// ============================================================
// WEB APP — Recibe POST desde la app móvil
// ============================================================

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
    return jsonResponse({
      success: false,
      error: error.toString(),
    });
  }
}

// ============================================================
// WEB APP — GET (para verificar que el backend funciona)
// ============================================================

function doGet(e) {
  // Si es un test desde el browser
  if (e && e.parameter && e.parameter._test === '1') {
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="utf-8"><title>Centros de Acopio API</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: system-ui; padding: 2em; text-align: center; background: #0f0f1a; color: #eee; }
        .ok { color: #2ecc71; font-size: 3em; }
        h1 { font-size: 1.3em; }
      </style>
      </head>
      <body>
        <div class="ok">✓</div>
        <h1>Backend activo</h1>
        <p>El web app de Centros de Acopio está funcionando.</p>
        <p style="color:#888;font-size:.85em">
          Últimos registros: ${getOrCreateSheet().getLastRow() - 1}
        </p>
      </body>
      </html>
    `).setTitle('Centros de Acopio — API');
  }

  // GET normal → respuesta JSON
  return jsonResponse({
    status: 'ok',
    message: 'Centros de Acopio API activa',
    records: getOrCreateSheet().getLastRow() - 1,
  });
}

// ============================================================
// HOJA DE CÁLCULO
// ============================================================

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Código de barras',
      'Producto',
      'Categoría',
      'Cantidad',
      'Unidad',
      'Donante / Procedencia',
      'Notas',
      'Estado',
    ]);
    sheet.setFrozenRows(1);
    // Formato: negrita en encabezados
    sheet.getRange('1:1').setFontWeight('bold');
    // Autoajustar columnas
    sheet.autoResizeColumns(1, 9);
  }

  return sheet;
}

// ============================================================
// SETUP — Ejecutar una vez desde el editor
// ============================================================

function setupSheet() {
  getOrCreateSheet();
  SpreadsheetApp.getUi().alert('Hoja configurada correctamente ✅');
}

// ============================================================
// UTILIDADES
// ============================================================

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
