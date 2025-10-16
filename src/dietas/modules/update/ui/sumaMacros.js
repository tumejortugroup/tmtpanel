// ===== ARCHIVO: sumaMacros.js =====

import { getAlimentos } from "../fetch/getAlimentos.js";

export let alimentosCache = [];

export async function prepararSumaMacros() {
  console.log("🚀 prepararSumaMacros() INICIADA");
  
  alimentosCache = await getAlimentos();
  console.log("💾 Cache cargado:", alimentosCache.length, "alimentos");

  const contenedor = document.getElementById("tabla-container");
  if (!contenedor) {
    console.log("❌ No se encontró tabla-container");
    return;
  }

  console.log("✅ Contenedor encontrado:", contenedor);

  // Event delegation - escucha cambios en TODO el contenedor
  contenedor.addEventListener("change", (e) => {
    console.log("🔔 Evento change detectado en:", e.target.tagName, e.target.name, e.target.className);
    
    const fila = e.target.closest("tr");
    if (!fila) return;

    // Solo recalcular si es el PRIMER select de alimentos o input de cantidad
    const primerSelect = fila.querySelector('select[name="select-alimentos"]');
    const esElPrimerSelect = e.target === primerSelect;
    const esInputCantidad = e.target.classList.contains("input-cantidad");

    console.log("🔍 Análisis del evento:", { 
      esElPrimerSelect, 
      esInputCantidad,
      targetIsFirstSelect: e.target === primerSelect
    });

    if (esElPrimerSelect || esInputCantidad) {
      console.log("✅ Evento válido - recalculando...");
      recalcularSoloAlimentosPrincipales();
    } else {
      console.log("❌ Evento ignorado - no es primer select ni input cantidad");
    }
  });

  contenedor.addEventListener("input", (e) => {
    console.log("📝 Evento input detectado en:", e.target.tagName, e.target.className);
    if (e.target.classList.contains("input-cantidad")) {
      console.log("✅ Input de cantidad - recalculando...");
      recalcularSoloAlimentosPrincipales();
    }
  });

  console.log("🎧 Event listeners configurados");

  // Cálculo inicial
  recalcularSoloAlimentosPrincipales();
}

function recalcularSoloAlimentosPrincipales() {
  console.log("🔄 INICIANDO RECÁLCULO...");
  
  let totalCalorias = 0;
  let totalProteinas = 0;
  let totalGrasas = 0;
  let totalHidratos = 0;

  const contenedor = document.getElementById("tabla-container");
  if (!contenedor) {
    console.log("❌ Contenedor no encontrado");
    return;
  }

  // Diagnóstico completo
  const todasLasTablas = contenedor.querySelectorAll("table");
  const tablasConClase = contenedor.querySelectorAll(".table-dieta");
  
  console.log("🔍 DIAGNÓSTICO COMPLETO:");
  console.log(`📊 Total tablas: ${todasLasTablas.length}`);
  console.log(`📊 Tablas con .table-dieta: ${tablasConClase.length}`);
  
  todasLasTablas.forEach((tabla, index) => {
    console.log(`Tabla ${index}: clases="${tabla.className}"`);
  });

  // Buscar filas en TODAS las tablas (con o sin clase)
  let todasLasFilas = [];
  todasLasTablas.forEach((tabla, tablaIndex) => {
    const filasTabla = tabla.querySelectorAll("tbody tr");
    console.log(`📊 Tabla ${tablaIndex}: ${filasTabla.length} filas`);
    todasLasFilas.push(...filasTabla);
  });

  console.log(`📋 Total filas de todas las tablas: ${todasLasFilas.length}`);

  // Filtrar filas válidas (que tengan select y input)
  const filasValidas = Array.from(todasLasFilas).filter(fila => {
    const tieneSelect = fila.querySelector('select[name="select-alimentos"]');
    const tieneInput = fila.querySelector('.input-cantidad');
    const esObservaciones = fila.querySelector('textarea');
    return tieneSelect && tieneInput && !esObservaciones;
  });

  console.log(`📋 Filas válidas para procesar: ${filasValidas.length}`);

  if (filasValidas.length === 0) {
    console.log("⚠️ NO HAY FILAS VÁLIDAS");
    actualizarInputsCalculados(0, 0, 0, 0);
    return;
  }

  filasValidas.forEach((fila, index) => {
    const selectPrincipal = fila.querySelector('select[name="select-alimentos"]');
    const input = fila.querySelector(".input-cantidad");

    const alimentoId = selectPrincipal?.value;
    const cantidad = parseFloat(input?.value) || 0;

    console.log(`Fila ${index}:`, {
      alimentoId: alimentoId || "SIN SELECCIONAR",
      cantidad,
      inputValue: input?.value || "VACÍO"
    });

    if (!alimentoId || cantidad <= 0) {
      console.log(`❌ Fila ${index}: saltada`);
      return;
    }

    const alimento = alimentosCache.find(a => a.id_alimento == alimentoId);
    if (!alimento) {
      console.log(`❌ Alimento ${alimentoId} no encontrado en cache`);
      return;
    }

    const factor = cantidad / 100;
    const calorias = parseFloat(alimento.calorias) || 0;
    const proteinas = parseFloat(alimento.proteinas) || 0;
    const grasas = parseFloat(alimento.grasas) || 0;
    const hidratos = parseFloat(alimento.carbohidratos) || 0;

    totalCalorias += calorias * factor;
    totalProteinas += proteinas * factor;
    totalGrasas += grasas * factor;
    totalHidratos += hidratos * factor;

    console.log(`✅ Sumando ${alimento.nombre}: ${(calorias * factor).toFixed(1)} cal`);
  });

  console.log("📊 TOTALES FINALES:", {
    calorias: totalCalorias.toFixed(1),
    proteinas: totalProteinas.toFixed(1),
    grasas: totalGrasas.toFixed(1),
    hidratos: totalHidratos.toFixed(1)
  });

  actualizarInputsCalculados(totalCalorias, totalProteinas, totalGrasas, totalHidratos);
}

function actualizarInputsCalculados(calorias, proteinas, grasas, hidratos) {
  const elementos = {
    calorias: document.getElementById("table-caloriesDieta1"),
    proteinas: document.getElementById("table-proteinDieta1"),
    grasas: document.getElementById("table-fatDieta1"),
    carbohidratos: document.getElementById("table-carbsDieta1")
  };

  console.log("🎯 Elementos para actualizar:", {
    calorias: !!elementos.calorias,
    proteinas: !!elementos.proteinas,
    grasas: !!elementos.grasas,
    carbohidratos: !!elementos.carbohidratos
  });

  if (elementos.calorias) {
    elementos.calorias.value = `${calorias.toFixed(1)} kcal`;
    console.log("✅ Calorías actualizadas:", elementos.calorias.value);
  }
  if (elementos.proteinas) {
    elementos.proteinas.value = `${proteinas.toFixed(1)} gr`;
    console.log("✅ Proteínas actualizadas:", elementos.proteinas.value);
  }
  if (elementos.grasas) {
    elementos.grasas.value = `${grasas.toFixed(1)} gr`;
    console.log("✅ Grasas actualizadas:", elementos.grasas.value);
  }
  if (elementos.carbohidratos) {
    elementos.carbohidratos.value = `${hidratos.toFixed(1)} gr`;
    console.log("✅ Carbohidratos actualizados:", elementos.carbohidratos.value);
  }

  // Comparar objetivo vs calculado
  compararYSombrear("table-caloriesDieta", "table-caloriesDieta1");
  compararYSombrear("table-proteinDieta", "table-proteinDieta1");
  compararYSombrear("table-fatDieta", "table-fatDieta1");
  compararYSombrear("table-carbsDieta", "table-carbsDieta1");
}

function compararYSombrear(idNecesario, idDieta) {
  const tdNecesario = document.getElementById(idNecesario);
  const tdDieta = document.getElementById(idDieta);

  if (!tdNecesario || !tdDieta) return;

  const valNecesario = parseFloat(tdNecesario.value || tdNecesario.textContent);
  const valDieta = parseFloat(tdDieta.value || tdDieta.textContent);

  if (isNaN(valNecesario) || isNaN(valDieta)) return;

  if (valDieta > valNecesario) {
    tdDieta.classList.add("exceso-macro");
  } else {
    tdDieta.classList.remove("exceso-macro");
  }
}

export function configurarListenersParaNuevaTabla() {
  console.log("🔄 configurarListenersParaNuevaTabla() llamada");
  recalcularSoloAlimentosPrincipales();
}