// src/dietas/modules/wizardBase/tablaAlimentos.js
import { renderSelectAlimentos } from '/src/dietas/modules/wizardBase/ui/renderAlimentos.js';
import { renderTablaEquivalencias } from '/src/dietas/modules/wizardBase/ui/renderEquivalencias.js';
import { prepararSumaMacros } from '/src/dietas/modules/wizardBase/ui/sumaMacros.js';

export async function tablaAlimentos() {



  // Esperar a que las tablas estén realmente en el DOM
  await new Promise(resolve => setTimeout(resolve, 50));

  // 1️⃣ Para cada fila de alimentos...
  document.querySelectorAll("select[name='select-categoria']").forEach(async selectCategoria => {

    const categoriaInicial = selectCategoria.value?.trim() || null;
  

    // 1.1️⃣ Buscar el select de alimentos en la MISMA FILA
    const fila = selectCategoria.closest("tr");
    if (!fila) {
      console.warn("⚠ No se encontró fila para categoría:", selectCategoria);
      return;
    }

    const selectAlimentos = fila.querySelector("select[name='select-alimentos']");
    if (!selectAlimentos) {
      console.warn("⚠ No se encontró select-alimentos en la misma fila.");
      return;
    }

    // 1.2️⃣ Render inicial
    await renderSelectAlimentos(selectAlimentos, categoriaInicial);

    // 1.3️⃣ Listener para cambios en esta fila
    selectCategoria.addEventListener("change", async (e) => {
      const categoria = e.target.value?.trim() || null;

      await renderSelectAlimentos(selectAlimentos, categoria);
    });

  });


  await renderTablaEquivalencias();
  await prepararSumaMacros();


}
