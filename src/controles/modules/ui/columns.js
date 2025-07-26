export function agregarColumna(botonId = 'agregarColumnaBtn') {
  const boton = document.getElementById(botonId);
  if (!boton) return;

  if (boton.dataset.listenerAdded === 'true') return;
  boton.dataset.listenerAdded = 'true';

  boton.addEventListener('click', () => {
    const tabla = document.querySelector('table');
    if (!tabla) return;

    const filas = tabla.querySelectorAll('tbody tr');

    // Paso 1: calcular el nuevo índice
    const todosLosInputs = tabla.querySelectorAll('input[data-index], select[data-index]');
    let maxIndex = 0;
    todosLosInputs.forEach(el => {
      const index = parseInt(el.getAttribute('data-index'));
      if (!isNaN(index) && index > maxIndex) {
        maxIndex = index;
      }
    });
    const nuevoIndex = maxIndex + 1;

    // Paso 2: agregar una celda por fila
filas.forEach((fila) => {
  const celdas = fila.querySelectorAll('td');
  if (celdas.length === 0) return;

  const nuevaCelda = document.createElement('td');
  nuevaCelda.style.backgroundColor = 'white';

  if (fila.classList.contains('fila-control-nombre')) {
    // ✅ Lee el número del texto anterior y suma
    const ultimaCelda = celdas[celdas.length - 1];
    const texto = ultimaCelda.textContent.trim();
    const match = texto.match(/Control-(\d+)/i);
    const ultimoNumero = match ? parseInt(match[1]) : 0;
    const nuevoNumero = ultimoNumero + 1;
    nuevaCelda.textContent = `Control-${nuevoNumero}`;
  } else {
  const primeraCelda = celdas[0];
  const primerInput = primeraCelda.querySelector('input, select');
  if (!primerInput) return;

  const nuevoElemento = primerInput.cloneNode(true);

  // ✅ Buscar el valor del input anterior en esta misma fila
  const ultimaCelda = celdas[celdas.length - 1];
  const inputAnterior = ultimaCelda.querySelector('input, select');
  const valorAnterior = inputAnterior ? inputAnterior.value : '';

  nuevoElemento.value = valorAnterior; // puede ser vacío si no hay nada
  nuevoElemento.removeAttribute('id');
  nuevoElemento.setAttribute('data-index', nuevoIndex);
  nuevaCelda.appendChild(nuevoElemento);
}

  fila.appendChild(nuevaCelda);
});





    actualizarColspanTabla?.();
  });
}



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
