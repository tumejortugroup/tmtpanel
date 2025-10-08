export function initDeleteUser() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (e) => {
        // Buscar si el click fue en el botón eliminar o dentro de él
        const btn = e.target.closest('.btn-eliminar');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation(); // Evitar que se propague y cierre el dropdown

        const userId = btn.getAttribute('data-id');
        const nombre = btn.getAttribute('data-nombre');
        
        if (!userId) {
            alert('ID de usuario no válido');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token de autenticación no encontrado. Por favor, inicia sesión.');
            return;
        }

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

            // Cerrar el dropdown manualmente antes de eliminar la fila
            const dropdown = btn.closest('.dropdown');
            if (dropdown) {
                const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.querySelector('[data-bs-toggle="dropdown"]'));
                if (bsDropdown) bsDropdown.hide();
            }

            btn.closest('tr').remove();
            alert(`Usuario "${nombre}" eliminado correctamente.`);
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    });
}