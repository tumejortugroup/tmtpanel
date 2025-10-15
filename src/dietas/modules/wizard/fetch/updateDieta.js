import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';

export async function actualizarDieta() {
  const token = localStorage.getItem("token");
  const idDieta = obtenerIdDietaDesdeUrl();
  
  if (!idDieta) {
    console.error("❌ No se encontró el ID de la dieta en la URL.");
    alert("❌ No se encontró el ID de la dieta.");
    return;
  }

  const nombreElement = document.getElementById("nombre-dieta");
  const descripcionElement = document.getElementById("descripcion-dieta");
  
  // Hacer opcionales nombre y descripción
  const nombre = nombreElement?.value?.trim() || "";
  const descripcion = descripcionElement?.value?.trim() || "";

  const proteinElement = document.getElementById("table-protein");
  const fatElement = document.getElementById("table-fat");
  const carbsElement = document.getElementById("table-carbs");

  // ⬇️ CAMBIO: Verificar que existen los elementos
  if (!proteinElement || !fatElement || !carbsElement) {
    console.error("❌ No se encontraron los elementos de macros en el DOM.");
    console.log("Elementos encontrados:", {
      protein: !!proteinElement,
      fat: !!fatElement,
      carbs: !!carbsElement
    });
    alert("❌ No se pudieron cargar los valores de macros. Por favor, recarga la página.");
    return;
  }

  // ⬇️ CAMBIO: Obtener texto y limpiar mejor
  const proteinasText = (proteinElement.textContent || proteinElement.innerText || "0")
    .replace(/gr|g|gramos/gi, "")
    .replace(/,/g, ".")
    .trim();
  
  const grasasText = (fatElement.textContent || fatElement.innerText || "0")
    .replace(/gr|g|gramos/gi, "")
    .replace(/,/g, ".")
    .trim();
  
  const carbohidratosText = (carbsElement.textContent || carbsElement.innerText || "0")
    .replace(/gr|g|gramos/gi, "")
    .replace(/,/g, ".")
    .trim();

  console.log("📊 Valores extraídos:", {
    proteinasText,
    grasasText,
    carbohidratosText
  });

  const proteinas = parseFloat(proteinasText);
  const grasas = parseFloat(grasasText);
  const carbohidratos = parseFloat(carbohidratosText);

  // ⬇️ CAMBIO: Mejor validación con valores por defecto
  if (isNaN(proteinas) || isNaN(grasas) || isNaN(carbohidratos)) {
    console.error("❌ Los valores de macros no son válidos:", {
      proteinas,
      grasas,
      carbohidratos,
      textos: {
        proteinasText,
        grasasText,
        carbohidratosText
      }
    });
    alert("❌ Los valores de macros no son válidos. Verifica que la tabla de macros esté cargada correctamente.");
    return;
  }

  // ⬇️ CAMBIO: Validar que los valores sean positivos
  if (proteinas <= 0 || grasas <= 0 || carbohidratos <= 0) {
    console.error("❌ Los valores de macros deben ser mayores a 0:", {
      proteinas,
      grasas,
      carbohidratos
    });
    alert("❌ Los valores de macros deben ser mayores a 0.");
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
      console.log("✅ Dieta actualizada:", result);
      alert("✅ Dieta actualizada correctamente.");
    } else {
      console.error("❌ Error al actualizar la dieta:", result);
      alert(`❌ Hubo un error al actualizar la dieta: ${result.message || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error("❌ Error en la petición:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
}