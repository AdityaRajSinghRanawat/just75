export function toTitleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function toLocalDateInputValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function normalizeCalendarDate(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  if (typeof value === "string") {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function formatCalendarDisplay(value) {
  return normalizeCalendarDate(value).toLocaleDateString();
}

export function calculateInclusiveDays(start, end) {
  const d1 = normalizeCalendarDate(start);
  const d2 = normalizeCalendarDate(end);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
}

export function formatDateInput(dateStr) {
  if (!dateStr) return null;
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return toLocalDateInputValue(new Date(dateStr));
}

export function formatPeriods(totalPeriods, periodsPerDay) {
  const total = totalPeriods || 0;
  const days = Math.floor(total / periodsPerDay);
  const periods = total % periodsPerDay;
  return `${days} day${days !== 1 ? "s" : ""} and ${periods} period${periods !== 1 ? "s" : ""}`;
}
