// utils/paramUtils.js
export function obtenerIdDietaDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id_dieta');
}




export function obtenerDatoDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id_dato');
}