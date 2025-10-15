export function asignarEventoSelectDieta(rowElement, token) {
  const selectDieta = rowElement.querySelector('select[name="select-dieta"]');
  if (!selectDieta) return;

  async function actualizarFila(idDieta) {
    try {
      const res = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/${idDieta}/dato`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      const data = result?.data;

      const nombreDatoTd = rowElement.querySelector('.nombre-dato');
      const fechaDatoTd = rowElement.querySelector('.fecha-dato');
      if (nombreDatoTd) nombreDatoTd.textContent = '—';
      if (fechaDatoTd) fechaDatoTd.textContent = '—';

      if (data) {
        if (nombreDatoTd) nombreDatoTd.textContent = data.nombre_dato || '—';
        if (fechaDatoTd) fechaDatoTd.textContent = data.fecha_creacion?.split(' ')[0] || '—';
      }

      // 🔗 Actualizar botones directos
      const verBtn = rowElement.querySelector('.list-user-action:last-child .btn-ver-dieta');
      if (verBtn) verBtn.href = `/dashboard/dietas/dieta.html?id_dieta=${idDieta}`;

      const editarBtn = rowElement.querySelector('.list-user-action:last-child .btn-editar-dieta');
      if (editarBtn) editarBtn.href = `/dashboard/dietas/wizardUpdate.html?id_dieta=${idDieta}&id_dato=${data?.id_dato || ""}`;

      // 🔗 Actualizar botones del dropdown
      const dropdownVerControl = rowElement.querySelector('.dropdown-menu .btn-ver-control');
      if (dropdownVerControl) {
        dropdownVerControl.onclick = () => {
          // Obtener el id_usuario de la fila
          const idUsuario = rowElement.querySelector('[data-id-usuario]')?.dataset.idUsuario || 
                            rowElement.dataset.idUsuario || 
                            rowElement.querySelector('td:first-child')?.textContent.trim();
          
          window.location.href = `/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${data?.id_dato || ""}`;
        };
      }

      const dropdownVerDieta = rowElement.querySelector('.dropdown-menu .btn-ver-dieta');
      if (dropdownVerDieta) {
        dropdownVerDieta.onclick = () => {
          window.location.href = `/dashboard/dietas/dieta.html?id_dieta=${idDieta}`;
        };
      }

      const dropdownEditarDieta = rowElement.querySelector('.dropdown-menu .btn-editar-dieta');
      if (dropdownEditarDieta) {
        dropdownEditarDieta.onclick = () => {
          window.location.href = `/dashboard/dietas/wizardUpdate.html?id_dieta=${idDieta}&id_dato=${data?.id_dato || ""}`;
        };
      }

      const dropdownEliminar = rowElement.querySelector('.dropdown-menu .btn-eliminar');
      if (dropdownEliminar) {
        dropdownEliminar.setAttribute('data-id', idDieta);
        dropdownEliminar.setAttribute('data-nombre', data?.nombre_dato || 'Dieta');
      }

    } catch (err) {
      console.error("❌ Error al obtener dato de dieta:", err);
    }
  }

  selectDieta.addEventListener('change', e => {
    const idDieta = e.target.value;
    if (idDieta) {
      actualizarFila(idDieta);
    } else {
      const nombreDatoTd = rowElement.querySelector('.nombre-dato');
      const fechaDatoTd = rowElement.querySelector('.fecha-dato');
      if (nombreDatoTd) nombreDatoTd.textContent = '—';
      if (fechaDatoTd) fechaDatoTd.textContent = '—';

      const dropdownBtns = rowElement.querySelectorAll('.dropdown-menu button');
      dropdownBtns.forEach(btn => btn.onclick = null);
    }
  });
}