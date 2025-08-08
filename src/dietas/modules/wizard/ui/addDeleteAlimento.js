import { renderSelectAlimentos } from '/src/dietas/modules/wizard/ui/renderAlimentos.js';

import { renderTablaEquivalencias } from '/src/dietas/modules/wizard/ui/renderEquivalencias.js';




 export function quitarAlimento() {
    const tbody = document.querySelector(".table-dieta tbody");
    const filas = Array.from(tbody.querySelectorAll("tr"));
    
    // Evitar eliminar la fila de Observaciones
    if (filas.length <= 4) return;

    // Elimina las 3 filas anteriores a Observaciones
    for (let i = 0; i < 1; i++) {
        const lastRow = tbody.querySelector("tr:last-child").previousElementSibling;
        if (lastRow && !lastRow.querySelector("textarea")) {
            tbody.removeChild(lastRow);
        }
    }
}
