import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { tablaAlimentos } from '/src/dietas/modules/wizard/tablaAlimentos.js';
import { actualizarDieta } from './modules/wizard/fetch/updateDieta.js';

document.addEventListener("DOMContentLoaded", async () => {
      window.duplicarUltimaTabla = duplicarUltimaTabla;
  window.eliminarUltimaTabla = eliminarUltimaTabla;
  await ejecutarAutoAjuste();
  await tablaAlimentos();
  document.getElementById("guardar-dieta-btn").addEventListener("click", actualizarDieta);
  
});
