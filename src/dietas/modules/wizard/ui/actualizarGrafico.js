import { macroChart } from "./inicializarGrafico.js";

export function actualizarGraficoMacronutrientes(calorias, proteinas, grasas, carbohidratos) {
  // Parsear y validar
  const p = parseFloat(proteinas) || 0;
  const g = parseFloat(grasas) || 0;
  const c = parseFloat(carbohidratos) || 0;
  const kcal = parseFloat(calorias) || ((p * 4) + (g * 9) + (c * 4)); // Fallback si no se pasa

  if (!macroChart || !macroChart.data || !macroChart.data.datasets) {
    console.warn("⚠️ macroChart no inicializado correctamente.");
    return;
  }

  // 1. Actualizar gráfico
  macroChart.data.datasets[0].data = [p, g, c];
  macroChart.update();

  // 2. Actualizar tabla de valores absolutos
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };

  setText("table-protein", `${p.toFixed(1)} gr`);
  setText("table-fat", `${g.toFixed(1)} gr`);
  setText("table-carbs", `${c.toFixed(1)} gr`);
  setText("table-calories", `${kcal.toFixed(0)} kcal`);


    setText("table-proteinDieta", `${p.toFixed(1)} gr`);
  setText("table-fatDieta", `${g.toFixed(1)} gr`);
  setText("table-carbsDieta", `${c.toFixed(1)} gr`);
  setText("table-caloriesDieta", `${kcal.toFixed(0)} kcal`);


  // 3. Calcular calorías por macronutriente
  const kcalP = p * 4;
  const kcalG = g * 9;
  const kcalC = c * 4;

  // 4. Calcular porcentajes
  const percentP = (kcalP / kcal) * 100;
  const percentG = (kcalG / kcal) * 100;
  const percentC = (kcalC / kcal) * 100;

  // 5. Actualizar tabla de porcentajes
  setText("percent-protein", `${percentP.toFixed(1)} %`);
  setText("percent-fat", `${percentG.toFixed(1)} %`);
  setText("percent-carbs", `${percentC.toFixed(1)} %`);


}
