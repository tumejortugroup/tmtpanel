/**
 * filtrarTabla()
 * --------------
 * Aplica filtros dinámicos por columna en la tabla de dietas.
 *
 * Flujo:
 * - Obtiene la tabla `#dieta-list-table` y sus inputs de filtro en el <thead>.
 * - Escucha eventos `input` en cada campo de búsqueda/filtro.
 * - Cada vez que cambia un filtro:
 *   - Itera todas las filas del <tbody>.
 *   - Evalúa si cada celda cumple las condiciones activas:
 *      - Checkbox → interpreta si el estado "activo" está presente en la celda.
 *      - Date → compara solo la parte de fecha (YYYY-MM-DD).
 *      - Texto → compara con coincidencia parcial, sin mayúsculas/minúsculas.
 *   - Muestra/oculta la fila en función de si pasa todos los filtros.
 *
 * Consideraciones:
 * - Los filtros se aplican de forma acumulativa (AND).
 * - Si un input está vacío o no marcado, se ignora en el filtrado.
 * - Está diseñado para funcionar con una fila extra en <thead> destinada a filtros.
 *
 * @returns {void}
 */

export function filtrarTabla() {
  const table = document.getElementById('dieta-list-table');
  const inputs = table.querySelectorAll('thead tr:nth-child(2) input');

  inputs.forEach((input, colIndex) => {
    input.addEventListener('input', () => {
      const filas = table.querySelectorAll('tbody tr');

      filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        let visible = true;

        inputs.forEach((inputFiltro, i) => {
          const filtro = inputFiltro.type === 'checkbox'
            ? inputFiltro.checked
            : inputFiltro.value.toLowerCase().trim();

          if (!filtro) return; // si el input está vacío, no filtra esa columna

          const celda = celdas[i];
          if (!celda) return;

          const tipo = inputFiltro.type;

          if (tipo === 'checkbox') {
            const estadoTexto = celda.textContent.trim().toLowerCase();
            const estaActivo = estadoTexto.includes('activo');
            if (filtro !== estaActivo) visible = false;
          } else if (tipo === 'date') {
            const celdaFecha = celda.textContent.trim().slice(0, 10);
            if (!celdaFecha.includes(filtro)) visible = false;
          } else {
            const celdaTexto = celda.textContent.toLowerCase().trim();
            if (!celdaTexto.includes(filtro)) visible = false;
          }
        });

        fila.style.display = visible ? '' : 'none';
      });
    });
  });
}
