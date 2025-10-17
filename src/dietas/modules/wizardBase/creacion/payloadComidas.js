import { alimentosCache } from "../ui/sumaMacros.js";

export function generarPayloadComidas() {
  console.log("🚀 generarPayloadComidas() INICIANDO");
  
  const tablas = document.querySelectorAll(".table-dieta");
  console.log("📊 Tablas encontradas:", tablas.length);
  console.log("📋 Tablas:", tablas);
  
  const comidas = [];

  // 1️⃣ Recopilar tablas normales de comidas
  tablas.forEach((tabla, index) => {
    console.log(`🍽️ Procesando tabla ${index + 1}`);
    
    const tipoComida = tabla.querySelector("select[name='tipo-comida']")?.value;
    console.log(`  Tipo de comida: ${tipoComida}`);
    
    const filas = tabla.querySelectorAll("tbody tr");
    console.log(`  Filas encontradas: ${filas.length}`);

    const alimentos = [];

    filas.forEach((fila, filaIndex) => {
      console.log(`    Procesando fila ${filaIndex + 1}`);
      
      const selectCategoria = fila.querySelector("select[name='select-categoria']");
      const selectAlimento = fila.querySelectorAll("select[name='select-alimentos']");
      const inputCantidad = fila.querySelector(".input-cantidad");

      if (!selectAlimento.length || !inputCantidad) {
        console.log(`      ⚠️ Fila ${filaIndex + 1} sin selects o input, saltando`);
        return;
      }

      const idAlimento = selectAlimento[0]?.value;
      const cantidad = parseFloat(inputCantidad.value);

      console.log(`      ID alimento: ${idAlimento}, Cantidad: ${cantidad}`);

      if (!idAlimento || isNaN(cantidad)) {
        console.log(`      ⚠️ Fila ${filaIndex + 1} sin ID o cantidad válida, saltando`);
        return;
      }

      const alimentoCache = alimentosCache.find(a => a.id_alimento == idAlimento);
      if (!alimentoCache) {
        console.log(`      ❌ Alimento ${idAlimento} no encontrado en cache`);
        return;
      }

      console.log(`      ✅ Alimento encontrado: ${alimentoCache.nombre}`);

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

      // Equivalentes en formato flat
      const equivalentes = {};
      
      for (let i = 1; i < selectAlimento.length && i <= 9; i++) {
        const eqSelect = selectAlimento[i];
        const eqValue = eqSelect?.value;
        
        if (eqValue) {
          const cantidadEq = parseFloat(eqSelect.parentElement.nextElementSibling?.textContent || 0);
          
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

    // Capturar hora y nota
    const hora = tabla.querySelector("input[type='time']")?.value || "";
    const nota = tabla.querySelector("textarea")?.value || "";

    console.log(`  📝 Hora: ${hora}, Nota: ${nota}`);
    console.log(`  🍔 Alimentos procesados: ${alimentos.length}`);

    // Agregar comida si tiene alimentos o nota
    if (alimentos.length > 0 || nota.trim() !== "") {
      comidas.push({
        tipo_comida: tipoComida,
        hora: hora,
        nota: nota,
        alimentos
      });
      console.log(`  ✅ Comida agregada al payload`);
    }
  });

  console.log("📊 Comidas normales procesadas:", comidas.length);

  // 2️⃣ ✅ Capturar tabla de suplementación estática
  console.log("🔍 Buscando tabla de suplementación...");

  const tablaSuplemento = document.getElementById("Suplementacion");
  console.log("📋 Tabla suplementación encontrada:", tablaSuplemento);

  if (tablaSuplemento) {
    const textarea = tablaSuplemento.querySelector("textarea");
    console.log("📝 Textarea encontrado:", textarea);
    
    const notaSuplemento = textarea?.value || "";
    console.log("💬 Valor del textarea:", `"${notaSuplemento}"`);
    
    if (notaSuplemento.trim() !== "") {
      console.log("✅ Agregando suplementación al payload");
      comidas.push({
        tipo_comida: "suplementacion",
        hora: "",
        nota: notaSuplemento,
        alimentos: []
      });
    } else {
      console.log("⚠️ Textarea vacío, no se agrega suplementación");
    }
  } else {
    console.error("❌ No se encontró la tabla #Suplementacion en el DOM");
    console.log("🔍 Todas las tablas en el documento:", document.querySelectorAll("table"));
  }
  
  console.log("📦 Payload final generado:", comidas);
  console.log("📦 Total de comidas:", comidas.length);
  
  return comidas;
}