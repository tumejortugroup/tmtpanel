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
    const res = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    
    const nombre = data.nombre || data.username || 'Usuario';
    const numeroUsuarioCompleto = data.numero_usuario; // Capturar numero_usuario completo
    
    // ✅ Extraer solo los 3 primeros números (antes del guion)
    const numeroUsuario = numeroUsuarioCompleto ? numeroUsuarioCompleto.split('-')[0] : null;
    


    // Guardar en localStorage como respaldo
    if (numeroUsuario) {
      localStorage.setItem('numero_usuario_actual', numeroUsuario);
    }

    // Esperar un momento si el select aún no tiene opciones cargadas
    const esperarOSeleccionar = () => {
      const option = select.querySelector(`option[value="${id}"]`);
      if (option) {
        select.value = id;
        select.dataset.numeroUsuario = numeroUsuario;
      } else {
        setTimeout(esperarOSeleccionar, 100);
      }
    };

    esperarOSeleccionar();

    return { id, nombre, numeroUsuario };

  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
  }
}