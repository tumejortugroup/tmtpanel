// formulas/grasa.js

import { log10, round } from '../utils/math.js';

/**
 * Calcula % grasa usando perímetros (Fórmula US Navy)
 */
export function grasaPorPerimetros({ genero, altura, cuello, cintura, cadera }) {
  if (!altura || !cuello || !cintura) return null;
  const h = parseFloat(altura);
  const c = parseFloat(cintura);
  const q = parseFloat(cuello);
  const ca = parseFloat(cadera || 0);

  if (genero === 'hombre') {
    // Fórmula US Navy para hombres
    const bf = 495 / (1.0324 - 0.19077 * log10(c - q) + 0.15456 * log10(h)) - 450;
    return round(bf, 2);
  } else if (genero === 'mujer') {
    if (!ca) return null;
    // Fórmula US Navy para mujeres
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
 * Calcula % grasa usando pliegues cutáneos
 * Fórmula de Jackson & Pollock (1985) - 5 pliegues
 * 
 * @param {Object} params
 * @param {string} params.genero - "hombre" o "mujer"
 * @param {Object} params.pliegues - Objeto con los 5 pliegues
 * @param {number} params.edad - Edad en años (opcional, mejora precisión)
 * @returns {number|null} Porcentaje de grasa corporal
 */
export function grasaPorPliegues({ genero, pliegues, edad = 25 }) {
  const suma = sumaPliegues(pliegues);
  if (!suma || suma <= 0) return null;

  let densidadCorporal;

  if (genero === 'hombre') {
    // Jackson & Pollock (1985) - Hombres - 5 pliegues
    densidadCorporal = 1.10938 - 
                       (0.0008267 * suma) + 
                       (0.0000016 * suma * suma) - 
                       (0.0002574 * edad);
  } else if (genero === 'mujer') {
    // Jackson & Pollock (1985) - Mujeres - 5 pliegues
    densidadCorporal = 1.0994921 - 
                       (0.0009929 * suma) + 
                       (0.0000023 * suma * suma) - 
                       (0.0001392 * edad);
  } else {
    return null;
  }

  // Fórmula de Siri para convertir densidad a % grasa
  const porcentajeGrasa = ((4.95 / densidadCorporal) - 4.50) * 100;

  return round(porcentajeGrasa, 2);
}

/**
 * Calcula % grasa usando pliegues - Fórmula alternativa simplificada
 * Fórmula de Durnin & Womersley (1974)
 * 
 * @param {Object} params
 * @param {string} params.genero - "hombre" o "mujer"
 * @param {Object} params.pliegues - Pliegues cutáneos
 * @param {number} params.edad - Edad en años
 * @returns {number|null} Porcentaje de grasa corporal
 */
export function grasaPorPlieguesDurnin({ genero, pliegues, edad }) {
  // Usar solo 4 pliegues: tríceps, subescapular, suprailiaco, bíceps
  const { triceps = 0, subescapular = 0, supra_iliaco = 0, abdomen_pliegue = 0 } = pliegues;
  const suma4 = triceps + subescapular + supra_iliaco + abdomen_pliegue;
  
  if (!suma4 || !edad) return null;

  let densidadCorporal;

  if (genero === 'hombre') {
    if (edad >= 17 && edad <= 19) {
      densidadCorporal = 1.1620 - 0.0630 * Math.log10(suma4);
    } else if (edad >= 20 && edad <= 29) {
      densidadCorporal = 1.1631 - 0.0632 * Math.log10(suma4);
    } else if (edad >= 30 && edad <= 39) {
      densidadCorporal = 1.1422 - 0.0544 * Math.log10(suma4);
    } else if (edad >= 40 && edad <= 49) {
      densidadCorporal = 1.1620 - 0.0700 * Math.log10(suma4);
    } else {
      densidadCorporal = 1.1715 - 0.0779 * Math.log10(suma4);
    }
  } else if (genero === 'mujer') {
    if (edad >= 17 && edad <= 19) {
      densidadCorporal = 1.1549 - 0.0678 * Math.log10(suma4);
    } else if (edad >= 20 && edad <= 29) {
      densidadCorporal = 1.1599 - 0.0717 * Math.log10(suma4);
    } else if (edad >= 30 && edad <= 39) {
      densidadCorporal = 1.1423 - 0.0632 * Math.log10(suma4);
    } else if (edad >= 40 && edad <= 49) {
      densidadCorporal = 1.1333 - 0.0612 * Math.log10(suma4);
    } else {
      densidadCorporal = 1.1339 - 0.0645 * Math.log10(suma4);
    }
  } else {
    return null;
  }

  // Fórmula de Siri
  const porcentajeGrasa = ((4.95 / densidadCorporal) - 4.50) * 100;

  return round(porcentajeGrasa, 2);
}