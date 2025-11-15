// formulas/composicion.js

import { round } from '../utils/math.js';

/**
 * Calcula el peso óseo según la fórmula de Rocha (von Döbeln modificada)
 */
export function pesoOseoRocha({
  altura,
  humero_biepicondileo,
  femur_bicondileo,
  muneca_estiloideo,
}) {
  if (!altura || !femur_bicondileo) return 0;

  const hRaw = parseFloat(altura);
  if (!hRaw || hRaw <= 0) return 0;
  const h = hRaw > 3 ? hRaw / 100 : hRaw;

  const dmOrigen = muneca_estiloideo ?? humero_biepicondileo;
  if (!dmOrigen) return 0;

  const DMcm = parseFloat(dmOrigen);
  const DFcm = parseFloat(femur_bicondileo);

  if (!DMcm || !DFcm || DMcm <= 0 || DFcm <= 0) return 0;

  const DM = DMcm / 100;
  const DF = DFcm / 100;

  const base = h * h * DM * DF * 400;
  const pesoOseo = 3.02 * Math.pow(base, 0.712);

  return round(pesoOseo, 2);
}

/**
 * Peso residual (NO usado en el PDF pero lo dejo intacto)
 */
export function pesoResidual(peso, genero) {
  if (!peso || !genero) return { kg: 0, porcentaje: 0 };

  let porcentaje;

  if (genero === "hombre") {
    porcentaje = 0.60;  // 60%
  } else if (genero === "mujer") {
    porcentaje = 0.50;  // 50%
  } else {
    return { kg: 0, porcentaje: 0 };
  }

  const kg = peso * porcentaje;

  return {
    kg: round(kg, 2),
    porcentaje: round(porcentaje, 2) // para mostrar 60 o 50
  };
}


/**
 * Agua extracelular e intracelular (fracciones)
 */
export function pesoExtraIntracelular(peso, genero) {
  if (!peso || !genero) return { ext: 0, pExt: 0, int: 0, pInt: 0 };
  
  let pctExt, pctInt;

  if (genero === 'hombre') {
    pctExt = 0.20;
    pctInt = 0.40;
  } else if (genero === 'mujer') {
    pctExt = 0.167;
    pctInt = 0.334;
  } else {
    return { ext: 0, pExt: 0, int: 0, pInt: 0 };
  }

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
 * Masa magra y grasa
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
 * FFMI
 */
export function indiceMasaMagra(kgMasaMagra, altura) {
  if (!kgMasaMagra || !altura) return 0;
  
  const h = altura > 3 ? altura / 100 : altura;
  const imm = kgMasaMagra / (h * h);
  
  return round(imm, 2);
}

/**
 * ❌ MODELO CIENTÍFICO (no usado por el PDF)
 * pesoMuscular = masaMagra - pesoOseo
 */
export function pesoMuscular({ masaMagra, pesoOseo, pesoTotal }) {
  if (!masaMagra || !pesoOseo || !pesoTotal) {
    return { kg: 0, porcentaje: 0 };
  }

  let kg = masaMagra - pesoOseo;
  if (kg < 0) kg = 0;

  const porcentaje = (kg / pesoTotal) * 100;

  return {
    kg: round(kg, 2),
    porcentaje: round(porcentaje, 2)
  };
}

/**
 * Peso graso
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
 * Complexión ósea
 */
export function complexionOsea({ muñeca }) {
  const m = parseFloat(muñeca);
  if (!m) return null;

  if (m <= 5.10) return 10.5;
  if (m <= 5.25) return 10.7;
  if (m <= 5.45) return 10.6;
  if (m <= 5.65) return 10.8;

  return 11.0; // para muñecas más grandes
}


/* -------------------------------------------------------------
   NUEVO — MODELO EXACTO DEL PDF (REGLA DE 3)
------------------------------------------------------------- */

/**
 * % muscular = 100 − (% graso + % óseo)
 * EXACTAMENTE como lo hace el PDF.
 */
export function porcentajeMuscularRegla3(pesoTotal, porcentajeGraso, pesoOseo) {
  if (!pesoTotal || porcentajeGraso == null || !pesoOseo) {
    return 0;
  }

  const porcentajeOseo = (pesoOseo / pesoTotal) * 100;
  const porcentajeMuscular = 100 - (porcentajeGraso + porcentajeOseo);

  return round(porcentajeMuscular, 2);
}

/**
 * Peso muscular versión PDF:
 * kg = pesoTotal * (% muscular / 100)
 */
export function pesoMuscularVersionPDF(pesoTotal, porcentajeMuscular) {
  if (!pesoTotal || porcentajeMuscular == null) return 0;

  const kg = pesoTotal * (porcentajeMuscular / 100);
  return round(kg, 2);
}
