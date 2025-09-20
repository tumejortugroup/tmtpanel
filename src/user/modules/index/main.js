import { pintarTotalClientes } from "/src/user/modules/index/listUltimosNumero.js";
import { listCumpleaños } from "/src/user/modules/index/listCumpleaños.js";
import { listUsuariosUltimos } from "/src/user/modules/index/listNombreUltimos.js";
import { pintarUsuariosDashboard } from "/src/user/modules/index/listActivos.js";


document.addEventListener("DOMContentLoaded", async () => {
    listCumpleaños();
    listUsuariosUltimos();
    pintarTotalClientes();
   pintarUsuariosDashboard()

});
