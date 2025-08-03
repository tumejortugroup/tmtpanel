export async function fetchDetalleDato(id_dato, token) {
  try {
    const res = await fetch(`http://localhost:9000/api/v1/datos/detalle/${id_dato}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`❌ Error al obtener detalle del dato (ID: ${id_dato}) - HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log(`📦 Detalle del dato ${id_dato}:`, data.data);
    return data.data;
  } catch (error) {
    console.error("❌ Error en fetchDetalleDato:", error);
    return null;
  }
}
