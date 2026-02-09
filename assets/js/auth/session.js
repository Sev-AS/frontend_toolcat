/**
 * Sesión: token en localStorage (punto único para migrar a cookies HttpOnly).
 */
function getStoredToken() {
  return localStorage.getItem('accessToken');
}

function setTokens(accessToken, refreshToken, expiresIn) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  if (expiresIn != null) localStorage.setItem('expiresIn', String(expiresIn));
}

function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiresIn');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function isAuthenticated() {
  return !!getStoredToken();
}

export { getStoredToken, setTokens, clearSession, getRefreshToken, isAuthenticated };
