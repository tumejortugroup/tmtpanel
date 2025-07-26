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
    const tabla = document.querySelector('table');
    const filas = tabla?.querySelectorAll('tbody tr');
    if (!tabla || filas.length === 0) return;

    const plantillas = {};
    filas.forEach(fila => {
      const variable = fila.dataset.variable;
      if (!variable) return;
      const campo = fila.querySelector('input, select');
      if (campo) {
        plantillas[variable] = campo.cloneNode(true);
      }
    });

    // Limpiar las celdas de la tabla
    filas.forEach(fila => {
      fila.querySelectorAll('td').forEach(td => td.remove());
    });

    controles.reverse();

    controles.forEach((control, index) => {
      filas.forEach(fila => {
        const nuevaCelda = document.createElement('td');
        nuevaCelda.style.backgroundColor = 'white';

        const variable = fila.dataset.variable;

        if (fila.classList.contains('fila-control-nombre')) {
          const input = document.createElement('input');
          input.className = 'nombre input-medidas';
          input.setAttribute('data-index', index);
          input.value = control.nombre ?? `Control-${index + 1}`;
          nuevaCelda.appendChild(input);
        } else if (variable === 'fecha') {
          const input = document.createElement('input');
          input.type = 'date';
          input.className = 'fecha input-medidas';
          input.setAttribute('data-index', index);
          input.value = control.fecha ?? '';
          nuevaCelda.appendChild(input);
        } else {
          if (!variable || !(variable in plantillas)) return;
          const campo = plantillas[variable].cloneNode(true);
          campo.value = control[variable] ?? '';
          campo.setAttribute('data-index', index);
          nuevaCelda.appendChild(campo);
        }

        fila.appendChild(nuevaCelda);
      });
    });

    // ➕ Añadir columna vacía para nuevo control
    const nuevoIndex = controles.length;

    filas.forEach(fila => {
      const nuevaCelda = document.createElement('td');
      nuevaCelda.style.backgroundColor = '#f9f9f9';

      const variable = fila.dataset.variable;

      if (fila.classList.contains('fila-control-nombre')) {
        const input = document.createElement('input');
        input.className = 'nombre input-medidas';
        input.setAttribute('data-index', nuevoIndex);
        nuevaCelda.appendChild(input);
      } else if (variable === 'fecha') {
        const input = document.createElement('input');
        input.type = 'date';
        input.className = 'fecha input-medidas';
        input.setAttribute('data-index', nuevoIndex);
        nuevaCelda.appendChild(input);
      } else {
        if (!variable || !(variable in plantillas)) return;
        const campo = plantillas[variable].cloneNode(true);
        campo.value = '';
        campo.setAttribute('data-index', nuevoIndex);
        nuevaCelda.appendChild(campo);
      }

      fila.appendChild(nuevaCelda);
    });

    // Fila de acciones (guardar)
    let filaAcciones = tabla.querySelector('tr.fila-acciones');
    if (!filaAcciones) {
      filaAcciones = document.createElement('tr');
      filaAcciones.classList.add('fila-acciones');
      const th = document.createElement('th');
      th.textContent = 'Acciones';
      th.style.backgroundColor = '#d4a321';
      filaAcciones.appendChild(th);
      tabla.querySelector('tbody').appendChild(filaAcciones);
    }

    // Asegurar que haya suficientes celdas en la fila de acciones
    const totalColumnas = controles.length + 1;
    while (filaAcciones.children.length < totalColumnas + 1) {
      const td = document.createElement('td');
      td.style.backgroundColor = '#f9f9f9';
      filaAcciones.appendChild(td);
    }

    // Botón guardar en la última columna
    const ultimaCelda = filaAcciones.lastElementChild;
    ultimaCelda.innerHTML = `
      <button class="guardar-control" data-index="${nuevoIndex}">
        Guardar
      </button>
    `;

    actualizarColspanTabla?.();
    console.log('✅ Controles previos cargados correctamente.');
  } catch (error) {
    console.error('❌ Error al cargar controles previos:', error);
  }
}
