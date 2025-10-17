import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { tablaAlimentos } from '/src/dietas/modules/wizard/tablaAlimentos.js';
import { actualizarDieta } from './modules/wizard/fetch/updateDieta.js';
import { guardarDietaCompleta } from '/src/dietas/modules/wizard/creacion/guardarDieta.js';
import { addColumns, removeColumns } from '/src/dietas/modules/wizard/ui/add-columns.js';
import { cargarPlantillasCentro } from './modules/plantilla/fetch/fetchPlantilla.js';
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";



document.addEventListener("DOMContentLoaded", async () => {
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
    const result = await mostrarConfirmacionGuardado();
    
    if (result.confirmed) {
      const { progressController } = result;
      
      try {

        await actualizarDieta();
        progressController.updateProgress(66);
        
        await guardarDietaCompleta();
        progressController.updateProgress(100);
        
        progressController.complete();
        
      } catch (error) {
        // Cerrar progress y mostrar error
        progressController.close();
        
        const errorResult = await mostrarErrorGuardado({
          title: '¡Error al guardar!',
          message: 'No se pudieron guardar los cambios en la dieta.',
          errorDetails: error.stack,
          primaryButtonText: 'Reintentar',
          secondaryButtonText: 'Cerrar'
        });
        
        if (errorResult.retry) {
          // Reiniciar todo el proceso
          document.getElementById("guardar-dieta-btn").click();
        }
      }
    }
  });
  
});
