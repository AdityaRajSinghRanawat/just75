// Pure utility functions for attendance projection (ESM)

export function toDate(d) {
  if (d instanceof Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  if (typeof d === 'string') {
    // Parse calendar dates in local time to avoid timezone drift.
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const parsed = new Date(d);
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function maxDate(a, b) {
  return a > b ? a : b;
}

function minDate(a, b) {
  return a < b ? a : b;
}

export function getDatesBetween(start, end, includeEnd = true) {
  const dates = [];
  let cur = toDate(start);
  const last = toDate(end);
  while (includeEnd ? cur <= last : cur < last) {
    dates.push(new Date(cur));
    cur = addDays(cur, 1);
  }
  return dates;
}

export function isWeekend(date) {
  const d = date.getDay();
  return d === 0 || d === 6; // Sunday=0, Saturday=6
}

export function dateInRange(date, start, end) {
  const d = toDate(date);
  return toDate(start) <= d && d <= toDate(end);
}

function dateInInclusiveHolidayRange(date, start, end) {
  const d = toDate(date);
  const s = toDate(start);
  const eExclusive = addDays(toDate(end), 1);
  return s <= d && d < eExclusive;
}

export function countBaseWorkingDays(start, end, officialHolidays = [], includeEnd = true) {
  const dates = getDatesBetween(start, end, includeEnd);
  let count = 0;
  for (const d of dates) {
    if (isWeekend(d)) continue;
    const isHoliday = officialHolidays.some(h => dateInInclusiveHolidayRange(d, h.startDate, h.endDate));
    if (isHoliday) continue;
    count++;
  }
  return count;
}

export function calculateNetWorkingDays({ startDate, endDate, officialHolidays = [], extraHolidays = [], extraWorkingDays = [] }) {
  // Study window is [startDate, endDate): exam/end date is excluded.
  const periodStart = toDate(startDate);
  const periodEnd = toDate(endDate);
  const base = countBaseWorkingDays(periodStart, periodEnd, officialHolidays, false);

  let extraH = 0;
  for (const h of extraHolidays) {
    const overlapStart = maxDate(toDate(h.startDate), periodStart);
    const overlapEndExclusive = minDate(addDays(toDate(h.endDate), 1), periodEnd);
    if (overlapStart >= overlapEndExclusive) continue;
    extraH += countBaseWorkingDays(overlapStart, overlapEndExclusive, [], false);
  }

  let extraW = 0;
  for (const w of extraWorkingDays) {
    const overlapStart = maxDate(toDate(w.startDate), periodStart);
    const overlapEndExclusive = minDate(addDays(toDate(w.endDate), 1), periodEnd);
    if (overlapStart >= overlapEndExclusive) continue;
    extraW += countBaseWorkingDays(overlapStart, overlapEndExclusive, [], false);
  }

  const net = Math.max(0, base - extraH + extraW);
  return { base, extraHolidays: extraH, extraWorkingDays: extraW, net };
}

export function computeProjection({ currentPresent, currentTotal, desiredPercent, netWorkingDays, periodsPerDay = 6 }) {
  const projectedNewLectures = netWorkingDays * periodsPerDay;
  const projectedTotal = Number(currentTotal) + projectedNewLectures;
  const requiredPresent = Math.ceil((desiredPercent / 100) * projectedTotal);
  const mustAttend = Math.max(0, requiredPresent - Number(currentPresent));
  const canMiss = Math.max(0, (Number(currentPresent) + projectedNewLectures) - requiredPresent);
  const maxPossiblePercent = Math.round(((Number(currentPresent) + projectedNewLectures) / projectedTotal) * 10000) / 100;
  const achievable = requiredPresent <= (Number(currentPresent) + projectedNewLectures);

  return {
    projectedTotal,
    requiredPresent,
    mustAttend,
    canMiss,
    achievable,
    maxPossiblePercent
  };
}

