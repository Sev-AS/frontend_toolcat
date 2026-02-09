/**
 * Vista de registro.
 */
import { register } from '../api/auth.js';
import { showError, showSuccess } from '../components/toast.js';

export function render() {
  const el = document.getElementById('view-register');
  if (!el) return;
  el.innerHTML = `
    <div class="card-custom mx-auto" style="max-width: 400px;">
      <h2 class="page-title">Registrarse</h2>
      <form id="form-register">
        <div class="mb-3">
          <label for="reg-name" class="form-label">Nombre</label>
          <input type="text" id="reg-name" class="form-control" required minlength="3" maxlength="16" placeholder="Tu nombre">
        </div>
        <div class="mb-3">
          <label for="reg-email" class="form-label">Email</label>
          <input type="email" id="reg-email" class="form-control" required placeholder="tu@email.com">
        </div>
        <div class="mb-3">
          <label for="reg-password" class="form-label">Contraseña</label>
          <input type="password" id="reg-password" class="form-control" required minlength="6" placeholder="Mínimo 6 caracteres">
        </div>
        <p id="reg-error" class="text-error small hidden"></p>
        <button type="submit" class="btn btn-primary-custom w-100" id="btn-reg-submit">Registrarse</button>
      </form>
      <p class="mt-3 text-center"><a href="#/login">Ya tengo cuenta</a></p>
    </div>
  `;
  const form = document.getElementById('form-register');
  const errEl = document.getElementById('reg-error');
  const btn = document.getElementById('btn-reg-submit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.classList.add('hidden');
    errEl.textContent = '';
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    if (name.length < 3 || name.length > 16) {
      errEl.textContent = 'El nombre debe tener entre 3 y 16 caracteres.';
      errEl.classList.remove('hidden');
      return;
    }
    if (password.length < 6) {
      errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      errEl.classList.remove('hidden');
      return;
    }
    btn.disabled = true;
    try {
      await register({ name, email, password });
      showSuccess('Cuenta creada. Ya puedes iniciar sesión.');
      window.location.hash = '#/login';
    } catch (err) {
      errEl.textContent = err.message || 'Error al registrarse';
      errEl.classList.remove('hidden');
      showError(err.message || 'Error al registrarse');
    } finally {
      btn.disabled = false;
    }
  });
}
