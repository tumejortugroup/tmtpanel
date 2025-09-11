import { getAlimentos } from '/src/dietas/modules/wizard/fetch/getAlimentos.js';

export async function renderSelectAlimentos(selectId) {
  try {
    const alimentos = await getAlimentos();

    if (!Array.isArray(alimentos)) {
      throw new Error("La respuesta del backend no es una lista.");
    }

    const selects = document.querySelectorAll(`select[name='${selectId}']`);
    
    selects.forEach(select => {
      select.innerHTML = `<option value="">Seleccionar</option>`; // default

      alimentos.forEach(alimento => {
        const option = document.createElement("option");
        option.value = alimento.id_alimento;
        option.textContent = alimento.nombre;
        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error("❌ Error al renderizar alimentos:", error);
  }
}
