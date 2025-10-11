// formulas/grasa.js

import { log10, round } from '../utils/math.js';

export function grasaPorPerimetros({ genero, altura, cuello, cintura, cadera }) {
  if (!altura || !cuello || !cintura) return null;
  const h = parseFloat(altura);
  const c = parseFloat(cintura);
  const q = parseFloat(cuello);
  const ca = parseFloat(cadera || 0);

  if (genero === 'hombre') {
    return 495 / (1.0324 - 0.19077 * log10(c - q) + 0.15456 * log10(h)) - 450;
  } else if (genero === 'mujer') {
    if (!ca) return null;
    return 495 / (1.29579 - 0.35004 * log10(c + ca - q) + 0.221 * log10(h)) - 450;
  }
  return null;
}

export function sumaPliegues({ triceps, subescapular, abdomen_pliegue, supra_iliaco, muslo_pliegue }) {
  const t = parseFloat(triceps || 0);
  const s = parseFloat(subescapular || 0);
  const a = parseFloat(abdomen_pliegue || 0);
  const si = parseFloat(supra_iliaco || 0);
  const m = parseFloat(muslo_pliegue || 0);

  return t + s + a + si + m;
}

export function grasaPorPliegues({ genero, pliegues }) {
  const suma = sumaPliegues(pliegues);
  if (!suma || suma <= 0) return null;

  if (genero === 'hombre') {
    return round(suma / (1.55 + log10(suma)), 2);
  } else if (genero === 'mujer') {
    return round(suma / (1.25 + log10(suma)), 2);
  }

  return null;
}