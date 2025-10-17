import { alimentosCache } from "../ui/sumaMacros.js";

export function generarPayloadComidas() {
  const tablas = document.querySelectorAll(".table-dieta");
  const comidas = [];

  tablas.forEach(tabla => {
    const tipoComida = tabla.querySelector("select[name='tipo-comida']")?.value;
    const filas = tabla.querySelectorAll("tbody tr");

    const alimentos = [];

    filas.forEach(fila => {
      const selectCategoria = fila.querySelector("select[name='select-categoria']");
      const selectAlimento = fila.querySelectorAll("select[name='select-alimentos']");
      const inputCantidad = fila.querySelector(".input-cantidad");

      if (!selectAlimento.length || !inputCantidad) return;

      const idAlimento = selectAlimento[0]?.value;
      const cantidad = parseFloat(inputCantidad.value);

      if (!idAlimento || isNaN(cantidad)) return;

      const alimentoCache = alimentosCache.find(a => a.id_alimento == idAlimento);
      if (!alimentoCache) return;

      const factor = cantidad / 100;

      const alimento = {
        id_alimento: Number(idAlimento),
        cantidad: cantidad,
        calorias_totales_alimento: parseFloat(alimentoCache.calorias) * factor,
        proteinas_totales_alimento: parseFloat(alimentoCache.proteinas) * factor,
        grasas_totales_alimento: parseFloat(alimentoCache.grasas) * factor,
        carbohidratos_totales_alimento: parseFloat(alimentoCache.carbohidratos) * factor,
        categoria: selectCategoria?.value?.toLowerCase() || "desconocida"
      };

      // Equivalentes en formato flat con numeración incorrecta de la DB
      const equivalentes = {};
      
      for (let i = 1; i < selectAlimento.length && i <= 9; i++) {
        const eqSelect = selectAlimento[i];
        const eqValue = eqSelect?.value;
        
        if (eqValue) {
          const cantidadEq = parseFloat(eqSelect.parentElement.nextElementSibling?.textContent || 0);
          
          if (i === 1) {
            // Primer equivalente sin número
            equivalentes.id_alimento_equivalente = Number(eqValue);
            equivalentes.cantidad_equivalente = cantidadEq;
          } else if (i === 2) {
            // Segundo equivalente con "1"
            equivalentes.id_alimento_equivalente1 = Number(eqValue);
            equivalentes.cantidad_equivalente1 = cantidadEq;
          } else {
            // Del tercero en adelante: i=3 → "3", i=4 → "4", etc.
            equivalentes[`id_alimento_equivalente${i}`] = Number(eqValue);
            equivalentes[`cantidad_equivalente${i}`] = cantidadEq;
          }
        }
      }
console.log('hohahaha')
      // Solo agregar equivalentes si hay al menos uno
      if (Object.keys(equivalentes).length > 0) {
        alimento.equivalentes = [equivalentes];
      }

      alimentos.push(alimento);
    });

    // Capturar hora y nota
    const hora = tabla.querySelector("input[type='time']")?.value || "";
    const nota = tabla.querySelector("textarea")?.value || "";

    // ⬇️ CAMBIO: Agregar comida incluso si no tiene alimentos (para suplementación)
    if (alimentos.length > 0 || nota.trim() !== "") {
      comidas.push({
        tipo_comida: tipoComida,
        hora: hora,
        nota: nota,
        alimentos
      });
    }
  });

  // ⬇️ NUEVO: Capturar tabla de suplementación por separado
  const tablaSuplemento = document.getElementById("Suplementacion");
  if (tablaSuplemento) {
    const notaSuplemento = tablaSuplemento.querySelector("textarea")?.value || "";
    
    if (notaSuplemento.trim() !== "") {
      comidas.push({
        tipo_comida: "suplementacion",
        hora: "",
        nota: notaSuplemento,
        alimentos: []
      });
    }
  }

  return comidas;
}