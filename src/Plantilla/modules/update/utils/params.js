// utils/paramUtils.js
export function obtenerIdPlantillaDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id_plantilla');
}


/***Captar control de la URL */

export function obtenerDatoDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id_dato');
}