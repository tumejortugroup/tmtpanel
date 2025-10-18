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
  const idDieta = params.get("id_dieta");        // Para guardar cambios
  const idDieta2 = params.get("id_dieta2");      // Para cargar datos de plantilla
  const idDato = params.get("id_dato");

  console.log("Parámetros URL:", { idDieta, idDieta2, idDato });

  if (!idDieta) {
    alert("Falta id_dieta en la URL");
    return;
  }

  // ⬇️ BOTÓN DE CONTROL
  const btnControl = document.querySelector('.dataTables_length button');
  if (btnControl && idDato) {
    btnControl.addEventListener('click', async () => {
      try {
        console.log('🔍 Obteniendo id_usuario desde id_dato:', idDato);
        
        const detalle = await obtenerDetalleDato();
        const idUsuario = detalle?.data?.id_usuario;
        
        if (!idUsuario) {
          throw new Error('No se encontró id_usuario en los detalles del dato');
        }
        
        console.log('✅ ID Usuario obtenido:', idUsuario);
        
        // Abrir en nueva pestaña
        window.open(`/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${idDato}`, '_blank');
        
      } catch (error) {
        console.error('❌ Error:', error);
        
        await mostrarErrorGuardado({
          title: 'Error al acceder al control',
          message: 'No se pudo obtener la información del usuario para mostrar el control.',
          errorDetails: error.message,
          primaryButtonText: 'Entendido',
          secondaryButtonText: null
        });
      }
    });
  } else if (btnControl && !idDato) {
    // Si no hay id_dato, deshabilitar el botón
    btnControl.disabled = true;
    btnControl.title = 'No hay datos de control disponibles';
    btnControl.style.opacity = '0.5';
    btnControl.style.cursor = 'not-allowed';
  }

  // Botones de añadir comida y alimentos
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);
  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  await tablaAlimentos();
  await ejecutarAutoAjuste();
  await cargarPlantillasCentro();

  // Carga de datos modificada para manejar id_dieta2
  let dataParaMostrar = null;
  let comidasParaMostrar = {};
  let dataOriginalDestino = null; // Para el nombre y descripción

  // Siempre cargar datos de la dieta destino para nombre/descripción
  console.log("Cargando datos de dieta destino:", idDieta);
  dataOriginalDestino = await getDieta(idDieta);

  if (idDieta2) {
    console.log("Cargando datos de plantilla desde id_dieta2:", idDieta2);
    try {
      dataParaMostrar = await getDieta(idDieta2);
      if (dataParaMostrar) {
        comidasParaMostrar = agruparPorComida(dataParaMostrar);
        console.log("Datos de plantilla cargados:", comidasParaMostrar);
      }
    } catch (error) {
      console.warn("Error cargando plantilla, usando dieta principal:", error);
    }
  }

  // Si no hay id_dieta2 o falló la carga, usar la dieta principal
  if (!dataParaMostrar) {
    console.log("Cargando datos de dieta principal:", idDieta);
    dataParaMostrar = dataOriginalDestino;
    if (dataParaMostrar) {
      comidasParaMostrar = agruparPorComida(dataParaMostrar);
    }
  }

  if (!dataParaMostrar) {
    console.error("No se pudieron cargar datos de ninguna dieta");
    return;
  }

  // Renderizar con información completa
  renderDieta({ 
    data: dataOriginalDestino || dataParaMostrar,  // Usar datos destino para nombre/descripción
    comidas: comidasParaMostrar,                   // Usar datos de plantilla para tablas
    isPlantillaMode: !!idDieta2,                   // Flag para saber si es modo plantilla
    idDietaDestino: idDieta,                       // ID donde se guardará
    idDietaPlantilla: idDieta2                     // ID de donde se cargan los datos
  });

  setTimeout(async () => {
    const { prepararSumaMacros } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    console.log("Configurando suma de macros después de renderizar tablas...");
    await prepararSumaMacros();
  }, 300);

  // Guardar: Siempre usa idDieta (destino) y los datos actuales mostrados
  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    const result = await mostrarConfirmacionGuardado({
      title: idDieta2 ? '¿Copiar plantilla a esta dieta?' : '¿Guardar cambios?',
      message: idDieta2 
        ? 'Se reemplazarán las comidas actuales con las de la dieta seleccionada.'
        : 'Se guardarán todos los cambios realizados en la dieta.'
    });
    
    if (result.confirmed) {
      const { progressController } = result;
      
      try {
        // Usar dataOriginalDestino para borrar las comidas existentes en la dieta destino
        console.log("Borrando comidas existentes de dieta destino:", idDieta);
        
        if (dataOriginalDestino && dataOriginalDestino.length > 0) {
          await borrarComidasDeDieta(dataOriginalDestino);
        }
        progressController.updateProgress(33);
        
        // Actualizar información de la dieta (nombre, descripción, etc.)
        console.log("Actualizando información de dieta:", idDieta);
        await actualizarDieta();
        progressController.updateProgress(66);
        
        // Guardar las nuevas comidas (basadas en lo que está mostrado en pantalla)
        console.log("Guardando nuevas comidas en dieta:", idDieta);
        await guardarDietaCompleta();
        progressController.updateProgress(100);
        
        progressController.complete();
        
      } catch (error) {
        progressController.close();
        
        const errorResult = await mostrarErrorGuardado({
          title: 'Error al guardar',
          message: idDieta2 
            ? 'No se pudo copiar la plantilla a la dieta de destino.'
            : 'No se pudieron guardar los cambios en la dieta.',
          errorDetails: error.stack,
          primaryButtonText: 'Reintentar',
          secondaryButtonText: null
        });
        
        if (errorResult.retry) {
          document.getElementById("guardar-dieta-btn").click();
        }
      }
    }
  });
});