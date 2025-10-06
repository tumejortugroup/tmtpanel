export function toggleStatus() {
    const table = document.querySelector('table');
    if (!table) return;

    table.addEventListener('click', async (e) => {
        const badge = e.target.closest('.badge-estado');
        if (!badge) return;

        e.preventDefault();

        const nombre = badge.getAttribute('data-nombre');
        if (!nombre) return alert('Nombre no válido');

        const token = localStorage.getItem('token');
        if (!token) return alert('Token no encontrado. Inicia sesión.');

        try {
            // Obtener ID del usuario por nombre
            const res = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/nombre/${encodeURIComponent(nombre)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Usuario no encontrado');
            const data = await res.json();
            const userId = data.id_usuario;

            // Confirmar acción
            if (!confirm(`¿Estás seguro de cambiar el estado de "${nombre}" a inactivo?`)) return;

            // PATCH para inactivar
            const patchRes = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${userId}/inactivar`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!patchRes.ok) throw new Error('No se pudo cambiar el estado del usuario');

            const nuevoEstado = badge.textContent.trim().toLowerCase() === 'activo' ? 'Inactivo' : 'Activo';
            badge.textContent = nuevoEstado;
            badge.classList.toggle('bg-success');
            badge.classList.toggle('bg-secondary');
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    });
}
