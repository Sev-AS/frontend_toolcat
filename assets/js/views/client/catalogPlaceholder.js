/**
 * Placeholder catálogo: el backend no expone listado público aún.
 */
export function render() {
  const el = document.getElementById('view-client-catalog');
  if (!el) return;
  el.innerHTML = `
    <h1 class="page-title">Catálogo de herramientas</h1>
    <div class="card-custom text-center py-5">
      <p class="lead text-muted">El catálogo de herramientas estará disponible próximamente.</p>
      <p class="text-muted">Cuando el backend exponga un endpoint para listar herramientas, aquí podrás explorar y reservar.</p>
      <a href="#/client" class="btn btn-secondary-custom mt-3">Volver al panel</a>
    </div>
  `;
}
