// utils/dom.js

/*
    **
    *@params
    *@return
    **
*/
export function getFloat(id) {
  const val = parseFloat(document.getElementById(id)?.value);
  return isNaN(val) ? 0 : val;
}


export function getSelectValue(id) {
  return document.getElementById(id)?.value || '';
}

/**
 * Establece el valor de un elemento de entrada HTML por su id.
 *
 * @param {string} id - El id del elemento HTML al que se le asignará el valor.
 * @param {number} value - El valor numérico que se asignará al elemento. Si no es un número, se asigna una cadena vacía.
 * @return {void} No retorna ningún valor.
 */
export function setValue(id, value, decimals = 2) {
  const input = document.getElementById(id);
  if (!input) return;

  if (typeof value === 'number' && !isNaN(value)) {
    input.value = value.toFixed(decimals);
  } else {
    input.value = ''; // o input.value = 'N/A' si prefieres mostrar algo
  }
}
