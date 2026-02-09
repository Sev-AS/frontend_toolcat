/**
 * Entrada SPA: inicializa router, navbar y despacha vistas.
 */
import { initRouter } from './router.js';
import { renderNavbar } from './components/navbar.js';
import { render as renderHome } from './views/homeView.js';
import { render as renderLogin } from './auth/loginView.js';
import { render as renderRegister } from './auth/registerView.js';
import { render as renderAdminDashboard } from './views/admin/adminDashboard.js';
import { render as renderAdminUsers } from './views/admin/usersView.js';
import { render as renderAdminSupplierCreate } from './views/admin/supplierCreateView.js';
import { render as renderSupplierDashboard } from './views/supplier/supplierDashboard.js';
import { render as renderSupplierCatalogs } from './views/supplier/myCatalogsView.js';
import { render as renderCatalogForm } from './views/supplier/catalogFormView.js';
import { render as renderToolItems } from './views/supplier/toolItemsView.js';
import { render as renderClientDashboard } from './views/client/clientDashboard.js';
import { render as renderClientCatalog } from './views/client/catalogPlaceholder.js';

const viewRenderers = {
  'view-home': renderHome,
  'view-login': renderLogin,
  'view-register': renderRegister,
  'view-admin': renderAdminDashboard,
  'view-admin-users': renderAdminUsers,
  'view-admin-supplier-create': renderAdminSupplierCreate,
  'view-supplier': renderSupplierDashboard,
  'view-supplier-catalogs': renderSupplierCatalogs,
  'view-supplier-catalog-new': () => renderCatalogForm(null),
  'view-supplier-items': (_viewId, params) => renderToolItems(params?.id),
  'view-client': renderClientDashboard,
  'view-client-catalog': renderClientCatalog,
};

window.renderView = function (viewId, params) {
  const fn = viewRenderers[viewId];
  if (fn) fn(viewId, params);
};

async function init() {
  await initRouter();
  renderNavbar();
}

init();
