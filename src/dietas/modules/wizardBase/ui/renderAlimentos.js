// src/dietas/modules/wizardBase/ui/renderAlimentos.js
import { getAlimentos } from '/src/dietas/modules/wizardBase/fetch/getAlimentos.js';

export async function renderSelectAlimentos(selectElementOrName, categoria = null) {
  try {

    // Aceptar directamente un <select> DOM o un string name=""
    let selects = [];

    if (typeof selectElementOrName === "string") {
      selects = document.querySelectorAll(`select[name='${selectElementOrName}']`);
    } else {
      selects = [selectElementOrName];
    }

    console.log("🔵 Render alimentos → Categoría:", categoria);

    let alimentos = [];

    if (!categoria) {
      console.log("🟡 Sin categoría: usar cache general");
      if (!window.__alimentosCache) {
        window.__alimentosCache = await getAlimentos();
      }
      alimentos = window.__alimentosCache;
    } else {
      console.log("🟢 Con categoría:", categoria, "→ cargar filtrados");
      alimentos = await getAlimentos(categoria);
    }

    selects.forEach(select => {

      console.log("🔽 Rellenando select:", select);

      // Limpiar y reponer placeholder
      select.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Seleccionar";
      select.appendChild(placeholder);

      alimentos.forEach(alimento => {
        const option = document.createElement("option");
        option.value = alimento.id_alimento;
        option.textContent = alimento.nombre;
        select.appendChild(option);
      });

      console.log("✅ Select filtrado con", alimentos.length, "alimentos");
    });

  } catch (error) {
    console.error("❌ Error al renderizar alimentos:", error);
  }
};
