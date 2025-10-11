import {  obtenerDatoDesdeUrl } from '/src/dietas/modules/wizard/utils/params.js';

export async function obtenerDetalleDato() {
    const token = localStorage.getItem("token");
  const idDato = obtenerDatoDesdeUrl();
  if (!idDato) throw new Error("ID de dato no encontrado en la URL");

    const response = await fetch(`https://my.tumejortugroup.com/api/v1/datos/detalle/${idDato}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error(`Error al obtener el detalle del dato: ${response.statusText}`);

  const data = await response.json();
  console.log(`📦 Detalle del dato ${idDato}:`, data);
  return data;
}