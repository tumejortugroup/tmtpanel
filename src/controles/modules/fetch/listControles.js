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
      li.className = 'd-flex align-items-center justify-content-between px-2';

      const label = document.createElement('label');
      label.className = 'dropdown-item m-0 flex-grow-1';
      label.style.cursor = 'pointer';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'control-checkbox me-2';
      checkbox.style.cursor = 'pointer';
      checkbox.value = control.nombre;
      if (primeros4.includes(control)) checkbox.checked = true;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(control.nombre ?? '(Sin nombre)'));

      const btnVer = document.createElement('a');
      btnVer.href = `/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${control.id_dato}`;
      btnVer.textContent = 'Ver';
      btnVer.className = 'text-primary ms-2';
      btnVer.style.fontSize = '13px';
      btnVer.style.textDecoration = 'none';
      btnVer.addEventListener('click', e => e.stopPropagation());

      li.appendChild(label);
      li.appendChild(btnVer);
      lista.appendChild(li);
    });

    const contenedorBoton = document.createElement('div');
    contenedorBoton.className = 'px-3 pb-2';

    const btnMostrar = document.createElement('button');
    btnMostrar.textContent = 'Mostrar';
    btnMostrar.id = 'btn-mostrar-controles';
    btnMostrar.className = 'btn btn-primary w-100 mt-2';

    btnMostrar.addEventListener('click', () => {
      cargarControlesSeleccionados();


      const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('btnControlDrop'));
      if (dropdown) dropdown.hide();
    });

    contenedorBoton.appendChild(btnMostrar);


    lista.appendChild(contenedorBoton);



    const boton = document.getElementById('ver-controles');
    boton.addEventListener('click', () => {
      cargarControlesSeleccionados();
      const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('btnControlDrop'));
      if (dropdown) dropdown.hide();
    });

    lista.addEventListener('click', (e) => {
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
