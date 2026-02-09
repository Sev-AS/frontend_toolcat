import { apiPost } from './apiClient.js';

export function createSupplier(body) {
  return apiPost('/supplier', body);
}
