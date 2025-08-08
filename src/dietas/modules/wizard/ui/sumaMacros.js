import { getAlimentos } from "../fetch/getAlimentos.js";

export let alimentosCache = [];

export async function prepararSumaMacros() {
  alimentosCache = await getAlimentos();

  const filas = document.querySelectorAll(".table-dieta tbody tr");

  filas.forEach(fila => {
    const select = fila.querySelector('select[name="select-alimentos"]');
    const input = fila.querySelector(".input-cantidad");

    if (!select || !input) return;

    select.addEventListener("change", recalcularTotales);
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
    const select = fila.querySelector('select[name="select-alimentos"]');
    const input = fila.querySelector(".input-cantidad");

    const cantidad = parseFloat(input?.value);
    const alimentoId = select?.value;

    if (!alimentoId || isNaN(cantidad)) return;

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
  document.getElementById("table-caloriesDieta1").textContent = `${totalCalorias.toFixed(1)} kcal`;
  document.getElementById("table-proteinDieta1").textContent = `${totalProteinas.toFixed(1)} gr`;
  document.getElementById("table-fatDieta1").textContent = `${totalGrasas.toFixed(1)} gr`;
  document.getElementById("table-carbsDieta1").textContent = `${totalHidratos.toFixed(1)} gr`;

  compararYSombrear("table-caloriesDieta", "table-caloriesDieta1");
compararYSombrear("table-proteinDieta", "table-proteinDieta1");
compararYSombrear("table-fatDieta", "table-fatDieta1");
compararYSombrear("table-carbsDieta", "table-carbsDieta1");
}


function compararYSombrear(idNecesario, idDieta) {
  const tdNecesario = document.getElementById(idNecesario);
  const tdDieta = document.getElementById(idDieta);

  if (!tdNecesario || !tdDieta) return;

  const valNecesario = parseFloat(tdNecesario.textContent);
  const valDieta = parseFloat(tdDieta.textContent);

  if (isNaN(valNecesario) || isNaN(valDieta)) return;

  // Añadir o quitar clase según el valor
  if (valDieta > valNecesario) {
    tdDieta.classList.add("exceso-macro");
  } else {
    tdDieta.classList.remove("exceso-macro");
  }
}
