import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';

// 🔧 Obtener alimentos desde el cache
function obtenerAlimentosDisponibles() {
  return window.__alimentosCache || [];
}

// 🔧 Generar opciones para select de alimentos
function generarOpcionesAlimentos(alimentos) {
  let opciones = '<option value="">Alimentos</option>';
  
  if (!alimentos || alimentos.length === 0) {
    return opciones;
  }
  
  alimentos.forEach(alimento => {
    const id = alimento.id_alimento;
    const nombre = alimento.nombre;
    opciones += `<option value="${id}">${nombre}</option>`;
  });
  
  return opciones;
}

// 🔧 Agregar eventos de equivalencia a una fila específica
async function agregarEventosEquivalenciaFila(fila) {
  const { getEquivalencia } = await import('/src/dietas/modules/wizard/fetch/getEquivalencias.js');
  
  const selectMacro = fila.querySelector("td select[name='select-categoria']");
  const inputCantidad = fila.querySelector(".input-cantidad");
  if (!selectMacro || !inputCantidad) return;

  const selects = fila.querySelectorAll("select[name='select-alimentos']");
  if (selects.length < 2) return;

  const selectPrincipal = selects[0];
  const equivalentes = [];

  for (let i = 1; i < selects.length; i++) {
    const td = selects[i].closest("td").nextElementSibling;
    if (td) {
      equivalentes.push({ select: selects[i], td });
    }
  }

  async function calcular() {
    const idPrincipal = selectPrincipal.value;
    const cantidad = parseFloat(inputCantidad.value);
    const categoria = selectMacro.value?.toLowerCase();

    if (!idPrincipal || isNaN(cantidad) || !categoria) {
      equivalentes.forEach(eq => {
        if (eq.td.tagName === 'TD') {
          eq.td.textContent = "";
        }
      });
      return;
    }

    equivalentes.forEach(eq => {
      if (eq.td.tagName === 'TD') {
        eq.td.textContent = "";
      }
    });

    for (const { select, td } of equivalentes) {
      if (!select.value || !td) continue;
      
      try {
        const eqVal = await getEquivalencia(idPrincipal, select.value, categoria, cantidad);
        if (td.tagName === 'TD') {
          td.textContent = eqVal !== null ? `${eqVal}` : "-";
        }
      } catch (error) {
        console.error('Error calculando equivalencia:', error);
        if (td.tagName === 'TD') {
          td.textContent = "-";
        }
      }
    }
  }

  // Marcar que ya tiene eventos (evitar duplicados)
  if (fila.dataset.eventosAgregados === 'true') return;
  fila.dataset.eventosAgregados = 'true';

  // Agregar eventos
  [selectMacro, selectPrincipal, inputCantidad].forEach(el => {
    if (el) {
      el.addEventListener("change", calcular);
    }
  });
  
  if (inputCantidad) {
    inputCantidad.addEventListener("input", calcular);
  }

  equivalentes.forEach(({ select }) => {
    if (select) {
      select.addEventListener("change", calcular);
    }
  });
}

// 📌 AÑADIR COLUMNAS
export async function addColumns() {
  const tables = document.querySelectorAll(".table-dieta");
  const alimentos = obtenerAlimentosDisponibles();

  tables.forEach(table => {

    const headerRow = table.querySelector("thead tr:last-child");
    if (!headerRow) return;

    const currentCols = headerRow.children.length;
    if (currentCols >= 21) return;

    // ---------------------------------------
    // ⭐️ CORRECCIÓN → ACTUALIZAR TODOS LOS COLSPAN
    // ---------------------------------------

    // 1️⃣ PRIMERA FILA DEL THEAD (colspan del título)
    const theadTop = table.querySelector("thead tr:first-child th[colspan]");
    if (theadTop) {
      const colspan = parseInt(theadTop.getAttribute("colspan")) || currentCols;
      theadTop.setAttribute("colspan", colspan + 2);
    }

    // 2️⃣ FILA DE OBSERVACIONES (última del tbody)
    const observaciones = table.querySelector("tbody tr:last-child td[colspan]");
    if (observaciones) {
      const colspanBody = parseInt(observaciones.getAttribute("colspan")) || (currentCols - 1);
      observaciones.setAttribute("colspan", colspanBody + 2);
    }

    // ---------------------------------------
    //   AÑADIR NUEVAS CABECERAS
    // ---------------------------------------
    const thEq = document.createElement("th");
    thEq.textContent = "Alimento";
    headerRow.appendChild(thEq);

    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Gr";
    headerRow.appendChild(thCantidad);

    // ---------------------------------------
    //   AÑADIR COLUMNAS EN CADA FILA
    // ---------------------------------------
    const bodyRows = table.querySelectorAll("tbody tr");

    bodyRows.forEach(row => {
      if (row.querySelector("textarea")) return; // Saltar fila de Observaciones

      // --- crear TD alimento ---
      const tdEq = document.createElement("td");
      tdEq.classList.add("px-1", "py-0");

      const select = document.createElement("select");
      select.name = "select-alimentos";
      select.classList.add("form-select", "form-select-sm");

      // ⭐️ DETECTAR LA CATEGORÍA DE ESTA FILA
      const selectCategoria = row.querySelector("select[name='select-categoria']");
      const categoria = selectCategoria?.value?.trim() || null;

      console.log("🟦 NUEVA COLUMNA → CATEGORÍA DETECTADA:", categoria);

      // ⭐️ RELLENAR EL SELECT POR CATEGORÍA
      renderSelectAlimentos(select, categoria);

      tdEq.appendChild(select);

      // --- crear TD gramos ---
      const tdCantidad = document.createElement("td");
      tdCantidad.classList.add("px-1", "py-0");
      tdCantidad.textContent = "";

      // insertar al final
      row.appendChild(tdEq);
      row.appendChild(tdCantidad);
    });
  });

  // ---------------------------------------
  //   REENGANCHAR EVENTOS DE EQUIVALENCIA
  // ---------------------------------------
  const filas = document.querySelectorAll(".table-dieta tbody tr:not(:last-child)");
  filas.forEach(fila => (fila.dataset.eventosAgregados = "false"));

  for (const fila of filas) {
    await agregarEventosEquivalenciaFila(fila);
  }
}



// 📌 ELIMINAR COLUMNAS
export async function removeColumns() {
  const tables = document.querySelectorAll(".table-dieta");

  tables.forEach(table => {
    const headerRow = table.querySelector("thead tr:last-child");
    if (!headerRow) return;

    const currentCols = headerRow.children.length;

    if (currentCols <= 5) {
      console.warn("⚠️ No se puede eliminar más columnas (mínimo 1 equivalencia)");
      return;
    }

    // 🔥 ACTUALIZAR COLSPAN ANTES DE ELIMINAR COLUMNAS
    // 1. Primera fila del thead
    const firstHeaderTh = table.querySelector("thead tr:first-child th[colspan]");
    if (firstHeaderTh) {
      const colspanActual = parseInt(firstHeaderTh.getAttribute("colspan"));
      if (colspanActual > 2) {
        firstHeaderTh.setAttribute("colspan", colspanActual - 2);
      }
    }

    // 2. Fila de observaciones en tbody
    const observacionesTd = table.querySelector("tbody tr:last-child td[colspan]");
    if (observacionesTd) {
      const colspanActual = parseInt(observacionesTd.getAttribute("colspan"));
      if (colspanActual > 2) {
        observacionesTd.setAttribute("colspan", colspanActual - 2);
      }
    }

    // Eliminar últimas 2 columnas de header
    headerRow.removeChild(headerRow.lastElementChild);
    headerRow.removeChild(headerRow.lastElementChild);

    // Eliminar últimas 2 celdas de cada fila
    const bodyRows = table.querySelectorAll("tbody tr");
    bodyRows.forEach(row => {
      if (row.querySelector("textarea")) return;
      
      if (row.lastElementChild) row.removeChild(row.lastElementChild);
      if (row.lastElementChild) row.removeChild(row.lastElementChild);
    });
  });

  // 👇 IMPORTANTE: Limpiar marca de eventos y reaplicar
  const todasLasFilas = document.querySelectorAll(".table-dieta tbody tr:not(:last-child)");
  todasLasFilas.forEach(fila => {
    fila.dataset.eventosAgregados = 'false';
  });

  for (const fila of todasLasFilas) {
    await agregarEventosEquivalenciaFila(fila);
  }
}