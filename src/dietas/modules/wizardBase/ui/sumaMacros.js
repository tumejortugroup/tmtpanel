import { getAlimentos } from "../fetch/getAlimentos.js";

export let alimentosCache = [];

export async function prepararSumaMacros() {
  alimentosCache = await getAlimentos();

  const filas = document.querySelectorAll(".table-dieta tbody tr");

  filas.forEach(fila => {
    const selects = fila.querySelectorAll('select[name="select-alimentos"]');
    const input = fila.querySelector(".input-cantidad");

    if (!selects.length || !input) return;

    // Agregar listener a TODOS los selects para recalcular cuando cambien
    selects.forEach(select => {
      select.addEventListener("change", recalcularTotales);
    });
    
    input.addEventListener("input", recalcularTotales);
  });
}

function recalcularTotales() {
  let totalCalorias = 0;
  let totalProteinas = 0;
  let totalGrasas = 0;
  let totalHidratos = 0;

  const filas = document.querySelectorAll(".table-dieta tbody tr");

  filas.forEach(fila => {
    // ✅ Solo obtener el PRIMER select (alimento principal)
    const selectPrincipal = fila.querySelector('select[name="select-alimentos"]');
    const input = fila.querySelector(".input-cantidad");

    const cantidad = parseFloat(input?.value);
    const alimentoId = selectPrincipal?.value;

    if (!alimentoId || isNaN(cantidad) || cantidad <= 0) return;

    const alimento = alimentosCache.find(a => a.id_alimento == alimentoId);
    if (!alimento) return;

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

  // Actualizar el DOM
  const caloriasEl = document.getElementById("table-caloriesDieta1");
  const proteinasEl = document.getElementById("table-proteinDieta1");
  const grasasEl = document.getElementById("table-fatDieta1");
  const hidratosEl = document.getElementById("table-carbsDieta1");

  if (caloriasEl) caloriasEl.value = `${totalCalorias.toFixed(1)} kcal`;
  if (proteinasEl) proteinasEl.value = `${totalProteinas.toFixed(1)} gr`;
  if (grasasEl) grasasEl.value = `${totalGrasas.toFixed(1)} gr`;
  if (hidratosEl) hidratosEl.value = `${totalHidratos.toFixed(1)} gr`;

  if (caloriasEl) compararYSombrear("table-caloriesDieta", "table-caloriesDieta1");
  if (proteinasEl) compararYSombrear("table-proteinDieta", "table-proteinDieta1");
  if (grasasEl) compararYSombrear("table-fatDieta", "table-fatDieta1");
  if (hidratosEl) compararYSombrear("table-carbsDieta", "table-carbsDieta1");
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