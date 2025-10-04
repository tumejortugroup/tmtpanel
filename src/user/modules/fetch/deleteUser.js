export function initDeleteUser() {
    const table = document.querySelector('table');
    if (!table) return;

    table.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-eliminar');
        if (!btn) return;

        e.preventDefault();

        const userId = btn.getAttribute('data-id');
        const nombre = btn.getAttribute('data-nombre');
        
        if (!userId) return alert('ID de usuario no válido');

        const token = localStorage.getItem('token');
        if (!token) return alert('Token de autenticación no encontrado. Por favor, inicia sesión.');

        if (!confirm(`¿Estás seguro de eliminar a "${nombre}"?`)) return;

        try {
            const deleteRes = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!deleteRes.ok) {
                const error = await deleteRes.json();
                throw new Error(error.message || 'No se pudo eliminar el usuario');
            }

            btn.closest('tr').remove();
            alert(`Usuario "${nombre}" eliminado correctamente.`);
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    });
}