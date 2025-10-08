import {obtenerIdDietaDesdeUrl, obtenerDatoDesdeUrl} from '/src/dietas/modules/wizard/utils/params.js'

export function renderizarSelectDietas(dietas) {
    console.log('🔍 Buscando select con id="dietas-anteriores"...');
    const select = document.getElementById('dietas-anteriores');
    
    if (!select) {
        console.error("❌ Select de dietas NO encontrado en el DOM");
        return;
    }

    console.log(`📋 Renderizando ${dietas.length} dietas...`);

    // Opción por defecto como placeholder
    select.innerHTML = '<option value="" selected disabled>Dietas</option>';

    if (dietas.length === 0) {
        console.log("ℹ️ Usuario sin dietas");
        return;
    }

    // Agregar todas las dietas como opciones
    dietas.forEach((dieta) => {
        const option = document.createElement('option');
        option.value = dieta.id_dieta;
        option.textContent = dieta.nombre;
        select.appendChild(option);
    });

    console.log(`✅ Select renderizado con ${dietas.length} dietas`);

    // Event listener para el cambio
    select.onchange = function() {
        console.log('✅ Dieta seleccionada!');
        const id_dieta2 = this.value;
        
        if (!id_dieta2) {
            console.log("ℹ️ Valor vacío seleccionado");
            return;
        }

        const id_dieta = obtenerIdDietaDesdeUrl();
        const id_dato = obtenerDatoDesdeUrl();
        
        console.log(`🔄 Redirigiendo con:`, { id_dieta, id_dato, id_dieta2 });
        
        const url = `/dashboard/dietas/wizardBaseDieta.html?id_dieta=${id_dieta}&id_dato=${id_dato}&id_dieta2=${id_dieta2}`;
        console.log('📍 URL:', url);
        
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
        
        console.log(`✅ Dietas cargadas para usuario ${id_usuario}:`, dietas);
        return dietas;
        
    } catch (error) {
        console.error("❌ Error al cargar dietas:", error);
        return [];
    }
}