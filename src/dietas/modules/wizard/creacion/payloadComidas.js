import { alimentosCache } from '../ui/sumaMacros.js';

export function generarPayloadComidas() {
  const tablas = document.querySelectorAll(".table-dieta");
  const comidas = [];

  tablas.forEach(tabla => {
    const tipoComida = tabla.querySelector("select[name='tipo-comida']")?.value;
    const filas = tabla.querySelectorAll("tbody tr");

    const alimentos = [];

    filas.forEach(fila => {
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
        categoria: fila.querySelector("select")?.value?.toLowerCase() || "desconocida"
      };

      // Equivalentes
      const equivalentes = [];

      const eq1 = selectAlimento[1]?.value;
      const eq2 = selectAlimento[2]?.value;

      if (eq1 || eq2) {
        const eqObj = {};
        if (eq1) {
          const cantidadEq1 = parseFloat(selectAlimento[1]?.parentElement.nextElementSibling?.textContent || 0);
          eqObj.id_alimento_equivalente = Number(eq1);
          eqObj.cantidad_equivalente = cantidadEq1;
        }
        if (eq2) {
          const cantidadEq2 = parseFloat(selectAlimento[2]?.parentElement.nextElementSibling?.textContent || 0);
          eqObj.id_alimento_equivalente1 = Number(eq2);
          eqObj.cantidad_equivalente1 = cantidadEq2;
        }

        alimento.equivalentes = [eqObj];
      }

      alimentos.push(alimento);
    });

    if (alimentos.length > 0) {
 const hora = tabla.querySelector("input[name='cantidad-alimentos']")?.value || "";
const nota = tabla.querySelector(".text-dieta")?.value || "";


  comidas.push({
    tipo_comida: tipoComida,
    hora: hora,
    nota: nota,
    alimentos
  });
}
  });

  console.log("📦 Payload generado para comidas:", comidas);
  return comidas;
}
