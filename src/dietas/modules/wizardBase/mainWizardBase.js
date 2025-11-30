import { getDieta } from "./fetch/getDieta.js";
import { agruparPorComida } from "./utils/agruparComida.js";
import { renderDieta } from "./utils/renderDieta.js";
import { tablaAlimentos } from "/src/dietas/modules/wizardBase/tablaAlimentos.js";
import { ejecutarAutoAjuste } from '/src/dietas/modules/wizardBase/autoAjuste.js';
import { crearTablaVacia, eliminarUltimaTabla } from "./utils/crearTablaVacia.js";
import { eliminarComidas } from "./fetch/eliminarComidas.js";
import { actualizarDieta } from "/src/dietas/modules/wizardBase/fetch/updateDieta.js";
import { guardarDietaCompleta } from "/src/dietas/modules/wizardBase/creacion/guardarDieta.js";
import { addColumns, removeColumns } from "./utils/addAlimentos.js";
import { cargarPlantillasCentro } from '/src/dietas/modules/plantilla/fetch/fetchPlantilla.js';
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";
import { obtenerDetalleDato } from '/src/dietas/modules/wizardBase/fetch/getPeso.js';

function borrarComidasDeDieta(data) {
  const ids = data.map(item => item.id_comida);
  const idsUnicas = [...new Set(ids)];
  console.log("Enviando a borrar:", idsUnicas);
  return eliminarComidas(idsUnicas);
}

document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const idDieta = params.get("id_dieta");
  const idDieta2 = params.get("id_dieta2");
  const idDato = params.get("id_dato");

  console.log("Parámetros URL:", { idDieta, idDieta2, idDato });

  if (!idDieta) {
    alert("Falta id_dieta en la URL");
    return;
  }

  // ---------------------------------------
  // BOTÓN VER CONTROL
  // ---------------------------------------
  const btnControl2 = document.querySelector('.btn-ver-control');

  if (btnControl2 && idDato) {

    btnControl2.addEventListener('click', async () => {
      try {

        const detalle = await obtenerDetalleDato();
        const idUsuario = detalle?.data?.id_usuario;

        if (!idUsuario)
          throw new Error('No se encontró id_usuario');

        window.open(
          `/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${idDato}`,
          '_blank'
        );

      } catch (error) {
        await mostrarErrorGuardado({
          title: 'Error al acceder al control',
          message: 'No se pudo obtener el usuario.',
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

  // ---------------------------------------
  // BOTONES AÑADIR / QUITAR
  // ---------------------------------------
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);

  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  // ---------------------------------------
  // MANTENEMOS ESTO (NO SE TOCA)
  // ---------------------------------------
  await ejecutarAutoAjuste();
  await cargarPlantillasCentro();

  // ---------------------------------------
  // CARGA DIETA / PLANTILLA
  // ---------------------------------------
  let dataParaMostrar = null;
  let comidasParaMostrar = {};
  let dataOriginalDestino = null;

  console.log("Cargando dieta destino:", idDieta);
  dataOriginalDestino = await getDieta(idDieta);

  if (idDieta2) {
    try {
      dataParaMostrar = await getDieta(idDieta2);
      comidasParaMostrar = agruparPorComida(dataParaMostrar);
    } catch {
      console.warn("Error cargando plantilla, usando dieta por defecto");
    }
  }

  if (!dataParaMostrar) {
    dataParaMostrar = dataOriginalDestino;
    comidasParaMostrar = agruparPorComida(dataParaMostrar);
  }

  if (!dataParaMostrar) {
    console.error("No se pudo cargar ninguna dieta");
    return;
  }

  // ---------------------------------------
  // RENDER PRINCIPAL
  // ---------------------------------------
  renderDieta({
    data: dataOriginalDestino || dataParaMostrar,
    comidas: comidasParaMostrar,
    isPlantillaMode: !!idDieta2,
    idDietaDestino: idDieta,
    idDietaPlantilla: idDieta2
  });

  // ---------------------------------------
  // FILTRADO DE ALIMENTOS CUANDO EL DOM YA EXISTE
  // ---------------------------------------
  setTimeout(async () => {
    console.log("⏳ tablaAlimentos después del render...");
    await tablaAlimentos();
  }, 80);

  // ---------------------------------------
  // SUMA MACROS DESPUÉS DE TABLA ALIMENTOS
  // ---------------------------------------
  setTimeout(async () => {
    const { prepararSumaMacros } =
      await import('/src/dietas/modules/update/ui/sumaMacros.js');

    console.log("Configurando suma de macros…");
    await prepararSumaMacros();
  }, 200);

  // ---------------------------------------
  // GUARDAR
  // ---------------------------------------
  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {

    const result = await mostrarConfirmacionGuardado({
      title: idDieta2 ? '¿Copiar plantilla?' : '¿Guardar cambios?',
      message: idDieta2
        ? 'Esta dieta será reemplazada por la plantilla seleccionada.'
        : 'Se guardarán los cambios en la dieta.'
    });

    if (!result.confirmed) return;

    const { progressController } = result;

    try {

      await borrarComidasDeDieta(dataOriginalDestino);
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

      if (errorResult.retry)
        document.getElementById("guardar-dieta-btn").click();
    }
  });

});
