
import { cargarListaUsers } from './modules/fetch-control/listUsers.js';
import { mostrarNombreUsuarioHistorial } from './modules/fetch-control/nombreUsuarioHistorial.js';
import { cargarListaControles } from '/src/user/modules/fetch-control/listControles.js';
// No es necesario importar cargarControlesSeleccionados aquí si ya se usa dentro del botón dinámico

document.addEventListener('DOMContentLoaded', () => {
  cargarListaControles();
  mostrarNombreUsuarioHistorial();
  cargarListaUsers();
});
