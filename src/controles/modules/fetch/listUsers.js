export async function cargarListaUsers() {
  try {
    const token = localStorage.getItem('token');
    const centro_id = localStorage.getItem('centro_id');

    if (!token || !centro_id) {
      console.warn('⚠️ Token o centro_id no encontrados en localStorage');
      return;
    }

    const res = await fetch(`https://my.tumejortugroup.com/api/v1/usuarios/centro?id=${centro_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    if (!Array.isArray(result)) {
      console.warn('❌ La respuesta del servidor no es una lista de usuarios');
      return;
    }

    // Elementos del dropdown (HTML existente)
    const ul = document.getElementById('select-usuarios');
    const btn = document.getElementById('dropdownMenuButtonSM');

    if (!ul || !btn) {
      console.warn('❌ No se encontró #select-usuarios o #dropdownMenuButtonSM en el DOM');
      return;
    }

    // Asegurar que el dropdown NO esté abierto por defecto
    ul.classList.remove('show');
    ul.removeAttribute('style');
    btn.setAttribute('aria-expanded', 'false');

    ul.innerHTML = '';
    const liHeader = document.createElement('li');


    // Poblar el UL con items con estilo Bootstrap
    result.forEach(user => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = '#';
      a.textContent = user?.nombre ?? '(Sin nombre)';
      a.dataset.id = user?.id_usuario ?? '';
      li.appendChild(a);
      ul.appendChild(li);
    });

    // Delegación de eventos para manejar el click en cualquier item del dropdown
    ul.addEventListener('click', (e) => {
      const a = e.target.closest('a.dropdown-item');
      if (!a) return;
      e.preventDefault();

      const idUsuario = a.dataset.id;
      const nombre = a.textContent.trim();

      // Actualizar el texto del botón
      btn.textContent = nombre || 'Seleccionar usuario';

      // Cerrar el dropdown (si Bootstrap está disponible en global)
      try {
        const dd = window.bootstrap?.Dropdown?.getOrCreateInstance(btn);
        dd?.hide();
      } catch (_) {
        // Si no está bootstrap en global, no pasa nada
      }

      // Redirigir (misma funcionalidad que tenías con <select>.change)
      if (idUsuario) {
        window.location.href = `/dashboard/controles/control.html?id=${encodeURIComponent(idUsuario)}`;
      }
    });
  } catch (err) {
    console.error('❌ Error al cargar usuarios:', err);
  }
}