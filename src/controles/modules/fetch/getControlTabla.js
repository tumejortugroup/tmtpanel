import { actualizarColspanTabla } from '../ui/columns.js';

export async function cargarControlesPrevios(idUsuario) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Token JWT no encontrado');
    return;
  }

  try {
    const response = await fetch(`https://my.tumejortugroup.com/api/v1/datos/ultimos/${idUsuario}`, {
      headers: { 'Authorization': `Bearer ${token}` }
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

    // Limpiar todas las celdas de la tabla
    filas.forEach(fila => {
      fila.querySelectorAll('td').forEach(td => td.remove());
    });

    controles.reverse();

    // 🔒 Crear columnas previas como texto plano
    controles.forEach(control => {
      filas.forEach(fila => {
        const nuevaCelda = document.createElement('td');
        nuevaCelda.style.backgroundColor = 'white';

        const variable = fila.dataset.variable;
        let value = control[variable] ?? '';

        // 🔄 Mapeo especial
        if (variable === 'porcentaje_masa_magra' && control.indice_masa_magra !== undefined) {
          value = control.indice_masa_magra;
        }

        if (variable === 'nombre') {
          nuevaCelda.textContent = control.nombre ?? '';
        } else if (variable === 'fecha') {
          nuevaCelda.textContent = control.fecha?.split('T')[0] ?? '';
        } else {
          nuevaCelda.textContent = value;
        }

        fila.appendChild(nuevaCelda);
      });
    });

    // 🆕 Crear la última columna editable
    const nuevoIndex = controles.length;
    filas.forEach(fila => {
      const nuevaCelda = document.createElement('td');
      nuevaCelda.style.backgroundColor = '#f9f9f9';

      const variable = fila.dataset.variable;

      if (variable === 'nombre') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'nombre form-control';
        input.setAttribute('data-index', nuevoIndex);
        input.value = `Control-`;
        nuevaCelda.appendChild(input);

      } else if (variable === 'fecha') {
        const input = document.createElement('input');
        input.type = 'date';
        input.className = 'fecha form-control';
        input.setAttribute('data-index', nuevoIndex);
        const hoy = new Date().toISOString().split('T')[0];
        input.value = hoy;
        nuevaCelda.appendChild(input);

      } else {
        if (!variable || !(variable in plantillas)) return;
        const campo = plantillas[variable].cloneNode(true);

        // Variables que se copian del último control y quedan bloqueadas
        const copiarVariables = [
          'genero',
          'humero_biepicondileo',
          'femur_bicondileo',
          'muneca_estiloideo',
          'muneca_circunferencia',
        ];

        if (copiarVariables.includes(variable) && controles.length > 0) {
          campo.value = controles[controles.length - 1][variable] ?? '';
          campo.readOnly = true;
        } else {
          campo.value = '';
          campo.readOnly = false;
        }

        campo.disabled = false;
        campo.setAttribute('data-index', nuevoIndex);
        nuevaCelda.appendChild(campo);
      }

      fila.appendChild(nuevaCelda);
    });

    actualizarColspanTabla?.();
    console.log('✅ Controles previos cargados correctamente.');
  } catch (error) {
    console.error('❌ Error al cargar controles previos:', error);
  }
}
