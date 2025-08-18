export function asignarEventoSelectDieta(rowElement, token) {
  const selectDieta = rowElement.querySelector('select[name="select-dieta"]');

  if (!selectDieta) return;

  selectDieta.addEventListener('change', async (e) => {
    const idDieta = e.target.value;
    if (!idDieta) return;

    try {
      const res = await fetch(`http://localhost:9000/api/v1/dietas/${idDieta}/dato`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();
      const data = result?.data;

      if (data) {
        const nombreDatoTd = rowElement.querySelector('.nombre-dato');
        const fechaDatoTd = rowElement.querySelector('.fecha-dato');

        if (nombreDatoTd) nombreDatoTd.textContent = data.nombre_dato || '—';
        if (fechaDatoTd) fechaDatoTd.textContent = data.fecha_creacion?.split(' ')[0] || '—';
      }

      // 🔗 Actualizar href del botón 👁️ con el id_dieta seleccionado
      const verBtn = rowElement.querySelector('.btn-ver-dieta');
      if (verBtn) {
        verBtn.href = `/dashboard/dietas/dieta.html?id_dieta=${idDieta}`;
      }

    } catch (err) {
      console.error("❌ Error al obtener dato de dieta:", err);
    }
  });
}
