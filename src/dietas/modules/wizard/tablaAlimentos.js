import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';
import { renderTablaEquivalencias } from '/src/dietas/modules/wizard/ui/renderEquivalencias.js';
import { prepararSumaMacros } from '/src/dietas/modules/wizard/ui/sumaMacros.js';

export async function tablaAlimentos() {

  console.log("🔵 [tablaAlimentos] Iniciado");

  const filas = document.querySelectorAll("tbody tr:not(:last-child)");

  for (const fila of filas) {

    // Detectar categoría
    const selectCategoria = fila.querySelector("select[name='select-categoria']");
    let categoriaInicial = null;

    if (selectCategoria) {
      categoriaInicial = selectCategoria.value;
    }
    else if (fila.dataset.categoria) {
      categoriaInicial = fila.dataset.categoria;
    }
    else {
      const macroCell = fila.querySelector("td.header-dieta");
      categoriaInicial = macroCell?.textContent?.trim() || null;
    }

    console.log("🏁 Categoría final detectada en la fila:", categoriaInicial);

    // ✅ RENDERIZAR TODOS LOS SELECTS DE ESTA FILA
    const selectsAlimentos = fila.querySelectorAll("select[name='select-alimentos']");
    for (const select of selectsAlimentos) {
  await renderSelectAlimentos(select, categoriaInicial);
}


    // Si existe select-categoria, actualizar todo al cambiar
    if (selectCategoria) {
     selectCategoria.addEventListener("change", async (e) => {
  const nuevaCat = e.target.value;

  for (const select of selectsAlimentos) {
    await renderSelectAlimentos(select, nuevaCat);
  }
});
    }
  }

  await renderTablaEquivalencias();
  await prepararSumaMacros();

  console.log("✅ [tablaAlimentos] Finalizado");
}
