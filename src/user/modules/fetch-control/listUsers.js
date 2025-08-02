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

    // ✅ Ahora verificamos directamente si result es un array
    if (!Array.isArray(result)) {
      console.warn('❌ La respuesta del servidor no es una lista de usuarios');
      return;
    }

    const lista = document.getElementById('lista-users');
    lista.innerHTML = ''; 

    result.forEach(user => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';

      // Usa "id_usuario" porque así lo devuelve tu API
      a.href = `/dashboard/controles/vistaControles.html?id=${user.id_usuario}`;
      a.textContent = user.nombre ?? '(Sin nombre)';
      li.appendChild(a);
      lista.appendChild(li);
    });

    console.log('✅ Lista de usuarios cargada.');
  } catch (err) {
    console.error('❌ Error al cargar usuarios:', err);
  }
}
