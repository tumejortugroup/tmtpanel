// formulas/pliegues.js

/**
 * Comprueba si todos los pliegues necesarios están disponibles
 */
export function plieguesCompletos({ subescapular, abdomen_pliegue, supra_iliaco, muslo_pliegue }) {
  return (
    subescapular > 0 &&
    abdomen_pliegue > 0 &&
    supra_iliaco > 0 &&
    muslo_pliegue > 0
  );
}

/**
 * Suma de pliegues (opcional duplicado para mantener lógica separada de grasa.js)
 */
export function calcularSumaPliegues({ subescapular, abdomen_pliegue, supra_iliaco, muslo_pliegue }) {
  const s = parseFloat(subescapular || 0);
  const a = parseFloat(abdomen_pliegue || 0);
  const si = parseFloat(supra_iliaco || 0);
  const m = parseFloat(muslo_pliegue || 0);

  return s + a + si + m;
}
