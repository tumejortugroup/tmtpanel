import { initAuth } from './modules/auth.js';
import { initLogout } from './modules/logout.js';
import { checkSession } from './modules/check.js';
import { getUserInfoFromToken } from './modules/jwt.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('/auth/sign-in.html')) {
        initAuth();
        return;
    }

    if (path.includes('/dashboard')) {
        let asideRendered = false;

        // 1. Cargar ASIDE
        const asideLoaded = fetch('/dashboard/aside.html')
            .then(res => res.text())
            .then(html => {
                document.querySelector('aside').innerHTML = html;
                asideRendered = true;
            });

        // 2. Cargar NAVBAR
        const navbarLoaded = fetch('/dashboard/navbar.html')
            .then(res => res.text())
            .then(html => {
                document.querySelector('nav').innerHTML = html;
            });

        // 3. Esperamos ambos y luego actualizamos
        Promise.all([asideLoaded, navbarLoaded]).then(async () => {

            // 4. Verificamos sesión
            const token = await checkSession();
            if (!token) return;

            // 5. Obtenemos datos del usuario
            const user = getUserInfoFromToken(token);
            if (!user) return;

            const { nombre, rol, centro_id, id_usuario } = user;

            // 6. Guardamos en localStorage
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('id_usuario', id_usuario);
            localStorage.setItem('rol', rol);
            localStorage.setItem('centro_id', centro_id); 

            // 7. Insertamos opciones del select según el rol del usuario
            const roleSelect = document.getElementById('role');

            if (roleSelect) {
                // Limpia opciones existentes excepto la de "Seleccionar"
                roleSelect.innerHTML = '<option value="">Seleccionar</option>';

                const addOption = (value, text) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = text;
                    roleSelect.appendChild(option);
                };

                if (rol === 'Preparador') {
                    addOption('Cliente', 'Cliente');
                } else if (rol === 'Propietario') {
                    addOption('Cliente', 'Cliente');
                    addOption('Preparador', 'Preparador');
                } else if (rol === 'admin') {
                    addOption('Cliente', 'Cliente');
                    addOption('Preparador', 'Preparador');
                    addOption('Propietario', 'Propietario');
                }

                // Si estás usando Bootstrap selectpicker, refresca el componente
                if (typeof $ !== 'undefined' && $('.selectpicker').length) {
                    $('.selectpicker').selectpicker('refresh');
                }
            }

            // 8. Mostrar nombre y rol en la UI
            setTimeout(() => {
                const nombreElems = document.querySelectorAll('.nombre-usuario-navbar');
                const rolElems = document.querySelectorAll('.rol-usuario');

                if (nombreElems.length === 0 || rolElems.length === 0) {
                    console.error('No se encontraron elementos para actualizar el nombre y rol');
                    return;
                }

                nombreElems.forEach(el => el.textContent = nombre);
                rolElems.forEach(el => el.textContent = rol);
            }, 100);

            // 9. Inicializar logout
            initLogout();
        });
    }
});
