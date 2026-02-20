const envBase = (import.meta.env.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");
const defaultBase =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "";
const BASE = envBase || defaultBase;

const CACHE_TTL_MS = 30_000;
const cache = new Map();

function cacheKey(path) {
  return `${BASE}${path}`;
}

function getCached(path) {
  const item = cache.get(cacheKey(path));
  if (!item) return null;
  if (Date.now() - item.createdAt > CACHE_TTL_MS) {
    cache.delete(cacheKey(path));
    return null;
  }
  return item.value;
}

function setCached(path, value) {
  cache.set(cacheKey(path), { value, createdAt: Date.now() });
}

function clearApiCache() {
  cache.clear();
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  if (method === "GET") {
    const hit = getCached(path);
    if (hit) return hit;
  }

  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const e = new Error(err.message || "Request failed");
    e.response = { data: err, status: res.status };
    throw e;
  }

  const data = res.status === 204 ? null : await res.json();

  if (method === "GET") {
    setCached(path, data);
  } else {
    clearApiCache();
  }

  return data;
}

export async function fetchSemesters() {
  return request("/api/semesters");
}
export async function fetchSemester(id) {
  return request(`/api/semesters/${id}`);
}
export async function createSemester(payload) {
  return request("/api/semesters", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function updateSemester(id, payload) {
  return request(`/api/semesters/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
export async function deleteSemester(id) {
  return request(`/api/semesters/${id}`, { method: "DELETE" });
}

export async function fetchHolidays(semesterId) {
  return request(`/api/holidays${semesterId ? `?semesterId=${semesterId}` : ""}`);
}
export async function createHoliday(payload) {
  return request("/api/holidays", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function updateHoliday(id, payload) {
  return request(`/api/holidays/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
export async function deleteHoliday(id) {
  return request(`/api/holidays/${id}`, { method: "DELETE" });
}

export default { request };
