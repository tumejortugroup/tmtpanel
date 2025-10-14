import { fetchDetalleDato } from '/src/dietas/modules/listDietas/fetchDato.js';

export async function crearDieta(id_usuario, id_dato) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const usuarioLogueado = localStorage.getItem("id_usuario");
  const numero_usuario = localStorage.getItem("numero_usuario_actual"); // ✅ Capturar del localStorage

  if (!token || !rol || !usuarioLogueado) {
    alert("❌ Token, rol o id_usuario no disponibles. Inicia sesión nuevamente.");
    return null;
  }

  if (!numero_usuario) {
    alert("❌ No se encontró el número de usuario.");
    return null;
  }

  try {
    // 1. Obtener los datos del control
    const detalle = await fetchDetalleDato(id_dato, token);
    if (!detalle) {
      alert("❌ No se pudieron obtener los datos del control.");
      return null;
    }

    // 2. Generar el nombre de la dieta con numero_usuario y fecha en formato DD--MM--YYYY
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreDieta = `${numero_usuario}-${dia}/${mes}/${anio}`;

    // 3. Preparar payload de la dieta
    const payload = {
      id_usuario,
      id_dato,
      nombre: nombreDieta,
      calorias_dieta: detalle.calorias_datos,
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

    // 4. Asignar rol
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


    
    // ✅ Eliminar numero_usuario del localStorage después de crear la dieta
    localStorage.removeItem("numero_usuario_actual");

    
    return id_dieta;

  } catch (error) {
    console.error("❌ Error al crear o asignar la dieta:", error);
    alert("❌ Hubo un error al crear o asignar la dieta.");
    return null;
  }
}