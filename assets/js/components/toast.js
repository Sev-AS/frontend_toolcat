/**
 * Toasts de éxito y error.
 */
const container = () => document.getElementById('toast-container');

export function showToast(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
  el.style.minWidth = '280px';
  el.setAttribute('role', 'alert');
  el.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  const c = container();
  if (c) c.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

export function showError(msg) {
  showToast(msg, 'error');
}

export function showSuccess(msg) {
  showToast(msg, 'success');
}
