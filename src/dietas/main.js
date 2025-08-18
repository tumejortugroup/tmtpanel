import { listUser } from '/src/dietas/modules/listDietas/listUsers.js'
import { filtrarTabla } from '/src/dietas/modules/listDietas/filtrarTabla.js';

document.addEventListener("DOMContentLoaded", async () => {
  
  await listUser();   
  filtrarTabla();     
});



