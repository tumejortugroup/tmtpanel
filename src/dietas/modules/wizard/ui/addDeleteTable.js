export function duplicarUltimaTabla() {
  const container = document.getElementById("tabla-container");
  const tablas = container.querySelectorAll("table.table-dieta");

  if (tablas.length === 0) {
    console.warn("⚠️ No hay tablas para clonar.");
    return;
  }

  const ultimaTabla = tablas[tablas.length - 1];
  const clon = ultimaTabla.cloneNode(true); // Clona solo la tabla, no toda la sección

  container.appendChild(clon);
}


export function eliminarUltimaTabla() {
  const container = document.getElementById("tabla-container");
  const tablas = container.querySelectorAll("table.table-dieta");

  if (tablas.length <= 1) {
    console.warn("⚠️ No se puede eliminar la última tabla.");
    
    // Opcional: Desactivar el botón si solo queda una
    const botonEliminar = document.getElementById("btn-eliminar-tabla");
    if (botonEliminar) botonEliminar.disabled = true;

    return;
  }

  const ultimaTabla = tablas[tablas.length - 1];
  ultimaTabla.remove();

  // Re-activar el botón en caso de que se hubiera desactivado antes
  const botonEliminar = document.getElementById("btn-eliminar-tabla");
  if (botonEliminar) botonEliminar.disabled = false;
}

