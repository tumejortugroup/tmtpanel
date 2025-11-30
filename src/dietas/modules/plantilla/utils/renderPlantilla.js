import {
  obtenerAlimentosDisponibles,
  filtrarAlimentosPorCategoria,
  generarOpcionesAlimentos,
  obtenerMaxEquivalentes,
  generarTablaComida,
  capitalizar
} from './helpers.js';

export async function renderPlantilla({ data, comidas }) {
  try {
    console.log('Iniciando renderizado de plantilla...');
    
    const nombreInput = document.getElementById("nombre-dieta");
    if (data && data.length > 0 && nombreInput) {
      nombreInput.value = data[0].nombre_plantilla || "";
    }

    // ====================================
    // ALIMENTOS CACHE
    // ====================================
    let alimentos = obtenerAlimentosDisponibles();
   
    if (alimentos.length === 0) {
      console.warn("⚠ No hay alimentos en memoria → cargando desde backend...");

      const { getAlimentos } = await import("/src/dietas/modules/plantilla/fetch/getAlimentos.js");
      window.__alimentosCache = await getAlimentos();

      alimentos = window.__alimentosCache;
      console.log("📦 Alimentos cargados:", alimentos.length);
    }

    const numEquivalentes = obtenerMaxEquivalentes(comidas);
    const contenedor = document.getElementById("tabla-container");
    if (!contenedor) return;

    const tablaSuplementacion = contenedor.querySelector('#Suplementacion');

    contenedor.querySelectorAll('.table-dieta').forEach(t => t.remove());

    let notaSupplementacion = '';

    // ================================
    // GENERAR TABLAS
    // ================================
    for (const comida of Object.values(comidas)) {

      const tipoComidaCapitalizado = capitalizar(comida.tipo_comida);

      // Suplementación se hace después
      if (tipoComidaCapitalizado === 'Suplementacion') {
        notaSupplementacion = comida.notas || '';
        continue;
      }

      const tablaHTML = generarTablaComida(comida, numEquivalentes, alimentos);

      if (tablaSuplementacion) {
        tablaSuplementacion.insertAdjacentHTML('beforebegin', tablaHTML);
      } else {
        contenedor.insertAdjacentHTML('beforeend', tablaHTML);
      }

      // =========================================
      // 🔥🔥🔥 AQUI VIENE LA PIEZA QUE FALTABA 🔥🔥🔥
      //   → Igual que en wizardBase
      //   → ESTO PINTA EL PRIMER SELECT
      // =========================================
      const tabla = contenedor.querySelector(".table-dieta:last-of-type");

      if (tabla) {
        const { renderSelectAlimentos } = await import("/src/dietas/modules/plantilla/ui/renderAlimentos.js");

        tabla.querySelectorAll("tbody tr").forEach(fila => {
          const catSel = fila.querySelector("select[name='select-categoria']");
          const alSel = fila.querySelector("select[name='select-alimentos']");
          if (!catSel || !alSel) return;

          const alimentoActual = comida.alimentos.find(
            a => capitalizar(a.categoria) === catSel.value.trim()
          );

          renderSelectAlimentos(alSel, catSel.value.trim(), alimentoActual);
        });
      }
      // =========================================
      // FIN DE LA PIEZA QUE FALTABA
      // =========================================
    }

    // ================================
    // SUPLEMENTACION
    // ================================
    if (tablaSuplementacion) {
      const textarea = tablaSuplementacion.querySelector("textarea");
      if (textarea) textarea.value = notaSupplementacion;
    }

    // ================================
    // LISTENER CAMBIO DE CATEGORÍA
    // ================================
 

    console.log('Renderizado de plantilla completado');

  } catch (error) {
    console.error('Error en renderPlantilla:', error);
  }
}


// ================================
// CÁLCULO DE EQUIVALENCIAS
// ================================
async function agregarCalculoEquivalencias(contenedor) {
  const { getEquivalencia } = await import('/src/dietas/modules/wizard/fetch/getEquivalencias.js');

  const filas = contenedor.querySelectorAll(".table-dieta tbody tr:not(:last-child)");

  filas.forEach(fila => {
    const selectMacro = fila.querySelector("select[name='select-categoria']");
    const inputCantidad = fila.querySelector(".input-cantidad");

    if (!selectMacro || !inputCantidad) return;

    const selects = fila.querySelectorAll("select[name='select-alimentos']");
    if (selects.length < 2) return;

    const selectPrincipal = selects[0];

    const equivalentes = [...selects].slice(1).map(sel => ({
      select: sel,
      td: sel.closest("td").nextElementSibling
    }));

    async function calcular() {
      const idPrincipal = selectPrincipal.value;
      const cantidad = parseFloat(inputCantidad.value);
      const categoria = selectMacro.value?.toLowerCase();

      if (!idPrincipal || isNaN(cantidad)) {
        equivalentes.forEach(eq => eq.td.textContent = "");
        return;
      }

      for (const { select, td } of equivalentes) {
        if (!select.value) continue;

        try {
          const eqVal = await getEquivalencia(idPrincipal, select.value, categoria, cantidad);
          td.textContent = eqVal !== null ? Math.ceil(eqVal) : "-";
        } catch {
          td.textContent = "-";
        }
      }
    }

    [selectMacro, selectPrincipal, inputCantidad].forEach(el => {
      el.addEventListener("change", calcular);
    });

    inputCantidad.addEventListener("input", calcular);

    equivalentes.forEach(({ select }) => {
      select.addEventListener("change", calcular);
    });
  });
}
