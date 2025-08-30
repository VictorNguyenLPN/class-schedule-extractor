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
  1: "06:50 - 07:40",
  2: "07:40 - 08:30",
  3: "08:30 - 09:20",
  4: "09:30 - 10:20",
  5: "10:20 - 11:10",
  6: "11:10 - 12:00",
  7: "12:45 - 13:35",
  8: "13:35 - 14:25",
  9: "14:25 - 15:15",
  10: "15:25 - 16:15",
  11: "16:15 - 17:05",
  12: "17:05 - 17:55",
  13: "18:05 - 18:55",
  14: "18:55 - 19:45",
  15: "19:45 - 20:35",
};

function parseCell(cell) {
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
      const courses = parseCell(cell, weekday);

      if (courses.length > 0) {
        results[weekday][period].push(...courses);
      }
    });
  });

  return results;
}

const res = extractSchedule();
console.log(res);
