import { pintarTotalClientes } from "/src/user/modules/index/listUltimosNumero.js";
import { listCumpleaños } from "/src/user/modules/index/listCumpleaños.js";
import { listUsuariosUltimos } from "/src/user/modules/index/listNombreUltimos.js";
import { pintarUsuariosDashboard } from "/src/user/modules/index/listActivos.js";

// Función que carga todos los datos del dashboard
async function cargarDatosDashboard() {
    try {
        console.log('🔄 Iniciando carga de datos del dashboard...');
        
        await Promise.all([
            listCumpleaños(),
            listUsuariosUltimos(),
            pintarTotalClientes(),
            pintarUsuariosDashboard()
        ]);
        
        console.log('✅ Todos los datos del dashboard cargados correctamente');
    } catch (error) {
        console.error("❌ Error cargando datos del dashboard:", error);
    }
}

// Variable para evitar cargar dos veces
let dashboardCargado = false;

// Escuchar el evento 'dashboardReady' (primera carga después de login)
window.addEventListener('dashboardReady', (event) => {
    if (dashboardCargado) return;
    

    dashboardCargado = true;
    cargarDatosDashboard();
});

// Fallback: Si ya están los datos en localStorage (refresh con Ctrl+R)
document.addEventListener("DOMContentLoaded", () => {
    // Pequeño delay para dar tiempo al evento dashboardReady
    setTimeout(() => {
        if (dashboardCargado) return; // Ya se cargó con el evento
        
        const token = localStorage.getItem('token');
        const centro_id = localStorage.getItem('centro_id');
        
        if (token && centro_id) {
            console.log('🔄 Datos detectados en localStorage, cargando dashboard...');
            dashboardCargado = true;
            cargarDatosDashboard();
        } else {
            console.log('⏳ Esperando datos de autenticación...');
        }
    }, 200); // 200ms de margen para que se dispare el evento primero
});