let idPlantillaCreada = null; 

export async function crearPlantilla() {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario");
  const id_centro = localStorage.getItem("centro_id");

  // Recuperar el valor del input
  const nombre = document.getElementById("nplantilla").value.trim();

  if (!token || !id_usuario || !id_centro) {
    alert("❌ Faltan datos en el localStorage (token, usuario o centro). Inicia sesión nuevamente.");
    return;
  }

  if (!nombre) {
    alert("❌ El nombre de la plantilla es obligatorio.");
    return;
  }

  const payload = {
    nombre,
    id_usuario: Number(id_usuario),
    id_centro: Number(id_centro)
  };

  try {
    const res = await fetch("https://my.tumejortugroup.com/api/v1/plantillas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`❌ Error al crear la plantilla: HTTP ${res.status}`);
    }

    const result = await res.json();
    idPlantillaCreada = result.id; // ← guardamos el id en la variable global

    if (!idPlantillaCreada) {
      throw new Error("❌ No se recibió ID de la plantilla creada.");
    }

   

    // 👉 Aquí ya puedes usar idPlantillaCreada para lo que necesites a continuación
    // Ejemplo:
    // await asociarComidasAPlantilla(idPlantillaCreada, comidasSeleccionadas);

    return idPlantillaCreada;
  } catch (error) {
    console.error("❌ Error al crear la plantilla:", error);
    alert("❌ Hubo un error al crear la plantilla.");
  }
}
