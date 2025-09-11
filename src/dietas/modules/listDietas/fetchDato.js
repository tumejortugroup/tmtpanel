/**
 * fetchDetalleDato()
 * ------------------
 * Obtiene el detalle completo de un "dato" desde la API.
 *
 * Flujo:
 * - Hace una petición GET a `/datos/detalle/:id_dato`.
 * - Incluye el `token` JWT en los headers para autorización.
 * - Valida la respuesta HTTP y lanza un error si no es exitosa.
 * - Retorna la propiedad `data` del JSON recibido.
 *
 * Consideraciones:
 * - En caso de error, captura la excepción, loggea en consola
 *   y devuelve `null` para que el caller lo maneje.
 * - Incluye logs de depuración en consola (``❌`).
 *
 * @param {string|number} id_dato - Identificador del dato a consultar.
 * @param {string} token - Token JWT válido para la API.
 * @returns {Promise<Object|null>} Objeto con el detalle del dato o `null` si falla.
 */


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
    return data.data;
  } catch (error) {
    console.error("❌ Error en fetchDetalleDato:", error);
    return null;
  }
}
