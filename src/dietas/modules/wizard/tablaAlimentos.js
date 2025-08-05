// src/dietas/modules/wizard/tablaAlimentos.js
import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';
import { renderTablaEquivalencias } from '/src/dietas/modules/wizard/ui/renderEquivalencias.js';

export async function tablaAlimentos() {
  // Aquí puedes tener más lógica, como crear dinámicamente las filas o tablas si es el caso

  await renderSelectAlimentos("select-alimentos"); 
    await renderTablaEquivalencias();// Asegúrate de que el <select> esté en el DOM antes de esto
}
