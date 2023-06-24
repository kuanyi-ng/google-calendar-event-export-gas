# google-calendar-event-export-gas
A Google Apps Script program that exports events in Google Calendar periodically to Google Sheets

## Functions used in Sheets' Cell
- `=getAllSheetNames()`
### Data filtering
- `=query(INDIRECT(CONCAT($B$1,"!A1:F")), "select A,B,C,D,E WHERE F = FALSE")`
- `=SORT(A5:E, A5:A, true, B5:B, true)`
### Before visualization
- `=unique(L5:L)`
- `=SUMIF($L$5:$L, N4, $K$5:$K)`
