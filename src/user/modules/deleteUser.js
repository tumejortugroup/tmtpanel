export function initDeleteUser() {
    const table = document.querySelector('table');
    if (!table) return;

    table.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-eliminar');
        if (!btn) return;

        e.preventDefault();

        const nombre = btn.getAttribute('data-nombre');
        if (!nombre) return alert('Nombre no válido');

        const token = localStorage.getItem('token'); // ✅ Asegúrate de tener el token guardado
        if (!token) return alert('Token de autenticación no encontrado. Por favor, inicia sesión.');

        try {
            // Obtener ID del usuario por nombre
            const res = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/nombre/${encodeURIComponent(nombre)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Usuario no encontrado');
            const data = await res.json();
            const userId = data.id_usuario;

            if (!confirm(`¿Estás seguro de eliminar a "${nombre}"?`)) return;

            // Eliminar usuario por ID
            const deleteRes = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ✅ Aquí se usa correctamente
                }
            });

            if (!deleteRes.ok) throw new Error('No se pudo eliminar el usuario');

            btn.closest('tr').remove();
            alert(`Usuario "${nombre}" eliminado correctamente.`);
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    });
}
