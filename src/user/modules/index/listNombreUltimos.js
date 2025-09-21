import { formatearFecha } from "/src/user/modules/utils/formatearFecha.js";

export async function listUsuariosUltimos() {
    const token = localStorage.getItem("token");
    const centro_id = localStorage.getItem("centro_id");

    if (!token || !centro_id) {
        console.warn("⚠️ Faltan datos en localStorage.");
        return;
    }

    const endpoint = `https://my.tumejortugroup.com/api/v1/usuarios/centro/ultimos?id=${centro_id}`;

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
        console.table(usuarios);

 
        const tbody = document.querySelector("#basic-table tbody");
        if (!tbody) {
            console.warn("⚠️ No se encontró el <tbody> dentro de #basic-table");
            return;
        }

        tbody.innerHTML = ""; 

        usuarios.forEach((usuario, index) => {
            const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`;
            const fecha = usuario.fecha_creacion
                ? formatearFecha(usuario.fecha_creacion)
                : "Sin fecha";

            const rowHTML = `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <!-- Icono -->
                            <div class="pe-3">
                            <div class="iq-media-group iq-media-group-1">
                                <a href="#" class="iq-media-1">
                                <div class="icon iq-icon-box-3 rounded-pill">
                                    ${usuario.nombre.charAt(0)}
                                </div>
                                </a>
                            </div>
                            </div>
                            <!-- Nombre -->
                            <div>
                            <h6 class="mb-1">${nombreCompleto}</h6>
                            </div>
                        </div>
                    </td>
                    
                    <td>${fecha}</td>
                </tr>
            `;

            tbody.insertAdjacentHTML("beforeend", rowHTML);
        });

    } catch (error) {
        console.error("❌ Error al cargar los usuarios:", error.message);
    }
}
