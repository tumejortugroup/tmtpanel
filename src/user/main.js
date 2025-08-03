import { initDeleteUser } from "./modules/deleteUser.js";
import { listUser } from "./modules/listUser.js";
import { toggleStatus } from "./modules/toggleStatus.js";
import { initCreateUserForm } from "./modules/createUser.js";
import { filtrarTabla } from "./modules/filtrarTabla.js";



document.addEventListener("DOMContentLoaded", async () => {
  initCreateUserForm();
  await listUser();   // Esperar a que se carguen las filas
  toggleStatus();
  initDeleteUser();
  filtrarTabla();     // Ahora sí, ya hay <tr> en el tbody
});



