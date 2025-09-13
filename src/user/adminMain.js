import { initDeleteUser } from "./modules/deleteUser.js";

import { toggleStatus } from "./modules/toggleStatus.js";
import { initCreateUserFormAdmin } from "./modules/admin/createUserAdmin.js";
import { cargarCentrosSelect } from "./modules/getCentros.js"; 
import { listClientes } from "./modules/admin/listUserAdmin.js";

document.addEventListener("DOMContentLoaded", async () => {
  initCreateUserFormAdmin();
  await listClientes();
  toggleStatus();
  initDeleteUser();
  cargarCentrosSelect("https://my.tumejortugroup.com/api/v1/centros", "centro");
});
