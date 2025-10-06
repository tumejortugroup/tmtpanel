// centros.js

export async function cargarCentrosSelect(endpoint, selectId) {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const centros = await res.json();
    const select = document.getElementById(selectId);

    // Limpiar opciones previas y poner placeholder
    select.innerHTML = '<option value="">Seleccionar</option>';

    centros.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id_centro;     // value será el id
      option.textContent = c.nombre;  // lo que se muestra
      select.appendChild(option);
    });

    console.log("✅ Centros cargados correctamente.");
  } catch (error) {
    console.error("❌ Error cargando centros:", error);
  }
}
