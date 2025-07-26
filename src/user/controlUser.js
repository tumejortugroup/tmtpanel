import { cargarListaControles } from '/src/user/modules/fetch-control/listControles.js';
import { cargarControlesSeleccionados } from '/src/user/modules/fetch-control/getMultiplesControles.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarListaControles();

  document.getElementById('ver-controles')?.addEventListener('click', () => {
    cargarControlesSeleccionados();
  });
});