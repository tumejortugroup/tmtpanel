export async function getPlantilla(idPlantilla) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Token no encontrado. Inicia sesión.");
    return null;
  }

  try {
    const res = await fetch(`https://my.tumejortugroup.com/api/v1/plantillas/informe/${idPlantilla}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();


    return result.data;
  } catch (error) {
    console.error("❌ Error al obtener plantilla:", error);
    return null;
  }
}