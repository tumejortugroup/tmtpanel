import { formatearFecha } from "/src/user/modules/utils/formatearFecha.js";
import { mostrarConfirmacionGuardado } from "/src/skeleton/skeletonConfirm.js";
import { mostrarErrorGuardado } from "/src/skeleton/skeletonError.js";

export async function cargarPlantillasCentro() {
  const token = localStorage.getItem("token");
  const centro_id = localStorage.getItem("centro_id");

  if (!token || !centro_id) {
    console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
    return;
  }

  const endpoint = `https://my.tumejortugroup.com/api/v1/plantillas/centro?id=${centro_id}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`❌ Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const plantillas = await response.json();

    const tbody = document.querySelector("tbody");
    if (!tbody) {
      console.warn("⚠️ No se encontró el <tbody> en el DOM.");
      return;
    }

    tbody.innerHTML = ""; // Limpiamos antes de insertar

    if (plantillas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-muted py-4">
            No hay plantillas creadas todavía
          </td>
        </tr>
      `;
      return;
    }

    plantillas.forEach(plantilla => {
      const rowHTML = `
        <tr>
          <td class="text-truncate">${plantilla.nombre}</td>
          <td class="text-truncate">${formatearFecha(plantilla.fecha_creacion)}</td>
          <td>
            <div class="flex align-items-center list-user-action justify-content-center">
              <div class="dropdown">
                <button class="btn btn-sm btn-icon" type="button" id="dropdownMenuButton${plantilla.id_plantilla}" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${plantilla.id_plantilla}">
                  <li><a class="dropdown-item" href="/dashboard/dietas/updatePlantilla.html?id=${plantilla.id_plantilla}">Editar</a></li>
                  <li><a class="dropdown-item eliminar-plantilla" href="#" data-id="${plantilla.id_plantilla}" data-nombre="${plantilla.nombre}">Eliminar</a></li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", rowHTML);
    });

    // ⬇️ Event listener CORREGIDO - ahora pasa ambos parámetros
    document.querySelectorAll('.eliminar-plantilla').forEach(btn => {
      btn.addEventListener('click', async function(e) {
        e.preventDefault();
        const idPlantilla = this.getAttribute('data-id');
        const nombrePlantilla = this.getAttribute('data-nombre');
        
        // ⬇️ Llamar a la función con ambos parámetros
        await eliminarPlantilla(idPlantilla, nombrePlantilla);
      });
    });

  } catch (error) {
    console.error("❌ Error al cargar las plantillas:", error.message);
    
    await mostrarErrorGuardado({
      title: 'Error al cargar plantillas',
      message: 'No se pudieron cargar las plantillas del centro.',
      errorDetails: error.stack,
      primaryButtonText: 'Reintentar',
      secondaryButtonText: null
    });
  }
}

async function eliminarPlantilla(idPlantilla, nombrePlantilla) {
  // Mostrar confirmación de eliminación
  const result = await mostrarConfirmacionGuardado({
    title: 'Eliminar plantilla',
    message: `¿Estás seguro de que quieres eliminar la plantilla "${nombrePlantilla}"? Esta acción no se puede deshacer.`,
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar'
  });

  if (!result.confirmed) {
    return; // Usuario canceló
  }

  const { progressController } = result;
  const token = localStorage.getItem("token");
  
  if (!token) {
    progressController.close();
    
    await mostrarErrorGuardado({
      title: 'Error de autenticación',
      message: 'No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.',
      primaryButtonText: 'Reintentar',
      secondaryButtonText: null
    });
    return;
  }

  const endpoint = `https://my.tumejortugroup.com/api/v1/plantillas/${idPlantilla}`;
  
  try {
    progressController.updateProgress(50);
    
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "No se pudo eliminar la plantilla.";
      
      if (response.status === 404) {
        errorMessage = "La plantilla no existe o ya fue eliminada.";
      } else if (response.status === 401) {
        errorMessage = "No tienes permisos para eliminar esta plantilla.";
      } else if (response.status === 403) {
        errorMessage = "No tienes autorización para eliminar esta plantilla.";
      } else if (response.status === 500) {
        errorMessage = "Error interno del servidor. Inténtalo más tarde.";
      }

      progressController.close();

      const errorResult = await mostrarErrorGuardado({
        title: 'Error al eliminar',
        message: errorMessage,
        errorDetails: `Error ${response.status}: ${response.statusText}\n\nRespuesta:\n${errorText}`,
        primaryButtonText: 'Reintentar',
        secondaryButtonText: null
      });

      if (errorResult.retry) {
        await eliminarPlantilla(idPlantilla, nombrePlantilla);
      }
      return;
    }

    progressController.updateProgress(100);
    
    console.log(`✅ Plantilla "${nombrePlantilla}" eliminada correctamente`);
    
    progressController.complete();
    
    // Recargar la lista después de eliminar
    setTimeout(async () => {
      await cargarPlantillasCentro();
    }, 1000);
    
  } catch (error) {
    progressController.close();
    
    console.error("❌ Error al eliminar la plantilla:", error);
    
    const errorResult = await mostrarErrorGuardado({
      title: 'Error de conexión',
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      errorDetails: `${error.message}\n\n${error.stack}`,
      primaryButtonText: 'Reintentar',
      secondaryButtonText: null
    });

    if (errorResult.retry) {
      await eliminarPlantilla(idPlantilla, nombrePlantilla);
    }
  }
}