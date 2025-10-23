import { obtenerIdUsuarioDesdeUrl } from '/src/controles/modules/utils/params.js';
import { cargarControlesSeleccionados } from '/src/controles/modules/fetch/getMultiplesControles.js';

export async function cargarListaControles() {
  const idUsuario = obtenerIdUsuarioDesdeUrl();
  if (!idUsuario) {
    console.warn('ID de usuario no encontrado en la URL');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://my.tumejortugroup.com/api/v1/datos/usuario/${idUsuario}`, {
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

    const primeros4 = result.data.slice(0, 4);

    result.data.forEach(control => {
      const li = document.createElement('li');
      const isPreselected = primeros4.includes(control);

      li.innerHTML = `
        <label class="dropdown-item" style="cursor: pointer;">
          <input type="checkbox" class="control-checkbox" style="cursor: pointer;" value="${control.nombre}" ${isPreselected ? 'checked' : ''}>
          ${control.nombre ?? '(Sin nombre)'}
        </label>
      `;
      lista.appendChild(li);
    });

    // botón ya existe en el HTML
    const boton = document.getElementById('ver-controles');
    boton.addEventListener('click', () => {
      cargarControlesSeleccionados();
      // cierra el dropdown
      const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('btnControlDrop'));
      if (dropdown) dropdown.hide();
    });

    // Evitar que se cierre al marcar checkboxes
    const ul = document.getElementById('lista-controles');
    ul.addEventListener('click', (e) => {
      const label = e.target.closest('label.dropdown-item');
      if (label) {
        e.stopPropagation();
        e.preventDefault();
        const cb = label.querySelector('.control-checkbox');
        if (cb) cb.checked = !cb.checked;
      }
    });

    const triggerBtn = document.getElementById('btnControlDrop');
    if (triggerBtn) {
      triggerBtn.setAttribute('data-bs-auto-close', 'outside');
    }

  } catch (err) {
    console.error('❌ Error al cargar controles:', err);
  }
}
