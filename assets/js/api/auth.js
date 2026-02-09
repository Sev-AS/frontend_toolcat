import { apiPost, apiGet } from './apiClient.js';

export async function login(body) {
  return apiPost('/auth/login', body);
}

export async function register(body) {
  return apiPost('/auth/register', body);
}

export async function refresh(body) {
  return apiPost('/auth/refresh', body);
}

export async function logout(body) {
  return apiPost('/auth/logout', body);
}

export async function getMe() {
  return apiGet('/auth/me');
}
