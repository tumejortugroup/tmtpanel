import { initDeleteUser } from "./modules/deleteUser.js";
import { toggleStatus } from "./modules/toggleStatus.js";
import { initCreateUserFormAdmin } from "./modules/admin/createUserAdmin.js";
import { listPreparadores } from "./modules/admin/listPreparadores.js";
import { filtrarTabla } from "./modules/filtrarTabla.js";

document.addEventListener("DOMContentLoaded", async () => {
  initCreateUserFormAdmin();
  await listPreparadores();
  toggleStatus();
  initDeleteUser();
  filtrarTabla();
});
