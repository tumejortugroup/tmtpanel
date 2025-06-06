document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "/dashboard/auth/sign-in.html";
        return;
    }

    const userData = parseJwt(token);
    if (!userData || !userData.rol) {
        console.error('No se pudo obtener el rol del token');
        return;
    }

    const userRol = userData.rol.trim();

    document.querySelectorAll('[data-visible-to]').forEach(el => {
        const allowedRoles = el.getAttribute('data-visible-to').split(' ').map(r => r.trim());
        if (allowedRoles.includes(userRol)) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });
});


function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al parsear JWT:", e);
        return null;
    }
}
