import { updateTableAndChart } from '/src/dietas/modules/wizardBase/autoajuste/uptadeTableAndChart.js';
import { setProteinasPorKg, setGrasasPorKg } from '/src/dietas/modules/wizardBase/utils/ratiosStore.js'; // 👈 IMPORTAR

export function updateKgValue(id, delta) {
  console.log('🔴 [updateKgValue] Click detectado');
  console.log('   ID:', id);
  console.log('   Delta:', delta);
  
  const el = document.getElementById(id);
  if (!el) return;

  let val = parseFloat(el.innerText) || 0;
  console.log('   Valor anterior:', val);
  
  val = Math.max(0, val + delta);
  val = Math.round(val * 10) / 10;
  
  console.log('   Valor nuevo:', val);
  
  el.innerText = val.toFixed(1);

  // ✅ Actualizar el store correspondiente
  if (id === 'protein-value') {
    setProteinasPorKg(val);
  } else if (id === 'fat-value') {
    setGrasasPorKg(val);
  }

  console.log('🔴 Llamando a updateTableAndChart...');
  updateTableAndChart();
}