import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { agregarAlimento, quitarAlimento } from '/src/dietas/modules/wizard/ui/addDeleteAlimento.js';


document.addEventListener("DOMContentLoaded", async () => {
      window.duplicarUltimaTabla = duplicarUltimaTabla;
  window.eliminarUltimaTabla = eliminarUltimaTabla;
  window.agregarAlimento = agregarAlimento;
  window.quitarAlimento = quitarAlimento;
  await ejecutarAutoAjuste();
});
