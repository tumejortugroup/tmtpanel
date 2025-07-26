// utils/paramUtils.js
export function obtenerIdUsuarioDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}


/***Captar control de la URL */

export function obtenerNombreDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('nombre');
}