import { initCreateUserForm } from './createUser.js';
import { initUserList } from './listUser.js';

document.addEventListener("DOMContentLoaded", () => {
    initCreateUserForm();
    initUserList();
    // initRoleBasedNavbar();
});
