import { parseJwt } from './jwt.js';

export function mostrarContenidoPorRol(token) {
    const userData = parseJwt(token);
    if (!userData || !userData.rol) {
        console.error('No se pudo obtener el rol del token');
        return;
    }

    const userRol = userData.rol.trim();

    document.querySelectorAll('[data-visible-to]').forEach(el => {
        const allowedRoles = el.getAttribute('data-visible-to').split(' ').map(r => r.trim());
        el.style.display = allowedRoles.includes(userRol) ? '' : 'none';
    });
}
