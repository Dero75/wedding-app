const SIMPLE_CONFIG = {
  sheetName: "RSVP_BACKUP",
  timezone: "Europe/Rome",
  webhookTokenProperty: "RSVP_WEBHOOK_TOKEN",
  minRows: 200,
  minCols: 10,
  headers: [
    "id",
    "nome",
    "cognome",
    "stato",
    "adulti",
    "under",
    "vegetariani",
    "celiaci",
    "totale_persone",
    "updated_at",
  ],
};

function doGet() {
  return jsonResponse_({
    ok: true,
    service: "wedding-rsvp-google-sheet-backup",
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  const timestamp = new Date().toISOString();
  const lock = LockService.getDocumentLock();

  try {
    lock.waitLock(30000);

    const payload = parseJsonBody_(e);
    verifyWebhookToken_(payload);

    const event = normalizeIncomingEvent_(payload);
    if (!event) {
      return jsonResponse_({ ok: false, error: "Payload RSVP non valido", timestamp });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(ss, SIMPLE_CONFIG.sheetName);
    setupSimpleSheetIfNeeded_(sheet);

    if (event.event === "DELETE") {
      deleteSimpleRsvpById_(sheet, event.record.id);
    } else {
      upsertSimpleRsvp_(sheet, event.record);
    }

    return jsonResponse_({
      ok: true,
      id: event.record.id,
      source: event.source,
      event: event.event,
      timestamp,
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String((error && error.message) || error),
      timestamp,
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {
      // no-op
    }
  }
}

function buildWeddingRsvpBackupSheet() {
  buildSimpleRsvpBackupSheet();
}

function buildSimpleRsvpBackupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, SIMPLE_CONFIG.sheetName);
  setupSimpleSheetIfNeeded_(sheet);
  compactSimpleSheet_(sheet);
}

function setupSimpleSheetIfNeeded_(sheet) {
  ensureMinimumGridSize_(sheet, SIMPLE_CONFIG.minRows, SIMPLE_CONFIG.minCols);

  const current = sheet.getRange(1, 1, 1, SIMPLE_CONFIG.headers.length).getDisplayValues()[0];
  const hasExpectedHeader = SIMPLE_CONFIG.headers.every((h, i) => safeString_(current[i]) === h);
  if (!hasExpectedHeader) {
    sheet.getRange(1, 1, 1, SIMPLE_CONFIG.headers.length).setValues([SIMPLE_CONFIG.headers]);
  }

  sheet.setFrozenRows(1);

  sheet
    .getRange(1, 1, 1, SIMPLE_CONFIG.headers.length)
    .setBackground("#4A3728")
    .setFontColor("#FAF5EE")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  const widths = [360, 160, 170, 160, 70, 70, 100, 85, 130, 190];
  for (let i = 0; i < widths.length; i += 1) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }

  if (sheet.getMaxRows() > 1) {
    sheet.getRange(2, 5, sheet.getMaxRows() - 1, 5).setNumberFormat("0");
  }
}

function upsertSimpleRsvp_(sheet, rawRecord) {
  const record = normalizeRsvpRecord_(rawRecord);
  if (!record.id) return;

  const rowValues = mapSimpleRsvpRow_(record);
  const targetRow = findRowById_(sheet, record.id) || findFirstEmptyIdRow_(sheet);

  if (targetRow > sheet.getMaxRows()) {
    sheet.insertRowsAfter(sheet.getMaxRows(), targetRow - sheet.getMaxRows());
  }

  sheet.getRange(targetRow, 1, 1, SIMPLE_CONFIG.headers.length).setValues([rowValues]);
}

function deleteSimpleRsvpById_(sheet, id) {
  const targetId = safeString_(id);
  if (!targetId) return;

  const row = findRowById_(sheet, targetId);
  if (!row) return;

  sheet.getRange(row, 1, 1, SIMPLE_CONFIG.headers.length).clearContent();
  compactSimpleSheet_(sheet);
}

function compactSimpleSheet_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const lastCol = SIMPLE_CONFIG.headers.length;
  const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  const used = rows.filter((row) => safeString_(row[0]) !== "");

  sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  if (used.length > 0) {
    sheet.getRange(2, 1, used.length, lastCol).setValues(used);
  }
}

function mapSimpleRsvpRow_(record) {
  const attending = record.attending === true;
  const adults = attending ? record.guest_count : 0;
  const under = attending ? record.children_count : 0;
  const vegetariani = attending ? record.dietary_vegetarian : 0;
  const celiaci = attending ? record.dietary_celiac : 0;
  const totalePersone = attending ? adults + under : 0;
  const stato = attending ? "Confermato" : "Non partecipa";

  return [
    record.id,
    record.first_name,
    record.last_name,
    stato,
    adults,
    under,
    vegetariani,
    celiaci,
    totalePersone,
    formatIsoToLocal_(record.updated_at || record.submitted_at),
  ];
}

function normalizeIncomingEvent_(payload) {
  const source = safeString_(payload.source || "supabase");
  const rawEvent = safeString_(payload.event || payload.type || "UPSERT").toUpperCase();
  const rawRecord = payload.record || payload.rsvp || payload.new || payload.old || payload.data;

  if (!rawRecord || typeof rawRecord !== "object") return null;

  const record = normalizeRsvpRecord_(rawRecord);
  if (!record.id) return null;

  const event = rawEvent === "DELETE" ? "DELETE" : "UPSERT";
  return { source, event, record };
}

function normalizeRsvpRecord_(raw) {
  const dietaryCounts = raw.dietary_counts || raw.dietaryCounts || {};
  const nowIso = new Date().toISOString();

  return {
    id: safeString_(raw.id),
    first_name: safeString_(raw.first_name || raw.firstName),
    last_name: safeString_(raw.last_name || raw.lastName),
    attending: toBoolean_(raw.attending, true),
    guest_count: clampInteger_(raw.guest_count || raw.guestCount, 1, 10, 1),
    children_count: clampInteger_(raw.children_count || raw.childrenCount, 0, 10, 0),
    dietary_vegetarian: clampInteger_(
      dietaryCounts.vegetarian != null ? dietaryCounts.vegetarian : raw.dietary_vegetarian,
      0,
      10,
      0,
    ),
    dietary_celiac: clampInteger_(
      dietaryCounts.celiac != null ? dietaryCounts.celiac : raw.dietary_celiac,
      0,
      10,
      0,
    ),
    submitted_at: normalizeIso_(raw.submitted_at || raw.submittedAt, nowIso),
    updated_at: normalizeIso_(raw.updated_at || raw.updatedAt, nowIso),
  };
}

function findRowById_(sheet, id) {
  const targetId = safeString_(id);
  if (!targetId) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
  for (let i = 0; i < ids.length; i += 1) {
    if (safeString_(ids[i][0]) === targetId) return i + 2;
  }
  return null;
}

function findFirstEmptyIdRow_(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), 2);
  const rowCount = lastRow - 1;
  if (rowCount <= 0) return 2;

  const ids = sheet.getRange(2, 1, rowCount, 1).getDisplayValues();
  for (let i = 0; i < ids.length; i += 1) {
    if (safeString_(ids[i][0]) === "") return i + 2;
  }

  return lastRow + 1;
}

function verifyWebhookToken_(payload) {
  const expected = safeString_(
    PropertiesService.getScriptProperties().getProperty(SIMPLE_CONFIG.webhookTokenProperty),
  );
  const received = safeString_(payload.token);

  if (!expected) {
    throw new Error("Token non configurato in Script Properties: RSVP_WEBHOOK_TOKEN");
  }
  if (!received || received !== expected) {
    throw new Error("Token webhook non valido");
  }
}

function parseJsonBody_(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : "";
  if (!raw) throw new Error("Body JSON mancante");

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`JSON non valido: ${String((error && error.message) || error)}`);
  }
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function ensureMinimumGridSize_(sheet, minRows, minCols) {
  if (sheet.getMaxRows() < minRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), minRows - sheet.getMaxRows());
  }
  if (sheet.getMaxColumns() < minCols) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), minCols - sheet.getMaxColumns());
  }
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function safeString_(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function clampInteger_(value, min, max, fallback) {
  if (value === "" || value === null || value === undefined) return fallback;
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function toBoolean_(value, fallback) {
  if (value === true || value === false) return value;
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;

  const s = safeString_(value).toLowerCase();
  if (["true", "t", "yes", "y", "si", "s"].includes(s)) return true;
  if (["false", "f", "no", "n"].includes(s)) return false;

  return fallback;
}

function parseIsoStringToDate_(value) {
  const s = safeString_(value);
  if (!s) return null;

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;

  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] || 0),
  );
}

function formatIsoToLocal_(value) {
  const d = parseIsoStringToDate_(value);
  if (!d) return "";
  return Utilities.formatDate(d, SIMPLE_CONFIG.timezone, "dd/MM/yyyy HH:mm");
}

function normalizeIso_(value, fallback) {
  const d = parseIsoStringToDate_(value);
  if (d) return d.toISOString();
  return safeString_(fallback);
}
