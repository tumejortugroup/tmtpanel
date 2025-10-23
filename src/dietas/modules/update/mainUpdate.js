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
import { obtenerDetalleDato } from '/src/dietas/modules/update/fetch/getPeso.js'; // ⬅️ USAR ESTE

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

  // ⬇️ BOTÓN DE CONTROL
  // ⬇️ BOTÓN DE CONTROL
const btnControl = document.querySelector('.dataTables_length button');
if (btnControl && idDato) {
  btnControl.addEventListener('click', async () => {
    try {
      console.log('🔍 Obteniendo id_usuario desde id_dato:', idDato);
      
      // Usar obtenerDetalleDato (que ya usas en autoAjuste)
      const detalle = await obtenerDetalleDato();
      const idUsuario = detalle?.data?.id_usuario;
      
      if (!idUsuario) {
        throw new Error('No se encontró id_usuario en los detalles del dato');
      }
      
      console.log('✅ ID Usuario obtenido:', idUsuario);
      
      // ⬇️ Abrir en nueva pestaña
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

  /**BOTONES DE AÑADIR COMIDA Y ALIMENTOS */
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);
  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  await tablaAlimentos();
  await ejecutarAutoAjuste();
  await cargarPlantillasCentro();

  const data = await getDieta(idDieta);
  if (!data) return;

  const comidas = agruparPorComida(data);
  renderDieta({ data, comidas });

  setTimeout(async () => {
    const { prepararSumaMacros } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    console.log("🔄 Configurando suma de macros después de renderizar tablas...");
    await prepararSumaMacros();
  }, 300);

  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    const result = await mostrarConfirmacionGuardado({
      title: 'Guardar cambios',
      message: 'Se guardarán todos los cambios realizados en la dieta.',
      confirmText: 'Guardar',
      cancelText: 'Cancelar'
    });
    
    if (result.confirmed) {
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
          message: 'No se pudieron guardar los cambios en la dieta.',
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