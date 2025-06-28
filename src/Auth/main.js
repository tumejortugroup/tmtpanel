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
                console.log('✅ ASIDE cargado');
            });

        // 2. Cargar NAVBAR
        const navbarLoaded = fetch('/dashboard/navbar.html')
            .then(res => res.text())
            .then(html => {
                document.querySelector('nav').innerHTML = html;

            });

        // 3. Esperamos ambos y luego actualizamos
        Promise.all([asideLoaded, navbarLoaded]).then(async () => {

            const token = await checkSession();
            if (!token) return;

            const user = getUserInfoFromToken(token);
            if (!user) return;

            const { nombre, rol } = user;


            localStorage.setItem('nombre', nombre);
            localStorage.setItem('rol', rol);

            setTimeout(() => {
                const nombreElems = document.querySelectorAll('.nombre-usuario');
                const rolElems = document.querySelectorAll('.rol-usuario');
                if (nombreElems.length === 0 || rolElems.length === 0) {
                    console.error('No se encontraron elementos para actualizar el nombre y rol');
                    return;
                }

                nombreElems.forEach(el => el.textContent = nombre);
                rolElems.forEach(el => el.textContent = rol);

            }, 100);
            initLogout();
        });
    }
});
