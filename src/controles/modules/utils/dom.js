// utils/dom.js

/*
    **
    *@params
    *@return
    **
*/
export function getFloat(param, index = 1) {
  const el = document.querySelector(`.${param}[data-index="${index}"]`);
  const val = parseFloat(el?.value);
  return isNaN(val) ? 0 : val;
}

export function getSelectValue(param, index = 1) {
  const el = document.querySelector(`.${param}[data-index="${index}"]`);
  return el?.value || '';
}

export function setValue(param, value, index = 1, decimals = 2) {
  const el = document.querySelector(`.${param}[data-index="${index}"]`);
  if (!el) return;

  if (typeof value === 'number' && !isNaN(value)) {
    el.value = value.toFixed(decimals);
  } else {
    el.value = '';
  }
}
