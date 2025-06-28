export function initLogout() {
    const logoutBtn = document.getElementById("logout");
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
        alert('Sesión cerrada');
        window.location.href = '/auth/sign-in.html';

        if (token === null) {
            console.log('Token eliminado con éxito');
        } else {
            console.log('Error: El token no se eliminó');
        }
    });
}
