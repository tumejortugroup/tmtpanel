import { initDeleteDieta } from './modules/allDietasTable/deleteDieta.js';
import { listUser } from '/src/dietas/modules/allDietasTable/listUsers.js'
import { filtrarTabla } from '/src/dietas/modules/listDietas/filtrarTabla.js';

document.addEventListener("DOMContentLoaded", async () => {
  
  await listUser();  
  initDeleteDieta();
  filtrarTabla();     
});



document.addEventListener("click", function(e) {
  if (e.target.classList.contains("btn-acciones")) {
    const menu = e.target.nextElementSibling;
    menu.classList.toggle("oculto");
  } else {
    document.querySelectorAll(".acciones-lista").forEach(m => m.classList.add("oculto"));
  }
});
