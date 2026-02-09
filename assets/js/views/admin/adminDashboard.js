/**
 * Panel administrador.
 */
export function render() {
  const el = document.getElementById('view-admin');
  if (!el) return;
  el.innerHTML = `
    <h1 class="page-title">Panel de administración</h1>
    <div class="card-custom">
      <p class="mb-3">Gestiona usuarios y proveedores de la plataforma.</p>
      <div class="d-flex gap-2 flex-wrap">
        <a href="#/admin/users" class="btn btn-primary-custom">Usuarios</a>
        <a href="#/admin/supplier/create" class="btn btn-secondary-custom">Crear proveedor</a>
      </div>
    </div>
  `;
}
