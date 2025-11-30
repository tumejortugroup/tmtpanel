// src/dietas/modules/wizardBase/ui/renderAlimentos.js
import { getAlimentos } from '/src/dietas/modules/wizardBase/fetch/getAlimentos.js';

export async function renderSelectAlimentos(selectOrName, categoria = null, alimentoSeleccionado = null) {
  try {

    if (!window.__alimentosCache) {
      const alimentos = await getAlimentos();
      if (!Array.isArray(alimentos)) throw new Error("Backend devolvió un formato inválido.");
      window.__alimentosCache = alimentos;
    }

    const alimentos = window.__alimentosCache;

    let selects = [];

    if (selectOrName instanceof HTMLElement) {
      selects = [selectOrName];
    } else {
      selects = document.querySelectorAll(`select[name='${selectOrName}']`);
    }

    selects.forEach(select => {

      // 🔥🔥🔥 LA LÍNEA QUE SALVA TODO 🔥🔥🔥
      if (select.options.length > 1) return;

      // Asegurar placeholder
      if (select.options.length === 0) {
        const ph = document.createElement("option");
        ph.value = "";
        ph.textContent = "Seleccionar";
        select.appendChild(ph);
      }

      let lista = alimentos;

      if (categoria && typeof categoria === "string") {
        const catLower = categoria.toLowerCase();
        lista = alimentos.filter(a => a.categoria?.toLowerCase() === catLower) || alimentos;
      }

      lista.forEach(a => {
        const option = document.createElement("option");
        option.value = a.id_alimento;
        option.textContent = a.nombre;

        if (alimentoSeleccionado && a.id_alimento == (alimentoSeleccionado.id_alimento ?? alimentoSeleccionado)) {
          option.selected = true;
        }

        select.appendChild(option);
      });

    });

  } catch (error) {
    console.error("❌ Error renderizando alimentos:", error);
  }
}
