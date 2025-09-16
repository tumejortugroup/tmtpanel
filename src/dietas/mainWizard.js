import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { tablaAlimentos } from '/src/dietas/modules/wizard/tablaAlimentos.js';
import { actualizarDieta } from './modules/wizard/fetch/updateDieta.js';
import { guardarDietaCompleta } from '/src/dietas/modules/wizard/creacion/guardarDieta.js';
import { addColumns, removeColumns } from '/src/dietas/modules/wizard/ui/add-columns.js';



document.addEventListener("DOMContentLoaded", async () => {
      window.duplicarUltimaTabla = duplicarUltimaTabla;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-add-columns")) {
    addColumns(e.target);
  }
  if (e.target.matches(".btn-remove-columns")) {
    removeColumns(e.target);
  }
});

  await ejecutarAutoAjuste();
  await tablaAlimentos();


  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {


  await actualizarDieta(); // primero actualiza
  await guardarDietaCompleta(); // luego crea y asocia comidas
});
  
});
