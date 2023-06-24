// number of seconds in a day
const secondsInADay = 24 * 60 * 60; // needed to use in calculation of duration so that the value can be formatted correctly
const secondsInOneHour = 60 * 60;

// only events that are created or accepted (to attend) are accepted
const validStatus = [CalendarApp.GuestStatus.OWNER, CalendarApp.GuestStatus.YES];

const calendarIds = [
  'kuanyi.ng@imago.mobi',
  'raionkurane@gmail.com'
];

function getEvents(startDate, endDate) {
  const ownedCalendars = calendarIds.map(id => CalendarApp.getCalendarById(id));
  return ownedCalendars.map(calendar => calendar.getEvents(startDate, endDate)).flat();
}

function getMinStartDate(year, month) {
  return new Date("".concat(...[year, '/', month, '/1']));
}

function getMaxEndDate(year, month) {
  const nextYear = (month !== 12) ? year : year + 1;
  const nextMonth = (month !== 12) ? month + 1 : 1;

  return new Date("".concat(...[nextYear, '/', nextMonth, '/1']));
}

function getTimesAndDuration(event, minStartDate, maxEndDate) {
  let eventStartTime = event.getStartTime();
  let eventEndTime = event.getEndTime();

  // Handling of edge cases
  // 
  // When an event starts on 28th Feb and ends on 1st Mar (after 00:00),
  // the event is counted twice (once for Feb's report and again for Mar's report).
  // Also, the whole duration of the event is recorded.
  // Ref: https://developers.google.com/apps-script/reference/calendar/calendar-app#geteventsstarttime,-endtime
  //
  // e.g., if event A starts at 2022.02.28 23:00 and ends at 2022.03.01 01:00
  // Feb report will record event A as starting at 2022.02.28 23:00 and ends at 2022.03.01 00:00
  // Mar report will record event A as starting at 2022.03.01 00:00 and ends at 2022.03.01 01:00
  
  // start counting from 00:00 of the 1st day of this month
  if (eventStartTime < minStartDate) {
    eventStartTime = minStartDate;
  }

  // stop counting at 00:00 of the 1st day of next month
  if (eventEndTime > maxEndDate) {
    eventEndTime = maxEndDate;
  }

  return {
    startTime: eventStartTime,
    endTime: eventEndTime,
    // (endTime - startTime) is in [ms]
    // this is value to enter in cell (Spreadsheet's cell)
    duration: ((eventEndTime - eventStartTime) / 1000) / secondsInADay
  }
}

