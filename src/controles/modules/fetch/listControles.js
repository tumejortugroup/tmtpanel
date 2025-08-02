
import { obtenerIdUsuarioDesdeUrl } from '../utils/params.js';


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

    result.data.forEach(control => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = `/dashboard/controles/vistaControles.html?id=${idUsuario}&nombre=${encodeURIComponent(control.nombre)}`;
      a.textContent = control.nombre ?? '(Sin nombre)';
      li.appendChild(a);
      lista.appendChild(li);
    });

    console.log('✅ Lista de controles cargada.');
  } catch (err) {
    console.error('❌ Error al cargar controles:', err);
  }
}
