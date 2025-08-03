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
