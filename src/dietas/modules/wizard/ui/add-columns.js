import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';
import { renderTablaEquivalencias } from '/src/dietas/modules/wizard/ui/renderEquivalencias.js';

export function addColumns() {
    const tables = document.querySelectorAll(".table");

    tables.forEach(table => {

        // ⛔ NO MODIFICAR LA TABLA DE SUPLEMENTACIÓN
        if (table.id === "Suplementacion") {
            console.log("⛔ Ignorando tabla de suplementación");
            return;
        }

        const headerRow = table.querySelector("thead tr:last-child");
        if (!headerRow) return;

        const currentCols = headerRow.children.length;
        if (currentCols >= 21) return;

        // --- Actualizar colspan en thead ---
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

            // 🔥 categoría REAL
            const selectCategoria = row.querySelector("select[name='select-categoria']");
            const categoria = selectCategoria ? selectCategoria.value.trim() : null;

            console.log("🟦 Añadida columna → categoría detectada:", categoria);

            renderSelectAlimentos(select, categoria);
        });
    });

    renderTablaEquivalencias();
}

export function removeColumns() {
    const tables = document.querySelectorAll(".table");

    tables.forEach(table => {

        if (table.id === "Suplementacion") return;

        const headerRow = table.querySelector("thead tr:last-child");
        if (!headerRow) return;

        const bodyRows = table.querySelectorAll("tbody tr");

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
