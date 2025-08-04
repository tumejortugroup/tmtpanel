import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';


document.addEventListener("DOMContentLoaded", async () => {
      window.duplicarUltimaTabla = duplicarUltimaTabla;
  window.eliminarUltimaTabla = eliminarUltimaTabla;
  await ejecutarAutoAjuste();
});
