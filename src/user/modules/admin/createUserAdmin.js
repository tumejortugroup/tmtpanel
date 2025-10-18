import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export function initCreateUserFormAdmin() {
    const form = document.getElementById("userForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        event.stopPropagation();

        const token = localStorage.getItem("token");
        
        if (!token) {
            await mostrarErrorGuardado({
                title: 'Error de autenticación',
                message: 'No se encontró el token de autenticación. Por favor, vuelve a iniciar sesión.',
                primaryButtonText: 'Entendido',
                showDetails: false
            });
            return;
        }

        const idCentro = document.getElementById("centro").value;
        if (!idCentro) {
            await mostrarErrorGuardado({
                title: 'Centro requerido',
                message: 'Debes seleccionar un centro para el nuevo usuario antes de continuar.',
                primaryButtonText: 'Entendido',
                showDetails: false
            });
            return;
        }

        // Validar campos obligatorios
        const camposObligatorios = [
            { id: 'fname', nombre: 'Nombre' },
            { id: 'lname', nombre: 'Apellidos' },
            { id: 'email', nombre: 'Correo electrónico' },
           
        ];

        const camposFaltantes = camposObligatorios.filter(campo => {
            const valor = document.getElementById(campo.id).value.trim();
            return !valor;
        });

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

        const formData = {
            nombre: document.getElementById("fname").value,
            apellidos: document.getElementById("lname").value,
            telefono: document.getElementById("mobno").value,
            correo: document.getElementById("email").value,
            fecha_de_nacimiento: document.getElementById("birthday").value,
            rol: document.querySelector("[name='role']").value,
            direccion: document.getElementById("add1").value,
            ciudad: document.getElementById("city").value,
            id_centro: idCentro, 
            password: document.getElementById("pass").value,
            estado: document.getElementById("estado").value
        };

        // Mostrar confirmación antes de crear
        const result = await mostrarConfirmacionGuardado({
            title: '¿Crear usuario?',
            message: `¿Estás seguro de crear el usuario ${formData.nombre} ${formData.apellidos}?`,
            confirmText: 'Crear usuario',
            cancelText: 'Cancelar'
        });

        if (result.confirmed) {
            const { progressController } = result;

            try {
                // Progreso inicial
                progressController.updateProgress(30);

                const response = await fetch("https://my.tumejortugroup.com/api/v1/usuarios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                progressController.updateProgress(70);

                if (response.ok) {
                    progressController.updateProgress(100);
                    
                    // Mostrar éxito y redirigir
                    progressController.complete();
                    
                    // Esperar un poco antes de redirigir
                    setTimeout(() => {
                        window.location.href = "/dashboard/index.html";
                    }, 2000);

                } else {
                    // Cerrar progress y mostrar error específico
                    progressController.close();
                    
                    const errorText = await response.text();
                    let errorMessage = "Hubo un problema al crear el usuario.";
                    
                    // Personalizar mensaje según el código de error
                    if (response.status === 400) {
                        errorMessage = "Los datos enviados no son válidos. Revisa la información ingresada.";
                    } else if (response.status === 409) {
                        errorMessage = "Ya existe un usuario con ese correo electrónico.";
                    } else if (response.status === 401) {
                        errorMessage = "No tienes permisos para crear usuarios.";
                    } else if (response.status === 500) {
                        errorMessage = "Error interno del servidor. Inténtalo más tarde.";
                    }

                    const errorResult = await mostrarErrorGuardado({
                        title: 'Error al crear usuario',
                        message: errorMessage,
                        errorDetails: `Error ${response.status}: ${response.statusText}\n\nRespuesta del servidor:\n${errorText}`,
                        primaryButtonText: 'Reintentar',
                        secondaryButtonText: 'Cancelar'
                    });

                    if (errorResult.retry) {
                        // Reintentar la creación
                        form.dispatchEvent(new Event('submit'));
                    }
                }

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
                    // Reintentar la creación
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }
    });
}