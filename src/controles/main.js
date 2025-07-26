// main.js
// main.js
import { calcularTodo } from './modules/calculos/calculos.js';
import { agregarColumna } from './modules/ui/columns.js';
import { obtenerIdUsuarioDesdeUrl } from './modules/utils/params.js';
import { cargarControlesPrevios } from './modules/fetch/getControlTabla.js';
import { guardarControl } from './modules/fetch/postControl.js';

// Inicializa botón para agregar columnas (una sola vez)
agregarColumna();

// Variable global para rastrear la columna activa
let indiceActivo = 0;

// Detectar el input activo (por foco)
document.addEventListener('focusin', (e) => {
  const el = e.target;
  if (el.matches('input[data-index], select[data-index]')) {
    const index = parseInt(el.getAttribute('data-index'));
    if (!isNaN(index)) {
      indiceActivo = index;
      console.log('Índice activo:', indiceActivo);
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


document.addEventListener('DOMContentLoaded', () => {
  const idUsuario = obtenerIdUsuarioDesdeUrl();

  if (idUsuario) {
    cargarControlesPrevios(idUsuario);
  } else {
    console.warn('ID de usuario no encontrado en la URL');
  }
});



/*****POST CONTROL ******* */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button.guardar-control');
  if (!btn) return;

  const index = parseInt(btn.getAttribute('data-index'));
  if (!isNaN(index)) {
    console.log('🖱️ Botón "Guardar" clicado. Index:', index);
    guardarControl(index);
  }
});
