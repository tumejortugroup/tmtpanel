export async function pintarTotalClientes() {
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

        const totalClientes = usuarios.length > 0 ? usuarios[0].total_clientes : 0;


        const parrafo = document.querySelector("#clientesSemana");
        if (parrafo) {
            parrafo.innerHTML = `
                <svg class="me-2 text-primary icon-24" width="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
                ${totalClientes} nuevos clientes esta semana
            `;
        }

    } catch (error) {
        console.error("❌ Error al cargar el total de clientes:", error.message);

        const parrafo = document.querySelector("#clientesSemana");
        if (parrafo) {
            parrafo.innerHTML = `
                <svg class="me-2 text-primary icon-24" width="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
                0 nuevos clientes esta semana
            `;
        }
    }
}
