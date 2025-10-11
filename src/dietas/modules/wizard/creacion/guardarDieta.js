import { crearComidas } from './crearComida.js';
import { asociarComidasADieta } from './comidaDieta.js';

export async function guardarDietaCompleta() {
  try {
    const response = await crearComidas();

    if (!response?.success || !Array.isArray(response.data)) {
      alert("❌ No se pudieron crear las comidas.");
      return;
    }

    const idsComidas = response.data
      .map(c => c?.id_comida)
      .filter(id => !!id)
      .map(id => ({ id_comida: id })); 


    if (!idsComidas.length) {
      alert("⚠️ No se generaron comidas válidas para asociar.");
      return;
    }

    await asociarComidasADieta(idsComidas);
  } catch (error) {
    console.error("❌ Error en guardarDietaCompleta:", error);
    alert("❌ Hubo un error al guardar la dieta completa.");
  }
}
