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

function getTimeRange(periodStr) {
  if (!periodStr) return "";

  const periods = periodStr.split("").map(Number);
  const startPeriod = periods[0];
  const endPeriod = periods[periods.length - 1];

  const startTime = PERIOD_TIME[startPeriod]?.split(" - ")[0];
  const endTime = PERIOD_TIME[endPeriod]?.split(" - ")[1];

  return `${startTime} - ${endTime}`;
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

function parseCell(cell, weekday) {
  const spans = cell.querySelectorAll("span");
  const subjects = [];

  spans.forEach((span) => {
    const p = span.querySelector("p");
    if (!p) return;

    // example of a raw cell
    // <p style="padding:0px 0px 10px 0px; margin:0px;"><b>Thực hành Nhập môn Xử lý ảnh số<br><label class="lbl-lang" style="color:white;padding-left:0;">| Thực hành Introduction to Digital Image Processing</label></b><br>(505060 - Nhóm<label class="lbl-lang" style="color:white;padding-left:0;">|Group: </label>7 - Tổ<label class="lbl-lang" style="color:white;padding-left:0;">|Sub-group: </label>1)<br>Tiết<label class="lbl-lang" style="color:white;padding-left:0;">|Period: </label>123 (Phòng:<label class="lbl-lang" style="color:white;padding-left:0;">|Room: </label>A604)<br> Tuần học<label class="lbl-lang" style="color:white;padding-left:0;">|Week: </label>----5678-012345------------------------------------</p>

    const content = p.innerText.trim().split("\n");
    if (content.length < 5) return;

    // example of a splitted cell
    // [
    //   "Thực hành Nhập môn Xử lý ảnh số",
    //   "| Thực hành Introduction to Digital Image Processing",
    //   "(505060 - Nhóm|Group: 7 - Tổ|Sub-group: 1)",
    //   "Tiết|Period: 123 (Phòng:|Room: A604)",
    //   "Tuần học|Week: ----5678-012345------------------------------------",
    // ];

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
    const startTime = getTimeRange(period)[0];
    const endTime = getTimeRange(period)[1];

    subjects.push({
      courseName,
      courseCode,
      group,
      subGroup,
      period,
      room,
      week,
      dates: getCourseDates(week, "2025-08-10", weekday),
      timeRange: getTimeRange(period),
    });
  });

  return subjects;
}
// example of a parsed cell
// {
//     "courseName": "Thực hành Nhập môn Xử lý ảnh số",
//     "courseCode": "505060",
//     "group": "7",
//     "subGroup": "1",
//     "period": "123",
//     "room": "A604",
//     "week": "----5678-012345------------------------------------",
//     "dates": [
//         "2025-09-08",
//         "2025-09-15",
//         "2025-09-22",
//         "2025-09-29",
//         "2025-10-13",
//         "2025-10-20",
//         "2025-10-27",
//         "2025-11-03",
//         "2025-11-10",
//         "2025-11-17"
//     ],
//     "timeRange": "06:50 - 09:20"
// }

function extractSchedule() {
  const generalScheduleTable = document.querySelector("#ThoiKhoaBieu1_Table1");
  const rows = generalScheduleTable.querySelectorAll("tr.rowContent");
  rows.forEach((row, rowIndex) => {
    const period =
      rowIndex === 0 ? "Morning" : rowIndex === 1 ? "Afternoon" : "Evening";
    console.log(period);
    const cells = row.querySelectorAll("td.cell");
    cells.forEach((cell, cellIndex) => {
      console.log(DAY_OF_WEEK[cellIndex]);
      const weekday = cellIndex + 1;
      const courses = parseCell(cell, weekday);
      console.log(courses);
    });
  });
}
