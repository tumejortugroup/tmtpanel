import { formatearFecha } from "/src/user/modules/utils/formatearFecha.js";

export async function listClientes() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("⚠️ No hay token en localStorage.");
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
            throw new Error(`❌ Error HTTP: ${response.status}`);
        }

        const usuarios = await response.json();
        const tbody = document.querySelector("tbody");

        if (!tbody) {
            console.warn("⚠️ No se encontró el <tbody> en el DOM.");
            return;
        }

        tbody.innerHTML = ""; // Limpiar tabla

        usuarios.forEach(usuario => {

            // ----------------------------------------
            //      HTML DE LA FILA DEL CLIENTE
            // ----------------------------------------
            const rowHTML = `
                <tr data-id-usuario="${usuario.id_usuario}">
                    <td>${usuario.centro}</td>

                    <td>
                        <span style="cursor: pointer;" 
                              class="badge ${usuario.estado?.toLowerCase() === 'activo' ? 'bg-success' : 'bg-secondary'} badge-estado"
                              data-nombre="${usuario.nombre}">
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
                                <button class="btn btn-sm btn-icon" 
                                        type="button" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>

                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item btn-editar-cliente"
                                           href="/dashboard/user/user-update.html?id=${usuario.id_usuario}">
                                           Editar
                                        </a>
                                    </li>

                                    <li>
                                        <button class="dropdown-item btn-eliminar"
                                                data-id="${usuario.id_usuario}"
                                                data-nombre="${usuario.nombre}">
                                            Eliminar
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
            `;

            // Insertar la fila en la tabla
            tbody.insertAdjacentHTML("beforeend", rowHTML);

            // Obtener la fila recién insertada
            const row = tbody.lastElementChild;

        });

    } catch (error) {
        console.error("❌ Error al cargar los clientes:", error);
    }
}
