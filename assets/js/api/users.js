import { apiGet, apiPut } from './apiClient.js';

export function listUsers() {
  return apiGet('/users/list');
}

export function assignRole(userId, body) {
  return apiPut(`/users/${userId}/roles`, body);
}

export function updateUser(userId, body) {
  return apiPut(`/users/update/${userId}`, body);
}

export function updateMe(body) {
  return apiPut('/users/update/me', body);
}

export function setStatus(body) {
  return apiPut('/users/status', body);
}
