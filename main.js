const DAY_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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

const GENERAL_SCHEDULE_TABLE_SELECTOR = "ThoiKhoaBieu1_Table1";

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
  //   console.log(startDateStr);
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

function parseCell(cell, weekDay, startDate) {
  //   console.log(startDate);
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
    const roomMatch = periodRoom.match(/Room:\s*([A-Z0-9._-]+)/i);
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
      dateList: getCourseDates(week, startDate, weekDay),
      timeRange: getTimeRange(period),
    });
  });

  return subjects;
}

function extractSchedule(startDate) {
  const results = {};
  DAY_OF_WEEK.forEach((day) => {
    results[day] = { Morning: [], Afternoon: [], Evening: [] };
  });

  const generalScheduleTable = document.querySelector(
    `#${GENERAL_SCHEDULE_TABLE_SELECTOR}`
  );
  const rows = generalScheduleTable.querySelectorAll("tr.rowContent");

  rows.forEach((row, rowIndex) => {
    const period =
      rowIndex === 0 ? "Morning" : rowIndex === 1 ? "Afternoon" : "Evening";

    const cells = row.querySelectorAll("td.cell");
    cells.forEach((cell, cellIndex) => {
      const weekday = DAY_OF_WEEK[cellIndex];
      const courses = parseCell(cell, cellIndex + 1, startDate);

      if (courses.length > 0) {
        results[weekday][period].push(...courses);
      }
    });
  });

  return results;
}

function toIcsDate(dateStr, hour, minute) {
  const [y, m, d] = dateStr.split("-");
  return `${y}${m}${d}T${String(hour).padStart(2, "0")}${String(
    minute
  ).padStart(2, "0")}00`;
}

function buildICS(data) {
  let ics =
    "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";

  for (const [day, sessions] of Object.entries(data)) {
    for (const [session, courses] of Object.entries(sessions)) {
      for (const course of courses) {
        for (const d of course.dateList) {
          const dtstart = toIcsDate(
            d,
            course.timeRange.startHour,
            course.timeRange.startMinute
          );
          const dtend = toIcsDate(
            d,
            course.timeRange.endHour,
            course.timeRange.endMinute
          );
          const uid = `${course.courseCode}-${d}-${course.period}@tool`;

          ics += `BEGIN:VEVENT\n`;
          ics += `UID:${uid}\n`;
          ics += `DTSTART:${dtstart}\n`;
          ics += `DTEND:${dtend}\n`;
          ics += `SUMMARY:[${course.room}] ${course.courseName}\n`;
          ics += `DESCRIPTION:Code: ${course.courseCode}\\nGroup: ${course.group}`;
          if (course.subGroup) {
            ics += `\\nSub-group: ${course.subGroup}`;
          }
          ics += `\\nPeriod: ${course.period}\n`;

          if (course.room[0] == "P") {
            ics += `LOCATION:${course.room} - 12C Ngo Tat To, Binh Thanh, TP. HCM\n`;
          } else {
            ics += `LOCATION:${course.room} - 19 Nguyen Huu Tho, Tan Hung, TP. HCM\n`;
          }

          ics += `END:VEVENT\n`;
        }
      }
    }
  }

  ics += "END:VCALENDAR";
  return ics;
}

if (
  typeof chrome !== "undefined" &&
  chrome.runtime &&
  chrome.runtime.onMessage
) {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "exportICS") {
      const schedule = extractSchedule(msg.startDate);
      const ics = buildICS(schedule);

      const blob = new Blob([ics], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "schedule.ics";
      a.click();
    }
  });
}

if (document.getElementById("exportBtn")) {
  document.getElementById("exportBtn").addEventListener("click", async () => {
    const startDate = document.getElementById("startDate").value;
    if (!startDate) {
      alert("Chọn ngày bắt đầu học kỳ trước!");
      return;
    }

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action: "exportICS", startDate });
  });
}
