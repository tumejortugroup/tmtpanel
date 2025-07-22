import { actualizarColspanTabla } from '../ui/columns.js';


export async function cargarControlesPrevios(idUsuario) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Token JWT no encontrado');
    return;
  }

  try {
    const response = await fetch(`http://localhost:9000/api/v1/datos/ultimos/${idUsuario}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (!result.success || !Array.isArray(result.data)) return;

    const controles = result.data;
    if (controles.length === 0) return;

    const tabla = document.querySelector('table');
    const filas = tabla?.querySelectorAll('tbody tr');
    if (!tabla || filas.length === 0) return;

    // Mostrar de más antiguo a más reciente
    controles.reverse();

    controles.forEach((control, index) => {
      filas.forEach((fila) => {
        const nuevaCelda = document.createElement('td');
        nuevaCelda.style.backgroundColor = 'white';

        if (fila.classList.contains('fila-control-nombre')) {
          nuevaCelda.textContent = `Control-${index + 1}`;
        } else {
          const variable = fila.dataset.variable;
          if (!variable) return;

          const valor = control[variable] ?? '';
          const input = document.createElement('input');
          input.type = 'text';
          input.value = valor;
          input.setAttribute('data-index', index);
          nuevaCelda.appendChild(input);
        }

        fila.appendChild(nuevaCelda);
      });
    });

    // ✅ Añadir columna vacía para nuevo control
    const nuevoIndex = controles.length;

    filas.forEach((fila) => {
      const nuevaCelda = document.createElement('td');
      nuevaCelda.style.backgroundColor = 'white';

      if (fila.classList.contains('fila-control-nombre')) {
        nuevaCelda.textContent = `Control-${nuevoIndex + 1}`;
      } else {
        const variable = fila.dataset.variable;
        if (!variable) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = '';
        input.setAttribute('data-index', nuevoIndex);
        nuevaCelda.appendChild(input);
      }

      fila.appendChild(nuevaCelda);
    });

    // ✅ Ajustar colspan
    actualizarColspanTabla?.();

  } catch (error) {
    console.error('Error al cargar controles previos:', error);
  }
}