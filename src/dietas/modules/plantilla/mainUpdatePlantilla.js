import { getPlantilla } from "./fetch/getPlantilla.js";
import { getDieta } from "./fetch/getDieta.js";
import { agruparPorComida } from "./utils/agruparComida.js";
import { renderPlantilla } from "./utils/renderPlantilla.js";
import { renderDieta } from "./utils/renderDieta.js";
import { tablaAlimentos } from "/src/dietas/modules/plantilla/tablaAlimentos.js";
import { ejecutarAutoAjuste } from '/src/dietas/modules/plantilla/autoAjuste.js';
import { crearTablaVacia, eliminarUltimaTabla } from "./utils/crearTablaVacia.js";
import { eliminarComidas } from "./fetch/eliminarComidas.js";
import { actualizarDieta } from "/src/dietas/modules/plantilla/fetch/updateDieta.js";
import { guardarDietaCompleta } from "/src/dietas/modules/plantilla/creacion/guardarDieta.js";
import { addColumns, removeColumns } from "./utils/addAlimentos.js";
import { cargarPlantillasCentro } from '/src/dietas/modules/plantilla/fetch/fetchPlantilla.js';
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";
import { obtenerDetalleDato } from '/src/dietas/modules/plantilla/fetch/getPeso.js';

function borrarComidasDeDieta(data) {
  const dataArray = Array.isArray(data) ? data : [data];
  const ids = dataArray.map(item => item.id_comida).filter(id => id);
  const idsUnicas = [...new Set(ids)];

  if (idsUnicas.length === 0) {
    console.warn('⚠️ No hay IDs de comidas para borrar');
    return Promise.resolve();
  }

  return eliminarComidas(idsUnicas);
}

document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const idDieta = params.get("id_dieta");
  const idPlantilla = params.get("id_plantilla");
  const idDato = params.get("id_dato");

  if (!idDieta) {
    alert("Falta id_dieta en la URL");
    return;
  }

  // -------------------------------------------
  // BOTÓN VER CONTROL
  // -------------------------------------------

  const btnControl2 = document.querySelector('.btn-ver-control');

  if (btnControl2 && idDato) {

    btnControl2.addEventListener('click', async () => {
      try {
        console.log('🔍 Obteniendo id_usuario desde id_dato:', idDato);
        const detalle = await obtenerDetalleDato();
        const idUsuario = detalle?.data?.id_usuario;

        if (!idUsuario) throw new Error('No se encontró id_usuario');

        window.open(
          `/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${idDato}`,
          '_blank'
        );

      } catch (error) {
        console.error('❌ Error:', error);
        await mostrarErrorGuardado({
          title: 'Error al acceder al control',
          message: 'No se pudo obtener la información del usuario.',
          errorDetails: error.message
        });
      }
    });

  } else if (btnControl2) {
    btnControl2.disabled = true;
    btnControl2.title = 'No hay datos disponibles';
    btnControl2.style.opacity = '0.5';
    btnControl2.style.cursor = 'not-allowed';
  }

  // -------------------------------------------
  // BOTONES AÑADIR / QUITAR ALIMENTOS
  // -------------------------------------------

  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);

  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  await ejecutarAutoAjuste(idDieta);
  await cargarPlantillasCentro();

  // -------------------------------------------
  // CARGA DE DATOS
  // -------------------------------------------

  let dataDieta;
  let dataComidas;
  let comidas;
  let dataOriginalDestino;

  if (idPlantilla) {

    console.log('🔹 MODO PLANTILLA → cargando plantilla en dieta');

    dataDieta = await getDieta(idDieta);
    if (!dataDieta) return;

    dataOriginalDestino = dataDieta;

    dataComidas = await getPlantilla(idPlantilla);
    if (!dataComidas) return;

    comidas = agruparPorComida(dataComidas);

    await renderPlantilla({
      data: dataComidas,
      comidas
    });

  } else {

    console.log('🔹 MODO DIETA → cargando dieta normal');

    dataDieta = await getDieta(idDieta);
    if (!dataDieta) return;

    dataOriginalDestino = dataDieta;

    const dataArray = Array.isArray(dataDieta) ? dataDieta : [dataDieta];
    comidas = agruparPorComida(dataArray);

    await renderDieta({
      data: dataArray,
      comidas
    });
  }

  // -------------------------------------------
  // EJECUTAR tablaAlimentos DESPUÉS DEL RENDER
  // -------------------------------------------

  setTimeout(async () => {
    console.log("⏳ Ejecutando tablaAlimentos después del render...");
    await tablaAlimentos();
  }, 80);

  // -------------------------------------------
  // SUMA DE MACROS
  // -------------------------------------------

  setTimeout(async () => {
    const { prepararSumaMacros } =
      await import('/src/dietas/modules/update/ui/sumaMacros.js');

    console.log("🔄 Configurando suma de macros…");
    await prepararSumaMacros();
  }, 200);

  // -------------------------------------------
  // GUARDAR DIETA
  // -------------------------------------------

  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {

    const result = await mostrarConfirmacionGuardado({
      title: idPlantilla ? '¿Aplicar plantilla?' : '¿Guardar cambios?',
      message: idPlantilla
        ? 'Se reemplazarán las comidas actuales con las de la plantilla.'
        : 'Se guardarán los cambios realizados en la dieta.'
    });

    if (!result.confirmed) return;

    const { progressController } = result;

    try {

      console.log("🗑️ Borrando comidas existentes…");
      await borrarComidasDeDieta(dataOriginalDestino);
      progressController.updateProgress(33);

      console.log("📝 Actualizando información general…");
      await actualizarDieta();
      progressController.updateProgress(66);

      console.log("💾 Guardando nuevas comidas…");
      await guardarDietaCompleta();
      progressController.updateProgress(100);

      progressController.complete();

      if (idPlantilla) {
        setTimeout(() => {
          window.location.href =
            `/dashboard/dietas/wizardUpdatePlantilla.html?id_dieta=${idDieta}&id_dato=${idDato || ''}`;
        }, 1500);
      }

    } catch (error) {

      progressController.close();

      const errorResult = await mostrarErrorGuardado({
        title: 'Error al guardar',
        message: idPlantilla
          ? 'No se pudo aplicar la plantilla.'
          : 'No se pudieron guardar los cambios.',
        errorDetails: error.stack,
        primaryButtonText: 'Reintentar'
      });

      if (errorResult.retry) {
        document.getElementById("guardar-dieta-btn").click();
      }
    }
  });

});
