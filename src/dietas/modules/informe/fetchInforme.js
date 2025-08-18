import { agruparPorTipoComida } from './agruparComida.js';
import { renderInformeDieta } from './renderDieta.js'; // Esta función la puedes crear



export async function fetchInformeDieta(idDieta) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Token no encontrado. Inicia sesión.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:9000/api/v1/dietas/informe/${idDieta}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    console.log("📄 Informe recibido:", result.data);

    renderInformeDieta(result.data); // ✅ Aquí lo pasas
  } catch (error) {
    console.error("❌ Error al obtener informe de dieta:", error);
  }
}
