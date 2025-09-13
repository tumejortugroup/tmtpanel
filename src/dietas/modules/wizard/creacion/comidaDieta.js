import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';

export async function asociarComidasADieta(idComidasArray) {
  const idDieta = obtenerIdDietaDesdeUrl();

  if (!idDieta || !idComidasArray.length) {
    alert("❌ Falta ID de dieta o lista de comidas.");
    return;
  }

  // 👇 Extraer solo los IDs
  const idsSolo = idComidasArray.map(c => c.id_comida);

  console.log("🚀 Asociando comidas a dieta:", {
    id_dieta: idDieta,
    comidas: idsSolo
  });

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("https://my.tumejortugroup.com/api/v1/dietas/asociar-comidas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id_dieta: parseInt(idDieta),
        comidas: idsSolo
      })
    });

    const data = await res.json();
    console.log('')

  if (res.ok) {
      console.log("✅ Comidas asociadas a dieta correctamente:", data);

      // 🔹 Abre nueva pestaña con la dieta
      window.open(`/dashboard/dietas/dieta.html?id_dieta=${idDieta}`, "_blank");

      // 🔹 Redirige la pestaña actual al index
      window.location.href = "/dashboard/index.html";
    } else {
      console.error("❌ Error al asociar comidas:", data);
      alert("Error al asociar comidas a la dieta.");
    }
  } catch (error) {
    console.error("❌ Error de red:", error);
    alert("Error de red al asociar comidas.");
  }
}

