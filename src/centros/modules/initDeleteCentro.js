// modules/deleteCentro.js
export function initDeleteCentro() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-eliminar-centro");
    if (!btn) return;

    e.preventDefault();

    const id = btn.dataset.id;
    const nombre = btn.dataset.nombre;

    if (!id) return;

    const confirmar = confirm(`¿Seguro que quieres eliminar el centro "${nombre}"?`);
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://my.tumejortugroup.com/api/v1/centros/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        alert(`✅ Centro "${nombre}" eliminado correctamente.`);
        btn.closest("tr").remove(); // elimina la fila de la tabla
      } else {
        console.error("❌ Error al eliminar:", res.status, await res.text());
        alert("No se pudo eliminar el centro.");
      }
    } catch (err) {
      console.error("❌ Error en la petición DELETE:", err);
      alert("Error de conexión con el servidor.");
    }
  });
}
