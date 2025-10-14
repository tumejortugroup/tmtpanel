// main.js
// main.js
import { calcularTodo } from './modules/calculos/calculos.js';

import { obtenerIdUsuarioDesdeUrl } from './modules/utils/params.js';
import { cargarControlesPrevios } from './modules/fetch/getControlTabla.js';
import { guardarControl } from './modules/fetch/postControl.js';
import { cargarListaUsers } from './modules/fetch/listUsers.js';
import { mostrarNombreUsuario } from './modules/fetch/nombreUsuario.js';

import { mostrarNombreUsuarioHistorial } from './modules/fetch/nombreUsuarioHistorial.js';
import { cargarListaControles } from './modules/fetch/listControles.js';



// Inicializa botón para agregar columnas (una sola vez)


// Variable global para rastrear la columna activa
let indiceActivo = 0;






document.addEventListener('DOMContentLoaded', () => {


  mostrarNombreUsuario();
  cargarListaUsers();
  cargarListaControles();
  mostrarNombreUsuarioHistorial();



      // Detectar el input activo (por foco)
  document.addEventListener('focusin', (e) => {
    const el = e.target;
    if (el.matches('input[data-index], select[data-index]')) {
      const index = parseInt(el.getAttribute('data-index'));
      if (!isNaN(index)) {
        indiceActivo = index;

      }
    }
  });

  // Ejecutar cálculo automáticamente cuando se modifica un input/select
  document.addEventListener('input', (e) => {
    const el = e.target;

    // Evita cálculos si es un input de tipo fecha
    if (el.type === 'date') return;

    if (el.matches('input[data-index], select[data-index]')) {
      const index = parseInt(el.getAttribute('data-index'));
      if (!isNaN(index)) {
        calcularTodo(index);
      }
    }
  });

  const idUsuario = obtenerIdUsuarioDesdeUrl();

  if (idUsuario) {
    cargarControlesPrevios(idUsuario);
  } else {
    console.warn('ID de usuario no encontrado en la URL');
  }




/*****POST CONTROL ******* */

// 👉 Listener global al botón "Guardar"
document.addEventListener('click', (e) => {
  if (e.target.matches('button.guardar-control')) {
    guardarControl();
  }
});

/***GET USERS INPUT */
document.getElementById('btn-ver-controles').addEventListener('click', () => {
  const idUsuario = obtenerIdUsuarioDesdeUrl(); // ✅ tu función existente

  if (idUsuario) {
    window.location.href = `/dashboard/controles/vistaControles.html?id=${idUsuario}`;
  } else {
    alert('❌ No se encontró el ID de usuario en la URL.');
  }
});

});
