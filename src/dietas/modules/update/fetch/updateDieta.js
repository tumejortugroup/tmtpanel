import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';

export async function actualizarDieta() {
  const token = localStorage.getItem("token");
  const idDieta = obtenerIdDietaDesdeUrl();
  
  if (!idDieta) {
    console.error("❌ No se encontró el ID de la dieta en la URL.");
    alert("❌ No se encontró el ID de la dieta.");
    return;
  }

  // 🔥 Obtener elementos de macros
  const caloriesElement = document.getElementById("table-caloriesDieta");
  const proteinElement = document.getElementById("table-proteinDieta");
  const fatElement = document.getElementById("table-fatDieta");
  const carbsElement = document.getElementById("table-carbsDieta");

  if (!caloriesElement || !proteinElement || !fatElement || !carbsElement) {
    console.error("❌ No se encontraron los elementos de macros en el DOM.");
    console.log("Elementos encontrados:", {
      calories: !!caloriesElement,
      protein: !!proteinElement,
      fat: !!fatElement,
      carbs: !!carbsElement
    });
    alert("❌ No se pudieron cargar los valores de macros. Por favor, recarga la página.");
    return;
  }

  // 🔥 Obtener valores y limpiar texto
  const caloriasText = (caloriesElement.value || "0")
    .replace(/gr|g|gramos|kcal/gi, "")
    .replace(/,/g, ".")
    .trim();

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
    caloriasText,
    proteinasText,
    grasasText,
    carbohidratosText
  });

  // 🔥 Convertir a números
  const calorias = parseFloat(caloriasText);
  const proteinas = parseFloat(proteinasText);
  const grasas = parseFloat(grasasText);
  const carbohidratos = parseFloat(carbohidratosText);

  if (isNaN(calorias) || isNaN(proteinas) || isNaN(grasas) || isNaN(carbohidratos)) {
    console.error("❌ Los valores de macros no son válidos:", {
      calorias,
      proteinas,
      grasas,
      carbohidratos,
      textos: { caloriasText, proteinasText, grasasText, carbohidratosText }
    });
    alert("❌ Los valores de macros no son válidos. Asegúrate de haber añadido alimentos a tu dieta.");
    return;
  }

  // 🔥 Validar que no sean negativos
  if (calorias < 0 || proteinas < 0 || grasas < 0 || carbohidratos < 0) {
    console.error("❌ Los valores de macros no pueden ser negativos:", {
      calorias, proteinas, grasas, carbohidratos
    });
    alert("❌ Los valores de macros no pueden ser negativos.");
    return;
  }

  // 🔥 Preparar datos para enviar
  const data = {
    calorias_dieta: calorias,
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

    } else {
      console.error("❌ Error al actualizar la dieta:", result);

    }
  } catch (error) {
    console.error("❌ Error en la petición:", error);

  }
}