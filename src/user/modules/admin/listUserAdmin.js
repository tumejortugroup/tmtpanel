import { formatearFecha } from "/src/user/modules/utils/formatearFecha.js";
export async function listClientes() {
    const token = localStorage.getItem("token");
    const centro_id = localStorage.getItem("centro_id");

    

    if (!token || !centro_id) {
        console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
        return;
    }


  const endpoint = `https://my.tumejortugroup.com/api/v1/usuarios/clientes`;
    

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`❌ Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const usuarios = await response.json();
   

        const tbody = document.querySelector("tbody");
        if (!tbody) {
            console.warn("⚠️ No se encontró el <tbody> en el DOM.");
            return;
        }

        tbody.innerHTML = ""; // Limpiamos antes de insertar

        usuarios.forEach(usuario => {
            const rowHTML = `
                <tr>
                    <td>${usuario.centro}</td>
                    <td>
                        <span class="badge ${usuario.estado?.toLowerCase() === 'activo' ? 'bg-success' : 'bg-secondary'} badge-estado" data-nombre="${usuario.nombre}">
                            ${usuario.estado}
                        </span>

                    </td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.telefono}</td>
                    <td>${formatearFecha(usuario.fecha_creacion)}</td>
                    
                  
                    
                    
                      <td>
                        <div class="flex align-items-center list-user-action justify-content-center">
            <div class="dropdown">
              <button class="btn btn-sm btn-icon" type="button" id="dropdownMenuButton${usuario.id_usuario}" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${usuario.id_usuario}">
                <li><a class="dropdown-item" href="/dashboard/user/user-update.html?id=${usuario.id_usuario}">Editar</a></li>
                <li><a class="dropdown-item" href="#" data-nombre="${usuario.nombre}">Eliminar</a></li>
              </ul>
            </div>
          </div>
                    </td>
                    
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", rowHTML);
        });

    } catch (error) {
        console.error("❌ Error al cargar los usuarios:", error.message);
    }
}
