import { initDeleteUser } from "./modules/deleteUser.js";
import { listUser } from "./modules/listUser.js";
import { toggleStatus } from "./modules/toggleStatus.js";


document.addEventListener("DOMContentLoaded", () => {
    
    listUser();
    toggleStatus();
    initDeleteUser();

});
