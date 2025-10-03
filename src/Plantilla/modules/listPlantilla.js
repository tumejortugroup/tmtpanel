import { formatearFecha } from "/src/user/modules/utils/formatearFecha.js";

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

    console.log(`✅ ${plantillas.length} plantillas cargadas en la tabla`);

    // Event listener para eliminar plantillas
    document.querySelectorAll('.eliminar-plantilla').forEach(btn => {
      btn.addEventListener('click', async function(e) {
        e.preventDefault();
        const idPlantilla = this.getAttribute('data-id');
        const nombrePlantilla = this.getAttribute('data-nombre');
        
        if (confirm(`¿Estás seguro de eliminar la plantilla "${nombrePlantilla}"?`)) {
          await eliminarPlantilla(idPlantilla);
        }
      });
    });

  } catch (error) {
    console.error("❌ Error al cargar las plantillas:", error.message);
  }
}

async function eliminarPlantilla(idPlantilla) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.warn("⚠️ No se encontró el token en localStorage.");
    return;
  }

  const endpoint = `https://my.tumejortugroup.com/api/v1/plantillas/${idPlantilla}`;
  
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`❌ Error HTTP: ${response.status} - ${response.statusText}`);
    }

    console.log("✅ Plantilla eliminada correctamente");
    
    // Recargar la lista de plantillas
    await cargarPlantillasCentro();
    
  } catch (error) {
    console.error("❌ Error al eliminar la plantilla:", error.message);
    alert("Error al eliminar la plantilla. Por favor, intenta de nuevo.");
  }
}