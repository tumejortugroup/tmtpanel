// formulas/grasa.js

import { log10, round } from '../utils/math.js';

/**
 * Calcula % grasa usando perímetros (Fórmula US Navy)
 * IMPORTANTE: altura, cuello, cintura, cadera deben estar en la misma unidad (cm o pulgadas)
 */
export function grasaPorPerimetros({ genero, altura, cuello, cintura, cadera }) {
  if (!altura || !cuello || !cintura) return null;

  const h = parseFloat(altura);
  const c = parseFloat(cintura);
  const q = parseFloat(cuello);
  const ca = cadera != null ? parseFloat(cadera) : 0;

  if (!h || !c || !q || h <= 0 || c <= 0 || q <= 0) return null;

  if (genero === 'hombre') {
    // Evitar log10 de cero o negativo
    if (c - q <= 0) return null;

    const bf = 495 / (1.0324 - 0.19077 * log10(c - q) + 0.15456 * log10(h)) - 450;
    return round(bf, 2);
  } else if (genero === 'mujer') {
    if (!ca || ca <= 0) return null;
    if (c + ca - q <= 0) return null;

    const bf = 495 / (1.29579 - 0.35004 * log10(c + ca - q) + 0.221 * log10(h)) - 450;
    return round(bf, 2);
  }

  return null;
}

/**
 * Suma de 5 pliegues cutáneos
 */
export function sumaPliegues({ triceps, subescapular, abdomen_pliegue, supra_iliaco, muslo_pliegue }) {
  const t = parseFloat(triceps || 0);
  const s = parseFloat(subescapular || 0);
  const a = parseFloat(abdomen_pliegue || 0);
  const si = parseFloat(supra_iliaco || 0);
  const m = parseFloat(muslo_pliegue || 0);
  return t + s + a + si + m;
}

/**
 * Calcula % grasa usando pliegues cutáneos (Jackson & Pollock 3 pliegues + Siri)
 * OJO: las constantes son de las ecuaciones de 3 pliegues; asegúrate de
 * que los pliegues que pasas se ajustan a esa fórmula en tu app.
 */
export function grasaPorPliegues({ genero, pliegues, edad = 25 }) {
  const suma = sumaPliegues(pliegues);
  const edadNum = parseFloat(edad || 0);

  if (!suma || suma <= 0 || !edadNum) return null;

  let densidadCorporal;
  if (genero === 'hombre') {
    densidadCorporal =
      1.10938 -
      0.0008267 * suma +
      0.0000016 * suma * suma -
      0.0002574 * edadNum;
  } else if (genero === 'mujer') {
    densidadCorporal =
      1.0994921 -
      0.0009929 * suma +
      0.0000023 * suma * suma -
      0.0001392 * edadNum;
  } else {
    return null;
  }

  const porcentajeGrasa = ((4.95 / densidadCorporal) - 4.50) * 100;
  return round(porcentajeGrasa, 2);
}

/**
 * Calcula % grasa usando pliegues - Fórmula Durnin & Womersley (1974)
 * OJO: el protocolo original usa tríceps + bíceps + subescapular + suprailiaco.
 * Aquí estás usando abdomen_pliegue en vez de bíceps -> tenlo en cuenta.
 */
export function grasaPorPlieguesDurnin({ genero, pliegues, edad }) {
  if (!pliegues) return null;

  const {
    triceps = 0,
    subescapular = 0,
    supra_iliaco = 0,
    abdomen_pliegue = 0
  } = pliegues;

  const t = parseFloat(triceps || 0);
  const s = parseFloat(subescapular || 0);
  const si = parseFloat(supra_iliaco || 0);
  const a = parseFloat(abdomen_pliegue || 0);

  const suma4 = t + s + si + a;
  const edadNum = parseFloat(edad || 0);

  if (!suma4 || suma4 <= 0 || !edadNum) return null;

  let densidadCorporal;
  if (genero === 'hombre') {
    if (edadNum >= 17 && edadNum <= 19) densidadCorporal = 1.1620 - 0.0630 * log10(suma4);
    else if (edadNum >= 20 && edadNum <= 29) densidadCorporal = 1.1631 - 0.0632 * log10(suma4);
    else if (edadNum >= 30 && edadNum <= 39) densidadCorporal = 1.1422 - 0.0544 * log10(suma4);
    else if (edadNum >= 40 && edadNum <= 49) densidadCorporal = 1.1620 - 0.0700 * log10(suma4);
    else densidadCorporal = 1.1715 - 0.0779 * log10(suma4);
  } else if (genero === 'mujer') {
    if (edadNum >= 17 && edadNum <= 19) densidadCorporal = 1.1549 - 0.0678 * log10(suma4);
    else if (edadNum >= 20 && edadNum <= 29) densidadCorporal = 1.1599 - 0.0717 * log10(suma4);
    else if (edadNum >= 30 && edadNum <= 39) densidadCorporal = 1.1423 - 0.0632 * log10(suma4);
    else if (edadNum >= 40 && edadNum <= 49) densidadCorporal = 1.1333 - 0.0612 * log10(suma4);
    else densidadCorporal = 1.1339 - 0.0645 * log10(suma4);
  } else {
    return null;
  }

  const porcentajeGrasa = ((4.95 / densidadCorporal) - 4.50) * 100;
  return round(porcentajeGrasa, 2);
}
