// Pure utility functions for attendance projection (ESM)

export function toDate(d) {
  return d instanceof Date ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : new Date(d);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getDatesBetween(start, end) {
  const dates = [];
  let cur = toDate(start);
  const last = toDate(end);
  while (cur <= last) {
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

export function countBaseWorkingDays(start, end, officialHolidays = []) {
  const dates = getDatesBetween(start, end);
  let count = 0;
  for (const d of dates) {
    if (isWeekend(d)) continue;
    const isHoliday = officialHolidays.some(h => dateInRange(d, h.startDate, h.endDate));
    if (isHoliday) continue;
    count++;
  }
  return count;
}

export function calculateNetWorkingDays({ startDate, endDate, officialHolidays = [], extraHolidays = [], extraWorkingDays = [] }) {
  const base = countBaseWorkingDays(startDate, endDate, officialHolidays);

  let extraH = 0;
  for (const h of extraHolidays) {
    const overlapStart = new Date(Math.max(new Date(h.startDate), new Date(startDate)));
    const overlapEnd = new Date(Math.min(new Date(h.endDate), new Date(endDate)));
    if (overlapStart > overlapEnd) continue;
    extraH += countBaseWorkingDays(overlapStart, overlapEnd, []);
  }

  let extraW = 0;
  for (const w of extraWorkingDays) {
    const overlapStart = new Date(Math.max(new Date(w.startDate), new Date(startDate)));
    const overlapEnd = new Date(Math.min(new Date(w.endDate), new Date(endDate)));
    if (overlapStart > overlapEnd) continue;
    extraW += countBaseWorkingDays(overlapStart, overlapEnd, []);
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

