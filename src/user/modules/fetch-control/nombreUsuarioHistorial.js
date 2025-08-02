import { obtenerIdUsuarioDesdeUrl } from '/src/controles/modules/utils/params.js';

export async function mostrarNombreUsuarioHistorial() {
  const id = obtenerIdUsuarioDesdeUrl();
  if (!id) {
    console.warn("⚠️ No se encontró ID en la URL");
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:9000/api/v1/usuarios/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    

    // Suponiendo que la API devuelve { id_usuario, nombre, ... }
    const nombre = data.nombre || data.username || 'Usuario';

    // Coloca el nombre en el botón
    const btn = document.getElementById('btnGroupDropNombre');
    if (btn) btn.textContent = nombre;

  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
  }
}


