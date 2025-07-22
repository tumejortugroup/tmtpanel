// utils/paramUtils.js
export function obtenerIdUsuarioDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}
