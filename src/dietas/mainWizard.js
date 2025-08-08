import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
<<<<<<< HEAD
import { agregarAlimento, quitarAlimento } from '/src/dietas/modules/wizard/ui/addDeleteAlimento.js';

=======
import { tablaAlimentos } from '/src/dietas/modules/wizard/tablaAlimentos.js';
import { actualizarDieta } from './modules/wizard/fetch/updateDieta.js';
>>>>>>> 72504cfffd0177abb5accde967e161aebb2a495d

document.addEventListener("DOMContentLoaded", async () => {
      window.duplicarUltimaTabla = duplicarUltimaTabla;
  window.eliminarUltimaTabla = eliminarUltimaTabla;
  window.agregarAlimento = agregarAlimento;
  window.quitarAlimento = quitarAlimento;
  await ejecutarAutoAjuste();
  await tablaAlimentos();
  document.getElementById("guardar-dieta-btn").addEventListener("click", actualizarDieta);
  
});
