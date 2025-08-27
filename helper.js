export function parseDate(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export function parseCell(cell) {
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
