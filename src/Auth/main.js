// Importar módulos necesarios
import { initAuth } from './modules/auth.js';
import { initLogout } from './modules/logout.js';
import { checkSession } from './modules/check.js';


document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Página de login
    if (path.includes('/auth/sign-in.html')) {
        initAuth();
    }

    if (path.includes('/dashboard')) {
        checkSession();    
        initLogout();
    }
});
