// formulas/composicion.js

import { round } from '../utils/math.js';

/**
 * Calcula el peso óseo según la fórmula de Rocha
 * Fórmula: 3.02 × (h² × d × D × 400)^0.712
 * 
 * @param {Object} datos
 * @param {number} datos.altura - Altura en cm
 * @param {number} datos.humero_biepicondileo - Diámetro del húmero en cm
 * @param {number} datos.femur_bicondileo - Diámetro del fémur en cm
 * @returns {number} Peso óseo en kg
 */
export function pesoOseoRocha({ altura, humero_biepicondileo, femur_bicondileo }) {
  if (!altura || !humero_biepicondileo || !femur_bicondileo) return 0;
  
  const h = altura / 100; // convertir a metros
  const d = humero_biepicondileo; // mantener en cm
  const D = femur_bicondileo; // mantener en cm

  // Fórmula de Würch: 3.02 × (h² × √(d × D) × 0.04)^0.712
  const base = h * h * Math.sqrt(d * D) * 0.04;
  const pesoOseo = 3.02 * Math.pow(base, 0.712);
  
  return round(pesoOseo, 2);
}

export function pesoResidual(peso, genero) {
  if (!peso) return { kg: 0, porcentaje: 0 };
  const esHombre = genero === 'hombre';
  const kg = esHombre ? peso * 0.6 : peso * 0.5;
  return { kg, porcentaje: kg / peso };
}

export function pesoExtraIntracelular(peso, genero) {
  if (!peso) return { ext: 0, pExt: 0, int: 0, pInt: 0 };
  const esHombre = genero === 'hombre';

  const ext = esHombre ? peso * 0.2 : peso * 0.167;
  const int = esHombre ? peso * 0.4 : peso * 0.334;

  return {
    ext,
    pExt: ext / peso,
    int,
    pInt: int / peso
  };
}

/**
 * Calcula masa magra y grasa a partir del peso total y porcentaje graso
 * 
 * @param {number} peso - Peso total en kg
 * @param {number} porcentajeGraso - Porcentaje de grasa corporal
 * @returns {Object} { masaMagra, grasa }
 */
export function calcularMasaMagraYGrasa(peso, porcentajeGraso) {
  if (!peso || porcentajeGraso == null) return { masaMagra: 0, grasa: 0 };
  const kgGrasa = peso * (porcentajeGraso / 100);
  const masaMagra = peso - kgGrasa;
  return { masaMagra, grasa: kgGrasa };
}

/**
 * Calcula el índice de masa magra
 * 
 * @param {number} kgMasaMagra - Kilogramos de masa magra
 * @param {number} altura - Altura en cm
 * @returns {number} Índice de masa magra
 */
export function indiceMasaMagra(kgMasaMagra, altura) {
  if (!kgMasaMagra || !altura) return 0;
  return (kgMasaMagra / ((altura * altura) / 100)) * 100;
}

/**
 * Calcula el peso muscular y su porcentaje
 * Método: Peso Muscular = Masa Magra - Peso Óseo
 * 
 * @param {Object} datos
 * @param {number} datos.masaMagra - Masa magra total en kg
 * @param {number} datos.pesoOseo - Peso óseo en kg
 * @param {number} datos.pesoTotal - Peso corporal total en kg
 * @returns {Object} { kg, porcentaje }
 */
export function pesoMuscular({ masaMagra, pesoOseo, pesoTotal }) {
  if (!masaMagra || !pesoOseo || !pesoTotal) {
    return { kg: 0, porcentaje: 0 };
  }

  const kg = masaMagra - pesoOseo;
  const porcentaje = (kg / pesoTotal) * 100;

  return {
    kg: round(kg, 2),
    porcentaje: round(porcentaje, 2)
  };
}

/**
 * Calcula el peso graso y su porcentaje
 * 
 * @param {number} pesoTotal - Peso corporal total en kg
 * @param {number} porcentajeGraso - Porcentaje de grasa corporal
 * @returns {Object} { kg, porcentaje }
 */
export function pesoGraso(pesoTotal, porcentajeGraso) {
  if (!pesoTotal || porcentajeGraso == null) {
    return { kg: 0, porcentaje: 0 };
  }

  const kg = pesoTotal * (porcentajeGraso / 100);

  return {
    kg: round(kg, 2),
    porcentaje: round(porcentajeGraso, 2)
  };
}

/**
 * Calcula el índice de complexión ósea.
 * Fórmula simple: altura (cm) / diámetro muñeca (cm)
 * 
 * @param {Object} datos
 * @param {number} datos.altura - Altura en cm
 * @param {number} datos.muñeca - Diámetro de muñeca en cm (bicondíleo)
 * @returns {number|null} Índice redondeado o null si faltan datos
 */
export function complexionOsea({ altura, muñeca }) {
  if (!altura || !muñeca) return null;

  const h = parseFloat(altura);
  const m = parseFloat(muñeca);

  const indice = h / m;
  return round(indice, 2);
}