export function filtrarTabla() {
  const table = document.getElementById('user-list-table');
  if (!table) {
    console.warn("⚠️ No se encontró la tabla con id user-list-table");
    return;
  }

  const inputs = table.querySelectorAll('thead tr:nth-child(2) input');

  inputs.forEach((input, colIndex) => {
    input.addEventListener('input', () => {
      const filas = table.querySelectorAll('tbody tr');

      filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        let visible = true;

        inputs.forEach((inputFiltro, i) => {
          let filtro;

          if (inputFiltro.type === 'checkbox') {
            filtro = inputFiltro.checked ? "activo" : "inactivo";
          } else {
            filtro = inputFiltro.value.toLowerCase().trim();
          }

          if (!filtro) return;

          const celda = celdas[i];
          if (!celda) return;

          if (inputFiltro.type === 'checkbox') {
            const estadoTexto = celda.textContent.trim().toLowerCase();
            if (!estadoTexto.includes(filtro)) visible = false;
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
