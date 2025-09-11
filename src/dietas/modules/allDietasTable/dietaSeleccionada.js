/**
 * asignarEventoSelectDieta()
 * --------------------------
 * Asocia la lógica de actualización a un <select> de dietas dentro de una fila de usuario.
 *
 * Funcionalidad:
 * - Escucha cambios en el select de dietas.
 * - Al seleccionar una dieta:
 *    - Obtiene los datos asociados vía API (`/dietas/:id/dato`).
 *    - Actualiza dinámicamente las celdas de nombre y fecha.
 *    - Refresca los enlaces de "Ver" y "Editar" para que apunten a la dieta seleccionada.
 * - Si se resetea el select, limpia las celdas.
 *
 * Parámetros:
 * @param {HTMLElement} rowElement - Fila de la tabla que contiene el select y botones.
 * @param {string} token - JWT para autorización en las peticiones.
 *
 * Consideraciones:
 * - Ignora la ejecución si no existe el select en la fila.
 * - Maneja errores de red/API y deja trazas en consola sin romper la UI.
 */

export function asignarEventoSelectDieta(rowElement, token) {
  const selectDieta = rowElement.querySelector('select[name="select-dieta"]');
  if (!selectDieta) return;

  async function actualizarFila(idDieta) {
    try {
      const res = await fetch(`http://localhost:9000/api/v1/dietas/${idDieta}/dato`, {
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

      // 🔗 actualizar botones
      const verBtn = rowElement.querySelector('.btn-ver-dieta');
      if (verBtn) verBtn.href = `/dashboard/dietas/dieta.html?id_dieta=${idDieta}`;

      const editarBtn = rowElement.querySelector('.btn-editar-dieta');
      if (editarBtn) editarBtn.href = `/dashboard/dietas/wizardUpdate.html?id_dieta=${idDieta}&id_dato=${data?.id_dato || ""}`;
    } catch (err) {
      console.error("❌ Error al obtener dato de dieta:", err);
    }
  }

  // 👉 cada vez que se cambia de opción
  selectDieta.addEventListener('change', e => {
    const idDieta = e.target.value;
    if (idDieta) {
      actualizarFila(idDieta);
    } else {
      // resetear si no hay valor
      const nombreDatoTd = rowElement.querySelector('.nombre-dato');
      const fechaDatoTd = rowElement.querySelector('.fecha-dato');
      if (nombreDatoTd) nombreDatoTd.textContent = '—';
      if (fechaDatoTd) fechaDatoTd.textContent = '—';
    }
  });
}
