import { crearPlantilla } from './crearPlantilla.js';
import { crearComidas } from './crearComida.js';
import { asociarComidasAPlantilla } from './comidaPlantilla.js';

export async function guardarPlantillaCompleta() {
  try {
    // 1. Crear plantilla
    const id_plantilla = await crearPlantilla();
    if (!id_plantilla) {
      alert("❌ No se pudo crear la plantilla.");
      return;
    }
    console.log("📦 Plantilla creada con ID:", id_plantilla);

    // 2. Crear comidas
    const comidas = await crearComidas();
    if (!comidas || !Array.isArray(comidas)) {
      alert("❌ No se pudieron crear las comidas.");
      return;
    }

    const idsComidas = comidas.map(c => c?.id_comida).filter(Boolean);
    console.log("🍽️ IDs de comidas creadas:", idsComidas);

    if (!idsComidas.length) {
      alert("⚠️ No se generaron comidas válidas para asociar.");
      return;
    }

    // 3. Asociar comidas a la plantilla
    await asociarComidasAPlantilla(id_plantilla, idsComidas);

    alert("✅ Plantilla completa guardada con éxito.");
  } catch (error) {
    console.error("❌ Error en guardarPlantillaCompleta:", error);
    alert("❌ Hubo un error al guardar la plantilla completa.");
  }
}