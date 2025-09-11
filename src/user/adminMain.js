import { initDeleteUser } from "./modules/deleteUser.js";
import { listUser } from "./modules/listUser.js";
import { toggleStatus } from "./modules/toggleStatus.js";
import { initCreateUserFormAdmin } from "./modules/createUserAdmin.js";
import { filtrarTabla } from "./modules/filtrarTabla.js";
import { cargarCentrosSelect } from "./modules/getCentros.js"; 

document.addEventListener("DOMContentLoaded", async () => {
  initCreateUserFormAdmin();
  cargarCentrosSelect("http://localhost:9000/api/v1/centros", "centro");
});
