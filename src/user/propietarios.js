import { initDeleteUser } from "./modules/deleteUser.js";
import { toggleStatus } from "./modules/toggleStatus.js";
import { initCreateUserFormAdmin } from "./modules/admin/createUserAdmin.js";
import {listPropietarios } from "./modules/admin/listPropietarios.js";

document.addEventListener("DOMContentLoaded", async () => {
  
    initCreateUserFormAdmin();
  toggleStatus();
  await listPropietarios();
  initDeleteUser();

});
