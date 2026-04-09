const RSVP_SHEET_CONFIG = {
  sheetDb: "RSVP_DB",
  sheetDash: "Dashboard",
  sheetHelp: "Istruzioni",
  timezone: "Europe/Rome",
  webhookTokenProperty: "RSVP_WEBHOOK_TOKEN",
  columnsCount: 18,
};
function doGet() {
  return respondJson_({
    ok: true,
    service: "wedding-rsvp-google-sheet-backup",
    timestamp: new Date().toISOString(),
  });
}
function doPost(e) {
  const timestamp = new Date().toISOString();
  try {
    const payload = parseJsonBody_(e);
    verifyWebhookToken_(payload);
    const event = normalizeIncomingEvent_(payload);
    if (!event) {
      return respondJson_({ ok: false, error: "Payload RSVP non valido", timestamp });
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const db = ss.getSheetByName(RSVP_SHEET_CONFIG.sheetDb);
    const dash = ss.getSheetByName(RSVP_SHEET_CONFIG.sheetDash);
    if (!db || !dash) {
      throw new Error(
        "Fogli mancanti: eseguire buildWeddingRsvpBackupSheet() prima di usare il webhook",
      );
    }
    upsertRsvpRecord_(db, event.record, event.source, event.note);
    refreshWeddingRsvpBackup_();
    return respondJson_({
      ok: true,
      id: event.record.id,
      source: event.source,
      timestamp,
    });
  } catch (error) {
    return respondJson_({
      ok: false,
      error: String((error && error.message) || error),
      timestamp,
    });
  }
}
function refreshWeddingRsvpBackup_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RSVP_SHEET_CONFIG.sheetDb);
  const dash = ss.getSheetByName(RSVP_SHEET_CONFIG.sheetDash);
  if (!sheet || !dash) return;
  const lastRecordRow = getLastRecordRow_(sheet);
  if (lastRecordRow <= 1) {
    clearDashboardValues_(dash);
    return;
  }
  const rowCount = lastRecordRow - 1;
  const values = sheet.getRange(2, 1, rowCount, RSVP_SHEET_CONFIG.columnsCount).getValues();
  let adultsConfirmed = 0;
  let underConfirmed = 0;
  let vegetarianConfirmed = 0;
  let celiacConfirmed = 0;
  let absents = 0;
  let totalRsvp = 0;
  let latestUpdatedAt = null;
  const outputD = [];
  const outputF = [];
  const outputI = [];
  const outputL = [];
  const outputN = [];
  for (let i = 0; i < values.length; i += 1) {
    const row = values[i];
    const id = safeString_(row[0]);
    const firstName = safeString_(row[1]);
    const lastName = safeString_(row[2]);
    const rowHasData = id !== "";
    if (!rowHasData) {
      outputD.push([""]);
      outputF.push([""]);
      outputI.push([""]);
      outputL.push([""]);
      outputN.push([""]);
      continue;
    }
    const attending = row[4] === true;
    const guestCount = clampInteger_(row[6], 1, 10, 1);
    const childrenCount = clampInteger_(row[7], 0, 10, 0);
    const vegetarian = clampInteger_(row[9], 0, 10, 0);
    const celiac = clampInteger_(row[10], 0, 10, 0);
    const submittedIso = safeString_(row[12]);
    const updatedIso = safeString_(row[17]);
    const fullName = [firstName, lastName].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    const status = attending ? "Confermato" : "Non partecipa";
    const totalPeople = attending ? guestCount + childrenCount : 0;
    const totalDiets = vegetarian + celiac;
    const submittedLocal = formatIsoToLocal_(submittedIso);
    outputD.push([fullName]);
    outputF.push([status]);
    outputI.push([totalPeople]);
    outputL.push([totalDiets]);
    outputN.push([submittedLocal]);
    totalRsvp += 1;
    if (attending) {
      adultsConfirmed += guestCount;
      underConfirmed += childrenCount;
      vegetarianConfirmed += vegetarian;
      celiacConfirmed += celiac;
    } else {
      absents += 1;
    }
    const candidate = parseIsoStringToDate_(updatedIso) || parseIsoStringToDate_(submittedIso);
    if (candidate && (!latestUpdatedAt || candidate > latestUpdatedAt)) {
      latestUpdatedAt = candidate;
    }
  }
  sheet.getRange(2, 4, outputD.length, 1).setValues(outputD);
  sheet.getRange(2, 6, outputF.length, 1).setValues(outputF);
  sheet.getRange(2, 9, outputI.length, 1).setValues(outputI);
  sheet.getRange(2, 12, outputL.length, 1).setValues(outputL);
  sheet.getRange(2, 14, outputN.length, 1).setValues(outputN);
  sheet.getRange(2, 7, rowCount, 6).setNumberFormat("0");
  sheet.getRange(2, 14, rowCount, 1).setNumberFormat("dd/MM/yyyy HH:mm");
  sheet.getRange(2, 17, rowCount, 2).setNumberFormat("dd/MM/yyyy HH:mm");
  dash.getRange("A5:B7").setValue(adultsConfirmed);
  dash.getRange("C5:D7").setValue(underConfirmed);
  dash.getRange("E5:F7").setValue(vegetarianConfirmed);
  dash.getRange("G5:H7").setValue(celiacConfirmed);
  dash.getRange("A11:B13").setValue(absents);
  dash.getRange("C11:D13").setValue(totalRsvp);
  dash.getRange("E11:F13").clearContent();
  if (latestUpdatedAt) {
    dash.getRange("E11:F13").setValue(latestUpdatedAt).setNumberFormat("dd/MM/yyyy HH:mm");
  }
}
function clearDashboardValues_(dash) {
  dash.getRange("A5:B7").setValue(0);
  dash.getRange("C5:D7").setValue(0);
  dash.getRange("E5:F7").setValue(0);
  dash.getRange("G5:H7").setValue(0);
  dash.getRange("A11:B13").setValue(0);
  dash.getRange("C11:D13").setValue(0);
  dash.getRange("E11:F13").clearContent();
}
function upsertRsvpRecord_(sheet, record, source, note) {
  const rowValues = mapRsvpToSheetRow_(record, source, note);
  const id = rowValues[0];
  const idToRow = getIdToRowMap_(sheet);
  let targetRow = idToRow[id];
  if (!targetRow) {
    targetRow = findFirstEmptyIdRow_(sheet);
    if (targetRow > sheet.getMaxRows()) {
      sheet.insertRowsAfter(sheet.getMaxRows(), targetRow - sheet.getMaxRows());
    }
  }
  sheet.getRange(targetRow, 1, 1, RSVP_SHEET_CONFIG.columnsCount).setValues([rowValues]);
}
function mapRsvpToSheetRow_(rawRecord, source, note) {
  const record = normalizeRsvpRecord_(rawRecord);
  const fullName = `${record.first_name} ${record.last_name}`.trim();
  const status = record.attending ? "Confermato" : "Non partecipa";
  const totalPeople = record.attending ? record.guest_count + record.children_count : 0;
  const totalDiets = record.dietary_vegetarian + record.dietary_celiac;
  return [
    record.id,
    record.first_name,
    record.last_name,
    fullName,
    record.attending,
    status,
    record.guest_count,
    record.children_count,
    totalPeople,
    record.dietary_vegetarian,
    record.dietary_celiac,
    totalDiets,
    record.submitted_at,
    formatIsoToLocal_(record.submitted_at),
    safeString_(source || "supabase"),
    safeString_(note || ""),
    record.created_at,
    record.updated_at,
  ];
}
function normalizeIncomingEvent_(payload) {
  const source = safeString_(payload.source || "supabase");
  const note = safeString_(payload.note || "");
  const rawRecord = payload.rsvp || payload.record || payload.new || payload.data;
  if (!rawRecord || typeof rawRecord !== "object") return null;
  const record = normalizeRsvpRecord_(rawRecord);
  if (!record.id || !record.first_name || !record.last_name) return null;
  return { record, source, note };
}
function normalizeRsvpRecord_(raw) {
  const dietaryCounts = raw.dietary_counts || raw.dietaryCounts || {};
  const nowIso = new Date().toISOString();
  const record = {
    id: safeString_(raw.id),
    first_name: safeString_(raw.first_name || raw.firstName),
    last_name: safeString_(raw.last_name || raw.lastName),
    attending: toBoolean_(raw.attending, true),
    guest_count: clampInteger_(raw.guest_count || raw.guestCount, 1, 10, 1),
    children_count: clampInteger_(raw.children_count || raw.childrenCount, 0, 10, 0),
    dietary_vegetarian: clampInteger_(
      dietaryCounts.vegetarian || raw.dietary_vegetarian,
      0,
      10,
      0,
    ),
    dietary_celiac: clampInteger_(dietaryCounts.celiac || raw.dietary_celiac, 0, 10, 0),
    submitted_at: normalizeIso_(raw.submitted_at || raw.submittedAt, nowIso),
    created_at: normalizeIso_(raw.created_at || raw.createdAt, ""),
    updated_at: normalizeIso_(raw.updated_at || raw.updatedAt, nowIso),
  };
  return record;
}
function getIdToRowMap_(sheet) {
  const map = {};
  const lastRecordRow = getLastRecordRow_(sheet);
  if (lastRecordRow <= 1) return map;
  const ids = sheet.getRange(2, 1, lastRecordRow - 1, 1).getDisplayValues();
  for (let i = 0; i < ids.length; i += 1) {
    const id = safeString_(ids[i][0]);
    if (!id) continue;
    map[id] = i + 2;
  }
  return map;
}
function getLastRecordRow_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows <= 1) return 1;
  const ids = sheet.getRange(2, 1, maxRows - 1, 1).getDisplayValues();
  for (let i = ids.length - 1; i >= 0; i -= 1) {
    if (safeString_(ids[i][0]) !== "") return i + 2;
  }
  return 1;
}
function findFirstEmptyIdRow_(sheet) {
  const lastRecordRow = getLastRecordRow_(sheet);
  if (lastRecordRow <= 1) return 2;
  const ids = sheet.getRange(2, 1, lastRecordRow - 1, 1).getDisplayValues();
  for (let i = 0; i < ids.length; i += 1) {
    if (safeString_(ids[i][0]) === "") return i + 2;
  }
  return lastRecordRow + 1;
}
function compactRsvpDbRows_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows <= 1) return;
  const dataRange = sheet.getRange(2, 1, maxRows - 1, RSVP_SHEET_CONFIG.columnsCount);
  const rows = dataRange.getValues();
  const used = rows.filter((row) => safeString_(row[0]) !== "");
  dataRange.clearContent();
  if (used.length > 0) {
    sheet.getRange(2, 1, used.length, RSVP_SHEET_CONFIG.columnsCount).setValues(used);
  }
}
function verifyWebhookToken_(payload) {
  const expected = safeString_(PropertiesService.getScriptProperties().getProperty(
    RSVP_SHEET_CONFIG.webhookTokenProperty,
  ));
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
function respondJson_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function safeString_(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}
function toBoolean_(value, fallback) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return fallback;
}
function clampInteger_(value, min, max, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
function parseIsoStringToDate_(value) {
  const s = safeString_(value);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}
function formatIsoToLocal_(value) {
  const d = parseIsoStringToDate_(value);
  if (!d) return "";
  return Utilities.formatDate(d, RSVP_SHEET_CONFIG.timezone, "dd/MM/yyyy HH:mm");
}
function normalizeIso_(value, fallback) {
  const d = parseIsoStringToDate_(value);
  if (d) return d.toISOString();
  return safeString_(fallback);
}
