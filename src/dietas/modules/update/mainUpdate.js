import { getDieta } from "./fetch/getDieta.js";
import { agruparPorComida } from "./utils/agruparComida.js";
import { renderDieta } from "./utils/renderDieta.js";
import { tablaAlimentos } from "/src/dietas/modules/update/tablaAlimentos.js";
import { ejecutarAutoAjuste } from '/src/dietas/modules/update/autoAjuste.js';
import { crearTablaVacia, eliminarUltimaTabla } from "./utils/crearTablaVacia.js";
import { eliminarComidas } from "./fetch/eliminarComidas.js"; // 👈
import { actualizarDieta } from "/src/dietas/modules/update/fetch/updateDieta.js"; // suponiendo que ya lo tienes
import { guardarDietaCompleta } from "/src/dietas/modules/update/creacion/guardarDieta.js"; // idem
import { addColumns, removeColumns } from "./utils/addAlimentos.js";
import { cargarPlantillasCentro } from '/src/dietas/modules/plantilla/fetch/fetchPlantilla.js';

function borrarComidasDeDieta(data) {
  const ids = data.map(item => item.id_comida);
  const idsUnicas = [...new Set(ids)];
  console.log("🚀 Enviando a borrar:", idsUnicas);
  return eliminarComidas(idsUnicas);
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idDieta = params.get("id_dieta");


  if (!idDieta) {
    alert("Falta id_dieta en la URL");
    return;
  }
  /**BOTONES DE AÑADIR COMIDA Y ALIMETNOS */
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);
  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

    await tablaAlimentos();
  await ejecutarAutoAjuste();

 
  await cargarPlantillasCentro();

  const data = await getDieta(idDieta);
  if (!data) return;

  const comidas = agruparPorComida(data);
  renderDieta({ data, comidas });


    setTimeout(async () => {
    const { prepararSumaMacros } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    console.log("🔄 Configurando suma de macros después de renderizar tablas...");
    await prepararSumaMacros();
  }, 300);

  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    // Primero eliminamos las comidas actuales de la dieta
    await borrarComidasDeDieta(data);

    //  Luego actualizamos dieta (nombre, descripción, etc.)
    await actualizarDieta();

    //  Finalmente volvemos a crear las comidas y asociarlas
    await guardarDietaCompleta();
  });
});
