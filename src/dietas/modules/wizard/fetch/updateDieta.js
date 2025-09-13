import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';
export async function actualizarDieta() {

    const token = localStorage.getItem("token");
  const idDieta = obtenerIdDietaDesdeUrl(); // ⬅️ Usa el parámetro de la URL
  if (!idDieta) {
    console.error("❌ No se encontró el ID de la dieta en la URL.");
    return;
  }

  // Obtener nombre y descripción
  const nombre = document.getElementById("nombre-dieta").value.trim();
  const descripcion = document.getElementById("descripcion-dieta").value.trim();

  if (!nombre) {
    alert("⚠️ El nombre de la dieta es obligatorio.");
    return;
  }

  // Obtener macros
  const proteinasText = document.getElementById("table-protein").textContent.replace("gr", "").trim();
  const grasasText = document.getElementById("table-fat").textContent.replace("gr", "").trim();
  const carbohidratosText = document.getElementById("table-carbs").textContent.replace("gr", "").trim();

  const proteinas = parseFloat(proteinasText);
  const grasas = parseFloat(grasasText);
  const carbohidratos = parseFloat(carbohidratosText);

  const data = {
    nombre,
    descripcion,
    proteinas_dieta: proteinas,
    grasas_dieta: grasas,
    carbohidratos_dieta: carbohidratos
  };

  try {
    const response = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/${idDieta}`, {
      method: "PUT",
      headers: {
             Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("✅ Dieta actualizada correctamente.");
      console.log("📦 Respuesta del servidor:", result);
    } else {
      console.error("❌ Error al actualizar la dieta:", result);
      alert("❌ Hubo un error al actualizar la dieta.");
    }
  } catch (error) {
    console.error("❌ Error en la petición:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
}