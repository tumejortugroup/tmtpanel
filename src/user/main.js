import { initDeleteUser } from "./modules/fetch/deleteUser.js";
import { listUser } from "./modules/fetch/listUser.js";
import { toggleStatus } from "./modules/utils/toggleStatus.js";
import { initCreateUserForm } from "./modules/fetch/createUser.js";
import { filtrarTabla } from "./modules/utils/filtrarTabla.js";
import { cargarCentrosSelect } from "./modules/fetch/getCentros.js"; 
import { cargarUltimoNumeroUsuario } from "./modules/fetch/getUltimoNumero.js";


document.addEventListener("DOMContentLoaded", async () => {

 
  initCreateUserForm();
  await cargarUltimoNumeroUsuario();
  await listUser();
  toggleStatus();
  initDeleteUser();
  filtrarTabla();
  cargarCentrosSelect("https://my.tumejortugroup.com/api/v1/centros", "centro");
});
