function setCircleProgress(id, percent) {
  const circle = document.getElementById(id);
  if (!circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  if (!circle.dataset.inicializado) {
    circle.style.strokeDashoffset = circumference;
    circle.dataset.inicializado = true;
  }

  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function updateProgressBar(id, percent) {
  const bar = document.getElementById(id);
  if (!bar) return;

  bar.style.width = `${percent.toFixed(1)}%`;
  bar.setAttribute("aria-valuenow", percent.toFixed(1));
}

export function actualizarGraficoMacronutrientes(calorias, proteinas, grasas, carbohidratos) {
  const p = parseFloat(proteinas) || 0;
  const g = parseFloat(grasas) || 0;
  const c = parseFloat(carbohidratos) || 0;

  // ✅ respetar valor del backend aunque sea 0
  const kcal = calorias != null && !isNaN(parseFloat(calorias))
    ? parseFloat(calorias)
    : ((p * 4) + (g * 9) + (c * 4));

  // 🔹 actualizar calorías en el H2
  const kcalElem = document.getElementById("table-calories");
  if (kcalElem) {
    kcalElem.innerText = `${kcal.toFixed(0)} Kcal`;
  }

  // actualizar textos macros
  const protElem = document.getElementById("macro-proteinas");
  if (protElem) protElem.innerText = `${p.toFixed(1)} g`;

  const carbElem = document.getElementById("macro-carbohidratos");
  if (carbElem) carbElem.innerText = `${c.toFixed(1)} g`;

  const fatElem = document.getElementById("macro-grasas");
  if (fatElem) fatElem.innerText = `${g.toFixed(1)} g`;

  // calorías por macro
  const kcalP = p * 4;
  const kcalG = g * 9;
  const kcalC = c * 4;

  let percentP = 0, percentG = 0, percentC = 0;

  if (kcal > 0) {
    percentP = (kcalP / kcal) * 100;
    percentG = (kcalG / kcal) * 100;
    percentC = (kcalC / kcal) * 100;
  }

  // 🔹 normalizar para evitar sumas > 100 o NaN
  const totalPercent = percentP + percentG + percentC;
  if (totalPercent > 0) {
    percentP = (percentP / totalPercent) * 100;
    percentG = (percentG / totalPercent) * 100;
    percentC = (percentC / totalPercent) * 100;
  }

  // 🔹 actualizar círculos
  setCircleProgress("circle-protein", percentP);
  setCircleProgress("circle-carbs", percentC);
  setCircleProgress("circle-fat", percentG);

  // 🔹 actualizar progress bars
  updateProgressBar("protein-progress", percentP);
  updateProgressBar("fat-progress", percentG);
  updateProgressBar("carbs-progress", percentC);
}
