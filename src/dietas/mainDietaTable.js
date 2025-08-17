import { initDeleteDieta } from './modules/allDietasTable/deleteDieta.js';
import { listUser } from '/src/dietas/modules/allDietasTable/listUsers.js'
import { filtrarTabla } from '/src/dietas/modules/listDietas/filtrarTabla.js';

document.addEventListener("DOMContentLoaded", async () => {
  
  await listUser();  
  initDeleteDieta();
  filtrarTabla();     
});



