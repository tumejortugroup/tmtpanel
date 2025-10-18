import { renderSelectAlimentos } from '/src/dietas/modules/plantilla/ui/renderAlimentos.js';
import { renderTablaEquivalencias } from '/src/dietas/modules/plantilla/ui/renderEquivalencias.js';

export function addColumns() {
  const tables = document.querySelectorAll(".table");

  tables.forEach(table => {
    const headerRow = table.querySelector("thead tr:last-child");
    if (!headerRow) return;

    const currentCols = headerRow.children.length;
    if (currentCols >= 21) return;

    // --- Actualizar colspan en TODAS las filas del thead ---
    const theadRows = table.querySelectorAll("thead tr");
    theadRows.forEach(row => {
      row.querySelectorAll("th[colspan]").forEach(cell => {
        const currentColspan = parseInt(cell.getAttribute("colspan")) || 1;
        cell.setAttribute("colspan", currentColspan + 2);
      });
    });

    // --- Añadir cabeceras ---
    const thEq = document.createElement("th");
    thEq.textContent = "Alimento";
    headerRow.appendChild(thEq);

    const thCantidad = document.createElement("th");
    thCantidad.textContent = "gr";
    headerRow.appendChild(thCantidad);

    // --- Añadir celdas en cada fila del tbody ---
    const bodyRows = table.querySelectorAll("tbody tr");
    bodyRows.forEach(row => {
      if (row.querySelector("textarea")) return;

      // Actualizar colspan en tbody también si existe
      row.querySelectorAll("td[colspan]").forEach(cell => {
        const currentColspan = parseInt(cell.getAttribute("colspan")) || 1;
        cell.setAttribute("colspan", currentColspan + 2);
      });

      const tdEq = document.createElement("td");
      tdEq.classList.add("px-1", "py-0");
      const select = document.createElement("select");
      select.name = "select-alimentos";
      select.classList.add("form-select", "form-select-sm");
      select.innerHTML = `<option value="">Alimentos</option>`;
      tdEq.appendChild(select);

      const tdCantidad = document.createElement("td");
      tdCantidad.classList.add("px-1", "py-0");
      tdCantidad.textContent = "";

      row.appendChild(tdEq);
      row.appendChild(tdCantidad);
    });
  });

  // 👇 Muy importante: volver a rellenar y enganchar eventos
  renderSelectAlimentos("select-alimentos");
  renderTablaEquivalencias();

  setTimeout(async () => {
    const { configurarListenersParaNuevaTabla } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    configurarListenersParaNuevaTabla();
  }, 100)
}


export function removeColumns() {
  const tables = document.querySelectorAll(".table");

  tables.forEach(table => {
    const headerRow = table.querySelector("thead tr:last-child");
    if (!headerRow) return;

    const bodyRows = table.querySelectorAll("tbody tr");

    // comprobar que haya al menos una pareja de columnas aparte de MACRO
    if (headerRow.children.length > 3) {
      headerRow.removeChild(headerRow.lastElementChild);
      headerRow.removeChild(headerRow.lastElementChild);

      bodyRows.forEach(row => {
        if (row.querySelector("textarea")) return;
        row.removeChild(row.lastElementChild);
        row.removeChild(row.lastElementChild);
      });
    }
  });
  setTimeout(async () => {
    const { configurarListenersParaNuevaTabla } = await import('/src/dietas/modules/update/ui/sumaMacros.js');
    configurarListenersParaNuevaTabla();
  }, 100)
}
