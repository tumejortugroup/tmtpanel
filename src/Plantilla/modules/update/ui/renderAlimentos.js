import { getAlimentos } from '/src/Plantilla/modules/update/fetch/getAlimentos.js';



export async function renderSelectAlimentos(
  selectOrName,
  categoria = null,
  alimentoSeleccionado = null
) {
  try {
    

    // ===========================
    // CACHE ALIMENTOS
    // ===========================
    if (!window.__alimentosCache) {
      console.log("⚠ No había cache, cargando alimentos...");
      const alimentos = await getAlimentos();
      if (!Array.isArray(alimentos)) throw new Error("Backend devolvió un formato inválido.");
      window.__alimentosCache = alimentos;
    }

    const alimentos = window.__alimentosCache;
    console.log("📦 Alimentos en cache:", alimentos.length);

    let selects = [];

    // ===========================
    // DETECTAR TIPO DE selectOrName
    // ===========================
    if (selectOrName instanceof HTMLElement) {
      console.log("📌 selectOrName es un nodo <select>");
      selects = [selectOrName];
    } else if (typeof selectOrName === "string") {
      console.log("📌 selectOrName es string → buscando selects con name:", selectOrName);
      selects = document.querySelectorAll(`select[name='${selectOrName}']`);
    } else {
      console.warn("❌ ERROR: parámetro inválido recibido en renderSelectAlimentos:", selectOrName);
      return;
    }

    console.log("🧩 Selects detectados:", selects.length);

    // ===========================
    // PROCESAR CADA SELECT
    // ===========================
    selects.forEach(select => {

      if (!(select instanceof HTMLSelectElement)) {
        console.warn("⚠ Ignorando un select que NO es HTMLSelectElement:", select);
        return;
      }

      console.log("---------------------------------------------------");
      console.log("🎯 Procesando SELECT:", select);
      console.log("---------------------------------------------------");

      // Resetear
      select.innerHTML = '<option value="">Seleccionar</option>';

      // ===========================
      // FILTRADO POR CATEGORIA
      // ===========================
      let lista = alimentos;

      if (typeof categoria === "string" && categoria.trim() !== "") {
        const cat = categoria.toLowerCase();
        console.log(`🔎 Filtrando alimentos por categoría "${cat}"...`);

        const filtrados = alimentos.filter(a => 
          a.categoria && a.categoria.toLowerCase() === cat
        );

        console.log("🟨 Encontrados:", filtrados.length, "alimentos");

        lista = filtrados.length > 0 ? filtrados : alimentos;

        if (filtrados.length === 0) {
          console.warn("⚠ No hay alimentos para esa categoría → usando lista completa");
        }
      } else {
        console.log("⚠ No se filtró categoría porque no es string válida:", categoria);
      }

      console.log("📥 Lista final que se va a pintar (" + lista.length + " items):");
      lista.forEach(a => console.log(" -", a.nombre, "(cat:", a.categoria, ")"));

      // ===========================
      // PINTAR ALIMENTOS
      // ===========================
      lista.forEach(a => {
        const option = document.createElement("option");
        option.value = a.id_alimento;
        option.textContent = a.nombre;

        // Seleccionar automáticamente el alimento correcto
       if (alimentoSeleccionado 
    && a.id_alimento == (alimentoSeleccionado.id_alimento ?? alimentoSeleccionado)) {

    console.log("✔ Preseleccionando alimento:", a.nombre);
    option.selected = true;
}

        select.appendChild(option);
      });

      console.log("✔ SELECT rellenado correctamente.");
    });

    console.log("🟩 renderSelectAlimentos() → FIN");
    console.log("---------------------------------------------------");

  } catch (error) {
    console.error("❌ Error renderizando alimentos:", error);
  }
}
