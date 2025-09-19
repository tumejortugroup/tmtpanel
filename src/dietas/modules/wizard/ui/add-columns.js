import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';


export function addColumns() {
  // Seleccionamos todas las tablas con clase .table
  const tables = document.querySelectorAll(".table");

  tables.forEach(table => {
    const headerRow = table.querySelector("thead tr:last-child");
    if (!headerRow) return;

    const currentCols = headerRow.children.length;

    // límite de columnas (ejemplo: 21)
    if (currentCols >= 21) {
      return; // si quieres, puedes alertar solo en la primera tabla
    }

    // --- Añadir cabeceras Alimento + gr ---
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

      // Columna Alimento (select)
      const tdEq = document.createElement("td");
      tdEq.classList.add("px-1", "py-0");
      const select = document.createElement("select");
      select.name = "select-alimentos";
      select.classList.add("form-select", "form-select-sm");
      select.innerHTML = `<option value="">Alimentos</option>`;
      tdEq.appendChild(select);

      // Columna gr (input)
      const tdCantidad = document.createElement("td");
      tdCantidad.classList.add("px-1", "py-0");
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add("form-control", "form-control-sm");
      tdCantidad.appendChild(input);

      row.appendChild(tdEq);
      row.appendChild(tdCantidad);
    });
  });

  // Rellenar selects dinámicamente en todas
  renderSelectAlimentos("select-alimentos");
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
}
