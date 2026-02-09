import { apiPost, apiPut, apiDelete } from './apiClient.js';

export function createToolCatalog(formData) {
  return apiPost('/tools', formData);
}

export function updateToolCatalog(catalogId, formData) {
  return apiPut(`/tools/update/${catalogId}`, formData);
}

export function deleteToolCatalog(catalogId) {
  return apiDelete(`/tools/delete/${catalogId}`);
}
