import { obtenerIdUsuarioDesdeUrl } from '/src/controles/modules/utils/params.js';
import { cargarControlesSeleccionados } from '/src/user/modules/fetch-control/getMultiplesControles.js';


export async function cargarListaControles() {
  const idUsuario = obtenerIdUsuarioDesdeUrl();
  if (!idUsuario) {
    console.warn('ID de usuario no encontrado en la URL');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:9000/api/v1/datos/usuario/${idUsuario}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await res.json();
    if (!result.success || !Array.isArray(result.data)) {
      console.warn('No se pudieron cargar los controles');
      return;
    }

    const lista = document.getElementById('lista-controles');
    lista.innerHTML = '';

    const boton = document.createElement('button');
    boton.id = 'ver-controles';
    boton.className = 'btn btn-primary';
    boton.textContent = 'Mostrar';

    boton.addEventListener('click', () => {
      cargarControlesSeleccionados();
    });

    lista.appendChild(boton);
    const primeros4 = result.data.slice(0, 4);


   result.data.forEach(control => {
  const li = document.createElement('li');
  const isPreselected = primeros4.includes(control);

  li.innerHTML = `
    <label class="dropdown-item">
      <input type="checkbox" class="control-checkbox" value="${control.nombre}" ${isPreselected ? 'checked' : ''}>
      ${control.nombre ?? '(Sin nombre)'}
    </label>
  `;
  lista.appendChild(li);
});


  } catch (err) {
    console.error('❌ Error al cargar controles:', err);
  }
}
