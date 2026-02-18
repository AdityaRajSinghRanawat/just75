const envBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const defaultBase = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000' : '';
const BASE = envBase || defaultBase;

async function request(path, options = {}){
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) {
    const err = await res.json().catch(()=>({ message: res.statusText }));
    const e = new Error(err.message || 'Request failed');
    e.response = { data: err, status: res.status };
    throw e;
  }
  return res.status === 204 ? null : res.json();
}

export async function fetchSemesters(){ return request('/api/semesters'); }
export async function fetchSemester(id){ return request(`/api/semesters/${id}`); }
export async function createSemester(payload){ return request('/api/semesters', { method: 'POST', body: JSON.stringify(payload) }); }
export async function updateSemester(id, payload){ return request(`/api/semesters/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function deleteSemester(id){ return request(`/api/semesters/${id}`, { method: 'DELETE' }); }

export async function fetchHolidays(semesterId){ return request(`/api/holidays${semesterId ? '?semesterId='+semesterId : ''}`); }
export async function createHoliday(payload){ return request('/api/holidays', { method: 'POST', body: JSON.stringify(payload) }); }
export async function updateHoliday(id, payload){ return request(`/api/holidays/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function deleteHoliday(id){ return request(`/api/holidays/${id}`, { method: 'DELETE' }); }

export default { request };
