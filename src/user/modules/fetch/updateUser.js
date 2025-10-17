
// updateUser.js modificado
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export async function actualizarUsuario(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        await mostrarErrorGuardado({
            title: 'Error de autenticación',
            message: 'Token no disponible. El usuario no está autenticado. Por favor, inicia sesión nuevamente.',
            primaryButtonText: 'Entendido',
            showDetails: false
        });
        return;
    }

    const data = {
        nombre: document.getElementById('fname')?.value.trim(),
        apellidos: document.getElementById('lname')?.value.trim(),
        telefono: document.getElementById('mobno')?.value.trim(),
        correo: document.getElementById('email')?.value.trim(),
        direccion: document.getElementById('add1')?.value.trim(),
        ciudad: document.getElementById('city')?.value.trim(),
        fecha_nacimiento: document.getElementById('birthday')?.value,
        rol: document.getElementById('role')?.value || 'Cliente',
        estado: document.getElementById('estado')?.value || 'activo'
    };

    // Validar campos obligatorios
    const camposObligatorios = [
        { campo: 'nombre', nombre: 'Nombre' },
        { campo: 'apellidos', nombre: 'Apellidos' },
        { campo: 'telefono', nombre: 'Teléfono' },
        { campo: 'correo', nombre: 'Correo electrónico' }
    ];

    const camposFaltantes = camposObligatorios.filter(({ campo }) => !data[campo]);

    if (camposFaltantes.length > 0) {
        const listaCampos = camposFaltantes.map(c => c.nombre).join(', ');
        await mostrarErrorGuardado({
            title: 'Campos obligatorios',
            message: `Por favor, completa los siguientes campos obligatorios: ${listaCampos}`,
            primaryButtonText: 'Entendido',
            showDetails: false
        });
        return;
    }

    // Mostrar confirmación antes de actualizar
    const result = await mostrarConfirmacionGuardado({
        title: '¿Actualizar usuario?',
        message: `¿Estás seguro de actualizar la información del usuario ${data.nombre} ${data.apellidos}?`,
        confirmText: 'Actualizar',
        cancelText: 'Cancelar'
    });

    if (result.confirmed) {
        const { progressController } = result;

        try {
            // Progreso inicial
            progressController.updateProgress(30);

            const response = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            progressController.updateProgress(70);

            if (!response.ok) {
                // Cerrar progress y mostrar error específico
                progressController.close();
                
                const error = await response.json();
                let errorMessage = "No se pudo actualizar el usuario.";
                
                // Personalizar mensaje según el código de error
                if (response.status === 400) {
                    errorMessage = "Los datos enviados no son válidos. Revisa la información ingresada.";
                } else if (response.status === 404) {
                    errorMessage = "El usuario no existe o fue eliminado.";
                } else if (response.status === 409) {
                    errorMessage = "Ya existe otro usuario con ese correo electrónico.";
                } else if (response.status === 401 || response.status === 403) {
                    errorMessage = "No tienes permisos para actualizar este usuario.";
                } else if (response.status === 500) {
                    errorMessage = "Error interno del servidor. Inténtalo más tarde.";
                }

                const errorResult = await mostrarErrorGuardado({
                    title: 'Error al actualizar usuario',
                    message: errorMessage,
                    errorDetails: `Error ${response.status}: ${response.statusText}\n\nRespuesta del servidor:\n${JSON.stringify(error, null, 2)}`,
                    primaryButtonText: 'Reintentar',
                    secondaryButtonText: 'Cancelar'
                });

                if (errorResult.retry) {
                    // Reintentar la actualización
                    await actualizarUsuario(id);
                }
                return;
            }

            const result = await response.json();
            progressController.updateProgress(100);

            // Mostrar éxito
            progressController.complete();

      
             setTimeout(() => {
               window.location.href = '/dashboard/index.html';
             }, 2000);
            
        } catch (error) {
            progressController.close();
            
            // Error de red o conexión
            const errorResult = await mostrarErrorGuardado({
                title: 'Error de conexión',
                message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
                errorDetails: `Error de red: ${error.message}\n\nStack trace:\n${error.stack}`,
                primaryButtonText: 'Reintentar',
                secondaryButtonText: 'Cancelar'
            });

            if (errorResult.retry) {
                // Reintentar la actualización
                await actualizarUsuario(id);
            }
        }
    }
}