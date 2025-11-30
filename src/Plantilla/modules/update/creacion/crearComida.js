import { generarPayloadComidas } from "./payloadComidas.js";

export async function crearComidas() {
  const comidas = generarPayloadComidas();

  if (!comidas.length) {

    return [];
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://my.tumejortugroup.com/api/v1/comidas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(comidas)
    });

    const data = await res.json();


    if (res.ok && Array.isArray(data.data)) {

      return data.data; // 👈 devolvemos solo el array [{id_comida:...}]
    } else {
      console.error("❌ Error al crear comidas:", data);

      return [];
    }
  } catch (error) {
    console.error("❌ Error en fetch:", error);
   
    return [];
  }
}