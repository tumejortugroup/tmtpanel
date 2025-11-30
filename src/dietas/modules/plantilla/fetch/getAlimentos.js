export async function getAlimentos(categoria = null) {
  const token = localStorage.getItem("token");

  // Normalizar categoría
  const validCategories = ["proteina", "carbohidrato", "grasa", "fruta", "verdura"];
  const categoriaLower = categoria ? categoria.toLowerCase() : null;

  let url;

  if (categoriaLower && validCategories.includes(categoriaLower)) {
    url = `https://my.tumejortugroup.com/api/v1/alimentos/categoria/${encodeURIComponent(categoriaLower)}`;
  } else {
    // Si no está en la lista → obtener todos
    url = `https://my.tumejortugroup.com/api/v1/alimentos`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("La respuesta del backend no contiene una lista válida de alimentos.");
    }

    return data;
  } catch (error) {
    console.error("❌ Error al cargar alimentos:", error);
    return [];
  }
}
