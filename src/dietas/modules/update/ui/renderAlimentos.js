// src/dietas/modules/update/ui/renderAlimentos.js
import { getAlimentos } from '/src/dietas/modules/update/fetch/getAlimentos.js';

export async function renderSelectAlimentos(selectOrName, categoria = null) {
  try {

    // 🟦 Cache global
    if (!window.__alimentosCache) {
      const alimentos = await getAlimentos();
      if (!Array.isArray(alimentos)) throw new Error("Formato inválido del backend.");
      window.__alimentosCache = alimentos;
    }

    const alimentos = window.__alimentosCache;

    // 🟦 Normalizar selects
    let selects = [];

    // Caso 1 → me pasan un <select>
    if (selectOrName instanceof HTMLElement) {
      selects = [selectOrName];
    }

    // Caso 2 → me pasan un string: "select-alimentos"
    else if (typeof selectOrName === "string") {
      selects = document.querySelectorAll(`select[name='${selectOrName}']`);
    }

    // Caso incorrecto
    else {
      console.warn("renderSelectAlimentos: parámetro inválido:", selectOrName);
      return;
    }

    selects.forEach(select => {

      // Seguridad extra → evitar crash si es un objeto raro
      if (!(select instanceof HTMLSelectElement)) {
        console.warn("⚠ Select inválido ignorado:", select);
        return;
      }

      // 🟦 Limpiar select
      select.innerHTML = "";

      // Placeholder
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Seleccionar";
      select.appendChild(placeholder);

      // 🟦 Filtrar alimentos según categoría
      let lista = alimentos;

      if (categoria) {
        const cat = categoria.toLowerCase();
        lista = alimentos.filter(a => a.categoria?.toLowerCase() === cat);

        console.log(
          `🔎 Filtrando categoría (${categoria}) → ${lista.length} alimentos`
        );
      }

      // Si categoría vacía o sin coincidencias → todos
      if (!categoria || lista.length === 0) {
        lista = alimentos;
      }

      // Añadir alimentos al select
      lista.forEach(alimento => {
        const option = document.createElement("option");
        option.value = alimento.id_alimento;
        option.textContent = alimento.nombre;
        select.appendChild(option);
      });
    });

  } catch (error) {
    console.error("❌ Error renderizando alimentos:", error);
  }
}
