/**
 * initDeleteDieta()
 * -----------------
 * Inicializa la lógica de eliminación de dietas en la tabla de usuarios.
 *
 * Flujo:
 * - Escucha clicks delegados en el `<table>`, buscando el botón `.btn-eliminar-dieta`.
 * - Verifica que el usuario haya seleccionado una dieta en el `<select>`.
 * - Solicita confirmación antes de proceder.
 * - Llama a la API (`DELETE /dietas/:id`) con el token almacenado.
 * - Si la eliminación es exitosa:
 *    - Elimina la opción del `<select>`.
 *    - Limpia las celdas de nombre y fecha asociadas.
 *    - Recarga la página para reflejar el estado actualizado.
 *
 * Consideraciones:
 * - Maneja la ausencia de tabla, botón, select o token sin romper la ejecución.
 * - Usa confirm() y alert() para feedback mínimo, pero depende del navegador.
 * - Si falla la petición, se notifica al usuario y se registra el error en consola.
 */

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
