// import {
//   PERIOD_REGULATIONS,
//   SEMESTER_START,
//   WEEKLY_SCHEDULE_TABLE_SELECTOR,
//   GENERAL_SCHEDULE_TABLE_SELECTOR,
//   DAY_OF_WEEK,
//   PROCESSED_SCHEDULE,
// } from "./config";
// import { parseCell } from "./helper";

function parseCell(cell) {
  const spans = cell.querySelectorAll("span");
  const subjects = [];
  spans.forEach((span) => {
    const p = span.querySelector("p");
    if (!p) return;
    const title = p.querySelector("b")?.childNodes[0]?.textContent.trim();
    const details = p.innerText.trim();
    subjects.push({ title, details });
  });
  return subjects;
}

const WEEKLY_SCHEDULE_TABLE_SELECTOR = "ThoiKhoaBieu1_tbTKBTheoTuan";
const GENERAL_SCHEDULE_TABLE_SELECTOR = "ThoiKhoaBieu1_Table1";
const DAY_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const PROCESSED_SCHEDULE = {
  Monday: {
    Morning: {},
    Afternoon: {},
    Evening: {},
  },
  Tuesday: { Morning: {}, Afternoon: {}, Evening: {} },
  Wednesday: { Morning: {}, Afternoon: {}, Evening: {} },
  Thursday: { Morning: {}, Afternoon: {}, Evening: {} },
  Friday: { Morning: {}, Afternoon: {}, Evening: {} },
  Saturday: { Morning: {}, Afternoon: {}, Evening: {} },
  Sunday: { Morning: {}, Afternoon: {}, Evening: {} },
};

function parseCell(cell) {
  const spans = cell.querySelectorAll("span");
  const subjects = [];
  spans.forEach((span) => {
    const p = span.querySelector("p");
    if (!p) return;
    const title = p.querySelector("b")?.childNodes[0]?.textContent.trim();
    const details = p.innerText.trim();
    subjects.push({ title, details });
  });
  return subjects;
}

function extractSchedule() {
  const generalScheduleTable = document.querySelector("#ThoiKhoaBieu1_Table1");
  const rows = generalScheduleTable.querySelectorAll("tr.rowContent");
  rows.forEach((row, rowIndex) => {
    const period =
      rowIndex === 0 ? "Morning" : rowIndex === 1 ? "Afternoon" : "Evening";
    const cells = row.querySelectorAll("td.cell");
    cells.forEach((cell, cellIndex) => {
      const subjects = parseCell(cell);
      console.log(subjects);
    });
  });
}
