/**
 * Navbar según autenticación y rol.
 */
import { isAuthenticated } from '../auth/session.js';
import { appState, hasRole } from '../router.js';
import { clearSessionAndRedirect } from '../api/apiClient.js';
import { logout } from '../api/auth.js';

function getNavMarkup() {
  if (!isAuthenticated()) {
    const items = [
      '<a class="nav-link" href="#/">Inicio</a>',
      '<a class="nav-link" href="#/login">Iniciar sesión</a>',
      '<a class="nav-link" href="#/register">Registrarse</a>',
    ].map(html => `<li class="nav-item">${html}</li>`).join('');
    return { left: items, right: '' };
  }
  const u = appState.user;
  const name = (u && (u.name || u.email)) || 'Usuario';
  let left = [];
  if (hasRole('ROLE_ADMIN')) {
    left = ['<a class="nav-link" href="#/admin">Panel</a>', '<a class="nav-link" href="#/admin/users">Usuarios</a>', '<a class="nav-link" href="#/admin/supplier/create">Crear proveedor</a>'];
  } else if (hasRole('ROLE_SUPPLIER')) {
    left = ['<a class="nav-link" href="#/supplier">Panel</a>', '<a class="nav-link" href="#/supplier/catalogs">Mis herramientas</a>'];
  } else if (hasRole('ROLE_USER')) {
    left = ['<a class="nav-link" href="#/client">Panel</a>', '<a class="nav-link" href="#/client/catalog">Catálogo</a>'];
  }
  const leftHtml = left.map(html => `<li class="nav-item">${html}</li>`).join('');
  const rightHtml = `
    <li class="nav-item"><span class="navbar-text me-2">${name}</span></li>
    <li class="nav-item"><button class="btn btn-outline-light btn-sm" id="btn-logout">Cerrar sesión</button></li>
  `;
  return { left: leftHtml, right: rightHtml };
}

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;
  const { left, right } = getNavMarkup();
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg navbar-dark';
  nav.style.backgroundColor = 'var(--color-secondary)';
  nav.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand" href="#/">Renta Herramientas</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">${left}</ul>
        ${right ? `<ul class="navbar-nav">${right}</ul>` : ''}
      </div>
    </div>
  `;
  container.innerHTML = '';
  container.appendChild(nav);
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      const ref = localStorage.getItem('refreshToken');
      try {
        if (ref) await logout({ refreshToken: ref });
      } catch (_) {}
      clearSessionAndRedirect();
      renderNavbar();
    });
  }
}
