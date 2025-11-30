import { obtenerIdPlantillaDesdeUrl, obtenerDatoDesdeUrl }
from '/src/Plantilla/modules/update/utils/params.js';

export function renderizarSelectPlantillas(plantillas) {

    const select = document.getElementById('plantillas-anteriores');
    
    if (!select) {
        console.error("❌ Select de plantillas NO encontrado en el DOM");
        return;
    }

    // placeholder
    select.innerHTML = '<option value="" selected disabled>Plantillas</option>';

    if (plantillas.length === 0) return;

    // añadir opciones
    plantillas.forEach((p) => {
        const option = document.createElement('option');
        option.value = p.id_plantilla;
        option.textContent = p.nombre_plantilla;
        select.appendChild(option);
    });

    // EVENTO
    select.onchange = function() {
        const id_plantilla2 = this.value;
        if (!id_plantilla2) return;

        const idPlantilla = obtenerIdPlantillaDesdeUrl();
        const idDato = obtenerDatoDesdeUrl();

        const url = `/dashboard/plantillas/wizardBasePlantilla.html?id_plantilla=${idPlantilla}&id_dato=${idDato}&id_plantilla2=${id_plantilla2}`;
        
        window.location.href = url;
    };
}

export async function cargarPlantillasCentro() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `https://my.tumejortugroup.com/api/v1/plantillas/centro`,
            { 
                headers: { 
                    Authorization: `Bearer ${token}`
                } 
            }
        );

        const data = await response.json();
        return Array.isArray(data.data) ? data.data : [];

    } catch (error) {
        console.error("❌ Error al cargar plantillas del centro:", error);
        return [];
    }
}

