/**
 * Router SPA hash-based. Redirige por rol tras login.
 */
import { isAuthenticated } from './auth/session.js';
import { getMe } from './api/auth.js';

const appState = { user: null };
if (typeof window !== 'undefined') window.appState = appState;

const routes = [
  { path: '/', public: true, id: 'view-home' },
  { path: '/login', public: true, id: 'view-login' },
  { path: '/register', public: true, id: 'view-register' },
  { path: '/admin', role: 'ROLE_ADMIN', id: 'view-admin' },
  { path: '/admin/users', role: 'ROLE_ADMIN', id: 'view-admin-users' },
  { path: '/admin/supplier/create', role: 'ROLE_ADMIN', id: 'view-admin-supplier-create' },
  { path: '/supplier', role: 'ROLE_SUPPLIER', id: 'view-supplier' },
  { path: '/supplier/catalogs', role: 'ROLE_SUPPLIER', id: 'view-supplier-catalogs' },
  { path: '/supplier/catalogs/new', role: 'ROLE_SUPPLIER', id: 'view-supplier-catalog-new' },
  { path: '/supplier/catalogs/:id/items', role: 'ROLE_SUPPLIER', id: 'view-supplier-items' },
  { path: '/client', role: 'ROLE_USER', id: 'view-client' },
  { path: '/client/catalog', role: 'ROLE_USER', id: 'view-client-catalog' },
];

function hasRole(roleName) {
  const user = appState.user;
  if (!user || !user.roles) return false;
  return user.roles.some(r => (r.authority || r.name) === roleName || r === roleName);
}

function getDefaultRouteForUser() {
  if (hasRole('ROLE_ADMIN')) return '#/admin';
  if (hasRole('ROLE_SUPPLIER')) return '#/supplier';
  if (hasRole('ROLE_USER')) return '#/client';
  return '#/';
}

function matchRoute(hash) {
  const path = hash.replace('#', '') || '/';
  const segs = path.split('/').filter(Boolean);
  for (const r of routes) {
    const rSegs = r.path.split('/').filter(Boolean);
    if (rSegs.length !== segs.length) continue;
    const params = {};
    let match = true;
    for (let i = 0; i < rSegs.length; i++) {
      if (rSegs[i].startsWith(':')) params[rSegs[i].slice(1)] = segs[i];
      else if (rSegs[i] !== segs[i]) { match = false; break; }
    }
    if (match) return { route: r, params };
  }
  return null;
}

function hideAllViews() {
  document.querySelectorAll('[data-view]').forEach(el => el.classList.add('hidden'));
}

function showView(viewId) {
  hideAllViews();
  const el = document.getElementById(viewId);
  if (el) el.classList.remove('hidden');
}

async function loadUser() {
  if (!isAuthenticated()) return;
  try {
    appState.user = await getMe();
  } catch {
    appState.user = null;
  }
}

async function navigate() {
  const hash = window.location.hash || '#/';
  const matched = matchRoute(hash);
  if (!matched) {
    if (isAuthenticated()) window.location.hash = getDefaultRouteForUser();
    else window.location.hash = '#/';
    return;
  }
  const { route, params } = matched;
  if (route.public && (route.path === '/' || route.path === '/login' || route.path === '/register') && isAuthenticated()) {
    window.location.hash = getDefaultRouteForUser();
    return;
  }
  if (!route.public && !isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }
  if (route.role && !hasRole(route.role)) {
    window.location.hash = getDefaultRouteForUser();
    return;
  }
  showView(route.id);
  if (typeof window.renderView === 'function') {
    window.renderView(route.id, params);
  }
}

export async function initRouter() {
  await loadUser();
  navigate();
  window.addEventListener('hashchange', navigate);
}

export function redirectAfterLogin() {
  window.location.hash = getDefaultRouteForUser();
}

export { appState, hasRole, getDefaultRouteForUser };
