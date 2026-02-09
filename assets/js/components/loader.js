/**
 * Loader inline para usar dentro de vistas.
 */
export function showLoader(containerEl) {
  if (!containerEl) return;
  const wrap = document.createElement('div');
  wrap.className = 'text-center py-5';
  wrap.id = 'inline-loader';
  wrap.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2 text-muted">Cargando...</p>';
  containerEl.innerHTML = '';
  containerEl.appendChild(wrap);
}

export function hideLoader(containerEl) {
  if (!containerEl) return;
  const el = containerEl.querySelector('#inline-loader');
  if (el) el.remove();
}
