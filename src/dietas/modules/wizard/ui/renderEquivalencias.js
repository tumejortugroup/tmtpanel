import { getAlimentos } from "../fetch/getAlimentos.js";
import { getEquivalencia } from "../fetch/getEquivalencias.js";

export async function renderTablaEquivalencias() {
  const alimentos = await getAlimentos();
  if (!alimentos.length) return;

  const filas = document.querySelectorAll(".table tbody tr");
  filas.forEach(fila => {
    const selectMacro = fila.querySelector("td select[name='select-categoria']");
    const inputCantidad = fila.querySelector(".input-cantidad");
    if (!selectMacro || !inputCantidad) return;

    // 👉 primer select siempre es el "principal"
    const selects = fila.querySelectorAll("select[name='select-alimentos']");
    if (selects.length < 2) return;

    const selectPrincipal = selects[0];
    const equivalentes = []; 

    // pares de (select, td) → a partir de la segunda columna de alimentos
    for (let i = 1; i < selects.length; i++) {
      const td = selects[i].closest("td").nextElementSibling; 
      equivalentes.push({ select: selects[i], td });
    }

    // Rellenar opciones en cada select
    selects.forEach(select => {
      if (select.options.length <= 1) {
        alimentos.forEach(alimento => {
          const opt = document.createElement("option");
          opt.value = alimento.id_alimento;
          opt.textContent = alimento.nombre;
          select.appendChild(opt);
        });
      }
    });

    async function calcular() {
      const idPrincipal = selectPrincipal.value;
      const cantidad = parseFloat(inputCantidad.value);
      const categoria = selectMacro.value?.toLowerCase();

      if (!idPrincipal || isNaN(cantidad) || !categoria) return;

      // limpiar todas las celdas
      equivalentes.forEach(eq => (eq.td.textContent = ""));

      for (const { select, td } of equivalentes) {
        if (!select.value) continue;
        const eqVal = await getEquivalencia(idPrincipal, select.value, categoria, cantidad);
        td.textContent = eqVal !== null ? `${eqVal} g` : "-";
      }
    }

    // Eventos
    [selectMacro, selectPrincipal, inputCantidad, ...selects].forEach(el =>
      el.addEventListener("change", calcular)
    );
    inputCantidad.addEventListener("input", calcular);
  });
}
