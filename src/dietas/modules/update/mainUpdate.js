import { getDieta } from "./fetch/getDieta.js";
import { agruparPorComida } from "./utils/agruparComida.js";
import { renderDieta } from "./utils/renderDieta.js";
import { tablaAlimentos } from "/src/dietas/modules/update/tablaAlimentos.js";
import { ejecutarAutoAjuste } from '/src/dietas/modules/update/autoAjuste.js';
import { crearTablaVacia, eliminarUltimaTabla } from "./utils/crearTablaVacia.js";
import { eliminarComidas } from "./fetch/eliminarComidas.js";
import { actualizarDieta } from "/src/dietas/modules/update/fetch/updateDieta.js";
import { guardarDietaCompleta } from "/src/dietas/modules/update/creacion/guardarDieta.js";
import { addColumns, removeColumns } from "./utils/addAlimentos.js";
import { cargarPlantillasCentro } from '/src/dietas/modules/plantilla/fetch/fetchPlantilla.js';
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";
import { obtenerDetalleDato } from '/src/dietas/modules/update/fetch/getPeso.js';

function borrarComidasDeDieta(data) {
  const ids = data.map(item => item.id_comida);
  const idsUnicas = [...new Set(ids)];
  console.log("🚀 Enviando a borrar:", idsUnicas);
  return eliminarComidas(idsUnicas);
}

document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const idDieta = params.get("id_dieta");
  const idDato = params.get("id_dato");

  if (!idDieta) {
    alert("Falta id_dieta en la URL");
    return;
  }


  // --- Botón Ver Control ---
  const btnControl2 = document.querySelector('.btn-ver-control');

  if (btnControl2 && idDato) {

    btnControl2.addEventListener('click', async () => {
      try {
        console.log('🔍 Obteniendo id_usuario desde id_dato:', idDato);
        const detalle = await obtenerDetalleDato();
        const idUsuario = detalle?.data?.id_usuario;
        if (!idUsuario) throw new Error('No se encontró id_usuario');
        window.open(`/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${idDato}`, '_blank');
      } catch (error) {
        console.error('❌ Error:', error);
        await mostrarErrorGuardado({
          title: 'Error al acceder al control',
          message: 'No se pudo obtener el usuario.',
          errorDetails: error.message
        });
      }
    });

  } else if (btnControl2) {

    btnControl2.disabled = true;
    btnControl2.title = 'No hay datos de control disponibles';
    btnControl2.style.opacity = '0.5';
    btnControl2.style.cursor = 'not-allowed';
  }

  // --- Botones Añadir / Quitar Alimentos ---
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);

  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  // --- IMPORTANTE ---
  // Mantengo tu autoajuste y carga de plantillas SIN TOCARLOS
  await ejecutarAutoAjuste();
  await cargarPlantillasCentro();

  // --- Cargar dieta ---
  const data = await getDieta(idDieta);
  if (!data) return;

  const comidas = agruparPorComida(data);

  // --- Render de la dieta ---
  renderDieta({ data, comidas });

  // --- AHORA SÍ: tablaAlimentos DESPUÉS DEL RENDER ---
  setTimeout(async () => {
    console.log("⏳ Ejecutando tablaAlimentos después del render...");
    await tablaAlimentos();
  }, 80);

  // --- Suma de macros después ---
  setTimeout(async () => {
    const { prepararSumaMacros } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    console.log("🔄 Configurando suma de macros después del render...");
    await prepararSumaMacros();
  }, 200);

  // --- Guardar dieta ---
  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {

    const result = await mostrarConfirmacionGuardado({
      title: 'Guardar cambios',
      message: 'Se guardarán todos los cambios realizados en la dieta.',
      confirmText: 'Guardar',
      cancelText: 'Cancelar'
    });

    if (!result.confirmed) return;

    const { progressController } = result;

    try {
      await borrarComidasDeDieta(data);
      progressController.updateProgress(33);

      await actualizarDieta();
      progressController.updateProgress(66);

      await guardarDietaCompleta();
      progressController.updateProgress(100);

      progressController.complete();

    } catch (error) {

      progressController.close();

      const errorResult = await mostrarErrorGuardado({
        title: 'Error al guardar',
        message: 'No se pudieron guardar los cambios.',
        errorDetails: error.stack,
        primaryButtonText: 'Reintentar'
      });

      if (errorResult.retry) {
        document.getElementById("guardar-dieta-btn").click();
      }
    }
  });

});
