import { obtenerIdDietaDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';

export async function obtenerDieta() {
  const token = localStorage.getItem("token");
  const idDieta = obtenerIdDietaDesdeUrl();
  if (!idDieta) throw new Error("ID de dieta no encontrado en la URL");

  const response = await fetch(`https://my.tumejortugroup.com/api/v1/dietas/${idDieta}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) throw new Error(`Error al obtener la dieta: ${response.statusText}`);

  const data = await response.json();
  console.log(`📦 Dieta ${idDieta}:`, data);
  return data;
}


