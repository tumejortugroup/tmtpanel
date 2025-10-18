// modules/deleteCentro.js
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export function initDeleteCentro() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-eliminar-centro");
    if (!btn) return;

    e.preventDefault();

    const id = btn.dataset.id;
    const nombre = btn.dataset.nombre;

    if (!id) {
      await mostrarErrorGuardado({
        title: 'Error de datos',
        message: 'ID de centro no válido. No se puede proceder con la eliminación.',
        primaryButtonText: 'Entendido',
        secondaryButtonText: null
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      await mostrarErrorGuardado({
        title: 'Error de autenticación',
        message: 'Token de autenticación no encontrado. Por favor, inicia sesión nuevamente.',
        primaryButtonText: 'Entendido',
        secondaryButtonText: null
      });
      return;
    }

    // Mostrar confirmación antes de eliminar
    const result = await mostrarConfirmacionGuardado({
      title: '¿Eliminar centro?',
      message: `¿Estás seguro de eliminar permanentemente el centro "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar'
    });

    if (result.confirmed) {
      const { progressController } = result;

      try {
        progressController.updateProgress(50);

        const res = await fetch(`https://my.tumejortugroup.com/api/v1/centros/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        progressController.updateProgress(80);

        if (!res.ok) {
          progressController.close();

          const errorText = await res.text();
          let errorMessage = 'No se pudo eliminar el centro.';

          // Personalizar mensaje según el código de error
          if (res.status === 404) {
            errorMessage = 'El centro no existe o ya fue eliminado.';
          } else if (res.status === 403) {
            errorMessage = 'No tienes permisos para eliminar este centro.';
          } else if (res.status === 409) {
            errorMessage = 'No se puede eliminar el centro porque tiene datos asociados (usuarios, dietas, etc.).';
          } else if (res.status === 500) {
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
          }

          const errorResult = await mostrarErrorGuardado({
            title: 'Error al eliminar centro',
            message: errorMessage,
            errorDetails: `Error ${res.status}: ${res.statusText}\n\nRespuesta del servidor:\n${errorText}`,
            primaryButtonText: 'Reintentar',
            secondaryButtonText: null
          });

          if (errorResult.retry) {
            btn.click();
          }
          return;
        }

        // Completar progreso
        progressController.updateProgress(100);

        // Cerrar el dropdown manualmente antes de eliminar la fila
        const dropdown = btn.closest('.dropdown');
        if (dropdown) {
          const bsDropdown = bootstrap?.Dropdown?.getInstance(dropdown.querySelector('[data-bs-toggle="dropdown"]'));
          if (bsDropdown) bsDropdown.hide();
        }

        // Eliminar la fila de la tabla
        btn.closest('tr').remove();

        // Mostrar éxito
        progressController.complete();

        console.log(`✅ Centro "${nombre}" eliminado correctamente`);

      } catch (err) {
        progressController.close();

        console.error("❌ Error en la petición DELETE:", err);

        const errorResult = await mostrarErrorGuardado({
          title: 'Error de conexión',
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
          errorDetails: `Error de red: ${err.message}\n\nStack trace:\n${err.stack}`,
          primaryButtonText: 'Reintentar',
          secondaryButtonText: null
        });

        if (errorResult.retry) {
          btn.click();
        }
      }
    }
  });
}