function getAllSheetNames() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets().map(sheet => sheet.getName());
}

function getEventType(eventTitle) {
  const startingCharacter = eventTitle[0];

  if (startingCharacter === "#") return "iQ Lab";
  else if (startingCharacter === "%") return "Class";
  else if (startingCharacter === "!") return "Research";
  else if (startingCharacter === "@") return "Intended Leisure";
  else if (startingCharacter === "^") return "Unintended Leisure";
  else if (startingCharacter === "~") return "Planning";
  else if (startingCharacter === "+") return "Learn";
  else return "Other";
}