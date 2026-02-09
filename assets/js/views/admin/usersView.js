/**
 * Listado de usuarios (ADMIN): tabla, asignar rol, cambiar estado.
 */
import { listUsers, assignRole, setStatus } from '../../api/users.js';
import { showLoader, hideLoader } from '../../components/loader.js';
import { showError, showSuccess } from '../../components/toast.js';

const ROLES = ['USER', 'SUPPLIER', 'ADMIN'];

export function render() {
  const el = document.getElementById('view-admin-users');
  if (!el) return;
  el.innerHTML = '<h1 class="page-title">Usuarios</h1><div id="users-content"></div>';
  loadUsers();
}

async function loadUsers() {
  const content = document.getElementById('users-content');
  showLoader(content);
  try {
    const users = await listUsers();
    hideLoader(content);
    renderTable(content, users);
  } catch (err) {
    hideLoader(content);
    content.innerHTML = `<p class="text-error">${err.message}</p>`;
    showError(err.message);
  }
}

function renderTable(container, users) {
  if (!users || users.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay usuarios.</p>';
    return;
  }
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr data-user-id="${u.id}">
              <td>${escapeHtml(u.name || '-')}</td>
              <td>${escapeHtml(u.email)}</td>
              <td>${(u.roles || []).map(r => r.name || r.authority).join(', ') || '-'}</td>
              <td><span class="badge bg-${u.status === 'ACTIVE' ? 'success' : 'secondary'}">${u.status || '-'}</span></td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-assign-role" data-user-id="${u.id}">Asignar rol</button>
                <button class="btn btn-sm btn-outline-warning btn-toggle-status" data-user-id="${u.id}" data-status="${u.status}">${u.status === 'ACTIVE' ? 'Bloquear' : 'Activar'}</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  container.querySelectorAll('.btn-assign-role').forEach(btn => {
    btn.addEventListener('click', () => openAssignRoleModal(btn.dataset.userId));
  });
  container.querySelectorAll('.btn-toggle-status').forEach(btn => {
    btn.addEventListener('click', () => toggleStatus(btn.dataset.userId, btn.dataset.status));
  });
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function openAssignRoleModal(userId) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'modal-assign-role';
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Asignar rol</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Rol</label>
          <select class="form-select" id="select-role">
            ${ROLES.map(r => `<option value="${r}">${r}</option>`).join('')}
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary-custom" id="btn-confirm-role">Asignar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
  document.getElementById('btn-confirm-role').addEventListener('click', async () => {
    const roleName = document.getElementById('select-role').value;
    try {
      await assignRole(userId, { roleName });
      showSuccess('Rol asignado.');
      bsModal.hide();
      loadUsers();
    } catch (err) {
      showError(err.message);
    }
  });
  bsModal.show();
}

async function toggleStatus(userId, currentStatus) {
  const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
  if (!confirm(`¿${newStatus === 'BLOCKED' ? 'Bloquear' : 'Activar'} este usuario?`)) return;
  try {
    await setStatus({ userId, status: newStatus });
    showSuccess('Estado actualizado.');
    loadUsers();
  } catch (err) {
    showError(err.message);
  }
}
