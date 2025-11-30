// ===========================================================
//  tablaAlimentos.js — UPDATE (VERSIÓN CORREGIDA DEFINITIVA)
// ===========================================================

import { renderSelectAlimentos } from "/src/dietas/modules/update/ui/renderAlimentos.js";
import { renderTablaEquivalencias } from "/src/dietas/modules/update/ui/renderEquivalencias.js";
import { prepararSumaMacros } from "/src/dietas/modules/update/ui/sumaMacros.js";
import { capitalizar } from "./utils/helpers.js";

export async function tablaAlimentos(comidas = null) {

  console.log("🔥 tablaAlimentos ejecutada");

  await new Promise(res => setTimeout(res, 70));

  document.querySelectorAll("select[name='select-categoria']").forEach(async selectCategoria => {

    const fila = selectCategoria.closest("tr");
    if (!fila) return;

    const selectAlimentos = fila.querySelector("select[name='select-alimentos']");
    if (!selectAlimentos) return;

    // ❌ NO BLOQUEAR INICIALIZACIÓN
    // if (selectAlimentos.dataset.init === "1") return;

    let categoriaReal = selectCategoria.value?.trim() || null;
    let alimentoActual = null;

    if (comidas) {
      const tipoComida = fila.closest(".table-dieta")
        ?.querySelector("select[name='tipo-comida']")
        ?.value;

      const comidaData = Object.values(comidas).find(
        c => capitalizar(c.tipo_comida) === capitalizar(tipoComida)
      );

      if (comidaData) {
        alimentoActual = comidaData.alimentos.find(
          a => capitalizar(a.categoria) === capitalizar(selectCategoria.value.trim())
        );

        if (alimentoActual?.categoria) {
          categoriaReal = alimentoActual.categoria;
        }
      }
    }

    console.log(`🟦 FILA → categoríaReal: ${categoriaReal} | alimentoActual:`, alimentoActual);

    await renderSelectAlimentos(selectAlimentos, categoriaReal, alimentoActual);

    // ❌ NO MARCAR INIT AQUÍ
    // selectAlimentos.dataset.init = "1";

    selectCategoria.addEventListener("change", async e => {
      const nuevaCat = e.target.value?.trim() || null;
      console.log("🔄 Cambio categoría →", nuevaCat);

      await renderSelectAlimentos(selectAlimentos, nuevaCat);
    });

  });

  await renderTablaEquivalencias();
  await prepararSumaMacros();

  console.log("🟩 tablaAlimentos completado");
}
