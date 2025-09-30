import { getDieta } from "./fetch/getDieta.js";
import { agruparPorComida } from "./utils/agruparComida.js";
import { renderDieta } from "./utils/renderDieta.js";
import { tablaAlimentos } from "/src/dietas/modules/wizard/tablaAlimentos.js";
import { ejecutarAutoAjuste } from '/src/dietas/modules/wizard/autoAjuste.js';
import { duplicarUltimaTabla, eliminarUltimaTabla } from '/src/dietas/modules/wizard/ui/addDeleteTable.js';
import { eliminarComidas } from "./fetch/eliminarComidas.js"; // 👈
import { actualizarDieta } from "/src/dietas/modules/wizard/fetch/updateDieta.js"; // suponiendo que ya lo tienes
import { guardarDietaCompleta } from "/src/dietas/modules/wizard/creacion/guardarDieta.js"; // idem

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

  window.duplicarUltimaTabla = duplicarUltimaTabla;
  window.eliminarUltimaTabla = eliminarUltimaTabla;

  await ejecutarAutoAjuste();

  // 1. Cargar alimentos
  console.log('PASO 1: Cargando alimentos...');
  await tablaAlimentos();
  console.log('PASO 1 COMPLETADO. Cache:', !!window.__alimentosCache, 'Elementos:', window.__alimentosCache?.length);

  // 2. Traer dieta existente
  console.log('PASO 2: Cargando dieta...');
  const data = await getDieta(idDieta);
  if (!data) return;

  // 3. Agrupar y renderizar
  console.log('PASO 3: Agrupando y renderizando...');
  const comidas = agruparPorComida(data);
  renderDieta({ data, comidas });

  // Resto del código...

  // 4. Guardar cambios
  document.getElementById("guardar-dieta-btn").addEventListener("click", async () => {
    // 🗑️ Primero eliminamos las comidas actuales de la dieta
    await borrarComidasDeDieta(data);

    // ✏️ Luego actualizamos dieta (nombre, descripción, etc.)
    await actualizarDieta();

    // 🍽️ Finalmente volvemos a crear las comidas y asociarlas
    await guardarDietaCompleta();
  });
});
