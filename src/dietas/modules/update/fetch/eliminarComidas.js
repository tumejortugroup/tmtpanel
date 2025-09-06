export async function eliminarComidas(idsComidas) {
  if (!idsComidas || !idsComidas.length) {
    alert("❌ No hay comidas para eliminar.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:9000/api/v1/comidas", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ comidas: idsComidas }) // 👈 aquí le pasas array de IDs
    });

    const result = await res.json();

    if (res.ok) {
      console.log("✅ Comidas eliminadas correctamente:", result);
      return true;
    } else {
      console.error("❌ Error al eliminar comidas:", result);
      return false;
    }
  } catch (error) {
    console.error("❌ Error de red:", error);
    return false;
  }
}
