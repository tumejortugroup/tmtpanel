import { getAlimentos } from "../fetch/getAlimentos.js";
import { getEquivalencia } from "../fetch/getEquivalencias.js";

export async function renderTablaEquivalencias() {
  const alimentos = await getAlimentos();
  if (!alimentos.length) return;

  const filas = document.querySelectorAll(".table-dieta tbody tr");
  filas.forEach(fila => {
    const selectsAlimentos = fila.querySelectorAll('select[name="select-alimentos"]');
    const selectMacro = fila.querySelector("td select");

    if (selectsAlimentos.length !== 3 || !selectMacro) return;

    const [selectPrincipal, selectEq1, selectEq2] = selectsAlimentos;
    const inputCantidad = fila.querySelector(".input-cantidad");
    const tdEq1 = fila.children[4]; // cantidad de eq1
    const tdEq2 = fila.children[6]; // cantidad de eq2

    // Rellenar alimentos
    [selectPrincipal, selectEq1, selectEq2].forEach(select => {
      alimentos.forEach(alimento => {
        const opt = document.createElement("option");
        opt.value = alimento.id_alimento;
        opt.textContent = alimento.nombre;
        select.appendChild(opt);
      });
    });

  async function calcular() {
  const idPrincipal = selectPrincipal.value;
  const idEq1 = selectEq1.value;
  const idEq2 = selectEq2.value;
  const cantidad = parseFloat(inputCantidad.value);
  const categoria = selectMacro.value?.toLowerCase();

  if (!idPrincipal || isNaN(cantidad) || !categoria) return;

  tdEq1.textContent = "";
  tdEq2.textContent = "";

  // Primer equivalente
  if (idEq1) {
    const eq1 = await getEquivalencia(idPrincipal, idEq1, categoria, cantidad);
    tdEq1.textContent = eq1 !== null ? `${eq1} g` : "-";
  }

  // Segundo equivalente (corregido)
  if (idEq2) {
    const eq2 = await getEquivalencia(idPrincipal, idEq2, categoria, cantidad); // ✅ idEq2 correcto
    tdEq2.textContent = eq2 !== null ? `${eq2} g` : "-";
  }
}

    [selectMacro, selectPrincipal, selectEq1, selectEq2, inputCantidad].forEach(el =>
      el.addEventListener("change", calcular)
    );
    inputCantidad.addEventListener("input", calcular);
  });
}
