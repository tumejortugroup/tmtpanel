import { getPlantilla } from "./fetch/getPlantilla.js";
import { agruparPorComida } from "./utils/agruparComida.js";
import { renderPlantilla } from "./utils/renderPlantilla.js";
import { tablaAlimentos } from "/src/Plantilla/modules/update/tablaAlimentos.js";

import { crearTablaVacia, eliminarUltimaTabla } 
from "./utils/crearTablaVacia.js";

import { eliminarComidas } from "./fetch/eliminarComidas.js";
import { actualizarPlantilla } from "./fetch/updatePlantilla.js";
import { guardarPlantillaCompleta } from "./creacion/guardarPlantilla.js";

import { addColumns, removeColumns } from "./utils/addAlimentos.js";

import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

import { obtenerIdPlantillaDesdeUrl } from "./utils/params.js";

// ---------------------------------------------------------
//  BORRAR COMIDAS ANTIGUAS
// ---------------------------------------------------------
function borrarComidasDePlantilla(data) {
  const ids = data.map(item => item.id_comida);
  const unicos = [...new Set(ids)];
  console.log("🗑️ Borrando comidas:", unicos);
  return eliminarComidas(unicos);
}

// ---------------------------------------------------------
//  INICIALIZACIÓN
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {

  // -------- Obtener ID de plantilla --------
  const idPlantilla = obtenerIdPlantillaDesdeUrl();
  if (!idPlantilla) {
    alert("❌ Falta id_plantilla en la URL");
    return;
  }

  // -------- Botones añadir y quitar columnas --------
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);

  // -------- Hacer accesibles estas funciones globalmente --------
  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  // -------- Cargar plantilla desde backend --------
  const data = await getPlantilla(idPlantilla);
  if (!data) return;

  // -------- PINTAR nombre_plantilla --------
  document.getElementById("nplantilla").value = data[0]?.nombre_plantilla || "";

  // -------- Agrupar comidas y renderizar tablas --------
  const comidas = agruparPorComida(data);
  renderPlantilla({ data, comidas });

  // -------- Cargar alimentos en selects --------
  setTimeout(async () => {
    await tablaAlimentos();
  }, 80);

  // ---------------------------------------------------------
  //  GUARDAR PLANTILLA
  // ---------------------------------------------------------
  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {

    const result = await mostrarConfirmacionGuardado({
      title: "Guardar plantilla",
      message: "Se guardarán los cambios realizados.",
      confirmText: "Guardar",
      cancelText: "Cancelar"
    });

    if (!result.confirmed) return;

    const { progressController } = result;

   try {

  // 1️⃣ BORRAR COMIDAS ANTIGUAS
  await borrarComidasDePlantilla(data);
  progressController.updateProgress(33);

  // 2️⃣ ACTUALIZAR NOMBRE PLANTILLA
  await actualizarPlantilla(idPlantilla);
  progressController.updateProgress(66);

  // 3️⃣ GUARDAR NUEVAS COMIDAS
  await guardarPlantillaCompleta(idPlantilla);
  progressController.updateProgress(100);

  progressController.complete();

  // ✅ REDIRECCIÓN AL FINAL DEL TODO
  setTimeout(() => {
    window.location.href = "/dashboard/index.html";
  }, 300);

} catch (error) {

  progressController.close();

  const errorResult = await mostrarErrorGuardado({
    title: "Error al guardar",
    message: "No se pudieron guardar los cambios.",
    errorDetails: error.stack,
    primaryButtonText: "Reintentar"
  });

  if (errorResult.retry) {
    document.getElementById("guardar-plantilla-btn").click();
  }
}

  });

});
