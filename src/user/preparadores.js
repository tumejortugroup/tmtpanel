import { initDeleteUser } from "./modules/fetch/deleteUser.js";
import { toggleStatus } from "./modules/utils/toggleStatus.js";
import { initCreateUserFormAdmin } from "./modules/admin/createUserAdmin.js";
import { listPreparadores } from "./modules/admin/listPreparadores.js";
import { filtrarTabla } from "./modules/utils/filtrarTabla.js";

document.addEventListener("DOMContentLoaded", async () => {
  initCreateUserFormAdmin();
  await listPreparadores();
  toggleStatus();
  initDeleteUser();
  filtrarTabla();
});
