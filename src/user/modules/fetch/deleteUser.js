import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export function initDeleteUser() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (e) => {
        // Buscar si el click fue en el botón eliminar o dentro de él
        const btn = e.target.closest('.btn-eliminar');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation(); // Evitar que se propague y cierre el dropdown

        const userId = btn.getAttribute('data-id');
        const nombre = btn.getAttribute('data-nombre');
        
        if (!userId) {
            await mostrarErrorGuardado({
                title: 'Error de datos',
                message: 'ID de usuario no válido. No se puede proceder con la eliminación.',
                primaryButtonText: 'Entendido',
                showDetails: false
            });
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            await mostrarErrorGuardado({
                title: 'Error de autenticación',
                message: 'Token de autenticación no encontrado. Por favor, inicia sesión nuevamente.',
                primaryButtonText: 'Entendido',
                showDetails: false
            });
            return;
        }

        // Mostrar confirmación antes de eliminar
        const result = await mostrarConfirmacionGuardado({
            title: '¿Eliminar usuario?',
            message: `¿Estás seguro de eliminar permanentemente al usuario "${nombre}"? Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar'
        });

        if (result.confirmed) {
            const { progressController } = result;

            try {
                // Actualizar progreso
                progressController.updateProgress(50);

                const deleteRes = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                progressController.updateProgress(80);

                if (!deleteRes.ok) {
                    // Cerrar progress y mostrar error específico
                    progressController.close();
                    
                    const error = await deleteRes.json();
                    let errorMessage = 'No se pudo eliminar el usuario.';
                    
                    // Personalizar mensaje según el código de error
                    if (deleteRes.status === 404) {
                        errorMessage = 'El usuario no existe o ya fue eliminado.';
                    } else if (deleteRes.status === 403) {
                        errorMessage = 'No tienes permisos para eliminar este usuario.';
                    } else if (deleteRes.status === 409) {
                        errorMessage = 'No se puede eliminar el usuario porque tiene datos asociados.';
                    } else if (deleteRes.status === 500) {
                        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
                    }

                    const errorResult = await mostrarErrorGuardado({
                        title: 'Error al eliminar usuario',
                        message: errorMessage,
                        errorDetails: `Error ${deleteRes.status}: ${deleteRes.statusText}\n\nRespuesta del servidor:\n${JSON.stringify(error, null, 2)}`,
                        primaryButtonText: 'Reintentar',
                        secondaryButtonText: 'Cancelar'
                    });

                    if (errorResult.retry) {
                        // Reintentar la eliminación
                        btn.click();
                    }
                    return;
                }

                // Completar progreso
                progressController.updateProgress(100);

                // Cerrar el dropdown manualmente antes de eliminar la fila
                const dropdown = btn.closest('.dropdown');
                if (dropdown) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.querySelector('[data-bs-toggle="dropdown"]'));
                    if (bsDropdown) bsDropdown.hide();
                }

                // Eliminar la fila de la tabla
                btn.closest('tr').remove();

                // Mostrar éxito
                progressController.complete();

            } catch (err) {
                progressController.close();
                
                // Error de red o conexión
                const errorResult = await mostrarErrorGuardado({
                    title: 'Error de conexión',
                    message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
                    errorDetails: `Error de red: ${err.message}\n\nStack trace:\n${err.stack}`,
                    primaryButtonText: 'Reintentar',
                    secondaryButtonText: 'Cancelar'
                });

                if (errorResult.retry) {
                    // Reintentar la eliminación
                    btn.click();
                }
            }
        }
    });
}