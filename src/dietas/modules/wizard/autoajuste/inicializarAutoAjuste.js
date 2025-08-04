import { obtenerDetalleDato } from '/src/dietas/modules/wizard/fetch/getPeso.js';
import { obtenerDieta } from '/src/dietas/modules/wizard/fetch/getDieta.js';
import { setPeso } from '/src/dietas/modules/wizard/utils/pesoStore.js';

export async function inicializarAutoAjuste() {
  try {
    // 📦 Obtener peso del usuario
    const detalle = await obtenerDetalleDato();
    const peso = parseFloat(detalle?.data?.peso);

    if (!peso || isNaN(peso)) {
      console.error("❌ No se pudo obtener el peso.");
      return;
    }

    setPeso(peso); // Guardamos en store si se usa en otro lugar

    // 📦 Obtener dieta
    const dieta = await obtenerDieta();
    const datos = dieta?.data;

    const proteinasGr = parseFloat(datos?.proteinas_dieta) || 0;
    const grasasGr = parseFloat(datos?.grasas_dieta) || 0;

    // ✅ Calcular gramos por kg
    const proteinasPorKg = proteinasGr / peso;
    const grasasPorKg = grasasGr / peso;

    // Mostrar en los spans
    document.getElementById('protein-value').innerText = proteinasPorKg.toFixed(1);
    document.getElementById('fat-value').innerText = grasasPorKg.toFixed(1);

  } catch (error) {
    console.error("❌ Error en inicializarAutoAjuste:", error);
  }
}
