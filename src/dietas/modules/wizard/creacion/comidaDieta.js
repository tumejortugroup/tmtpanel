 import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';

export async function asociarComidasADieta(idComidasArray) {
  const idDieta = obtenerIdDietaDesdeUrl();

  if (!idDieta || !idComidasArray.length) {
    alert("❌ Falta ID de dieta o lista de comidas.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:9000/api/v1/dietas/asociar-comidas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id_dieta: idDieta,
        comidas: idComidasArray
      })
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ Comidas asociadas a dieta correctamente:", data);
      alert("✔️ Dieta creada y comidas asociadas.");
    } else {
      console.error("❌ Error al asociar comidas:", data);
      alert("Error al asociar comidas a la dieta.");
    }
  } catch (error) {
    console.error("❌ Error de red:", error);
    alert("Error de red al asociar comidas.");
  }
}
