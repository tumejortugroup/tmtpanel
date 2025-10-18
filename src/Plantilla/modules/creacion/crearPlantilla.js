import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export async function crearPlantilla() {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario");
  const id_centro = localStorage.getItem("centro_id");

  // Recuperar el valor del input
  const nombreInput = document.getElementById("nplantilla");
  const nombre = nombreInput?.value.trim();

  if (!token || !id_usuario || !id_centro) {
    await mostrarErrorGuardado({
      title: 'Datos faltantes',
      message: 'Faltan datos de autenticación (token, usuario o centro). Por favor, inicia sesión nuevamente.',
      primaryButtonText: 'Ir a login',
      secondaryButtonText: 'Cerrar'
    });
    
    throw new Error('Faltan datos de autenticación');
  }

  if (!nombre) {
    await mostrarErrorGuardado({
      title: 'Nombre requerido',
      message: 'El nombre de la plantilla es obligatorio. Por favor, ingresa un nombre.',
      primaryButtonText: 'Aceptar',
      secondaryButtonText: null
    });
    
    nombreInput?.focus();
    throw new Error('Nombre de plantilla vacío');
  }

  const payload = {
    nombre,
    id_usuario: Number(id_usuario),
    id_centro: Number(id_centro)
  };

  try {
    const res = await fetch("https://my.tumejortugroup.com/api/v1/plantillas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = "No se pudo crear la plantilla en el servidor.";
      
      if (res.status === 400) {
        errorMessage = "Los datos enviados no son válidos. Revisa la información ingresada.";
      } else if (res.status === 409) {
        errorMessage = "Ya existe una plantilla con ese nombre en tu centro.";
      } else if (res.status === 401) {
        errorMessage = "No tienes permisos para crear plantillas.";
      } else if (res.status === 500) {
        errorMessage = "Error interno del servidor. Inténtalo más tarde.";
      }

      const errorResult = await mostrarErrorGuardado({
        title: 'Error al crear plantilla',
        message: errorMessage,
        errorDetails: `Error ${res.status}: ${res.statusText}\n\nRespuesta:\n${errorText}`,
        primaryButtonText: 'Reintentar',
        secondaryButtonText: 'Cancelar'
      });

      if (errorResult.retry) {
        return await crearPlantilla();
      }
      
      throw new Error(`Error HTTP ${res.status}: ${errorMessage}`);
    }

    const result = await res.json();
    const idPlantilla = result.id;

    if (!idPlantilla) {
      await mostrarErrorGuardado({
        title: 'Error en respuesta',
        message: 'El servidor no devolvió un ID de plantilla válido.',
        errorDetails: JSON.stringify(result, null, 2),
        primaryButtonText: 'Aceptar',
        secondaryButtonText: null
      });
      
      throw new Error("No se recibió ID de la plantilla creada");
    }

    console.log("✅ Plantilla creada con ID:", idPlantilla);
    
    // ⬇️ SIMPLEMENTE DEVOLVER EL ID
    return idPlantilla;

  } catch (error) {
    console.error("❌ Error al crear la plantilla:", error);

    if (error.message.includes('HTTP') || 
        error.message.includes('autenticación') || 
        error.message.includes('vacío') ||
        error.message.includes('ID de la plantilla')) {
      throw error;
    }

    const errorResult = await mostrarErrorGuardado({
      title: 'Error de conexión',
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      errorDetails: `${error.message}\n\n${error.stack}`,
      primaryButtonText: 'Reintentar',
      secondaryButtonText: 'Cancelar'
    });

    if (errorResult.retry) {
      return await crearPlantilla();
    }

    throw error;
  }
}