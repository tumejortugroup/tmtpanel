
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { tablaAlimentos } from '/src/dietas/modules/wizard/tablaAlimentos.js';
import { addColumns, removeColumns } from '/src/dietas/modules/wizard/ui/add-columns.js';
import { guardarPlantillaCompleta } from './modules/creacion/guardarPlantilla.js';



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

  await tablaAlimentos();
  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {

    await guardarPlantillaCompleta()
});
  
});
