export async function listCentro() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
        return;
    }


  const endpoint = `https://my.tumejortugroup.com/api/v1/centros`;
    

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

        const centros = await response.json();
   

        const tbody = document.querySelector("tbody");
        if (!tbody) {
            console.warn("⚠️ No se encontró el <tbody> en el DOM.");
            return;
        }

        tbody.innerHTML = ""; // Limpiamos antes de insertar

        centros.forEach(centro => {
            const rowHTML = `
                <tr>
                    <td>${centro.nombre}</td>
                    <td>${centro.direccion}</td>
                    <td>${centro.telefono}</td>
                    <td>${centro.nombre_fiscal}</td>
                    <td>${centro.NIF}</td>
                    <td>${centro.ciudad}</td>
                    <td>${centro.codigo_postal}</td>
                    <td>${centro.correo}</td>
                    <td>
                        <div class="flex align-items-center list-user-action">
                    

                            <a class="btn btn-sm btn-icon btn-eliminar-centro"
                                data-id="${centro.id_centro}"
                                data-nombre="${centro.nombre}"
                                data-bs-toggle="tooltip"
                                title="Eliminar"
                                href="#">
                                <span class="btn-inner">🗑️</span>
                            </a>
                        </div>
                    </td>
                    
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", rowHTML);
        });

    } catch (error) {
        console.error("❌ Error al cargar los centros:", error.message);
    }
}
