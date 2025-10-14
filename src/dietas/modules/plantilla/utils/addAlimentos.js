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
  const tables = document.querySelectorAll(".table-dieta"); // Más específico
  const alimentos = obtenerAlimentosDisponibles();

  tables.forEach(table => {
    const headerRow = table.querySelector("thead tr:last-child");
    if (!headerRow) return;

    const currentCols = headerRow.children.length;
    // Máximo 21 columnas: 3 fijas + 9 pares de equivalencias (18)
    if (currentCols >= 21) {
      console.warn("⚠️ Ya hay el máximo de columnas (9 equivalencias)");
      return;
    }

    // Calcular el número de equivalencia
    const numEquivalentes = Math.floor((currentCols - 3) / 2) + 1;

    // --- Añadir cabeceras ---
    const thEq = document.createElement("th");
    thEq.textContent = `Alimento ${numEquivalentes}`;
    headerRow.appendChild(thEq);

    const thCantidad = document.createElement("th");
    thCantidad.textContent = "gr";
    headerRow.appendChild(thCantidad);

    // --- Añadir celdas en cada fila del tbody ---
    const bodyRows = table.querySelectorAll("tbody tr");
    bodyRows.forEach(row => {
      // Saltar fila de observaciones
      if (row.querySelector("textarea")) return;

      const tdEq = document.createElement("td");
      tdEq.classList.add("px-1", "py-0");
      const select = document.createElement("select");
      select.name = "select-alimentos";
      select.classList.add("form-select", "form-select-sm");
      select.innerHTML = generarOpcionesAlimentos(alimentos);
      tdEq.appendChild(select);

      const tdCantidad = document.createElement("td");
      tdCantidad.classList.add("px-1", "py-0");
      tdCantidad.textContent = "";

      row.appendChild(tdEq);
      row.appendChild(tdCantidad);
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

// 📌 ELIMINAR COLUMNAS
export async function removeColumns() {
  const tables = document.querySelectorAll(".table-dieta");

  tables.forEach(table => {
    const headerRow = table.querySelector("thead tr:last-child");
    if (!headerRow) return;

    const bodyRows = table.querySelectorAll("tbody tr");

    // Mínimo 3 columnas fijas + 2 (1 equivalencia)
    if (headerRow.children.length <= 5) {
      console.warn("⚠️ No se puede eliminar más columnas (mínimo 1 equivalencia)");
      return;
    }

    // Eliminar últimas 2 columnas de header
    headerRow.removeChild(headerRow.lastElementChild);
    headerRow.removeChild(headerRow.lastElementChild);

    // Eliminar últimas 2 celdas de cada fila
    bodyRows.forEach(row => {
      // Saltar fila de observaciones
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