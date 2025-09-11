//import { initDeleteUser } from "./modules/deleteUser.js";
import { listCentro } from "./modules/listCentros.js";
import { initDeleteCentro } from "./modules/initDeleteCentro.js";
import { initCreateCentroForm } from "./modules/initCreateCentro.js";


document.addEventListener("DOMContentLoaded", async () => {
 initCreateCentroForm()
  await listCentro();

  initDeleteCentro();
  //filtrarTabla();

  
});
