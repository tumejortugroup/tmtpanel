export async function listUser() {
    const token = localStorage.getItem("token");
    const centro_id = localStorage.getItem("centro_id");

    console.log("🔄 Intentando cargar la lista de usuarios...");

    if (!token || !centro_id) {
        console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
        return;
    }


  const endpoint = `http://localhost:9000/api/v1/usuarios/centro`;
    console.log(`🔗 Endpoint de usuarios: ${endpoint}`);
console.log("Token:", localStorage.getItem("token"));
    console.log("Centro ID:", centro_id);
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
        console.log("✅ Usuarios recibidos:", usuarios);

        const tbody = document.querySelector("tbody");
        if (!tbody) {
            console.warn("⚠️ No se encontró el <tbody> en el DOM.");
            return;
        }

        tbody.innerHTML = ""; // Limpiamos antes de insertar

        usuarios.forEach(usuario => {
            const rowHTML = `
                <tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.nombre_centro ?? 'Sin Centro'}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <span class="badge ${usuario.estado === 'Activo' ? 'bg-success' : 'bg-secondary'} badge-estado" data-nombre="${usuario.nombre}">
                            ${usuario.estado}
                        </span>

                    </td>
                    <td>${usuario.fecha_creacion}</td>
                    <td>
                        <div class="flex align-items-center list-user-action">
                            <a class="btn btn-sm btn-icon btn-warning" data-bs-toggle="tooltip" title="Editar" href="#">
                                <span class="btn-inner">✏️</span>
                            </a>
                            <a class="btn btn-sm btn-icon btn-danger btn-eliminar" data-nombre="${usuario.nombre}" data-bs-toggle="tooltip" title="Eliminar" href="#">
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
