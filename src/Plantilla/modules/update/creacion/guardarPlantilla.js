import { crearComidas } from './crearComida.js';
import { asociarComidasAPlantilla } from './comidaPlantilla.js';

export async function guardarPlantillaCompleta(idPlantilla) {
  try {

    if (!idPlantilla) {
      throw new Error("❌ guardarPlantillaCompleta() recibió idPlantilla = undefined");
    }

    // 1. Crear comidas nuevas
    const comidas = await crearComidas();
    if (!comidas || !Array.isArray(comidas)) {
      console.error("❌ Error: crearComidas() no devolvió un array válido");
      return;
    }

    const idsComidas = comidas
      .map(c => c?.id_comida)
      .filter(Boolean);

    if (!idsComidas.length) {
      console.warn("⚠️ No hay comidas válidas para asociar");
      return;
    }

    // 2. Asociar comidas nuevas a la plantilla correcta
    await asociarComidasAPlantilla(idPlantilla, idsComidas);

    console.log("✅ Plantilla guardada COMPLETA");

  } catch (error) {
    console.error("❌ Error en guardarPlantillaCompleta:", error);
    alert("❌ Hubo un error al guardar la plantilla completa.");
  }
}
