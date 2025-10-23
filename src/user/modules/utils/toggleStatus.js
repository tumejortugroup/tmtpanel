import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export function toggleStatus() {
    const table = document.querySelector('table');
    if (!table) return;

    table.addEventListener('click', async (e) => {
        const badge = e.target.closest('.badge-estado');
        if (!badge) return;

        e.preventDefault();

        const nombre = badge.getAttribute('data-nombre');
        if (!nombre) {
            await mostrarErrorGuardado({
                title: 'Error de datos',
                message: 'Nombre de usuario no válido. No se puede proceder con el cambio de estado.',
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

        const estadoActual = badge.textContent.trim().toLowerCase();
        const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';

        // Mostrar confirmación antes de cambiar estado
        const result = await mostrarConfirmacionGuardado({
            title: 'Cambiar estado de usuario',
            message: `¿Estás seguro de cambiar el estado de "${nombre}" a ${nuevoEstado}?`,
            confirmText: 'Cambiar estado',
            cancelText: 'Cancelar'
        });

        if (result.confirmed) {
            const { progressController } = result;

            try {

                progressController.updateProgress(25);

   
                const res = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/nombre/${encodeURIComponent(nombre)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                progressController.updateProgress(50);

                if (!res.ok) {
                    progressController.close();
                    
                    let errorMessage = 'Usuario no encontrado en el sistema.';
                    if (res.status === 404) {
                        errorMessage = 'El usuario no existe o fue eliminado.';
                    } else if (res.status === 403) {
                        errorMessage = 'No tienes permisos para consultar este usuario.';
                    }

                    const errorResult = await mostrarErrorGuardado({
                        title: 'Error al buscar usuario',
                        message: errorMessage,
                        errorDetails: `Error ${res.status}: ${res.statusText}`,
                        primaryButtonText: 'Reintentar',
                        secondaryButtonText: 'Cancelar'
                    });

                    if (errorResult.retry) {
                        badge.click();
                    }
                    return;
                }

                const data = await res.json();
                const userId = data.id_usuario;

                progressController.updateProgress(75);


                const patchRes = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${userId}/inactivar`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!patchRes.ok) {
                    progressController.close();
                    
                    let errorMessage = 'No se pudo cambiar el estado del usuario.';
                    if (patchRes.status === 403) {
                        errorMessage = 'No tienes permisos para cambiar el estado de este usuario.';
                    } else if (patchRes.status === 409) {
                        errorMessage = 'No se puede cambiar el estado del usuario debido a restricciones del sistema.';
                    } else if (patchRes.status === 500) {
                        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
                    }

                    const errorResult = await mostrarErrorGuardado({
                        title: 'Error al cambiar estado',
                        message: errorMessage,
                        errorDetails: `Error ${patchRes.status}: ${patchRes.statusText}`,
                        primaryButtonText: 'Reintentar',
                        secondaryButtonText: 'Cancelar'
                    });

                    if (errorResult.retry) {
                        badge.click();
                    }
                    return;
                }

                progressController.updateProgress(100);

                
                const estadoCapitalizado = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1);
                badge.textContent = estadoCapitalizado;
                badge.classList.toggle('bg-success');
                badge.classList.toggle('bg-secondary');

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
                    badge.click();
                }
            }
        }
    });
}