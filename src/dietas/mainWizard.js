import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';

document.addEventListener("DOMContentLoaded", async () => {
  await ejecutarAutoAjuste();
});
