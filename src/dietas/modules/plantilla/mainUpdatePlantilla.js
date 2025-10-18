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

  // BOTONES DE AÑADIR COMIDA Y ALIMENTOS
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);
  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  await ejecutarAutoAjuste(idDieta);
  await tablaAlimentos();
  await cargarPlantillasCentro();

  let dataDieta;
  let dataComidas;
  let comidas;
  let dataOriginalDestino; // Para guardar los datos originales de la dieta

  // Detectar si hay plantilla seleccionada
  if (idPlantilla) {
    console.log('🔹 MODO: Cargar plantilla en dieta existente');
    console.log('📊 Macros y datos desde dieta:', idDieta);
    console.log('🍽️ Comidas desde plantilla:', idPlantilla);
    
    dataDieta = await getDieta(idDieta);
    
    if (!dataDieta) {
      console.error('❌ No se pudo cargar la dieta');
      alert('Error al cargar los datos de la dieta');
      return;
    }

    // Guardar datos originales para el borrado
    dataOriginalDestino = dataDieta;
    
    dataComidas = await getPlantilla(idPlantilla);
    
    if (!dataComidas) {
      console.error('❌ No se pudo cargar la plantilla');
      alert('Error al cargar la plantilla');
      return;
    }
    
    comidas = agruparPorComida(dataComidas);
    
    await renderPlantilla({ 
      data: dataComidas,
      comidas
    });
    
  } else {
    console.log('🔹 MODO: Cargar dieta normal');
    console.log('📊 Todo desde dieta:', idDieta);
    
    dataDieta = await getDieta(idDieta);
    
    if (!dataDieta) {
      console.error('❌ No se pudo cargar la dieta');
      alert('Error al cargar la dieta');
      return;
    }

    // Guardar datos originales para el borrado
    dataOriginalDestino = dataDieta;
    
    const dataArray = Array.isArray(dataDieta) ? dataDieta : [dataDieta];
    
    comidas = agruparPorComida(dataArray);
    
    await renderDieta({ 
      data: dataArray,
      comidas 
    });
  }

  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    const result = await mostrarConfirmacionGuardado({
      title: idPlantilla ? '¿Aplicar plantilla a la dieta?' : '¿Guardar cambios?',
      message: idPlantilla 
        ? 'Se reemplazarán las comidas actuales de la dieta con las de la plantilla seleccionada.'
        : 'Se guardarán los cambios realizados en la dieta.'
    });
    
    if (result.confirmed) {
      const { progressController } = result;
      
      try {
        // Borrar las comidas existentes en la dieta destino
        console.log("🗑️ Borrando comidas existentes de dieta destino:", idDieta);
        
        if (dataOriginalDestino && Array.isArray(dataOriginalDestino) && dataOriginalDestino.length > 0) {
          await borrarComidasDeDieta(dataOriginalDestino);
        } else if (dataOriginalDestino) {
          await borrarComidasDeDieta([dataOriginalDestino]);
        }
        progressController.updateProgress(33);
        
        // Actualizar información de la dieta (nombre, descripción, macros)
        console.log("📝 Actualizando información de dieta:", idDieta);
        await actualizarDieta();
        progressController.updateProgress(66);
        
        // Guardar las nuevas comidas (las que están en pantalla)
        console.log("💾 Guardando nuevas comidas en dieta:", idDieta);
        await guardarDietaCompleta();
        progressController.updateProgress(100);
        
        progressController.complete();
        
        // Recargar la página sin id_plantilla para ver los cambios guardados
        if (idPlantilla) {
          setTimeout(() => {
            window.location.href = `/dashboard/dietas/wizardUpdatePlantilla.html?id_dieta=${idDieta}&id_dato=${idDato || ''}`;
          }, 1500);
        }
        
      } catch (error) {
        progressController.close();
        
        const errorResult = await mostrarErrorGuardado({
          title: 'Error al guardar',
          message: idPlantilla 
            ? 'No se pudo aplicar la plantilla a la dieta.'
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