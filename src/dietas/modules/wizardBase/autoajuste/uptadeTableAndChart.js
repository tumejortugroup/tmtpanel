import { actualizarGraficoMacronutrientes } from '/src/dietas/modules/wizardBase/ui/actualizarGrafico.js';
import { getPeso } from '/src/dietas/modules/wizardBase/utils/pesoStore.js';
import { getCaloriasObjetivo } from '/src/dietas/modules/wizardBase/utils/caloriasStore.js';
import { getRatios } from '/src/dietas/modules/wizardBase/utils/ratiosStore.js'; // 👈 IMPORTAR

export function updateTableAndChart() {
  const peso = getPeso();
  console.log('🔵 [updateTableAndChart] Inicio');
  console.log('   Peso:', peso);
  
  if (!peso) {
    console.error("❌ Peso no definido.");
    return;
  }

  // ✅ Leer los ratios exactos del store
  const { proteinasPorKg, grasasPorKg } = getRatios();
  const totalCalories = getCaloriasObjetivo();

  console.log('   proteinPerKg (exacto):', proteinasPorKg);
  console.log('   fatPerKg (exacto):', grasasPorKg);
  console.log('   totalCalories (objetivo exacto):', totalCalories);

  const proteinas = proteinasPorKg * peso;
  const grasas = grasasPorKg * peso;
  const kcalProteinas = proteinas * 4;
  const kcalGrasas = grasas * 9;
  const caloriasUsadas = kcalProteinas + kcalGrasas;
  const carbohidratos = Math.max((totalCalories - caloriasUsadas) / 4, 0);

  console.log('   📊 Calculado:');
  console.log('      Proteínas:', proteinas.toFixed(1), 'g');
  console.log('      Grasas:', grasas.toFixed(1), 'g');
  console.log('      Carbohidratos:', carbohidratos.toFixed(1), 'g');
  console.log('      Calorías usadas (P+G):', caloriasUsadas);

  // Actualizar tabla principal
  document.getElementById('table-protein').innerText = `${proteinas.toFixed(1)} gr`;
  document.getElementById('table-fat').innerText = `${grasas.toFixed(1)} gr`;
  document.getElementById('table-carbs').innerText = `${carbohidratos.toFixed(1)} gr`;

  console.log('🔵 [updateTableAndChart] Llamando a actualizarGraficoMacronutrientes');
  actualizarGraficoMacronutrientes(totalCalories, proteinas, grasas, carbohidratos);
}