
import { cargarListaUsers } from './modules/fetch-control/listUsers.js';
import { mostrarNombreUsuarioHistorial } from './modules/fetch-control/nombreUsuarioHistorial.js';
import { cargarListaControles } from '/src/user/modules/fetch-control/listControles.js';


document.addEventListener('DOMContentLoaded', () => {
  cargarListaControles();
  mostrarNombreUsuarioHistorial();
  cargarListaUsers();
});
