// src/dietas/modules/wizard/tablaAlimentos.js
import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';
import { renderTablaEquivalencias } from '/src/dietas/modules/wizard/ui/renderEquivalencias.js';
import { prepararSumaMacros } from '/src/dietas/modules/wizard/ui/sumaMacros.js';

export async function tablaAlimentos() {
  // Aquí puedes tener más lógica, como crear dinámicamente las filas o tablas si es el caso

  await renderSelectAlimentos("select-alimentos"); 
    await renderTablaEquivalencias();
    await prepararSumaMacros(); // Asegúrate de que el <select> esté en el DOM antes de esto
}
