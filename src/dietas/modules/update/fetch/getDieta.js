export async function getDieta(idDieta) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Token no encontrado. Inicia sesión.");
    return null;
  }

  try {
    const res = await fetch(`http://localhost:9000/api/v1/dietas/informe/${idDieta}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    console.log("📄 Informe recibido:", result.data);

    return result.data; // ✅ devolvemos los datos al mainUpdate.js
  } catch (error) {
    console.error("❌ Error al obtener informe de dieta:", error);
    return null;
  }
}
