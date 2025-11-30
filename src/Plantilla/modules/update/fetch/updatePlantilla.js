export async function actualizarPlantilla(idPlantilla) {
  const token = localStorage.getItem("token");

  const nombre = document.getElementById("nplantilla")?.value.trim() || "";

  const payload = {
    nombre: nombre
  };

  try {
    const res = await fetch(
      `https://my.tumejortugroup.com/api/v1/plantillas/${idPlantilla}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const json = await res.json();

    if (!res.ok) {
      console.error("❌ Error actualizando plantilla:", json);
      throw new Error(json?.message || "Error al actualizar la plantilla");
    }

    return json.data;

  } catch (error) {
    console.error("❌ Error en actualizarPlantilla:", error);
    throw error;
  }
}
