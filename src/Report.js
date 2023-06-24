function newReport() {
  console.log("newReport running...");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // + 1 to make `month` starts from 1

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getCurrentMonthSheet(ss, year, month);
  
  // get minStartDate and maxEndDate
  const minStartDate = getMinStartDate(year, month);
  const maxEndDate = getMaxEndDate(year, month);

  // get valid events
  const validEvents = getEvents(minStartDate, maxEndDate);

  // generate Full Report
  createFullReport(sheet, year, month, minStartDate, maxEndDate, validEvents);
}

function getCurrentMonthSheet(ss, year, month) {
  const sheetName = `${year}-${month}`;

  // https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#getsheetbynamename
  let sheet = ss.getSheetByName(sheetName);
  if (sheet != null) {
    return sheet;
  }

  // currentMonthSheet is not created yet
  // https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#insertsheetsheetname
  return ss.insertSheet(sheetName);
}

function createFullReport(sheet, year, month, minStartDate, maxEndDate, events) {
  console.log("createFullReport running...");

  // Output of Header
  // header (each columns) of a table
  const header = ["startedAt", "endedAt", "title", "description", "duration"];
  outputHeader(sheet, header);
  
  // Output Events to Spreadsheet
  // row offset for inserting totalHours
  let n = 0;
  while (events.length > 0) {
    let currentEvent = events.shift();
    
    const { startTime, endTime, duration } = getTimesAndDuration(currentEvent, minStartDate, maxEndDate);

    // TODO: output event type too
    const task = {
      title: currentEvent.getTitle(),
      desc: currentEvent.getDescription(),
      startTime: startTime,
      endTime: endTime,
      duration: duration
    };
    // add to Spreadsheet
    addNewTaskRecord(sheet, task, n, 0);
    
    n = n + 1; // increment
  }
}

function outputHeader(sheet, header) {
  sheet.getRange(row=1, column=1, numRows=1, numColumns=header.length).setValues([header]);
}

function addNewTaskRecord(sheet, task, rowOff, colOff) {
  // vertical offset for <header>
  const vOffset = 2;
  // Add to Spreadsheet
  let taskRecord = [task.startTime, task.endTime, task.title, task.desc, task.duration];
  sheet.getRange(row=rowOff+vOffset, column=colOff+1, numRows=1, numColumns=taskRecord.length).setValues([taskRecord]);
  // Set cell formats
  sheet.getRange(rowOff+vOffset, colOff+1).setNumberFormat("yyyy/mm/dd hh:mm:ss"); // "startedAt"
  sheet.getRange(rowOff+vOffset, colOff+2).setNumberFormat("yyyy/mm/dd hh:mm:ss"); // "endedAt"
  sheet.getRange(rowOff+vOffset, colOff+5).setNumberFormat("[hh]:mm"); // "duration"
}
