import { formatearFecha } from "/src/user/modules/utils/formatearFecha.js";

export async function listCumpleaños() {
    const token = localStorage.getItem("token");
    const centro_id = localStorage.getItem("centro_id");
    console.log('Pasa funcion')

    if (!token || !centro_id) {
        console.warn("⚠️ Faltan datos: token o centro_id no encontrados en localStorage.");
        return;
    }

    const endpoint = `https://my.tumejortugroup.com/api/v1/usuarios/centro/cumpleaños?id=${centro_id}`;

    try {
       console.log("🚀 Llamando a endpoint:", endpoint);

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

            // 👀 Mostramos el array de usuarios en consola
    console.log("✅ Usuarios recibidos:", usuarios);
    console.table(usuarios);

        // Seleccionamos el contenedor de la card
        const cardBody = document.querySelector(".card-body");
        if (!cardBody) {
            console.warn("⚠️ No se encontró el contenedor .card-body en el DOM.");
            return;
        }

        cardBody.innerHTML = ""; // Limpiamos antes de insertar
        usuarios.forEach((usuario, index) => {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`;
    const cumpleFormateado = usuario.proximo_cumple 
        ? formatearFecha(usuario.proximo_cumple) 
        : "Sin fecha";

    console.log(`🖌 Pintando usuario ${index + 1}:`, nombreCompleto, cumpleFormateado);

    const userHTML = `
        <div class="d-flex justify-content-start align-items-center ${index > 0 ? "mt-4" : ""}">
            <div class="pe-3">
                <!-- Si tienes avatar real úsalo, si no, inicial -->
                <span class="avatar bg-primary text-white p-2 rounded-circle">
                    ${usuario.nombre.charAt(0)}
                </span>
            </div>
            <div>
                <h6 class="mb-1">${nombreCompleto}</h6>
                <p class="mb-0">🎂 ${cumpleFormateado}</p>
            </div>
        </div>
    `;

    // 🔑 Ahora lo pintamos en el div correcto
    document.querySelector("#cumpleCard").insertAdjacentHTML("beforeend", userHTML);
});


    } catch (error) {
        console.error("❌ Error al cargar los usuarios:", error.message);
    }
}
