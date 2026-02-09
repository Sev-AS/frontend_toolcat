/**
 * Formulario crear herramienta (catálogo) - multipart imgFile + request.
 */
import { createToolCatalog } from '../../api/tools.js';
import { showError, showSuccess } from '../../components/toast.js';

const API_BASE = window.CONFIG?.API_BASE_URL || 'http://localhost:8080';

export function render(catalogId) {
  const el = document.getElementById('view-supplier-catalog-new');
  if (!el) return;
  const isEdit = !!catalogId;
  el.innerHTML = `
    <h1 class="page-title">${isEdit ? 'Editar herramienta' : 'Crear herramienta'}</h1>
    <div class="card-custom" style="max-width: 500px;">
      <form id="form-catalog">
        <div class="mb-3">
          <label for="cat-name" class="form-label">Nombre</label>
          <input type="text" id="cat-name" class="form-control" required placeholder="Ej. Taladro percutor">
        </div>
        <div class="mb-3">
          <label for="cat-price" class="form-label">Precio por día</label>
          <input type="number" id="cat-price" class="form-control" required min="0" step="0.01" placeholder="50000">
        </div>
        <div class="mb-3">
          <label for="cat-status" class="form-label">Estado</label>
          <select id="cat-status" class="form-select">
            <option value="AVAIBLE">Disponible</option>
            <option value="UNAVAIABLE">No disponible</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="cat-description" class="form-label">Descripción</label>
          <textarea id="cat-description" class="form-control" required rows="3" placeholder="Descripción de la herramienta"></textarea>
        </div>
        <div class="mb-3">
          <label for="cat-image" class="form-label">Imagen</label>
          <input type="file" id="cat-image" class="form-control" accept="image/*" ${isEdit ? '' : 'required'}>
        </div>
        <p id="catalog-error" class="text-error small hidden"></p>
        <button type="submit" class="btn btn-primary-custom" id="btn-catalog-submit">${isEdit ? 'Guardar' : 'Crear'}</button>
        <a href="#/supplier/catalogs" class="btn btn-secondary-custom ms-2">Volver</a>
      </form>
    </div>
  `;
  const form = document.getElementById('form-catalog');
  const errEl = document.getElementById('catalog-error');
  const btn = document.getElementById('btn-catalog-submit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.classList.add('hidden');
    errEl.textContent = '';
    const name = document.getElementById('cat-name').value.trim();
    const price = document.getElementById('cat-price').value;
    const status = document.getElementById('cat-status').value;
    const description = document.getElementById('cat-description').value.trim();
    const fileInput = document.getElementById('cat-image');
    if (!isEdit && (!fileInput.files || fileInput.files.length === 0)) {
      errEl.textContent = 'Selecciona una imagen.';
      errEl.classList.remove('hidden');
      return;
    }
    const formData = new FormData();
    const request = JSON.stringify({ name, price: parseFloat(price), status, description });
    formData.append('request', request);
    if (fileInput.files && fileInput.files[0]) {
      formData.append('imgFile', fileInput.files[0]);
    }
    btn.disabled = true;
    try {
      if (isEdit) {
        const { updateToolCatalog } = await import('../../api/tools.js');
        await updateToolCatalog(catalogId, formData);
        showSuccess('Herramienta actualizada.');
      } else {
        await createToolCatalog(formData);
        showSuccess('Herramienta creada.');
      }
      window.location.hash = '#/supplier/catalogs';
    } catch (err) {
      errEl.textContent = err.message || 'Error al guardar';
      errEl.classList.remove('hidden');
      showError(err.message);
    } finally {
      btn.disabled = false;
    }
  });
}
