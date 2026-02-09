/**
 * Landing pública.
 */
export function render() {
  const el = document.getElementById('view-home');
  if (!el) return;
  el.innerHTML = `
    <div class="card-custom text-center py-5">
      <h1 class="mb-3" style="color: var(--color-secondary);">Plataforma de Renta de Herramientas y Equipos</h1>
      <p class="lead text-muted mb-4">Alquila herramientas y equipos de construcción de forma sencilla y segura.</p>
      <div class="d-flex gap-2 justify-content-center flex-wrap">
        <a href="#/login" class="btn btn-primary-custom">Iniciar sesión</a>
        <a href="#/register" class="btn btn-secondary-custom">Registrarse</a>
      </div>
    </div>
  `;
}
