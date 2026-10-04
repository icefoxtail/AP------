export function normalizeColumn(column) {
  if (column === "left" || column === "right") return column;
  return "unknown";
}

