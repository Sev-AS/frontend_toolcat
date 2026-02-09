/**
 * Panel cliente.
 */
export function render() {
  const el = document.getElementById('view-client');
  if (!el) return;
  el.innerHTML = `
    <h1 class="page-title">Panel de cliente</h1>
    <div class="card-custom">
      <p class="mb-3">Bienvenido. Explora el catálogo de herramientas disponibles para alquilar.</p>
      <a href="#/client/catalog" class="btn btn-primary-custom">Ver catálogo</a>
    </div>
  `;
}
