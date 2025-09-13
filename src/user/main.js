import { initDeleteUser } from "./modules/deleteUser.js";
import { listUser } from "./modules/listUser.js";
import { toggleStatus } from "./modules/toggleStatus.js";
import { initCreateUserForm } from "./modules/createUser.js";
import { filtrarTabla } from "./modules/filtrarTabla.js";
import { cargarCentrosSelect } from "./modules/getCentros.js"; 

document.addEventListener("DOMContentLoaded", async () => {
  initCreateUserForm();
  await listUser();
  toggleStatus();
  initDeleteUser();
  filtrarTabla();
  cargarCentrosSelect("https://my.tumejortugroup.com/api/v1/centros", "centro");
});
