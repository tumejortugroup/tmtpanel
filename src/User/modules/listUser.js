export async function initUserList() {
    try {
        const response = await fetch("http://localhost:9000/api/v1/usuarios/centro", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const usuarios = await response.json();
        console.log("Usuarios recibidos:", usuarios);

        const tbody = document.querySelector("tbody");
        if (!tbody) {
            console.warn("No se encontró el <tbody> en el DOM.");
            return;
        }

        tbody.innerHTML = "";

        usuarios.forEach(usuario => {
            const row = `
                <tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.nombre_centro ?? 'Sin Centro'}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.rol}</td>
                    <td><span class="badge bg-success">${usuario.estado}</span></td>
                    <td>${usuario.fecha_creacion}</td>
                    <td>
                        <div class="flex align-items-center list-user-action">
                            <a class="btn btn-sm btn-icon btn-warning" data-bs-toggle="tooltip" title="Editar" href="#">
                                <span class="btn-inner">✏️</span>
                            </a>
                            <a class="btn btn-sm btn-icon btn-danger" data-bs-toggle="tooltip" title="Eliminar" href="#">
                                <span class="btn-inner">🗑️</span>
                            </a>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", row);
        });

    } catch (error) {
        console.error("Error al cargar los usuarios:", error);
    }
}
