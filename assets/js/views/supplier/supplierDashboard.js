/**
 * Panel proveedor.
 */
export function render() {
  const el = document.getElementById('view-supplier');
  if (!el) return;
  el.innerHTML = `
    <h1 class="page-title">Panel de proveedor</h1>
    <div class="card-custom">
      <p class="mb-3">Gestiona tu catálogo de herramientas e ítems.</p>
      <a href="#/supplier/catalogs" class="btn btn-primary-custom">Mis herramientas</a>
    </div>
  `;
}
