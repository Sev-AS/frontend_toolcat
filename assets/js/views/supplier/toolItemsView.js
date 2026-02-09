/**
 * Ítems de un catálogo: listar, crear, eliminar, cambiar estado y disponibilidad.
 */
import { getItems, createItem, deleteItem, updateStatus, updateAvailable } from '../../api/toolItems.js';
import { showLoader, hideLoader } from '../../components/loader.js';
import { showError, showSuccess } from '../../components/toast.js';

const API_BASE = window.CONFIG?.API_BASE_URL || 'http://localhost:8080';
const STATUS_OPTIONS = ['AVAIABLE', 'UNAVAIABLE', 'DAMAGED', 'MAINTENANCE'];

export function render(catalogId) {
  const el = document.getElementById('view-supplier-items');
  if (!el) return;
  if (!catalogId) {
    el.innerHTML = '<p class="text-muted">ID de catálogo no disponible. Crea una herramienta y accede desde el listado cuando el backend lo permita.</p>';
    return;
  }
  el.innerHTML = `
    <h1 class="page-title">Ítems del catálogo</h1>
    <p><a href="#/supplier/catalogs">Volver a mis herramientas</a></p>
    <div class="mb-3">
      <button class="btn btn-primary-custom" id="btn-new-item">Nuevo ítem</button>
    </div>
    <div id="items-content"></div>
  `;
  window.__currentCatalogId = catalogId;
  loadItems(catalogId);
  document.getElementById('btn-new-item').addEventListener('click', () => doCreateItem(catalogId));
}

async function loadItems(catalogId) {
  const content = document.getElementById('items-content');
  if (!content) return;
  showLoader(content);
  try {
    const items = await getItems(catalogId);
    hideLoader(content);
    renderItemsTable(content, items, catalogId);
  } catch (err) {
    hideLoader(content);
    content.innerHTML = `<p class="text-error">${err.message}</p>`;
    showError(err.message);
  }
}

function renderItemsTable(container, items, catalogId) {
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay ítems. Crea uno con el botón "Nuevo ítem".</p>';
    return;
  }
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Estado</th>
            <th>Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td><code>${item.id}</code></td>
              <td>
                <select class="form-select form-select-sm form-status" data-item-id="${item.id}" style="width: auto;">
                  ${STATUS_OPTIONS.map(s => `<option value="${s}" ${item.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input class="form-check-input toggle-available" type="checkbox" data-item-id="${item.id}" ${item.avaiable ? 'checked' : ''}>
                </div>
              </td>
              <td>
                <button class="btn btn-sm btn-danger btn-delete-item" data-item-id="${item.id}">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.querySelectorAll('.form-status').forEach(sel => {
    sel.addEventListener('change', () => {
      const itemId = sel.dataset.itemId;
      updateStatus(itemId, { status: sel.value }).then(() => showSuccess('Estado actualizado.')).catch(err => showError(err.message));
    });
  });
  container.querySelectorAll('.toggle-available').forEach(cb => {
    cb.addEventListener('change', () => {
      const itemId = cb.dataset.itemId;
      updateAvailable(itemId, cb.checked).then(() => showSuccess('Disponibilidad actualizada.')).catch(err => showError(err.message));
    });
  });
  container.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('¿Eliminar este ítem?')) return;
      deleteItem(btn.dataset.itemId).then(() => {
        showSuccess('Ítem eliminado.');
        loadItems(catalogId);
      }).catch(err => showError(err.message));
    });
  });
}

async function doCreateItem(catalogId) {
  try {
    await createItem(catalogId);
    showSuccess('Ítem creado.');
    loadItems(catalogId);
  } catch (err) {
    showError(err.message);
  }
}
