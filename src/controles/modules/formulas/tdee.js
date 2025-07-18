// formulas/tdee.js

const factoresActividad = {
  'Inactiva': 1.2,
  'Baja': 1.375,
  'Ligera': 1.55,
  'Media': 1.725,
  'Alta': 1.9,
  'Muy alta': 2.0,
  'Alto grado': 2.1,
  'Extrema': 2.2
};

const ajustesObjetivo = {
  'Bajada de peso': -500,
  'Aumento de peso': 500,
  'Hipertrofia': 300,
  'Definicion': -300,
  'Restriccion severa': -800,
  'Mantenimiento': 0,
  'Carga carbohidratos': 200
};

export function calcularTDEE(bmr, actividad) {
  const factor = factoresActividad[actividad] || 1.2;
  return bmr * factor;
}

export function ajustarTDEE(tdee, objetivo) {
  const ajuste = ajustesObjetivo[objetivo];
  if (ajuste === undefined) return null;
  return tdee + ajuste;
}
