export async function asociarComidasAPlantilla(id_plantilla, idsComidas) {


  const payload = { comidas: idsComidas };


  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://my.tumejortugroup.com/api/v1/plantillas/${id_plantilla}/asociar-comidas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();


    if (res.ok) {

    } else {
      alert("❌ Error al asociar comidas: " + (data.error || res.status));
    }
  } catch (error) {
    console.error("❌ Error de red en asociarComidasAPlantilla:", error);
    alert("Error de red al asociar comidas.");
  }
}
