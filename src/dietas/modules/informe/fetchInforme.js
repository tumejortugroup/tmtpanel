import { renderInformeDieta } from './renderDieta.js';

export async function fetchInformeDieta(idDieta) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token no encontrado");

    return;
  }

  if (!idDieta) {
    console.error("ID de dieta no proporcionado");
    return;
  }

  try {
    const res = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/informe/${idDieta}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });


    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error del servidor:", errorData);
      throw new Error(`Error HTTP: ${res.status} - ${errorData.message || 'Sin mensaje'}`);
    }

    const result = await res.json();

    if (result.success && result.data) {
      renderInformeDieta(result.data);
    } else {
      console.error("Respuesta sin datos:", result);

    }

  } catch (error) {
    console.error("Error al obtener informe de dieta:", error);

  }
}
