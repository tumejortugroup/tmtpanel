import { crearComidas} from './crearComida.js';
import { asociarComidasADieta } from './comidaDieta.js';

export async function guardarDietaCompleta() {
  const idsComidas = await crearComidas();
  if (idsComidas && idsComidas.length) {
    await asociarComidasADieta(idsComidas); // ya no pasas idDieta
  }
}