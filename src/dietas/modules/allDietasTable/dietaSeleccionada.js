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

      /* ------------------------------------------
         🔗 ACTUALIZAR BOTONES DEL NUEVO MENÚ
      ------------------------------------------- */

      // Botón "Ver Control"
      const btnVerControl = rowElement.querySelector('.acciones-lista .btn-ver-control');
      if (btnVerControl) {
        btnVerControl.onclick = () => {
          const idUsuario = rowElement.dataset.idUsuario;
          window.location.href = `/dashboard/controles/informe.html?id_usuario=${idUsuario}&id_dato=${data?.id_dato || ""}`;
        };
      }

      // Botón "Ver Dieta"
      const btnVerDieta = rowElement.querySelector('.acciones-lista .btn-ver-dieta');
      if (btnVerDieta) {
        btnVerDieta.onclick = () => {
          window.location.href = `/dashboard/dietas/dieta.html?id_dieta=${idDieta}`;
        };
      }

      // Botón "Editar Dieta"
      const btnEditarDieta = rowElement.querySelector('.acciones-lista .btn-editar-dieta');
      if (btnEditarDieta) {
        btnEditarDieta.onclick = () => {
          window.location.href = `/dashboard/dietas/wizardUpdate.html?id_dieta=${idDieta}&id_dato=${data?.id_dato || ""}`;
        };
      }

      // Botón "Eliminar Dieta"
      const btnEliminar = rowElement.querySelector('.acciones-lista .btn-eliminar');
      if (btnEliminar) {
        btnEliminar.setAttribute('data-id', idDieta);
        btnEliminar.setAttribute('data-nombre', data?.nombre_dato || 'Dieta');
      }

    } catch (err) {
      console.error("❌ Error al obtener dato de dieta:", err);
    }
  }

  // Cuando cambia el select → actualizar info
  selectDieta.addEventListener('change', e => {
    const idDieta = e.target.value;
    if (idDieta) {
      actualizarFila(idDieta);
    } else {
      const nombreDatoTd = rowElement.querySelector('.nombre-dato');
      const fechaDatoTd = rowElement.querySelector('.fecha-dato');
      if (nombreDatoTd) nombreDatoTd.textContent = '—';
      if (fechaDatoTd) fechaDatoTd.textContent = '—';

      // Desactivar botones
      const buttons = rowElement.querySelectorAll('.acciones-lista button');
      buttons.forEach(btn => btn.onclick = null);
    }
  });
}
