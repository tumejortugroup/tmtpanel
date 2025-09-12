


export function actualizarColspanTabla() {
  const filasDivision = document.querySelectorAll('tr.division-controles');

  // Buscar una fila de datos para contar columnas (usamos la primera que tenga <td>)
  const filaEjemplo = document.querySelector('tbody tr:not(.division-controles)');
  if (!filaEjemplo) return;

  const totalColumnas = filaEjemplo.querySelectorAll('td').length + 1; // +1 por el <th> inicial

  filasDivision.forEach(fila => {
    const th = fila.querySelector('th[colspan]');
    if (th) {
      th.setAttribute('colspan', totalColumnas);
    }
  });
}
