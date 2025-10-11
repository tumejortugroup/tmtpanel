
import { getDieta } from "/src/dietas/modules/wizardBase/fetch/getDietaAnterior.js";
import { agruparPorComida } from "/src/dietas/modules/wizardBase/utils/agruparComida.js";
import { renderDieta } from "/src/dietas/modules/wizardBase/utils/renderDieta.js";
import { tablaAlimentos } from "/src/dietas/modules/wizardBase/tablaAlimentos.js";
import { ejecutarAutoAjuste } from '/src/dietas/modules/wizardBase/autoAjuste.js';
import { crearTablaVacia, eliminarUltimaTabla } from "/src/dietas/modules/wizardBase/utils/crearTablaVacia.js";
import { actualizarDieta } from "/src/dietas/modules/wizardBase/fetch/updateDieta.js"; 
import { guardarDietaCompleta } from "/src/dietas/modules/wizardBase/creacion/guardarDieta.js"; 
import { addColumns, removeColumns } from "/src/dietas/modules/wizardBase/utils/addAlimentos.js";
import { cargarPlantillasCentro } from '/src/dietas/modules/plantilla/fetch/fetchPlantilla.js';


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

   
  await ejecutarAutoAjuste();

  await tablaAlimentos();
  await cargarPlantillasCentro();

  const data = await getDieta(idDieta);
  if (!data) return;

  const comidas = agruparPorComida(data);
  renderDieta({ data, comidas });

  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    await borrarComidasDeDieta(data);
    await actualizarDieta();
    await guardarDietaCompleta();
  });
});
