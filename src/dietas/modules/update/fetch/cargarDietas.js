import {obtenerIdDietaDesdeUrl, obtenerDatoDesdeUrl} from '/src/dietas/modules/wizard/utils/params.js'

export function renderizarSelectDietas(dietas) {

    const select = document.getElementById('dietas-anteriores');
    
    if (!select) {
        console.error("❌ Select de dietas NO encontrado en el DOM");
        return;
    }



    // Opción por defecto como placeholder
    select.innerHTML = '<option value="" selected disabled>Dietas</option>';

    if (dietas.length === 0) {

        return;
    }

    // Agregar todas las dietas como opciones
    dietas.forEach((dieta) => {
        const option = document.createElement('option');
        option.value = dieta.id_dieta;
        option.textContent = dieta.nombre;
        select.appendChild(option);
    });



    // Event listener para el cambio
    select.onchange = function() {
        const id_dieta2 = this.value; 
        if (!id_dieta2) {
            return;
        }
        const id_dieta = obtenerIdDietaDesdeUrl();
        const id_dato = obtenerDatoDesdeUrl();    
        const url = `/dashboard/dietas/wizardBaseDieta.html?id_dieta=${id_dieta}&id_dato=${id_dato}&id_dieta2=${id_dieta2}`;  
        window.location.href = url;
    };
}

export async function cargarDietasUsuario(id_usuario) {
    const token = localStorage.getItem("token");
    
    if (!token || !id_usuario) {
        console.warn("⚠️ Token o ID de usuario no disponible");
        return [];
    }

    try {
        const response = await fetch(
            `https://my.tumejortugroup.com/api/v1/dietas/usuario/${id_usuario}`,
            { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                } 
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const dietasData = await response.json();
        const dietas = Array.isArray(dietasData.data) ? dietasData.data : [];
        
        return dietas;
        
    } catch (error) {
        console.error("❌ Error al cargar dietas:", error);
        return [];
    }
}