// main.js
import { calcularTodo } from './modules/calculos/calculos.js';

document.querySelectorAll('.input-medidas').forEach(input => {
  input.addEventListener('input', calcularTodo);
});
