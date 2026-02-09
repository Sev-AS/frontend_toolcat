/**
 * Configuración del frontend - URL base del backend.
 * Al mover el frontend a otro proyecto, solo cambiar API_BASE_URL.
 */
const CONFIG = {
  API_BASE_URL: 'http://localhost:8080',
};

// Export para módulos ES
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
