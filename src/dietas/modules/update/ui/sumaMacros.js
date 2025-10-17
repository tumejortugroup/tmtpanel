// ===== ARCHIVO: sumaMacros.js =====

import { getAlimentos } from "../fetch/getAlimentos.js";

export let alimentosCache = [];

export async function prepararSumaMacros() {

  
  alimentosCache = await getAlimentos();


  const contenedor = document.getElementById("tabla-container");
  if (!contenedor) {

    return;
  }



  // Event delegation - escucha cambios en TODO el contenedor
  contenedor.addEventListener("change", (e) => {

    
    const fila = e.target.closest("tr");
    if (!fila) return;

    // Solo recalcular si es el PRIMER select de alimentos o input de cantidad
    const primerSelect = fila.querySelector('select[name="select-alimentos"]');
    const esElPrimerSelect = e.target === primerSelect;
    const esInputCantidad = e.target.classList.contains("input-cantidad");



    if (esElPrimerSelect || esInputCantidad) {

      recalcularSoloAlimentosPrincipales();
    } else {
      console.log("❌ Evento ignorado - no es primer select ni input cantidad");
    }
  });

  contenedor.addEventListener("input", (e) => {
    console.log("📝 Evento input detectado en:", e.target.tagName, e.target.className);
    if (e.target.classList.contains("input-cantidad")) {

      recalcularSoloAlimentosPrincipales();
    }
  });



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
 

  // Diagnóstico completo
  const todasLasTablas = contenedor.querySelectorAll("table");
  const tablasConClase = contenedor.querySelectorAll(".table-dieta");
  

 

  // Buscar filas en TODAS las tablas (con o sin clase)
  let todasLasFilas = [];
  todasLasTablas.forEach((tabla, tablaIndex) => {
    const filasTabla = tabla.querySelectorAll("tbody tr");
  
    todasLasFilas.push(...filasTabla);
  });


  // Filtrar filas válidas (que tengan select y input)
  const filasValidas = Array.from(todasLasFilas).filter(fila => {
    const tieneSelect = fila.querySelector('select[name="select-alimentos"]');
    const tieneInput = fila.querySelector('.input-cantidad');
    const esObservaciones = fila.querySelector('textarea');
    return tieneSelect && tieneInput && !esObservaciones;
  });



  if (filasValidas.length === 0) {
    actualizarInputsCalculados(0, 0, 0, 0);
    return
  }

  filasValidas.forEach((fila, index) => {
    const selectPrincipal = fila.querySelector('select[name="select-alimentos"]');
    const input = fila.querySelector(".input-cantidad");

    const alimentoId = selectPrincipal?.value;
    const cantidad = parseFloat(input?.value) || 0;



    const alimento = alimentosCache.find(a => a.id_alimento == alimentoId);
    if (!alimento) {
      
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



  if (elementos.calorias) {
    elementos.calorias.value = `${calorias.toFixed(1)} kcal`;
  }
  if (elementos.proteinas) {
    elementos.proteinas.value = `${proteinas.toFixed(1)} gr`;
  }
  if (elementos.grasas) {
    elementos.grasas.value = `${grasas.toFixed(1)} gr`;
  }
  if (elementos.carbohidratos) {
    elementos.carbohidratos.value = `${hidratos.toFixed(1)} gr`;  
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