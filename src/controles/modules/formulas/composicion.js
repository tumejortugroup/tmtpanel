// formulas/composicion.js

import { round } from '../utils/math.js';

/**
 * Calcula el peso óseo según la fórmula de Rocha (von Döbeln modificada)
 * Fórmula: 3.02 × (h² × r × R × 400)^0.712
 * donde r y R son los RADIOS (diámetro/2) del húmero y fémur
 * 
 * @param {Object} datos
 * @param {number} datos.altura - Altura en metros (ej: 1.75) o cm (175)
 * @param {number} datos.humero_biepicondileo - Diámetro del húmero en cm
 * @param {number} datos.femur_bicondileo - Diámetro del fémur en cm
 * @returns {number} Peso óseo en kg
 */
export function pesoOseoRocha({ altura, humero_biepicondileo, femur_bicondileo }) {
  if (!altura || !humero_biepicondileo || !femur_bicondileo) return 0;
  
  // Asegurar que altura está en metros
  const h = altura > 3 ? altura / 100 : altura;
  
  // ✅ CLAVE: Calcular RADIOS (diámetro/2) y convertir a metros
  const r = (humero_biepicondileo / 2) / 100;  // Radio húmero en metros
  const R = (femur_bicondileo / 2) / 100;      // Radio fémur en metros

  // Fórmula de Rocha usando radios
  const base = h * h * r * R * 400;
  const pesoOseo = 3.02 * Math.pow(base, 0.712);
  
  return round(pesoOseo, 2);
}
/**
 * Calcula el peso residual según porcentajes anatómicos estándar
 * Hombres: 24.1% | Mujeres: 20.9%
 * 
 * @param {number} peso - Peso total en kg
 * @param {string} genero - "hombre" o "mujer"
 * @returns {Object} { kg, porcentaje }
 */
export function pesoResidual(peso, genero) {
  if (!peso) return { kg: 0, porcentaje: 0 };
  
  // ✅ CORRECCIÓN: Usar porcentajes correctos según literatura científica
  const esHombre = genero === 'hombre';
  const porcentaje = esHombre ? 0.241 : 0.209; // 24.1% hombres, 20.9% mujeres
  const kg = peso * porcentaje;
  
  return { 
    kg: round(kg, 2), 
    porcentaje: round(porcentaje, 4)
  };
}

/**
 * Calcula peso de agua extracelular e intracelular
 * Según modelo de composición corporal 5 componentes
 * 
 * @param {number} peso - Peso total en kg
 * @param {string} genero - "hombre" o "mujer"
 * @returns {Object} { ext, pExt, int, pInt }
 */
export function pesoExtraIntracelular(peso, genero) {
  if (!peso) return { ext: 0, pExt: 0, int: 0, pInt: 0 };
  
  const esHombre = genero === 'hombre';

  // Porcentajes aproximados según literatura
  const pctExt = esHombre ? 0.20 : 0.167; // 20% hombres, 16.7% mujeres
  const pctInt = esHombre ? 0.40 : 0.334; // 40% hombres, 33.4% mujeres

  const ext = peso * pctExt;
  const int = peso * pctInt;

  return {
    ext: round(ext, 2),
    pExt: round(pctExt, 4),
    int: round(int, 2),
    pInt: round(pctInt, 4)
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
  return { 
    masaMagra: round(masaMagra, 2), 
    grasa: round(kgGrasa, 2) 
  };
}

/**
 * Calcula el índice de masa magra (FFMI)
 * 
 * @param {number} kgMasaMagra - Kilogramos de masa magra
 * @param {number} altura - Altura en metros
 * @returns {number} Índice de masa magra
 */
export function indiceMasaMagra(kgMasaMagra, altura) {
  if (!kgMasaMagra || !altura) return 0;
  
  // ✅ CORRECCIÓN: Asegurar que altura está en metros
  const h = altura > 3 ? altura / 100 : altura;
  const imm = kgMasaMagra / (h * h);
  
  return round(imm, 2);
}

/**
 * Calcula el peso muscular y su porcentaje
 * Método mejorado: Peso Muscular = Masa Magra - Peso Óseo - Agua extracelular
 * Simplificado: Peso Muscular ≈ 54% del peso corporal (hombres activos)
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

  // ✅ CORRECCIÓN: Masa muscular = Masa magra - Peso óseo
  // El componente residual y agua ya están fuera de la masa magra
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
 * Fórmula: altura (cm) / circunferencia muñeca (cm)
 * 
 * @param {Object} datos
 * @param {number} datos.altura - Altura en cm
 * @param {number} datos.muñeca - Circunferencia de muñeca en cm
 * @returns {number|null} Índice redondeado o null si faltan datos
 */
export function complexionOsea({ altura, muñeca }) {
  if (!altura || !muñeca) return null;

  const h = parseFloat(altura);
  const m = parseFloat(muñeca);

  const indice = h / m;
  return round(indice, 2);
}