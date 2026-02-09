/**
 * Cliente API: fetch con Authorization, manejo de ErrorResponse y refresh en 401.
 */

const API_BASE_URL = window.CONFIG?.API_BASE_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

async function doRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  }
  return null;
}

function clearSessionAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiresIn');
  if (window.appState) window.appState.user = null;
  window.location.hash = '#/login';
}

async function parseErrorResponse(res) {
  let body;
  try {
    body = await res.json();
  } catch {
    return { message: res.statusText || 'Error de conexión' };
  }
  if (body.message) return { message: body.message, errors: body.errors };
  if (body.errors && typeof body.errors === 'object') {
    const first = Object.values(body.errors)[0];
    return { message: Array.isArray(first) ? first[0] : first, errors: body.errors };
  }
  return { message: body.error || 'Error en la solicitud' };
}

/**
 * apiFetch(path, options): base para todas las peticiones.
 * - Añade Authorization: Bearer si hay token
 * - No añade Content-Type si options.body es FormData (multipart)
 * - En 401: intenta refresh y reintenta una vez; si falla, logout y #/login
 */
async function apiFetch(path, options = {}, retried = false) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const body = options.body;
  if (body && !(body instanceof FormData)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(url, { ...options, headers, body });
  if (res.status === 401 && !retried) {
    const newToken = await doRefresh();
    if (newToken) return apiFetch(path, options, true);
    clearSessionAndRedirect();
    throw new Error('Sesión expirada');
  }
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throw new Error(err.message || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function apiGet(path) {
  return apiFetch(path, { method: 'GET' });
}

function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

function apiPut(path, body) {
  return apiFetch(path, {
    method: 'PUT',
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  });
}

function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

export { apiFetch, apiGet, apiPost, apiPut, apiDelete, getToken, getRefreshToken, API_BASE_URL, clearSessionAndRedirect };
