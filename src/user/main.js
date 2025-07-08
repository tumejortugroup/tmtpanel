import { initDeleteUser } from "./modules/deleteUser.js";
import { listUser } from "./modules/listUser.js";
import { toggleStatus } from "./modules/toggleStatus.js";
import { initCreateUserForm } from "./modules/createUser.js";



document.addEventListener("DOMContentLoaded", () => {
    initCreateUserForm();
    listUser();
    toggleStatus();
    initDeleteUser();
  

});
