import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';

export function addColumns(button) {
  const table = button.closest(".table-dieta");
  if (!table) return;

  const headerRow = table.querySelector("thead tr:last-child");
  const currentCols = headerRow.children.length;


  if (currentCols >= 21) {
    alert("⚠️ Máximo 21 columnas.");
    return;
  }

  // --- Añadir cabeceras Eq + Cantidad ---
  const thEq = document.createElement("th");
  thEq.textContent = "Eq";
  headerRow.appendChild(thEq);

  const thCantidad = document.createElement("th");
  thCantidad.textContent = "Cantidad";
  headerRow.appendChild(thCantidad);

  // --- Añadir columnas en el cuerpo ---
  const bodyRows = table.querySelectorAll("tbody tr");
  bodyRows.forEach(row => {
    if (row.querySelector("textarea")) return; 


    const tdEq = document.createElement("td");
    const select = document.createElement("select");
    select.name = "select-alimentos"; 
    select.classList.add("form-select");
    tdEq.appendChild(select);

    // Cantidad
    const tdCantidad = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("input-cantidad");
    tdCantidad.appendChild(input);

    row.appendChild(tdEq);
    row.appendChild(tdCantidad);
  });


  renderSelectAlimentos("select-alimentos");
}

export function removeColumns(button) {
  const table = button.closest(".table-dieta");
  if (!table) return;

  const headerRow = table.querySelector("thead tr:last-child");
  const currentCols = headerRow.children.length;


  if (currentCols <= 3) {
    alert("⚠️ Deben quedar al menos MACRO + Alimento + Cantidad.");
    return;
  }

  // --- Quitar columnas del header ---
  headerRow.removeChild(headerRow.lastElementChild); 
  headerRow.removeChild(headerRow.lastElementChild); 

  // --- Quitar columnas del cuerpo ---
  const bodyRows = table.querySelectorAll("tbody tr");
  bodyRows.forEach(row => {
    if (row.querySelector("textarea")) return; 

    row.removeChild(row.lastElementChild); 
    row.removeChild(row.lastElementChild); 
  });
}
