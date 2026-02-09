/**
 * Mis herramientas (catálogos). Sin GET en backend: mensaje + botón crear.
 */
export function render() {
  const el = document.getElementById('view-supplier-catalogs');
  if (!el) return;
  el.innerHTML = `
    <h1 class="page-title">Mis herramientas</h1>
    <div class="card-custom">
      <p class="text-muted mb-3">Aquí podrás ver tu listado de herramientas cuando el backend exponga un endpoint de listado. Por ahora puedes crear nuevas herramientas.</p>
      <a href="#/supplier/catalogs/new" class="btn btn-primary-custom me-2">Crear herramienta</a>
      <div class="mt-3">
        <label class="form-label small text-muted">Si ya tienes un ID de catálogo (ej. tras crearlo), gestiona sus ítems:</label>
        <div class="d-flex gap-2">
          <input type="text" id="input-catalog-id" class="form-control" style="max-width: 280px;" placeholder="UUID del catálogo">
          <a href="#" id="link-goto-items" class="btn btn-outline-secondary btn-sm">Gestionar ítems</a>
        </div>
      </div>
    </div>
  `;
  const input = document.getElementById('input-catalog-id');
  const link = document.getElementById('link-goto-items');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = input.value.trim();
    if (id) window.location.hash = `#/supplier/catalogs/${id}/items`;
  });
}
