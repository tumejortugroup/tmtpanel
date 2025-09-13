import { obtenerIdUsuarioDesdeUrl } from '/src/controles/modules/utils/params.js';



function actualizarColspanUserTabla() {
  const filasDivision = document.querySelectorAll('tr.division-controles');

  // Cuenta el total de columnas por cada fila (excepto la <th>)
  const anyFila = document.querySelector('tbody tr:not(.division-controles)');
  const columnasActuales = anyFila?.querySelectorAll('td')?.length || 1;

  filasDivision.forEach(fila => {
    const th = fila.querySelector('th[colspan]');
    if (th) {
      th.setAttribute('colspan', columnasActuales + 1); // +1 por el nombre del parámetro (1ª columna)
    }
  });
}

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

// 🔄 Limpiar tabla siempre
filas.forEach(fila => {
  if (fila.classList.contains('division-controles')) return;
  fila.querySelectorAll('td').forEach(td => td.remove());
  const th = fila.querySelector('th[colspan]');
  if (th) th.setAttribute('colspan', '1');
});

// 🚫 Si no hay controles seleccionados, salir después de limpiar
if (nombresSeleccionados.length === 0) {
  console.warn('❌ No hay controles seleccionados');
  actualizarColspanUserTabla();
  return;
}

const controles = [];

for (let nombre of nombresSeleccionados) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://my.tumejortugroup.com/api/v1/datos/usuario/${idUsuario}/control/${encodeURIComponent(nombre)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await res.json();
    if (result.success && result.data) {
      controles.push(result.data);
    }
  } catch (error) {
    console.error(`❌ Error cargando ${nombre}:`, error);
  }
}

// 🔃 Ordenar por fecha ascendente (más vieja a más reciente)
controles.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

// ▶️ Insertar en la tabla en orden de fecha
controles.forEach(control => {
  filas.forEach(fila => {
    if (fila.classList.contains('division-controles')) return;

    const variable = fila.dataset.variable;
    const celda = document.createElement('td');
    celda.style.backgroundColor = '#f9f9f9';

    if (variable === 'nombre') {
      celda.textContent = control.nombre ?? '';
    } else if (variable === 'fecha') {
      celda.textContent = control.fecha?.split('T')[0] ?? '';
    } else {
      celda.textContent = control[variable] ?? '';
    }

    fila.appendChild(celda);
  });
});


  actualizarColspanUserTabla();

  console.log('✅ Controles seleccionados mostrados correctamente.');
}
