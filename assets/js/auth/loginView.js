/**
 * Vista de login.
 */
import { login } from '../api/auth.js';
import { setTokens } from './session.js';
import { redirectAfterLogin } from '../router.js';
import { showError } from '../components/toast.js';
import { renderNavbar } from '../components/navbar.js';

export function render() {
  const el = document.getElementById('view-login');
  if (!el) return;
  el.innerHTML = `
    <div class="card-custom mx-auto" style="max-width: 400px;">
      <h2 class="page-title">Iniciar sesión</h2>
      <form id="form-login">
        <div class="mb-3">
          <label for="login-email" class="form-label">Email</label>
          <input type="email" id="login-email" class="form-control" required placeholder="tu@email.com">
        </div>
        <div class="mb-3">
          <label for="login-password" class="form-label">Contraseña</label>
          <input type="password" id="login-password" class="form-control" required>
        </div>
        <p id="login-error" class="text-error small hidden"></p>
        <button type="submit" class="btn btn-primary-custom w-100" id="btn-login-submit">Entrar</button>
      </form>
    </div>
  `;
  const form = document.getElementById('form-login');
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('btn-login-submit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.classList.add('hidden');
    errEl.textContent = '';
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) {
      errEl.textContent = 'Completa email y contraseña.';
      errEl.classList.remove('hidden');
      return;
    }
    btn.disabled = true;
    try {
      const res = await login({ email, password });
      setTokens(res.accessToken, res.refreshToken, res.expiresIn);
      window.appState.user = await (await import('../api/auth.js')).getMe();
      renderNavbar();
      redirectAfterLogin();
    } catch (err) {
      errEl.textContent = err.message || 'Credenciales incorrectas';
      errEl.classList.remove('hidden');
      showError(err.message || 'Credenciales incorrectas');
    } finally {
      btn.disabled = false;
    }
  });
}
