// 📍 /src/dietas/modules/wizard/utils/ratiosStore.js
let proteinasPorKg = null;
let grasasPorKg = null;

export function setRatios(proteinas, grasas) {
  proteinasPorKg = parseFloat(proteinas);
  grasasPorKg = parseFloat(grasas);
  console.log('💾 Ratios guardados:', { proteinasPorKg, grasasPorKg });
}

export function getRatios() {
  console.log('📖 Leyendo ratios:', { proteinasPorKg, grasasPorKg });
  return { proteinasPorKg, grasasPorKg };
}

export function setProteinasPorKg(valor) {
  proteinasPorKg = parseFloat(valor);
  console.log('💾 Proteínas/kg actualizadas:', proteinasPorKg);
}

export function setGrasasPorKg(valor) {
  grasasPorKg = parseFloat(valor);
  console.log('💾 Grasas/kg actualizadas:', grasasPorKg);
}

export function getProteinasPorKg() {
  return proteinasPorKg;
}

export function getGrasasPorKg() {
  return grasasPorKg;
}