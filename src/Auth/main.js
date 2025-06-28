import { initAuth } from './modules/auth.js';
import { initLogout } from './modules/logout.js';
import { checkSession } from './modules/check.js';
import { getUserInfoFromToken } from './modules/jwt.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    console.log('📄 DOMContentLoaded. Path actual:', path);

    if (path.includes('/auth/sign-in.html')) {
        initAuth();
        return;
    }

    if (path.includes('/dashboard')) {
        console.log('✅ Página de dashboard detectada');

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
                console.log('✅ NAVBAR cargado');
            });

        // 3. Esperamos ambos y luego actualizamos
        Promise.all([asideLoaded, navbarLoaded]).then(async () => {
            console.log('✅ NAVBAR + ASIDE terminados');

            const token = await checkSession();
            if (!token) return;

            const user = getUserInfoFromToken(token);
            if (!user) return;

            const { nombre, rol } = user;

            console.log('👤 Usuario decodificado:', user);

            localStorage.setItem('nombre', nombre);
            localStorage.setItem('rol', rol);

            // ⚠️ Esperamos 100ms para que aside.innerHTML haya rendereado completamente
            setTimeout(() => {
                const nombreElems = document.querySelectorAll('.nombre-usuario');
                const rolElems = document.querySelectorAll('.rol-usuario');

                console.log('🔎 nombreElems:', nombreElems);
                console.log('🔎 rolElems:', rolElems);

                nombreElems.forEach(el => el.textContent = nombre);
                rolElems.forEach(el => el.textContent = rol);

                console.log('✅ Nombres y roles aplicados correctamente');
            }, 100); // ← esta espera garantiza que el DOM ya fue pintado

            initLogout();
        });
    }
});
