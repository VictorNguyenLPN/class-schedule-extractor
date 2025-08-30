const DAY_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function parseCell(cell) {
  const spans = cell.querySelectorAll("span");
  const subjects = [];

  spans.forEach((span) => {
    const p = span.querySelector("p");
    if (!p) return;

    const content = p.innerText.trim().split("\n");
    if (content.length < 5) return;

    // Example of conent:
    // [
    //   "Thực hành Nhập môn Xử lý ảnh số",
    //   "| Thực hành Introduction to Digital Image Processing",
    //   "(505060 - Nhóm|Group: 7 - Tổ|Sub-group: 1)",
    //   "Tiết|Period: 123 (Phòng:|Room: A604)",
    //   "Tuần học|Week: ----5678-012345------------------------------------",
    // ];

    // 1. Course name
    const courseName = content[0].trim();

    // 2. Course code, group, sub-group
    const courseInfo = content[2].replace(/[()]/g, "").split(" - ");
    const courseCode = courseInfo[0]?.trim() || "";
    const group = courseInfo[1].split(":")[1]?.trim() || "";
    const subGroup = courseInfo[2]?.split(":")[1]?.trim() || "";

    // 3. Period + Room
    const periodRoom = content[3];
    const periodMatch = periodRoom.match(/Period:\s*([0-9]+)/);
    const roomMatch = periodRoom.match(/Room:\s*([A-Z0-9]+)/);
    const period = periodMatch ? periodMatch[1] : "";
    const room = roomMatch ? roomMatch[1] : "";

    // 4. Week
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
  const generalScheduleTable = document.querySelector("#ThoiKhoaBieu1_Table1");
  const rows = generalScheduleTable.querySelectorAll("tr.rowContent");
  rows.forEach((row, rowIndex) => {
    const period =
      rowIndex === 0 ? "Morning" : rowIndex === 1 ? "Afternoon" : "Evening";
    console.log(period);
    const cells = row.querySelectorAll("td.cell");
    cells.forEach((cell, cellIndex) => {
      console.log(DAY_OF_WEEK[cellIndex]);
      const subjects = parseCell(cell);
      console.log(subjects);
    });
  });
}
