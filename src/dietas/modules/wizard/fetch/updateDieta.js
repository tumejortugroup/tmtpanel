import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';


export async function actualizarDieta() {
  const token = localStorage.getItem("token");
  const idDieta = obtenerIdDietaDesdeUrl();
  
  if (!idDieta) {
    console.error("❌ No se encontró el ID de la dieta en la URL.");
    return;
  }

  const nombreElement = document.getElementById("nombre-dieta");
  const descripcionElement = document.getElementById("descripcion-dieta");

  if (!nombreElement || !descripcionElement) {
    console.error("❌ No se encontraron los campos de nombre o descripción.");
    console.log("Elementos encontrados:", {
      nombre: nombreElement,
      descripcion: descripcionElement
    });
    return;
  }

  const nombre = nombreElement.value.trim();
  const descripcion = descripcionElement.value.trim();

  const proteinElement = document.getElementById("table-protein");
  const fatElement = document.getElementById("table-fat");
  const carbsElement = document.getElementById("table-carbs");

  if (!proteinElement || !fatElement || !carbsElement) {
    console.error("❌ No se encontraron los elementos de macros.");
    console.log("Elementos encontrados:", {
      protein: proteinElement,
      fat: fatElement,
      carbs: carbsElement
    });
    return;
  }

  const proteinasText = proteinElement.textContent.replace("gr", "").trim();
  const grasasText = fatElement.textContent.replace("gr", "").trim();
  const carbohidratosText = carbsElement.textContent.replace("gr", "").trim();

  const proteinas = parseFloat(proteinasText);
  const grasas = parseFloat(grasasText);
  const carbohidratos = parseFloat(carbohidratosText);

  if (isNaN(proteinas) || isNaN(grasas) || isNaN(carbohidratos)) {
    console.error("❌ Los valores de macros no son válidos:", {
      proteinas,
      grasas,
      carbohidratos
    });
    return;
  }

  const data = {
    nombre,
    descripcion,
    proteinas_dieta: proteinas,
    grasas_dieta: grasas,
    carbohidratos_dieta: carbohidratos
  };

  console.log("📤 Datos a enviar:", data);

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