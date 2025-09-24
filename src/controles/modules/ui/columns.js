
export function actualizarColspanTabla() {
  // Buscar una fila de datos normal para contar las columnas
  const filaEjemplo = document.querySelector('tbody tr[data-variable]');
  if (!filaEjemplo) return;

  const totalColumnas = filaEjemplo.querySelectorAll('td').length + 1; // +1 por el <th> de la fila

  // Seleccionamos TODOS los th con colspan
  const filasConTh = document.querySelectorAll('tr th[colspan]');
  filasConTh.forEach(th => {
    th.setAttribute('colspan', totalColumnas);
  });
}
