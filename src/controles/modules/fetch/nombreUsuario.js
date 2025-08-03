import { obtenerIdUsuarioDesdeUrl } from '../utils/params.js';

export async function mostrarNombreUsuario() {
  const id = obtenerIdUsuarioDesdeUrl();
  if (!id) {
    console.warn("⚠️ No se encontró ID en la URL");
    return;
  }

  const select = document.getElementById('select-usuarios');
  if (!select) return;

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:9000/api/v1/usuarios/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    const nombre = data.nombre || data.username || 'Usuario';

    // Esperar un momento si el select aún no tiene opciones cargadas
    const esperarOSeleccionar = () => {
      const option = select.querySelector(`option[value="${id}"]`);
      if (option) {
        select.value = id;
      } else {
        setTimeout(esperarOSeleccionar, 100); // intenta de nuevo en 100ms
      }
    };

    esperarOSeleccionar();

  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
  }
}
