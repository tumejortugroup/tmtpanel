// formulas/macros.js

export function calcularMacronutrientes(tdee, porcentajes = { proteinas: 30, grasas: 20, carbohidratos: 50 }) {
  if (!tdee || tdee <= 0) return { proteinas: 0, grasas: 0, carbohidratos: 0 };

  const { proteinas, grasas, carbohidratos } = porcentajes;

  const calProteinas = (proteinas / 100) * tdee;
  const calGrasas = (grasas / 100) * tdee;
  const calCarbos = (carbohidratos / 100) * tdee;

  return {
    proteinas: calProteinas / 4,
    grasas: calGrasas / 9,
    carbohidratos: calCarbos / 4
  };
}
