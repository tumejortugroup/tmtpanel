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
                    <td>${usuario.username}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.fecha_de_nacimiento}</td>
                    <td>${usuario.telefono}</td>
                  
                    <td>
                        <span class="badge ${usuario.estado?.toLowerCase() === 'activo' ? 'bg-success' : 'bg-secondary'} badge-estado" data-nombre="${usuario.nombre}">
                            ${usuario.estado}
                        </span>

                    </td>
                    <td>${usuario.centro}</td>
                    <td>
                        <div class="flex align-items-center list-user-action">
                            <a class="btn btn-sm btn-icon " data-bs-toggle="tooltip" title="Editar" href="/dashboard/user/user-update.html?id=${usuario.id_usuario}">
                                <span class="btn-inner">✏️</span>
                            </a>

                            <a class="btn btn-sm btn-icon  " data-nombre="${usuario.nombre}" data-bs-toggle="tooltip" title="Eliminar" href="#">
                                <span class="btn-inner">🗑️</span>
                            </a>
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
