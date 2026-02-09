/**
 * Crear proveedor (ADMIN).
 */
import { createSupplier } from '../../api/supplier.js';
import { showError, showSuccess } from '../../components/toast.js';

export function render() {
  const el = document.getElementById('view-admin-supplier-create');
  if (!el) return;
  el.innerHTML = `
    <h1 class="page-title">Crear proveedor</h1>
    <div class="card-custom" style="max-width: 500px;">
      <form id="form-supplier">
        <div class="mb-3">
          <label for="sup-name" class="form-label">Nombre</label>
          <input type="text" id="sup-name" class="form-control" required minlength="3" maxlength="16" placeholder="Nombre del proveedor">
        </div>
        <div class="mb-3">
          <label for="sup-email" class="form-label">Email</label>
          <input type="email" id="sup-email" class="form-control" required placeholder="email@ejemplo.com">
        </div>
        <div class="mb-3">
          <label for="sup-password" class="form-label">Contraseña</label>
          <input type="password" id="sup-password" class="form-control" required minlength="6" placeholder="Mínimo 6 caracteres">
        </div>
        <div class="mb-3">
          <label for="sup-company" class="form-label">Nombre de la empresa</label>
          <input type="text" id="sup-company" class="form-control" required placeholder="Ej. DeWalt">
        </div>
        <div class="mb-3">
          <label for="sup-address" class="form-label">Dirección</label>
          <input type="text" id="sup-address" class="form-control" required placeholder="Calle, número...">
        </div>
        <div class="mb-3">
          <label for="sup-postal" class="form-label">Código postal</label>
          <input type="text" id="sup-postal" class="form-control" required placeholder="1234">
        </div>
        <div class="mb-3">
          <label for="sup-city" class="form-label">Ciudad</label>
          <input type="text" id="sup-city" class="form-control" required placeholder="Bogotá D.C.">
        </div>
        <div class="mb-3">
          <label for="sup-country" class="form-label">Código país (ISO)</label>
          <input type="text" id="sup-country" class="form-control" required placeholder="COL, MEX, ARG">
        </div>
        <p id="supplier-error" class="text-error small hidden"></p>
        <button type="submit" class="btn btn-primary-custom" id="btn-supplier-submit">Crear proveedor</button>
      </form>
    </div>
  `;
  const form = document.getElementById('form-supplier');
  const errEl = document.getElementById('supplier-error');
  const btn = document.getElementById('btn-supplier-submit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.classList.add('hidden');
    errEl.textContent = '';
    const payload = {
      name: document.getElementById('sup-name').value.trim(),
      email: document.getElementById('sup-email').value.trim(),
      password: document.getElementById('sup-password').value,
      companyName: document.getElementById('sup-company').value.trim(),
      addressDesc: document.getElementById('sup-address').value.trim(),
      postalCode: document.getElementById('sup-postal').value.trim(),
      cityName: document.getElementById('sup-city').value.trim(),
      countryIsocode: document.getElementById('sup-country').value.trim(),
    };
    if (payload.password.length < 6) {
      errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      errEl.classList.remove('hidden');
      return;
    }
    btn.disabled = true;
    try {
      await createSupplier(payload);
      showSuccess('Proveedor creado correctamente.');
      form.reset();
    } catch (err) {
      errEl.textContent = err.message || 'Error al crear proveedor';
      errEl.classList.remove('hidden');
      showError(err.message);
    } finally {
      btn.disabled = false;
    }
  });
}
