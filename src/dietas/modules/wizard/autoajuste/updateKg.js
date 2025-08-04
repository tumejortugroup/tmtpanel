import { updateTableAndChart } from '/src/dietas/modules/wizard/autoajuste/uptadeTableAndChart.js';

export function updateKgValue(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;

  let val = parseFloat(el.innerText) || 0;
  val = Math.max(0, val + delta);
  el.innerText = val.toFixed(1);

  updateTableAndChart();
}