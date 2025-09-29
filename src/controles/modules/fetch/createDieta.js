import { fetchDetalleDato } from '/src/dietas/modules/listDietas/fetchDato.js';
export async function crearDieta(id_usuario, id_dato) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const usuarioLogueado = localStorage.getItem("id_usuario");

  if (!token || !rol || !usuarioLogueado) {
    alert("❌ Token, rol o id_usuario no disponibles. Inicia sesión nuevamente.");
    return null;
  }

  try {
    // 1. Obtener los datos del control
    const detalle = await fetchDetalleDato(id_dato, token);
    if (!detalle) {
      alert("❌ No se pudieron obtener los datos del control.");
      return null;
    }

    // 2. Preparar payload de la dieta
    const payload = {
      id_usuario,
      id_dato,
      calorias_dieta: detalle.tdee,
      proteinas_dieta: detalle.proteinas_datos,
      grasas_dieta: detalle.grasas_datos,
      carbohidratos_dieta: detalle.carbohidratos_datos
    };

    const res = await fetch('https://my.tumejortugroup.com/api/v1/dietas', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`❌ Error al crear la dieta: HTTP ${res.status}`);
    const result = await res.json();
    const id_dieta = result.id_dieta;

    if (!id_dieta) throw new Error("❌ No se recibió ID de la dieta creada.");

    // 3. Asignar rol
    const rolPayload = {
      id_usuario: Number(usuarioLogueado),
      rol
    };

    const resAsignacion = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/${id_dieta}/asignar-rol`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rolPayload)
    });

    if (!resAsignacion.ok) {
      throw new Error(`❌ Error al asignar la dieta al usuario logueado: HTTP ${resAsignacion.status}`);
    }

    // ✅ NO REDIRIGIR, solo devolver el id_dieta
    return id_dieta;

  } catch (error) {
    console.error("❌ Error al crear o asignar la dieta:", error);
    alert("❌ Hubo un error al crear o asignar la dieta.");
    return null;
  }
}