import { updateKgValue } from '/src/dietas/modules/wizardBase/autoajuste/updateKg.js';

export function configurarBotones() {
  const configuraciones = [
    {
      botonId: "btn-increase-protein",
      valorId: "protein-value",
      cambio: 0.1,
    },
    {
      botonId: "btn-decrease-protein",
      valorId: "protein-value",
      cambio: -0.1,
    },
    {
      botonId: "btn-increase-fat",
      valorId: "fat-value",
      cambio: 0.1,
    },
    {
      botonId: "btn-decrease-fat",
      valorId: "fat-value",
      cambio: -0.1,
    },
  ];

  configuraciones.forEach(({ botonId, valorId, cambio }) => {
    const boton = document.getElementById(botonId);
    if (!boton) {
      console.warn(`⚠️ Botón no encontrado: ${botonId}`);
      return;
    }

    boton.addEventListener("click", () => updateKgValue(valorId, cambio));
  });
}
