import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { tablaAlimentos } from '/src/dietas/modules/wizard/tablaAlimentos.js';
import { addColumns, removeColumns } from '/src/dietas/modules/wizard/ui/add-columns.js';
import { guardarPlantillaCompleta } from './modules/creacion/guardarPlantilla.js';
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

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

  await tablaAlimentos();
  
  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    // Validar que haya un nombre de plantilla
    const nombrePlantilla = document.getElementById("nplantilla")?.value.trim();
    
    if (!nombrePlantilla) {
      await mostrarErrorGuardado({
        title: 'Nombre requerido',
        message: 'Por favor, ingresa un nombre para la plantilla antes de guardar.',
        primaryButtonText: 'Entendido',
        showDetails: false
      });
      
      // Enfocar el campo de nombre
      document.getElementById("nplantilla")?.focus();
      return; // ⬅️ Detener aquí
    }

    const result = await mostrarConfirmacionGuardado({
      title: 'Crear plantilla',
      message: `Se creará la plantilla "${nombrePlantilla}" con las comidas y alimentos configurados.`,
      confirmText: 'Crear plantilla',
      cancelText: 'Cancelar'
    });
    
    if (result.confirmed) {
      const { progressController } = result;
      
      try {
        console.log("💾 Iniciando creación de plantilla...");
        
        progressController.updateProgress(20);
        
        // Guardar la plantilla completa (esto incluye crear la plantilla Y guardar las comidas)
        console.log("💾 Guardando plantilla completa...");
        await guardarPlantillaCompleta();
        
        progressController.updateProgress(100);
        progressController.complete();
        
        
        
        // Redirigir a la lista de plantillas después de un delay
        setTimeout(() => {
          window.location.href = '/dashboard/dietas/vistaPlantilla.html';
        }, 1500);
        
      } catch (error) {
        // ⬇️ Cerrar el progress bar
        progressController.close();
        
        console.error("❌ Error al crear plantilla:", error);
        
        // Determinar el mensaje de error apropiado
        let errorMessage = 'No se pudo guardar la plantilla completa.';
        let errorTitle = 'Error al crear plantilla';
        
        if (error.message.includes('autenticación')) {
          errorTitle = 'Error de autenticación';
          errorMessage = 'Faltan datos de autenticación. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('vacío')) {
          errorTitle = 'Datos incompletos';
          errorMessage = 'Faltan datos necesarios para crear la plantilla.';
        } else if (error.message.includes('conexión') || error.message.includes('fetch')) {
          errorTitle = 'Error de conexión';
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.message.includes('HTTP 409')) {
          errorTitle = 'Plantilla duplicada';
          errorMessage = 'Ya existe una plantilla con ese nombre. Por favor, usa un nombre diferente.';
        } else if (error.message.includes('HTTP 401')) {
          errorTitle = 'Sin permisos';
          errorMessage = 'No tienes permisos para crear plantillas.';
        }
        
        const errorResult = await mostrarErrorGuardado({
          title: errorTitle,
          message: errorMessage,
          errorDetails: `${error.message}\n\nStack trace:\n${error.stack}`,
          primaryButtonText: 'Reintentar',
          secondaryButtonText: 'Cancelar'
        });
        
        if (errorResult.retry) {
          // ⬇️ Reintentar haciendo click en el botón
          document.getElementById("guardar-dieta-btn").click();
        }
        
        // ⬇️ Si no reintenta, NO hacer nada más (el flujo se detiene aquí)
      }
    }
    
    // ⬇️ Si el usuario canceló la confirmación, NO hacer nada
  });
});