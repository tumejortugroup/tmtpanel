// 📍 /src/dietas/modules/wizardBase/utils/caloriasStore.js
let caloriasObjetivo = null;

export function setCaloriasObjetivo(calorias) {
  caloriasObjetivo = parseFloat(calorias);
  console.log('💾 Calorías objetivo guardadas:', caloriasObjetivo);
}

export function getCaloriasObjetivo() {
  console.log('📖 Leyendo calorías objetivo:', caloriasObjetivo);
  return caloriasObjetivo;
}