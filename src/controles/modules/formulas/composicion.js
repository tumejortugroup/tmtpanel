// formulas/composicion.js

import { round } from '../utils/math.js';

export function pesoOseoRocha({ altura, muneca_estiloideo, femur_bicondileo }) {
  if (!altura || !muneca_estiloideo || !femur_bicondileo) return 0;
  const h = altura / 100;
  const m = muneca_estiloideo / 100;
  const f = femur_bicondileo / 100;

  return 3.02 * Math.pow((h ** 2) * m * f * 400, 0.712);
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
 * 
 * @param {number} peso 
 * @param {number} porcentajeGraso 
 * @returns 
 */
export function calcularMasaMagraYGrasa(peso, porcentajeGraso) {
  console.log('Porcentaje graso:', porcentajeGraso); // ← Añade esto

  if (!peso || porcentajeGraso == null) return { masaMagra: 0, grasa: 0 };
  const kgGrasa = peso * (porcentajeGraso / 100);
  const masaMagra = peso - kgGrasa;
  return { masaMagra, grasa: kgGrasa };
}

/**
 * 
 * @param {number} kgMasaMagra 
 * @param {number} altura 
 * @returns 
 */
export function indiceMasaMagra(kgMasaMagra, altura) {
  if (!kgMasaMagra || !altura) return 0;
  return (kgMasaMagra / ((altura * altura) / 100)) * 100;
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

