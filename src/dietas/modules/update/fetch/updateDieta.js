import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';

export async function actualizarDieta() {
  const token = localStorage.getItem("token");
  const idDieta = obtenerIdDietaDesdeUrl();
  
  if (!idDieta) {
    console.error("❌ No se encontró el ID de la dieta en la URL.");
    alert("❌ No se encontró el ID de la dieta.");
    return;
  }

 
  // 🔥 CORREGIR: Usar los IDs correctos del HTML
  const proteinElement = document.getElementById("table-proteinDieta1");
  const fatElement = document.getElementById("table-fatDieta1");
  const carbsElement = document.getElementById("table-carbsDieta1");

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

  // 🔥 CORREGIR: Obtener valor de los inputs, no el textContent
  const proteinasText = (proteinElement.value || "0")
    .replace(/gr|g|gramos|kcal/gi, "")
    .replace(/,/g, ".")
    .trim();
  
  const grasasText = (fatElement.value || "0")
    .replace(/gr|g|gramos|kcal/gi, "")
    .replace(/,/g, ".")
    .trim();
  
  const carbohidratosText = (carbsElement.value || "0")
    .replace(/gr|g|gramos|kcal/gi, "")
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

  if (isNaN(proteinas) || isNaN(grasas) || isNaN(carbohidratos)) {
    console.error("❌ Los valores de macros no son válidos:", {
      proteinas,
      grasas,
      carbohidratos,
      textos: { proteinasText, grasasText, carbohidratosText }
    });
    alert("❌ Los valores de macros no son válidos. Asegúrate de haber añadido alimentos a tu dieta.");
    return;
  }

  // 🔥 CAMBIAR: Permitir valores 0 si no hay alimentos añadidos
  if (proteinas < 0 || grasas < 0 || carbohidratos < 0) {
    console.error("❌ Los valores de macros no pueden ser negativos:", {
      proteinas, grasas, carbohidratos
    });
    alert("❌ Los valores de macros no pueden ser negativos.");
    return;
  }

  const data = {

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