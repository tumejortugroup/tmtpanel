export function generarPayloadComidas() {
  console.log("🚀 generarPayloadComidas() INICIANDO");
  
  const tablas = document.querySelectorAll(".table-dieta");
  console.log("📊 Tablas encontradas:", tablas.length);

  const comidas = [];

  // Asegurar que el cache existe
  const alimentosCache = window.__alimentosCache;
  if (!alimentosCache) {
    console.error("❌ ERROR: NO existe window.__alimentosCache");
    return [];
  }

  // 1️⃣ TABLAS NORMALES (COMIDAS)
  tablas.forEach((tabla, index) => {
    console.log(`🍽️ Procesando tabla ${index + 1}`);

    const tipoComida = tabla.querySelector("select[name='tipo-comida']")?.value;
    const filas = tabla.querySelectorAll("tbody tr");

    const alimentos = [];

    filas.forEach((fila, filaIndex) => {
      const selectCategoria = fila.querySelector("select[name='select-categoria']");
      const selectsAlimento = fila.querySelectorAll("select[name='select-alimentos']");
      const inputCantidad = fila.querySelector(".input-cantidad");

      if (!selectsAlimento.length || !inputCantidad) return;

      const idAlimento = selectsAlimento[0]?.value;
      const cantidad = parseFloat(inputCantidad.value);

      if (!idAlimento || isNaN(cantidad)) return;

      // 🔥 FIX IMPORTANTE AQUÍ
      const alimentoCache = alimentosCache.find(a => a.id_alimento == idAlimento);

      if (!alimentoCache) {
        console.warn(`⚠️ Alimento ${idAlimento} no encontrado en cache`);
        return;
      }

      const factor = cantidad / 100;

      const alimento = {
        id_alimento: Number(idAlimento),
        cantidad: cantidad,
        calorias_totales_alimento: parseFloat(alimentoCache.calorias) * factor,
        proteinas_totales_alimento: parseFloat(alimentoCache.proteinas) * factor,
        grasas_totales_alimento: parseFloat(alimentoCache.grasas) * factor,
        carbohidratos_totales_alimento: parseFloat(alimentoCache.carbohidratos) * factor,
        categoria: selectCategoria?.value?.toLowerCase() || "desconocida",
      };

      // --- EQUIVALENTES ---
      const equivalentes = {};

      for (let i = 1; i < selectsAlimento.length && i <= 9; i++) {
        const eqSelect = selectsAlimento[i];
        const eqValue = eqSelect.value;

        if (eqValue) {
          const cantidadEq = parseFloat(
            eqSelect.parentElement.nextElementSibling?.textContent || 0
          );

          if (i === 1) {
            equivalentes.id_alimento_equivalente = Number(eqValue);
            equivalentes.cantidad_equivalente = cantidadEq;
          } else if (i === 2) {
            equivalentes.id_alimento_equivalente1 = Number(eqValue);
            equivalentes.cantidad_equivalente1 = cantidadEq;
          } else {
            equivalentes[`id_alimento_equivalente${i}`] = Number(eqValue);
            equivalentes[`cantidad_equivalente${i}`] = cantidadEq;
          }
        }
      }

      if (Object.keys(equivalentes).length > 0) {
        alimento.equivalentes = [equivalentes];
      }

      alimentos.push(alimento);
    });

    const hora = tabla.querySelector("input[type='time']")?.value || "";
    const nota = tabla.querySelector("textarea")?.value || "";

    if (alimentos.length > 0 || nota.trim() !== "") {
      comidas.push({
        tipo_comida: tipoComida,
        hora: hora,
        nota: nota,
        alimentos,
      });
    }
  });

  // 2️⃣ SUPLEMENTACIÓN
  const tablaSuplemento = document.getElementById("Suplementacion");

  if (tablaSuplemento) {
    const textarea = tablaSuplemento.querySelector("textarea");
    const notaSuplemento = textarea?.value || "";

    if (notaSuplemento.trim() !== "") {
      comidas.push({
        tipo_comida: "suplementacion",
        hora: "",
        nota: notaSuplemento,
        alimentos: [],
      });
    }
  }

  console.log("📦 Payload final:", comidas);
  return comidas;
}
