const DAY_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_MAP = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
};

const PERIOD_TIME = {
  1: { startHour: 6, startMinute: 50, endHour: 7, endMinute: 40 },
  2: { startHour: 7, startMinute: 40, endHour: 8, endMinute: 30 },
  3: { startHour: 8, startMinute: 30, endHour: 9, endMinute: 20 },

  4: { startHour: 9, startMinute: 30, endHour: 7, endMinute: 40 },
  5: { startHour: 10, startMinute: 20, endHour: 11, endMinute: 10 },
  6: { startHour: 11, startMinute: 10, endHour: 12, endMinute: 0 },

  7: { startHour: 12, startMinute: 45, endHour: 113, endMinute: 35 },
  8: { startHour: 13, startMinute: 35, endHour: 14, endMinute: 25 },
  9: { startHour: 14, startMinute: 25, endHour: 15, endMinute: 15 },

  10: { startHour: 15, startMinute: 25, endHour: 16, endMinute: 15 },
  11: { startHour: 16, startMinute: 15, endHour: 17, endMinute: 5 },
  12: { startHour: 17, startMinute: 5, endHour: 17, endMinute: 55 },

  13: { startHour: 18, startMinute: 5, endHour: 18, endMinute: 55 },
  14: { startHour: 18, startMinute: 55, endHour: 19, endMinute: 45 },
  15: { startHour: 19, startMinute: 50, endHour: 20, endMinute: 35 },
};

function getTimeRange(periodString) {
  const arrString = periodString.split("");
  const arrNumbers = arrString.map(Number);

  const timeRange = {
    startHour: PERIOD_TIME[arrNumbers[0]].startHour,
    startMinute: PERIOD_TIME[arrNumbers[0]].startMinute,
    endHour: PERIOD_TIME[arrNumbers[arrNumbers.length - 1]].endHour,
    endMinute: PERIOD_TIME[arrNumbers[arrNumbers.length - 1]].endMinute,
  };

  return timeRange;
}

function parseWeeks(weekString) {
  const weeks = [];
  for (let i = 0; i < weekString.length; i++) {
    const ch = weekString[i];
    if (ch === "-") continue;
    if (i < 9) {
      weeks.push(i + 1);
    } else {
      weeks.push(10 + parseInt(ch));
    }
  }
  return weeks;
}

function getCourseDates(week, startDateStr, weekday) {
  const startDate = new Date(startDateStr);
  const weeks = parseWeeks(week);
  const dates = [];

  weeks.forEach((week) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (week - 1) * 7 + weekday);
    dates.push(date.toISOString().split("T")[0]);
  });

  return dates;
}

function parseCell(cell, weekDay) {
  const spans = cell.querySelectorAll("span");
  const subjects = [];

  spans.forEach((span) => {
    const p = span.querySelector("p");
    if (!p) return;

    const content = p.innerText.trim().split("\n");
    if (content.length < 5) return;

    const courseName = content[0].trim();

    const courseInfo = content[2].replace(/[()]/g, "").split(" - ");
    const courseCode = courseInfo[0]?.trim() || "";
    const group = courseInfo[1].split(":")[1]?.trim() || "";
    const subGroup = courseInfo[2]?.split(":")[1]?.trim() || "";

    const periodRoom = content[3];
    const periodMatch = periodRoom.match(/Period:\s*([0-9]+)/);
    const roomMatch = periodRoom.match(/Room:\s*([A-Z0-9]+)/);
    const period = periodMatch ? periodMatch[1] : "";
    const room = roomMatch ? roomMatch[1] : "";

    const week = content[4].split("Week:")[1]?.trim() || "";

    subjects.push({
      courseName,
      courseCode,
      group,
      subGroup,
      period,
      room,
      week,
      dateList: getCourseDates(week, "2025-08-10", weekDay),
      timeRange: getTimeRange(period),
    });
  });

  return subjects;
}

function extractSchedule() {
  const results = {};
  DAY_OF_WEEK.forEach((day) => {
    results[day] = { Morning: [], Afternoon: [], Evening: [] };
  });

  const generalScheduleTable = document.querySelector("#ThoiKhoaBieu1_Table1");
  const rows = generalScheduleTable.querySelectorAll("tr.rowContent");

  rows.forEach((row, rowIndex) => {
    const period =
      rowIndex === 0 ? "Morning" : rowIndex === 1 ? "Afternoon" : "Evening";

    const cells = row.querySelectorAll("td.cell");
    cells.forEach((cell, cellIndex) => {
      const weekday = DAY_OF_WEEK[cellIndex];
      const courses = parseCell(cell, cellIndex + 1);

      if (courses.length > 0) {
        results[weekday][period].push(...courses);
      }
    });
  });

  return results;
}

const tmp = extractSchedule();
console.log(tmp);
