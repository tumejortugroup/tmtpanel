import { actualizarGraficoMacronutrientes } from '/src/dietas/modules/wizard/ui/actualizarGrafico.js';
import { getPeso } from '/src/dietas/modules/wizard/utils/pesoStore.js';

export function updateTableAndChart() {
  const peso = getPeso();
  if (!peso) {
    console.error("❌ Peso no definido.");
    return;
  }

  const proteinPerKg = parseFloat(document.getElementById('protein-value').innerText) || 0;
  const fatPerKg = parseFloat(document.getElementById('fat-value').innerText) || 0;
  const totalCalories = parseFloat(document.getElementById('table-calories').innerText) || 0;

  const proteinas = proteinPerKg * peso;
  const grasas = fatPerKg * peso;
  const kcalProteinas = proteinas * 4;
  const kcalGrasas = grasas * 9;
  const caloriasUsadas = kcalProteinas + kcalGrasas;
  const carbohidratos = Math.max((totalCalories - caloriasUsadas) / 4, 0);
  const kcalCarbos = carbohidratos * 4;

  console.log("🔢 Cálculo de Macronutrientes:");
  console.log(`🧍 Peso: ${peso} kg`);
  console.log(`🍗 Proteínas/kg: ${proteinPerKg}, totales: ${proteinas.toFixed(1)} gr`);
  console.log(`🥑 Grasas/kg: ${fatPerKg}, totales: ${grasas.toFixed(1)} gr`);
  console.log(`🔥 Calorías totales: ${totalCalories} kcal`);
  console.log(`📊 Calorías usadas: proteínas = ${kcalProteinas.toFixed(1)} kcal, grasas = ${kcalGrasas.toFixed(1)} kcal`);
  console.log(`🍞 Carbohidratos = ${carbohidratos.toFixed(1)} gr`);

  // Actualizar tabla principal
  document.getElementById('table-protein').innerText = `${proteinas.toFixed(1)} gr`;
  document.getElementById('table-fat').innerText = `${grasas.toFixed(1)} gr`;
  document.getElementById('table-carbs').innerText = `${carbohidratos.toFixed(1)} gr`;

  // Actualizar gráfico y calorías
  actualizarGraficoMacronutrientes(totalCalories, proteinas, grasas, carbohidratos);

  // Calcular porcentajes
  const percentProteinas = (kcalProteinas / totalCalories) * 100;
  const percentGrasas = (kcalGrasas / totalCalories) * 100;
  const percentCarbos = (kcalCarbos / totalCalories) * 100;

  // Mostrar en DOM
  document.getElementById('percent-protein').innerText = `${percentProteinas.toFixed(1)} %`;
  document.getElementById('percent-fat').innerText = `${percentGrasas.toFixed(1)} %`;
  document.getElementById('percent-carbs').innerText = `${percentCarbos.toFixed(1)} %`;
}
