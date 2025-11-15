import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { tablaAlimentos } from '/src/dietas/modules/wizard/tablaAlimentos.js';
import { actualizarDieta } from './modules/wizard/fetch/updateDieta.js';
import { guardarDietaCompleta } from '/src/dietas/modules/wizard/creacion/guardarDieta.js';
import { addColumns, removeColumns } from '/src/dietas/modules/wizard/ui/add-columns.js';
import { cargarPlantillasCentro } from './modules/plantilla/fetch/fetchPlantilla.js';
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";
import { obtenerDetalleDato } from '/src/dietas/modules/wizard/fetch/getPeso.js';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idDato = params.get("id_dato");

  const btnControl2 = document.querySelector('.btn-ver-control');

if (btnControl2 && idDato) {

  btnControl2.addEventListener('click', async () => {
    try {
      console.log('🔍 Obteniendo id_usuario desde id_dato:', idDato);

      const detalle = await obtenerDetalleDato();
      const idUsuario = detalle?.data?.id_usuario;

      if (!idUsuario) {
        throw new Error('No se encontró id_usuario en los detalles del dato');
      }

      console.log('✅ ID Usuario obtenido:', idUsuario);

      // MISMA RUTA QUE TU FUNCIÓN ORIGINAL
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

} else if (btnControl2 && !idDato) {

  btnControl2.disabled = true;
  btnControl2.title = 'No hay datos de control disponibles';
  btnControl2.style.opacity = '0.5';
  btnControl2.style.cursor = 'not-allowed';

}

  window.duplicarUltimaTabla = duplicarUltimaTabla;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-add-columns")) {
      addColumns(e.target);
    }
    if (e.target.matches(".btn-remove-columns")) {
      removeColumns(e.target);
    }
  });

  await ejecutarAutoAjuste();
  await tablaAlimentos();
  await cargarPlantillasCentro();

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