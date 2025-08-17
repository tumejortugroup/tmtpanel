export function initDeleteDieta() {
  const table = document.querySelector('table');
  if (!table) return;

  table.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-eliminar-dieta');
    if (!btn) return;

    e.preventDefault();

    const row = btn.closest('tr');
    const select = row.querySelector('select[name="select-dieta"]');
    const selectedOption = select?.selectedOptions[0];

    if (!selectedOption) {
      alert('No hay una dieta seleccionada.');
      return;
    }

    const nombreDieta = selectedOption.textContent;
    const idDieta = selectedOption.value;

    if (!confirm(`¿Eliminar la dieta "${nombreDieta}"?`)) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:9000/api/v1/dietas/${idDieta}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('No se pudo eliminar la dieta');

      // Quitar la opción del select
      selectedOption.remove();

      // Limpiar nombre y fecha de dato
      const nombreTd = row.querySelector('.nombre-dato');
      const fechaTd = row.querySelector('.fecha-dato');
      if (nombreTd) nombreTd.textContent = '—';
      if (fechaTd) fechaTd.textContent = '—';

            location.reload();
    } catch (err) {
      console.error(err);
      alert(`Error al eliminar dieta: ${err.message}`);
    }
  });
}
