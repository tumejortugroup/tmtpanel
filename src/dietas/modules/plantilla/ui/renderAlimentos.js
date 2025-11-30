

import { getAlimentos } from '/src/dietas/modules/plantilla/fetch/getAlimentos.js';

export async function renderSelectAlimentos(selectId) {
  try {
    // Cachear alimentos en window
    if (!window.__alimentosCache) {
      const alimentos = await getAlimentos();

      if (!Array.isArray(alimentos)) {
        throw new Error("La respuesta del backend no es una lista.");
      }

      window.__alimentosCache = alimentos;
    }

    const alimentos = window.__alimentosCache;

    const selects = document.querySelectorAll(`select[name='${selectId}']`);
    
    selects.forEach(select => {
      // ⚡ Solo rellenamos si está vacío (solo tiene el placeholder)
      if (select.options.length > 1) return;

      // Asegurar placeholder
      if (select.options.length === 0) {
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Seleccionar";
        select.appendChild(placeholder);
      }

      alimentos.forEach(alimento => {
        const option = document.createElement("option");
        option.value = alimento.id_alimento;
        option.textContent = alimento.nombre;
        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error("❌ Error al renderizar alimentos:", error);
  }
}