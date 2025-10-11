
import { getPlantilla } from "./fetch/getPlantilla.js";
import { agruparPorComida } from "./utils/agruparComida.js";
import { renderPlantilla } from "./utils/renderPlantilla.js";
import { tablaAlimentos } from "/src/dietas/modules/wizard/tablaAlimentos.js";
import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { crearTablaVacia, eliminarUltimaTabla } from "./utils/crearTablaVacia.js";
import { eliminarComidas } from "./fetch/eliminarComidas.js";
import { actualizarDieta } from "/src/dietas/modules/wizard/fetch/updateDieta.js";
import { guardarDietaCompleta } from "/src/dietas/modules/wizard/creacion/guardarDieta.js";
import { addColumns, removeColumns } from "./utils/addAlimentos.js";
import { cargarPlantillasCentro } from '/src/dietas/modules/plantilla/fetch/fetchPlantilla.js';

function borrarComidasDeDieta(data) {
  const ids = data.map(item => item.id_comida);
  const idsUnicas = [...new Set(ids)];
  
  return eliminarComidas(idsUnicas);
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idDieta = params.get("id_dieta");
  const idPlantilla = params.get("id_plantilla");

  if (!idDieta) {
    alert("Falta id_dieta en la URL");
    return;
  }

  // BOTONES DE AÑADIR COMIDA Y ALIMENTOS
  document.getElementById("btn-add-column")?.addEventListener("click", addColumns);
  document.getElementById("btn-remove-column")?.addEventListener("click", removeColumns);
  window.crearTablaVacia = crearTablaVacia;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  await ejecutarAutoAjuste();
  await tablaAlimentos();
  await cargarPlantillasCentro();

  let data;
  let comidas;

  // Detectar si hay plantilla seleccionada
  if (idPlantilla) {
    
    data = await getPlantilla(idPlantilla);
    if (!data) return;
    
    comidas = agruparPorComida(data);
    await renderPlantilla({ data, comidas });
  } else {
    
    data = await getDieta(idDieta);
    if (!data) return;
    
    comidas = agruparPorComida(data);
    await renderDieta({ data, comidas });
  }

  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    await borrarComidasDeDieta(data);
    await actualizarDieta();
    await guardarDietaCompleta();
  });
});