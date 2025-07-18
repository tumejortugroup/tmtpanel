// utils/math.js

export function log10(x) {
  return Math.log(x) / Math.LN10;
}


export function round(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
