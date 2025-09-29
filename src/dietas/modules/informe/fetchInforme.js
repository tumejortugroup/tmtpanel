import { renderInformeDieta } from './renderDieta.js';

export async function fetchInformeDieta(idDieta) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token no encontrado");
    alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
    return;
  }

  if (!idDieta) {
    console.error("ID de dieta no proporcionado");
    return;
  }

  // Debug: verificar el token
  console.log("Token encontrado:", token ? "Sí" : "No");
  console.log("Longitud del token:", token?.length);

  try {
    const res = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/informe/${idDieta}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Status de respuesta:", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error del servidor:", errorData);
      throw new Error(`Error HTTP: ${res.status} - ${errorData.message || 'Sin mensaje'}`);
    }

    const result = await res.json();
    console.log("Respuesta completa:", result);

    if (result.success && result.data) {
      renderInformeDieta(result.data);
    } else {
      console.error("Respuesta sin datos:", result);
      alert("No se pudo cargar el informe de la dieta");
    }

  } catch (error) {
    console.error("Error al obtener informe de dieta:", error);
    alert("Error al cargar el informe. Intenta nuevamente.");
  }
}
