
export function duplicarUltimaTabla() {
  const button = event.target;
  const btnsDiv = button.closest(".comida-btns");
  if (!btnsDiv) return;

  const parent = btnsDiv.parentNode;
  const tablas = parent.querySelectorAll("table");
  if (tablas.length === 0) return;

  let ultimaTabla = tablas[tablas.length - 1];

  // 👉 Si la última es Suplementacion, usamos la anterior
  if (ultimaTabla.id === "Suplementacion" && tablas.length > 1) {
    ultimaTabla = tablas[tablas.length - 2];
  }

  // Si seguimos sin tabla válida, no se clona
  if (!ultimaTabla || ultimaTabla.id === "Suplementacion") {
    console.warn("⚠️ No se puede clonar la tabla de Suplementación.");
    return;
  }

  // Clonar
  const clon = ultimaTabla.cloneNode(true);

  // 👉 Si existe Suplementacion, insertar justo antes de ella
  const tablaSuplementacion = parent.querySelector("#Suplementacion");
  if (tablaSuplementacion) {
    parent.insertBefore(clon, tablaSuplementacion);
  } else {
    // Si no hay Suplementacion, insertar antes de los botones
    parent.insertBefore(clon, btnsDiv);
  }
}

export function eliminarUltimaTabla() {
  const button = event.target;
  const btnsDiv = button.closest(".comida-btns");
  if (!btnsDiv) return;

  const parent = btnsDiv.parentNode;
  const tablas = parent.querySelectorAll("table");

  // 👉 Si hay 2 o menos tablas, no borrar nada
  if (tablas.length <= 2) {
    console.warn("⚠️ No se puede eliminar porque solo quedan dos tablas (incluyendo Suplementación).");
    return;
  }

  let ultimaTabla = tablas[tablas.length - 1];

  if (ultimaTabla.id === "Suplementacion") {
    // 👉 Si la última es Suplementacion, borramos la anterior
    ultimaTabla = tablas[tablas.length - 2];
  }

  ultimaTabla.remove();
}
