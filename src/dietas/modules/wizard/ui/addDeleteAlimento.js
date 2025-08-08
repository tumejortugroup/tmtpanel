
export function agregarAlimento() {
    const tbody = document.querySelector(".table-dieta tbody");
    
    const plantilla = `
 
    <tr>
        <td class="header-dieta">
            <select>
                <option>Proteina</option>
                <option>Grasa</option>
                <option>Carbohidratos</option>
            </select>
        </td>
        <td><select><option>Select</option></select></td>
        <td><input class="input-cantidad" type="text"></td>
        <td><select><option>Select</option></select></td>
        <td></td>
        <td><select><option>Select</option></select></td>
        <td></td>
    </tr>`;

    // Insertar antes de la fila de Observaciones
    const observaciones = tbody.querySelector("tr:last-child");
    observaciones.insertAdjacentHTML("beforebegin", plantilla);
}

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
