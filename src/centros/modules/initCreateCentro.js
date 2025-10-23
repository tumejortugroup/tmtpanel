// modules/createCentro.js
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export function initCreateCentroForm() {
  const form = document.getElementById("userForm");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      await mostrarErrorGuardado({
        title: 'Error de autenticación',
        message: 'No tienes sesión iniciada. Por favor, inicia sesión nuevamente.',
        primaryButtonText: 'Ir a login',
        secondaryButtonText: null
      });
      return;
    }

    // Validar campos obligatorios
    const camposObligatorios = [
      { id: 'nombrec', nombre: 'Nombre del centro' },
      { id: 'direccionc', nombre: 'Dirección' },
      { id: 'correoC', nombre: 'Correo electrónico' },
      { id: 'telefonoC', nombre: 'Teléfono' }
    ];

    const camposFaltantes = camposObligatorios.filter(campo => {
      const valor = document.getElementById(campo.id)?.value.trim();
      return !valor;
    });

    if (camposFaltantes.length > 0) {
      const listaCampos = camposFaltantes.map(c => c.nombre).join(', ');
      await mostrarErrorGuardado({
        title: 'Campos obligatorios',
        message: `Por favor, completa los siguientes campos obligatorios: ${listaCampos}`,
        primaryButtonText: 'Entendido',
        secondaryButtonText: null
      });
      return;
    }

    // Capturamos los datos del formulario
    const formData = {
      nombre: document.getElementById("nombrec").value,
      direccion: document.getElementById("direccionc").value,
      correo: document.getElementById("correoC").value,
      telefono: document.getElementById("telefonoC").value,
      ciudad: document.getElementById("ciudadc").value,
      nombre_fiscal: document.getElementById("nombrefc").value,
      NIF: document.getElementById("nifc").value,
      codigo_postal: document.getElementById("cpostal").value,
      pais: document.getElementById("paisc").value
    };

    // Mostrar confirmación antes de crear
    const result = await mostrarConfirmacionGuardado({
      title: 'Crear centro',
      message: `¿Estás seguro de crear el centro "${formData.nombre}"?`,
      confirmText: 'Crear centro',
      cancelText: 'Cancelar'
    });

    if (result.confirmed) {
      const { progressController } = result;

      try {
        progressController.updateProgress(30);

        const response = await fetch("https://my.tumejortugroup.com/api/v1/centros", {
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
  
  // Esperar 300ms antes de mostrar el check
  await new Promise(resolve => setTimeout(resolve, 300));
  
  progressController.complete();

  // Esperar 2 segundos para ver el check
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  window.location.href = "/dashboard/index.html";
} else {
          progressController.close();

          const errorText = await response.text();
          let errorMessage = "Hubo un problema al crear el centro.";

          // Personalizar mensaje según el código de error
          if (response.status === 400) {
            errorMessage = "Los datos enviados no son válidos. Revisa la información ingresada.";
          } else if (response.status === 409) {
            errorMessage = "Ya existe un centro con ese nombre, NIF o correo electrónico.";
          } else if (response.status === 401) {
            errorMessage = "No tienes permisos para crear centros.";
          } else if (response.status === 500) {
            errorMessage = "Error interno del servidor. Inténtalo más tarde.";
          }

          const errorResult = await mostrarErrorGuardado({
            title: 'Error al crear centro',
            message: errorMessage,
            errorDetails: `Error ${response.status}: ${response.statusText}\n\nRespuesta del servidor:\n${errorText}`,
            primaryButtonText: 'Reintentar',
            secondaryButtonText: null
          });

          if (errorResult.retry) {
            form.dispatchEvent(new Event('submit'));
          }
        }

      } catch (error) {
        progressController.close();

        console.error("❌ Error en la solicitud:", error);

        const errorResult = await mostrarErrorGuardado({
          title: 'Error de conexión',
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
          errorDetails: `Error de red: ${error.message}\n\nStack trace:\n${error.stack}`,
          primaryButtonText: 'Reintentar',
          secondaryButtonText: null
        });

        if (errorResult.retry) {
          form.dispatchEvent(new Event('submit'));
        }
      }
    }
  });
}