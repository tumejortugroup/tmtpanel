export async function getAlimentos() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://my.tumejortugroup.com/api/v1/alimentos", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("La respuesta del backend no contiene una lista válida de alimentos.");
    }

    return data; // Es directamente un array
  } catch (error) {
    console.error("❌ Error al cargar alimentos:", error);
    return [];
  }
}
