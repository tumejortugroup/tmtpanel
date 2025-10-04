import { initDeleteUser } from "./modules/fetch/deleteUser.js";
import { filtrarTabla } from "./modules/utils/filtrarTabla.js";
import { toggleStatus } from "./modules/utils/toggleStatus.js";
import { initCreateUserFormAdmin } from "./modules/admin/createUserAdmin.js";
import { cargarCentrosSelect } from "./modules/fetch/getCentros.js"; 
import { listClientes } from "./modules/admin/listUserAdmin.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Cargar centros primero
  await cargarCentrosSelect("https://my.tumejortugroup.com/api/v1/centros", "centro");
  
  // Luego inicializar el resto
  initCreateUserFormAdmin();
  filtrarTabla();
  await listClientes();
  toggleStatus();
  initDeleteUser();
});