export async function cargarListaUsers() {
  try {
    const token = localStorage.getItem('token');
    const centro_id = localStorage.getItem("centro_id");

    if (!token || !centro_id) {
      console.warn("⚠️ Token o centro_id no encontrados en localStorage");
      return;
    }

    const res = await fetch(`http://localhost:9000/api/v1/usuarios/centro?id=${centro_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await res.json();
    console.log('📦 Respuesta del servidor:', result);

    if (!Array.isArray(result)) {
      console.warn('❌ La respuesta del servidor no es una lista de usuarios');
      return;
    }

    const select = document.getElementById('select-usuarios');
    select.innerHTML = '<option disabled selected>Seleccionar usuario</option>';

    result.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id_usuario;
      option.textContent = user.nombre ?? 'Usuario';
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      const idUsuario = e.target.value;
      if (idUsuario) {
        window.location.href = `/dashboard/controles/vistaControles.html?id=${idUsuario}`;
      }
    });

    console.log('✅ Lista de usuarios cargada.');
  } catch (err) {
    console.error('❌ Error al cargar usuarios:', err);
  }
}