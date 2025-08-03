import { fetchDetalleDato } from './fetchDato.js';

export async function crearDieta(id_usuario, id_dato) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Token no disponible. Inicia sesión nuevamente.");
    return;
  }

  try {
    // 1. Obtener datos del control
    const detalle = await fetchDetalleDato(id_dato, token);

    if (!detalle) {
      alert("❌ No se pudieron obtener los datos del control.");
      return;
    }

    const payload = {
      id_usuario: id_usuario,
      id_dato: id_dato,
      calorias_dieta: detalle.tdee,
      proteinas_dieta: detalle.proteinas_datos,
      grasas_dieta: detalle.grasas_datos,
      carbohidratos_dieta: detalle.carbohidratos_datos
    };

    console.log("📤 Enviando dieta al backend:", payload);

    // 2. Hacer POST a la API
    const res = await fetch('http://localhost:9000/api/v1/dietas', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`❌ Error al crear la dieta: HTTP ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ Dieta creada:", result);

    alert("✅ Dieta creada exitosamente.");

// Redireccionar a la vista de la dieta
const id_dieta = result.id_dieta;
window.location.href = `/dashboard/dietas/wizard.html?id_dieta=${id_dieta}&id_dato=${id_dato}`;
  } catch (error) {
    console.error("❌ Error al crear la dieta:", error);
    alert("❌ Hubo un error al crear la dieta.");
  }
}
