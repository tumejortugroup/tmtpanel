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

    // 💾 Guardamos una copia de los inputs/selects originales por variable
    const plantillas = {};

    filas.forEach(fila => {
      const variable = fila.dataset.variable;
      if (!variable) return;

      const campo = fila.querySelector('input, select');
      if (campo) {
        plantillas[variable] = campo.cloneNode(true);
      }
    });

    // ❌ Limpiar todas las celdas previas (menos los th)
    filas.forEach(fila => {
      fila.querySelectorAll('td').forEach(td => td.remove());
    });

    // 🕒 Mostrar de más antiguo a más reciente
    controles.reverse();

    controles.forEach((control, index) => {
      filas.forEach(fila => {
        const nuevaCelda = document.createElement('td');
        nuevaCelda.style.backgroundColor = 'white';

        if (fila.classList.contains('fila-control-nombre')) {
          // Mostrar el nombre real del control desde la base de datos
          nuevaCelda.textContent = control.nombre ?? `Control-${index + 1}`;
        } else {
          const variable = fila.dataset.variable;
          if (!variable || !(variable in plantillas)) return;

          const valor = control[variable] ?? '';
          const campo = plantillas[variable].cloneNode(true);
          campo.value = valor;
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

      if (fila.classList.contains('fila-control-nombre')) {
        // Calcular el siguiente número a partir del mayor existente
        const numeros = Array.from(fila.querySelectorAll('td'))
          .map(td => {
            const match = td.textContent?.match(/Control-(\d+)/);
            return match ? parseInt(match[1], 10) : null;
          })
          .filter(n => n !== null);

        const maxNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
        const siguienteNumero = maxNumero + 1;

        nuevaCelda.textContent = `Control-${siguienteNumero}`;
      } else {
        const variable = fila.dataset.variable;
        if (!variable || !(variable in plantillas)) return;

        const campo = plantillas[variable].cloneNode(true);
        campo.value = '';
        campo.setAttribute('data-index', nuevoIndex);
        nuevaCelda.appendChild(campo);
      }

      fila.appendChild(nuevaCelda);
    });

    // 🎯 Actualizar colspan
    actualizarColspanTabla?.();

    console.log('Controles previos cargados correctamente.');
  } catch (error) {
    console.error('Error al cargar controles previos:', error);
  }
}
