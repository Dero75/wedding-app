function buildWeddingRsvpBackupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const columns = [
    { key: "id", width: 180 },
    { key: "first_name", width: 150 },
    { key: "last_name", width: 170 },
    { key: "nome_completo", width: 220 },
    { key: "attending", width: 95 },
    { key: "stato", width: 130 },
    { key: "guest_count", width: 120 },
    { key: "children_count", width: 130 },
    { key: "totale_persone", width: 130 },
    { key: "dietary_vegetarian", width: 140 },
    { key: "dietary_celiac", width: 120 },
    { key: "totale_diete", width: 120 },
    { key: "submitted_at_iso", width: 220 },
    { key: "submitted_at_local", width: 170 },
    { key: "source", width: 120 },
    { key: "note", width: 260 },
    { key: "created_at", width: 210 },
    { key: "updated_at", width: 210 },
  ];

  const colors = {
    headerBg: "#4A3728",
    headerText: "#FAF5EE",
    rowOdd: "#FFFDF9",
    rowEven: "#FAF5EE",
    border: "#E8D9C5",
    falseRowBg: "#FDF2F2",
    falseRowText: "#B74A4A",
    invalidBg: "#FFF4D6",
    duplicateBg: "#FFF6BF",
    dashboardBg: "#FAF5EE",
    dashboardCardBg: "#FFFDF9",
    dashboardText: "#3D2F24",
  };

  const dbSheet = getOrCreateSheet_(ss, RSVP_SHEET_CONFIG.sheetDb);
  const dashSheet = getOrCreateSheet_(ss, RSVP_SHEET_CONFIG.sheetDash);
  const helpSheet = getOrCreateSheet_(ss, RSVP_SHEET_CONFIG.sheetHelp);

  setupRsvpDbSheet_(dbSheet, columns, colors);
  setupDashboardSheet_(dashSheet, colors);
  setupInstructionsSheet_(helpSheet, colors);
  refreshWeddingRsvpBackup_();
}

function onEdit(e) {
  if (!e || !e.range) return;
  if (e.range.getSheet().getName() !== RSVP_SHEET_CONFIG.sheetDb) return;
  if (e.range.getRow() === 1) return;
  refreshWeddingRsvpBackup_();
}

function setupRsvpDbSheet_(sheet, columns, colors) {
  const lastCol = columns.length;
  ensureMinimumGridSize_(sheet, 300, lastCol);
  sheet.clearFormats();
  sheet.clearConditionalFormatRules();

  sheet.getRange(1, 1, 1, lastCol).setValues([columns.map((c) => c.key)]);
  columns.forEach((col, i) => sheet.setColumnWidth(i + 1, col.width));
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 42);
  sheet.setRowHeights(2, sheet.getMaxRows() - 1, 32);

  removeExistingFilter_(sheet);
  sheet.getRange(1, 1, Math.max(2, sheet.getMaxRows()), lastCol).createFilter();

  const fullRange = sheet.getRange(1, 1, sheet.getMaxRows(), lastCol);
  fullRange
    .setFontFamily("Arial")
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, colors.border, SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(1, 1, 1, lastCol)
    .setBackground(colors.headerBg)
    .setFontColor(colors.headerText)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  const bodyRange = sheet.getRange(2, 1, sheet.getMaxRows() - 1, lastCol);
  applyAlternatingRowBackgrounds_(bodyRange, colors.rowOdd, colors.rowEven);
  bodyRange.setFontColor("#2F241C");
  sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1).insertCheckboxes();

  const rule1to10 = SpreadsheetApp.newDataValidation().requireNumberBetween(1, 10).setAllowInvalid(false).build();
  const rule0to10 = SpreadsheetApp.newDataValidation().requireNumberBetween(0, 10).setAllowInvalid(false).build();
  sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1).setDataValidation(rule1to10);
  sheet.getRange(2, 8, sheet.getMaxRows() - 1, 1).setDataValidation(rule0to10);
  sheet.getRange(2, 10, sheet.getMaxRows() - 1, 1).setDataValidation(rule0to10);
  sheet.getRange(2, 11, sheet.getMaxRows() - 1, 1).setDataValidation(rule0to10);

  sheet.getRange(2, 7, sheet.getMaxRows() - 1, 6).setNumberFormat("0");
  sheet.getRange(2, 14, sheet.getMaxRows() - 1, 1).setNumberFormat("dd/MM/yyyy HH:mm");
  sheet.getRange(2, 17, sheet.getMaxRows() - 1, 2).setNumberFormat("dd/MM/yyyy HH:mm");

  applyConditionalFormatting_(sheet, colors, lastCol);
}

function setupDashboardSheet_(sheet, colors) {
  sheet.clear();
  ensureMinimumGridSize_(sheet, 30, 8);
  sheet.setHiddenGridlines(true);
  sheet.getRange("A1:H30").setFontFamily("Arial").setVerticalAlignment("middle").setBackground(colors.dashboardBg);

  for (let c = 1; c <= 8; c += 1) sheet.setColumnWidth(c, 180);
  for (let r = 1; r <= 30; r += 1) sheet.setRowHeight(r, r === 1 ? 46 : 78);

  sheet.getRange("A1:H2").merge();
  sheet.getRange("A1")
    .setValue("Dashboard RSVP Matrimonio")
    .setBackground(colors.headerBg)
    .setFontColor(colors.headerText)
    .setFontWeight("bold")
    .setFontSize(18)
    .setHorizontalAlignment("center");

  const cards = [
    ["A4:B4", "A5:B7", "Adulti confermati", 24],
    ["C4:D4", "C5:D7", "Under", 24],
    ["E4:F4", "E5:F7", "Vegetariani", 24],
    ["G4:H4", "G5:H7", "Celiaci", 24],
    ["A10:B10", "A11:B13", "Assenti", 24],
    ["C10:D10", "C11:D13", "RSVP totali", 24],
    ["E10:F10", "E11:F13", "Ultimo aggiornamento", 14],
  ];

  cards.forEach((card) => {
    sheet.getRange(card[0]).merge();
    sheet.getRange(card[1]).merge();
    sheet.getRange(card[0])
      .setValue(card[2])
      .setBackground(colors.headerBg)
      .setFontColor(colors.headerText)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBorder(true, true, true, true, true, true, colors.border, SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(card[1])
      .setBackground(colors.dashboardCardBg)
      .setFontColor(colors.dashboardText)
      .setFontWeight("bold")
      .setFontSize(card[3])
      .setHorizontalAlignment("center")
      .setBorder(true, true, true, true, true, true, colors.border, SpreadsheetApp.BorderStyle.SOLID);
  });
}

function setupInstructionsSheet_(sheet, colors) {
  sheet.clear();
  ensureMinimumGridSize_(sheet, 40, 4);
  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 170);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 380);

  sheet.getRange("A1:D1").merge();
  sheet.getRange("A1")
    .setValue("Istruzioni e mappatura campi")
    .setBackground(colors.headerBg)
    .setFontColor(colors.headerText)
    .setFontWeight("bold")
    .setFontSize(16)
    .setHorizontalAlignment("center");
}

function applyConditionalFormatting_(sheet, colors, lastCol) {
  const rules = [];
  const bodyRange = sheet.getRange(2, 1, sheet.getMaxRows() - 1, lastCol);
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",$E2=FALSE)')
      .setBackground(colors.falseRowBg)
      .setFontColor(colors.falseRowText)
      .setRanges([bodyRange])
      .build(),
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",$L2>$I2)')
      .setBackground(colors.invalidBg)
      .setRanges([sheet.getRange(2, 12, sheet.getMaxRows() - 1, 1)])
      .build(),
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",COUNTIF($A$2:$A,$A2)>1)')
      .setBackground(colors.duplicateBg)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1)])
      .build(),
  );
  sheet.setConditionalFormatRules(rules);
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function removeExistingFilter_(sheet) {
  const filter = sheet.getFilter();
  if (filter) filter.remove();
}

function ensureMinimumGridSize_(sheet, minRows, minCols) {
  if (sheet.getMaxRows() < minRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), minRows - sheet.getMaxRows());
  }
  if (sheet.getMaxColumns() < minCols) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), minCols - sheet.getMaxColumns());
  }
}

function applyAlternatingRowBackgrounds_(range, colorOdd, colorEven) {
  const rows = range.getNumRows();
  const cols = range.getNumColumns();
  const backgrounds = [];
  for (let r = 0; r < rows; r += 1) {
    backgrounds.push(new Array(cols).fill(r % 2 === 0 ? colorOdd : colorEven));
  }
  range.setBackgrounds(backgrounds);
}
