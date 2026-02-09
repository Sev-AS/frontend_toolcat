import { apiGet, apiPost, apiPut, apiDelete } from './apiClient.js';

export function getItems(catalogId) {
  return apiGet(`/tool/item/get/${catalogId}`);
}

export function createItem(catalogId) {
  return apiPost(`/tool/item/create/${catalogId}`);
}

export function deleteItem(itemId) {
  return apiDelete(`/tool/item/delete/${itemId}`);
}

export function updateStatus(itemId, body) {
  return apiPut(`/tool/item/update/status/${itemId}`, body);
}

export function updateAvailable(itemId, bool) {
  return apiPut(`/tool/item/update/avaible/${itemId}/${bool}`);
}
