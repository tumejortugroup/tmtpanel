export async function getDieta(idDieta) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Token no encontrado. Inicia sesión.");
    return null;
  }

  try {
    console.log('📡 Cargando dieta:', idDieta);
    
    const res = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/informe/${idDieta}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error(`❌ Error ${res.status}: ${res.statusText}`);
      
      // Si es 401, el token puede estar expirado
      if (res.status === 401) {
        alert("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = '/login';
      }
      
      return null;
    }

    const result = await res.json();
    console.log('✅ Dieta cargada:', result);

    // ⬇️ Devolver igual que getPlantilla para consistencia
    return result.data;
    
  } catch (error) {
    console.error("❌ Error al obtener informe de dieta:", error);
    return null;
  }
}