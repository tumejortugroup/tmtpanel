import { obtenerIdUsuarioDesdeUrl } from '/src/controles/modules/utils/params.js';
import { actualizarColspanTabla } from '../ui/columns.js';

export async function cargarControlesSeleccionados() {
  const idUsuario = obtenerIdUsuarioDesdeUrl();
  const checkboxes = document.querySelectorAll('.control-checkbox:checked');
  const nombresSeleccionados = Array.from(checkboxes).map(c => c.value);

  if (!idUsuario) {
    console.warn('❌ Falta ID');
    return;
  }

  const tabla = document.querySelector('table');
  const filas = tabla?.querySelectorAll('tbody tr');
  if (!tabla || filas.length === 0) return;

  // Guardar plantilla de campos base
  const plantillas = {};
  filas.forEach(fila => {
    const variable = fila.dataset.variable;
    if (!variable) return;
    const campo = fila.querySelector('input, select');
    if (campo) {
      plantillas[variable] = campo.cloneNode(true);
    }
  });

  // Limpiar tabla siempre
  filas.forEach(fila => {
    if (fila.classList.contains('division-controles')) return;
    fila.querySelectorAll('td').forEach(td => td.remove());
    const th = fila.querySelector('th[colspan]');
    if (th) th.setAttribute('colspan', '1');
  });

  //  Si no hay controles seleccionados, salir después de limpiar
  if (nombresSeleccionados.length === 0) {
    console.warn('❌ No hay controles seleccionados');
    actualizarColspanUserTabla();
    return;
  }

  const controles = [];

  for (let nombre of nombresSeleccionados) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `https://my.tumejortugroup.com/api/v1/datos/usuario/${idUsuario}/control/${encodeURIComponent(nombre)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const result = await res.json();
      if (result.success && result.data) {
        controles.push(result.data);
      }
    } catch (error) {
      console.error(`❌ Error cargando ${nombre}:`, error);
    }
  }

  // Ordenar por fecha ascendente
  controles.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // 🔒 Crear columnas bloqueadas (texto puro)
  controles.forEach(control => {
    filas.forEach(fila => {
      if (fila.classList.contains('division-controles')) return;

      const nuevaCelda = document.createElement('td');
      nuevaCelda.style.backgroundColor = 'white';

      const variable = fila.dataset.variable;
      let value = control[variable] ?? '';

      // 🔄 Mapeo especial: porcentaje_masa_magra <- indice_masa_magra
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

  // 🆕 Crear última columna editable
  const nuevoIndex = controles.length;
  filas.forEach(fila => {
    if (fila.classList.contains('division-controles')) return;

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

      // Variables que se copian del último control
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

}
