import { mostrarSkeletonSpinner, ocultarSkeletonSpinner } from '/src/skeleton/skeletonSpinner.js';

export function initLogout() {
    const logoutBtn = document.getElementById("logout");
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); // ⬅️ Prevenir acción por defecto
        
        // ⬇️ MOSTRAR SPINNER
        mostrarSkeletonSpinner({
            title: 'Cerrando sesión',
            subtitle: 'Hasta pronto...'
        });

        const token = localStorage.getItem('token');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('rol');
        localStorage.removeItem('centro_id');
        
        if (token === null) {
            console.log('Token eliminado con éxito');
        } else {
            console.log('Error: El token no se eliminó');
        }
        
        // ⬇️ ESPERAR 2 SEGUNDOS Y LUEGO REDIRIGIR
        setTimeout(() => {
            ocultarSkeletonSpinner();
            window.location.href = '/dashboard/auth/sign-in.html';
        }, 2000);
    });
}