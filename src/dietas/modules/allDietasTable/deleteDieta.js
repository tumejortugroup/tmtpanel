import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

/**
 * initDeleteDieta()
 * -----------------
 * Inicializa la lógica de eliminación de dietas en la tabla de usuarios.
 *
 * Flujo:
 * - Escucha clicks delegados en el `<table>`, buscando el botón `.btn-eliminar-dieta` o `.btn-eliminar`.
 * - Verifica que el usuario haya seleccionado una dieta en el `<select>`.
 * - Solicita confirmación con skeleton antes de proceder.
 * - Llama a la API (`DELETE /dietas/:id`) con el token almacenado.
 * - Si la eliminación es exitosa:
 *    - Elimina la opción del `<select>`.
 *    - Limpia las celdas de nombre y fecha asociadas.
 *    - Recarga la página para reflejar el estado actualizado.
 *
 * Consideraciones:
 * - Maneja la ausencia de tabla, botón, select o token sin romper la ejecución.
 * - Usa skeletons para confirmación y manejo de errores.
 * - Si falla la petición, permite reintentar.
 */

export function initDeleteDieta() {
  const table = document.querySelector('table');
  if (!table) return;

  table.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-eliminar-dieta') || e.target.closest('.btn-eliminar');
    if (!btn) return;

    e.preventDefault();

    const row = btn.closest('tr');
    const select = row.querySelector('select[name="select-dieta"]');
    const selectedOption = select?.selectedOptions[0];

    if (!selectedOption) {
      await mostrarErrorGuardado({
        title: 'Dieta no seleccionada',
        message: 'Por favor, selecciona una dieta antes de intentar eliminarla.',
        primaryButtonText: 'Entendido',
        showDetails: false
      });
      return;
    }

    const nombreDieta = selectedOption.textContent;
    const idDieta = selectedOption.value;

    // Llamar a la función de eliminación con manejo de errores
    await eliminarDieta(idDieta, nombreDieta, row, selectedOption);
  });
}

async function eliminarDieta(idDieta, nombreDieta, row, selectedOption) {
  // Mostrar confirmación de eliminación
  const result = await mostrarConfirmacionGuardado({
    title: '¿Eliminar dieta?',
    message: `¿Estás seguro de que quieres eliminar la dieta "${nombreDieta}"? Esta acción no se puede deshacer.`,
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar'
  });

  if (!result.confirmed) {
    return; // Usuario canceló
  }

  const { progressController } = result;
  const token = localStorage.getItem('token');

  if (!token) {
    progressController.close();
    
    await mostrarErrorGuardado({
      title: 'Error de autenticación',
      message: 'No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.',
      primaryButtonText: 'Ir a login',
      secondaryButtonText: null
    });
    return;
  }

  try {
    progressController.updateProgress(50);

    const res = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/${idDieta}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = "No se pudo eliminar la dieta.";
      
      if (res.status === 404) {
        errorMessage = "La dieta no existe o ya fue eliminada.";
      } else if (res.status === 401) {
        errorMessage = "No tienes permisos para eliminar esta dieta.";
      } else if (res.status === 403) {
        errorMessage = "No tienes autorización para eliminar esta dieta.";
      } else if (res.status === 500) {
        errorMessage = "Error interno del servidor. Inténtalo más tarde.";
      }

      progressController.close();

      const errorResult = await mostrarErrorGuardado({
        title: 'Error al eliminar',
        message: errorMessage,
        errorDetails: `Error ${res.status}: ${res.statusText}\n\nRespuesta:\n${errorText}`,
        primaryButtonText: 'Reintentar',
        secondaryButtonText: null
      });

      if (errorResult.retry) {
        await eliminarDieta(idDieta, nombreDieta, row, selectedOption);
      }
      return;
    }

    progressController.updateProgress(100);

    console.log(`✅ Dieta "${nombreDieta}" eliminada correctamente`);

    // Quitar la opción del select
    selectedOption.remove();

    // Limpiar nombre y fecha de dato
    const nombreTd = row.querySelector('.nombre-dato');
    const fechaTd = row.querySelector('.fecha-dato');
    if (nombreTd) nombreTd.textContent = '—';
    if (fechaTd) fechaTd.textContent = '—';

    progressController.complete();

    // Recargar después de un pequeño delay
    setTimeout(() => {
      location.reload();
    }, 1000);

  } catch (error) {
    progressController.close();

    console.error('❌ Error al eliminar dieta:', error);

    const errorResult = await mostrarErrorGuardado({
      title: 'Error de conexión',
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      errorDetails: `${error.message}\n\n${error.stack}`,
      primaryButtonText: 'Reintentar',
      secondaryButtonText: null
    });

    if (errorResult.retry) {
      await eliminarDieta(idDieta, nombreDieta, row, selectedOption);
    }
  }
}